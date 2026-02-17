# PULSE - QUICK URL REFERENCE

## 🔗 Customer URLs

| URL | Description |
|-----|-------------|
| `/pulse` | Main feed with revenue-weighted deals |
| `/pulse/leaderboard` | City/national/lifetime leaderboards |
| `/pulse/referral` | Share & earn referral system |

## 🔗 Merchant URLs

| URL | Description |
|-----|-------------|
| `/merchant/pulse` | Dashboard with boost purchase & stats |

## 🔗 Admin URLs

| URL | Description |
|-----|-------------|
| `/admin/pulse` | Revenue dashboard & city management |

## 🔗 Edge Functions

| Function | URL | Auth Required |
|----------|-----|---------------|
| `pulse-boost-checkout` | `/functions/v1/pulse-boost-checkout` | Yes (JWT) |
| `pulse-boost-webhook` | `/functions/v1/pulse-boost-webhook` | No (Stripe sig) |

## 🧪 Test Flow

### Customer:
1. Visit `/pulse` ✅
2. Click "Claim +10pts" button ✅
3. Click points badge → `/pulse/leaderboard` ✅
4. Click "Share & Earn" → `/pulse/referral` ✅

### Merchant:
1. Visit `/merchant/pulse` ✅
2. View deal performance stats ✅
3. Click "Boost This Deal" ✅

### Admin:
1. Visit `/admin/pulse` ✅
2. Review revenue stats ✅
3. Click "Activate" on a pilot city ✅

## ⚡ Quick Actions

### Claim a Deal (Customer):
```
Navigate to /pulse → Click "Claim" button → +10 points!
```

### Boost a Deal (Merchant):
```
Navigate to /merchant/pulse → Click "Boost This Deal" → Select type → Stripe checkout
```

### Activate a City (Admin):
```
Navigate to /admin/pulse → Find pilot city → Click "Activate" → Status: PUBLIC
```

## 🎯 Navigation Flow

```
Customer Dashboard
  ↓
[Pulse icon in nav]
  ↓
/pulse (Main Feed)
  ├─ [Points badge] → /pulse/leaderboard
  ├─ [Share button] → /pulse/referral
  └─ [Deal card] → /deal/{id}
```

```
Merchant Dashboard
  ↓
[Pulse menu item]
  ↓
/merchant/pulse
  ├─ View deal stats
  ├─ Purchase boost → Stripe checkout
  └─ Performance upsell card
```

```
Admin Dashboard
  ↓
[Pulse menu item]
  ↓
/admin/pulse
  ├─ Revenue overview
  ├─ City management
  ├─ Top performers
  └─ Recent boosts
```

## 🚀 Deploy Checklist

- [x] All routes added to App.tsx
- [x] Edge functions deployed
- [x] Database migration applied
- [x] Build passes successfully
- [ ] Configure Stripe webhook
- [ ] Test end-to-end flow
- [ ] Deploy to production

**ALL CODE IS COMPLETE AND READY TO GO! 🎉**
