# Auth Configuration Changes

## Executive Summary

This document outlines three critical configuration changes identified in the security audit that must be applied through the Supabase Dashboard (not code/migrations).

## 1. Auth Connection Strategy

### Current Configuration
```
Mode: Fixed
Connections: 10
```

### Issue
Fixed connection allocation can lead to:
- Connection starvation under high load
- Inefficient resource utilization
- Auth service bottlenecks

### Recommended Configuration
```
Mode: Percentage
Percentage: 10%
```

### Benefits
- **Dynamic Scaling**: Connections scale with database capacity
- **Better Resource Utilization**: Automatically adjusts to available resources
- **High Availability**: Prevents connection exhaustion during traffic spikes
- **Cost Efficiency**: Uses only what's needed

### Implementation Steps

1. **Access Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard/project/[project-id]
   - Go to: Settings → Database → Connection Pooling

2. **Update Auth Configuration**
   - Find "Auth Connection Strategy" section
   - Change Mode from "Fixed" to "Percentage"
   - Set Percentage to "10%"
   - Save changes

3. **Verify Configuration**
   - Check that mode shows "Percentage (10%)"
   - Monitor auth service metrics for 24 hours
   - Verify no connection errors in logs

### Expected Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Available Connections | 10 fixed | ~10-50 dynamic | Scales with load |
| Connection Errors | Possible under load | Minimal | 90% reduction |
| Resource Efficiency | Fixed overhead | Dynamic | 30-40% better |

### Monitoring

After changing, monitor these metrics:

1. **Auth Service Health**
   - Connection pool utilization
   - Auth request latency
   - Failed auth attempts

2. **Database Connections**
   - Total active connections
   - Auth service connection count
   - Connection wait times

3. **Error Rates**
   - "Too many connections" errors
   - Auth timeout errors
   - Failed login attempts

### Rollback Plan

If issues occur:
1. Return to Dashboard → Settings → Database → Connection Pooling
2. Change mode back to "Fixed"
3. Set connections to "10"
4. Save and monitor

---

## 2. Security Definer Views Audit

### Issue Identified

11 database views are defined with `SECURITY DEFINER`, which means they execute with the creator's privileges rather than the caller's. This can be a security risk if not properly managed.

### Affected Views

The following views should be audited (list needs to be generated from database):

```sql
SELECT
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN (
    SELECT viewname
    FROM pg_views v
    JOIN pg_proc p ON p.proname = v.viewname
    WHERE p.prosecdef = true
  )
ORDER BY viewname;
```

### Security Concerns

**SECURITY DEFINER views can**:
- Bypass RLS policies
- Access data the caller shouldn't see
- Execute operations beyond caller's permissions
- Create privilege escalation vulnerabilities

### Review Process

For each view:

1. **Identify Purpose**
   - What data does it expose?
   - Why was SECURITY DEFINER used?
   - Is it still necessary?

2. **Security Assessment**
   - Can it be converted to SECURITY INVOKER?
   - Does it properly validate inputs?
   - Could it leak sensitive data?
   - Are there alternative approaches?

3. **Decision Matrix**

| Keep SECURITY DEFINER | Convert to SECURITY INVOKER | Remove View |
|-----------------------|------------------------------|-------------|
| Legitimately needs elevated privileges | View works with caller's permissions | No longer needed |
| Properly validated inputs | No security concerns | Can be replaced |
| Well-documented need | Simpler to maintain | Causes confusion |
| Audit trail exists | Reduces attack surface | Better alternatives exist |

### Action Items

1. **Generate Full List** (Run query above)
2. **Document Each View**
   - Purpose
   - Why SECURITY DEFINER is used
   - Security implications
   - Alternatives considered
3. **Create Remediation Plan**
   - Which views to keep
   - Which to convert
   - Which to remove
4. **Implement Changes**
   - Create migrations for conversions
   - Update application code if needed
   - Test thoroughly

### Best Practices Going Forward

✅ **DO**:
- Use SECURITY INVOKER by default
- Document why SECURITY DEFINER is needed
- Add input validation to SECURITY DEFINER views
- Regular audits of all views
- Principle of least privilege

❌ **DON'T**:
- Use SECURITY DEFINER without justification
- Expose raw table data through views
- Allow user input without validation
- Grant excessive permissions to view owners

---

## 3. Leaked Password Protection

### Current Status
```
HaveIBeenPwned Integration: DISABLED
```

### Issue

Without leaked password protection:
- Users can set passwords from known data breaches
- Accounts vulnerable to credential stuffing attacks
- Higher risk of account compromise
- Regulatory compliance concerns

### Recommended Configuration
```
HaveIBeenPwned Integration: ENABLED
```

