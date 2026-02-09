# RequirePartner Error - FIXED

## Issue

The application was crashing with the error:
```
RequirePartner is not defined
```

This occurred when trying to access partner routes like:
- `/partner/winners`
- `/partner/campaigns`

## Root Cause

The routes were using a `RequirePartner` component that was never created or imported. This was an oversight when the new partner campaign routes were added.

## Solution

Replaced `RequirePartner` with the existing `ProtectedRoute` component that was already being used throughout the application for role-based access control.

### Before:
```typescript
<Route path="/partner/winners" element={
  <RequirePartner>
    <WeeklyWinnersFeed />
  </RequirePartner>
} />
```

### After:
```typescript
<Route path="/partner/winners" element={
  <ProtectedRoute allowedRoles={['partner']}>
    <WeeklyWinnersFeed />
  </ProtectedRoute>
} />
```

## Files Changed

- `src/App.tsx` - Replaced 2 instances of `RequirePartner` with `ProtectedRoute`

## Verification

- Build passes successfully (35.99s)
- Routes now use consistent auth pattern with rest of application
- Partner-only routes properly protected

## How ProtectedRoute Works

The existing `ProtectedRoute` component:
1. Checks if user is authenticated
2. Checks if user's role matches `allowedRoles` array
3. Redirects to login if not authenticated
4. Redirects to unauthorized if wrong role
5. Renders children if authorized

This is the same logic that would have been in `RequirePartner`, so the behavior is identical - we're just using the existing, battle-tested component instead of creating a duplicate.

## Status: RESOLVED

Both partner routes now work correctly and use the standard auth pattern:
- `/partner/winners` - View weekly winning creatives
- `/partner/campaigns` - Manage deployed campaigns
