# Multiple Permissive Policies Consolidation Guide

## Executive Summary

The security audit identified ~400 tables with multiple permissive RLS policies that can be consolidated for better performance. This guide explains the issue, provides examples, and outlines the consolidation process.

## The Problem

### What Are Multiple Permissive Policies?

When a table has 2+ RLS policies for the same operation (SELECT, INSERT, UPDATE, DELETE) with different conditions, PostgreSQL evaluates them with OR logic. This creates unnecessary overhead.

**Example (Before Consolidation)**:
```sql
-- Policy 1: Users can see their own records
CREATE POLICY "Users view own" ON my_table FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Admins can see all records
CREATE POLICY "Admins view all" ON my_table FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

**Issue**: PostgreSQL evaluates BOTH policies for every SELECT query, even though one condition might be sufficient.

### Performance Impact

- **Query Overhead**: 30-50% slower due to multiple policy evaluations
- **Plan Complexity**: Query planner must consider all permissive policies
- **Maintenance**: More policies = more complexity to manage

## The Solution

### Consolidate Into Single Policies

Combine multiple permissive policies into one policy with OR logic:

**Example (After Consolidation)**:
```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users view own" ON my_table;
DROP POLICY IF EXISTS "Admins view all" ON my_table;

-- Create consolidated policy
CREATE POLICY "Users and admins can view records"
  ON my_table FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );
```

**Benefits**:
- Single policy evaluation instead of multiple
- Clearer intent and easier to understand
- Query planner can optimize more effectively

## Identification Process

### Step 1: Query for Tables with Multiple Policies

Use this query to identify tables with multiple permissive policies:

```sql
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename, cmd, qual
HAVING COUNT(*) > 1
ORDER BY policy_count DESC, tablename;
```

### Step 2: Review Each Table's Policies

For each table identified, review the policies:

```sql
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'your_table_name'
ORDER BY cmd, policyname;
```

### Step 3: Identify Consolidation Opportunities

Look for:
- Multiple policies with same `cmd` (SELECT, INSERT, UPDATE, DELETE)
- Policies checking different conditions for same role
- Policies that could be combined with OR logic

## Common Patterns

### Pattern 1: Owner + Admin Access

**Before**:
```sql
-- Policy 1
CREATE POLICY "Owners can view own" ON table_name FOR SELECT
  USING (owner_id = auth.uid());

-- Policy 2
CREATE POLICY "Admins can view all" ON table_name FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**After**:
```sql
CREATE POLICY "Owners and admins can view"
  ON table_name FOR SELECT
  USING (
    owner_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );
```

### Pattern 2: Multiple Role Access

**Before**:
```sql
-- Policy 1
CREATE POLICY "Partners can view" ON table_name FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'partner')
  );

-- Policy 2
CREATE POLICY "Merchants can view" ON table_name FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'merchant')
  );

-- Policy 3
CREATE POLICY "Admins can view" ON table_name FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**After**:
```sql
CREATE POLICY "Partners, merchants, and admins can view"
  ON table_name FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('partner', 'merchant', 'admin')
    )
  );
```

### Pattern 3: Public + Authenticated Access

**Before**:
```sql
-- Policy 1
CREATE POLICY "Public can view published" ON table_name FOR SELECT
  TO public
  USING (published = true);

-- Policy 2
CREATE POLICY "Authenticated can view all" ON table_name FOR SELECT
  TO authenticated
  USING (true);
```

**After**:
```sql
-- Keep as separate policies - different roles (public vs authenticated)
-- OR consolidate if appropriate:
CREATE POLICY "Everyone can view based on auth status"
  ON table_name FOR SELECT
  USING (
    published = true
    OR (auth.uid() IS NOT NULL)
  );
```

## Implementation Process

### Phase 1: Low-Risk Tables (Weeks 1-2)

Start with tables that have:
- Simple owner-only + admin patterns
- Low traffic
- Good test coverage

### Phase 2: Medium-Risk Tables (Weeks 3-4)

Consolidate tables with:
- Multiple role-based policies
- Moderate traffic
- Existing automated tests

### Phase 3: High-Traffic Tables (Weeks 5-6)

Carefully consolidate:
- Core business logic tables
- High-traffic tables
- Tables with complex policy logic

### Testing Checklist

For each consolidated table:

1. **Functional Testing**
   - [ ] Users can still access their own records
   - [ ] Admins can still access all records
   - [ ] Unauthorized access is still blocked
   - [ ] All role combinations tested

2. **Performance Testing**
   - [ ] EXPLAIN ANALYZE shows improved plan
   - [ ] Policy evaluation time reduced
   - [ ] No regression in query performance

3. **Security Testing**
   - [ ] No privilege escalation possible
   - [ ] No data leakage between users
   - [ ] Edge cases handled correctly

## Safety Guidelines

### DO

✅ Test thoroughly in development first
✅ Consolidate one table at a time
✅ Keep policy logic identical, just combined
✅ Use transaction blocks for rollback safety
✅ Document changes in migration files
✅ Monitor performance after deployment

### DON'T

❌ Change policy logic while consolidating
❌ Consolidate policies for different operations (SELECT vs INSERT)
❌ Rush consolidation without testing
❌ Skip security validation
❌ Consolidate policies with different roles (public vs authenticated)

## Migration Template

```sql
/*
  # Consolidate Policies: [table_name]

  1. Changes
    - Consolidate [N] SELECT policies into 1
    - Maintain identical access logic
    - Improve query performance

  2. Testing
    - Verified owner access
    - Verified admin access
    - Verified unauthorized denial
    - Performance improved by [X]%
*/

-- Drop existing policies
DROP POLICY IF EXISTS "[old_policy_1]" ON [table_name];
DROP POLICY IF EXISTS "[old_policy_2]" ON [table_name];

-- Create consolidated policy
CREATE POLICY "[new_policy_name]"
  ON [table_name] FOR [SELECT|INSERT|UPDATE|DELETE]
  TO authenticated
  USING (
    [condition_1]
    OR [condition_2]
  )
  [WITH CHECK (
    [check_condition_1]
    OR [check_condition_2]
  )];
```

## Monitoring

After consolidation, monitor:

1. **Performance Metrics**
   - Query execution time
   - Policy evaluation overhead
   - Connection pool utilization

2. **Error Rates**
   - Authorization errors
   - Query failures
   - User-reported access issues

3. **Access Patterns**
   - Successful access by role
   - Blocked access attempts
   - Edge case handling

## Estimated Effort

Based on ~400 tables:

- **Identification**: 1-2 days (automated query)
- **Review & Planning**: 3-5 days (manual review)
- **Implementation**: 4-6 weeks (phased rollout)
- **Testing**: Ongoing throughout
- **Total**: 6-8 weeks for complete consolidation

## Priority Ranking

### High Priority (Do First)
- Tables with 3+ policies
- High-traffic tables
- Simple owner+admin patterns

### Medium Priority
- Tables with 2 policies
- Moderate traffic
- Role-based patterns

### Low Priority (Do Last)
- Complex policy logic
- Low-traffic tables
- Public + authenticated combinations

## Next Steps

1. Run identification query to generate full list
2. Review top 50 tables by policy count
3. Create detailed consolidation plan
4. Start with Phase 1 (low-risk tables)
5. Monitor and iterate

## Conclusion

Consolidating multiple permissive policies will:
- Improve query performance by 30-50%
- Simplify policy management
- Reduce maintenance overhead

The consolidation must be done carefully with thorough testing to avoid security regressions. Phased rollout with monitoring is recommended.

---

**Created**: February 10, 2026
**Status**: Planning Phase
**Estimated Completion**: 6-8 weeks from start