### Benefits
- **Breach Protection**: Blocks passwords from 10+ billion compromised credentials
- **Real-time Validation**: Checks passwords during signup and password changes
- **Privacy Preserved**: Uses k-anonymity model (no passwords sent to API)
- **Compliance**: Meets NIST and OWASP password guidelines
- **User Education**: Warns users when they choose compromised passwords

### Implementation Steps

1. **Access Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/[project-id]
   - Go to: Authentication → Policies

2. **Enable Leaked Password Protection**
   - Find "Password Protection" section
   - Toggle "Enable leaked password protection" to ON
   - Configure rejection message (optional)
   - Save changes

3. **Configure User Messaging** (Recommended)
   ```
   Message: "This password has appeared in a data breach and cannot be used. Please choose a different password."
   ```

4. **Test Configuration**
   - Try to register with a known breached password (e.g., "password123")
   - Verify rejection message appears
   - Try with a strong unique password
   - Verify account creation succeeds

### How It Works

1. **User Sets Password**
   - User enters password during signup or password change
   - Supabase hashes password using SHA-1

2. **K-Anonymity Check**
   - First 5 characters of hash sent to HaveIBeenPwned API
   - API returns all breached hashes starting with those 5 chars
   - Full match checked locally (password never sent to API)

3. **Decision**
   - If password found in breach: Rejected with error message
   - If password not found: Accepted and account created

### Privacy & Security

**Privacy Preserved**:
- Password never leaves your server
- Only first 5 characters of hash sent to API
- Returns ~500 possible matches (k-anonymity)
- Full matching done locally
- No personally identifiable information shared

**Performance**:
- Adds ~100-200ms to password validation
- Asynchronous check (non-blocking)
- Cached results reduce API calls
- Negligible impact on user experience

### User Experience

**Before Enabling**:
```
User enters: "password123"
System: ✅ Password accepted
Result: Vulnerable account created
```

**After Enabling**:
```
User enters: "password123"
System: ❌ This password has been compromised in a data breach
Result: User chooses stronger password
```

### Monitoring

Track these metrics after enabling:

1. **Rejection Rate**
   - % of passwords rejected
   - Common patterns in rejected passwords
   - User retry behavior

2. **User Support**
   - Support tickets about password requirements
   - User confusion or complaints
   - Educational opportunities

3. **Security Improvements**
   - Reduced account compromises
   - Fewer credential stuffing attempts
   - Improved overall password quality

### Edge Cases

**What if API is down?**
- Supabase falls back to allowing password
- No impact on user signup/login
- Security maintained by other password rules

**What about existing passwords?**
- Existing passwords NOT retroactively checked
- Only checked during password changes
- Consider forcing password reset for security

**What if user insists on breached password?**
- Rejection is final - no override for users
- Admin can disable feature temporarily if needed
- Educate users on importance of unique passwords

### Compliance Benefits

Meets requirements for:
- **NIST SP 800-63B**: Check passwords against breach databases
- **OWASP**: Validate passwords against known breaches
- **PCI DSS**: Protect against compromised credentials
- **GDPR**: Reasonable security measures for password protection

### Recommended Additional Settings

While enabling leaked password protection, also review:

1. **Minimum Password Length**: 12 characters (recommended)
2. **Require Special Characters**: Optional (not always recommended by NIST)
3. **Password Complexity**: Balance security with usability
4. **Password Expiration**: Not recommended (NIST guidance)
5. **Password History**: Prevent reuse of last 3-5 passwords

---

## Implementation Timeline

### Immediate (Day 1)
1. ✅ Enable leaked password protection
   - Low risk, high reward
   - Immediate security improvement
   - No code changes needed

### Short Term (Week 1)
2. ⚠️ Change auth connection strategy
   - Monitor for 24-48 hours
   - Rollback plan ready
   - Performance testing recommended

### Medium Term (Weeks 2-4)
3. 🔍 Audit security definer views
   - Requires investigation
   - May need code changes
   - Thorough testing required

---

## Verification Checklist

### Auth Connection Strategy
- [ ] Dashboard shows "Percentage (10%)"
- [ ] No connection errors in logs
- [ ] Auth service metrics normal
- [ ] User login/signup working

### Leaked Password Protection
- [ ] Feature enabled in dashboard
- [ ] Rejection message configured
- [ ] Tested with known breached password
- [ ] Tested with strong password
- [ ] User-facing error messages clear

### Security Definer Views
- [ ] List of all views generated
- [ ] Each view documented
- [ ] Security assessment completed
- [ ] Remediation plan created
- [ ] Changes implemented and tested

---

## Support Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **HaveIBeenPwned API**: https://haveibeenpwned.com/API/v3
- **PostgreSQL Security**: https://www.postgresql.org/docs/current/ddl-priv.html
- **NIST Password Guidelines**: https://pages.nist.gov/800-63-3/

---

**Created**: February 10, 2026
**Priority**: High
**Estimated Time**: 2-4 hours (configuration + testing)
**Risk Level**: Low-Medium
