# 🚀 Quick Deployment Guide - Local-Link Marketplace

## ✅ Current Status
- ✅ Code committed to Git (1,278 files, 303,244 lines)
- ✅ Ready to push to GitHub
- ✅ Database fully configured (Supabase)
- ✅ Edge functions deployed (200+)

---

## 📦 Step 1: Push to GitHub

Run this command in your terminal:

```bash
git push -u origin main
```

**Authentication Required:**
- Username: `EMcLellan89`
- Password: Use a GitHub Personal Access Token
  - Get one at: https://github.com/settings/tokens
  - Select scope: `repo` (Full control)
  - Copy token and paste as password

---

## 🌐 Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Select: `EMcLellan89/Local-Link-Marketplace`
3. Framework: Vite (auto-detected)
4. Add environment variables (see below)
5. Click "Deploy"

---

## 🔑 Step 3: Environment Variables

Copy these into Vercel:

### ⚠️ CRITICAL - Security Settings
```bash
# MUST BE FALSE IN PRODUCTION!
VITE_DEV_MODE=false
VITE_BYPASS_MODE=false
```

### Supabase Configuration
```bash
VITE_SUPABASE_URL=https://aqfcewyribyxnsqqrqut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmNld3lyaWJ5eG5zcXFycXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjA2MTIsImV4cCI6MjA4MDg5NjYxMn0.dhwcPIazDuvgOIwwP7MOvJMqieWZbAmCEkGiaCv0frw
```

### Stripe (Required for Payments)
```bash
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

### Optional Services
```bash
# Sentry Error Monitoring
VITE_SENTRY_DSN=your_sentry_dsn_here

# PayBright Backup Processor
PAYBRIGHT_API_KEY=your_key_here
PAYBRIGHT_MERCHANT_ID=your_id_here
PAYBRIGHT_API_URL=https://api.paybright.com/v1
VITE_GOPAYBRIGHT_WEBHOOK_SECRET=your_secret_here

# Local-Link Integration
VITE_LOCAL_LINK_BASE_URL=https://local-link.com
LOCAL_LINK_INGEST_URL=https://local-link.com/api/ingest/sale
LOCAL_LINK_INGEST_SECRET=your_secret_here
LOCAL_LINK_WEBHOOK_URL=https://local-link.com/api/webhooks/frontdesk-ai-pro
LOCAL_LINK_API_KEY=your_key_here
```

---

## ✅ Step 4: Stripe Webhook Setup

After Vercel deploys, configure Stripe webhooks:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook secret
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Step 5: Test Your Deployment

### Public Pages (Should Load)
- https://your-domain.vercel.app/
- https://your-domain.vercel.app/login
- https://your-domain.vercel.app/pricing

### Test Registration
1. Create test merchant account
2. Create test partner account
3. Verify dashboards load

### Test Payment Flow
1. Purchase a test course
2. Verify Stripe checkout works
3. Check enrollment in database

---

## 📊 What's Deployed

### Frontend
- ✅ 200+ pages (all routes configured)
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS styling
- ✅ React Router navigation
- ✅ Auth context & role management

### Backend
- ✅ Supabase database (400+ migrations)
- ✅ 200+ edge functions
- ✅ RLS security policies
- ✅ Stripe integration
- ✅ Email/SMS systems

### Features
- ✅ Merchant dashboard & CRM
- ✅ Partner dashboard & training
- ✅ Academy with 24+ courses
- ✅ Marketplace & checkout
- ✅ AI tools & automation
- ✅ Commission tracking
- ✅ Referral engine
- ✅ DFY services
- ✅ Admin portal

---

## 🔧 Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

### Pages Show "Not Found"
- Ensure you have `vercel.json` with rewrites configured (already included)

### Authentication Not Working
- Verify Supabase environment variables
- Check that DEV_MODE is false
- Ensure user exists in Supabase auth.users

### Payments Not Working
- Verify Stripe keys (use live keys, not test)
- Check webhook is configured
- Test in Stripe Dashboard

---

## 📝 Important Notes

### DEV_MODE & BYPASS_MODE
- **Development**: Set to `true` for easy testing
- **Production**: MUST be `false` for security

### Supabase Edge Functions
- Already deployed to Supabase
- No additional configuration needed
- Functions are called via `supabase.functions.invoke()`

### Database Migrations
- Already applied to your Supabase project
- 400+ migrations executed
- Database is production-ready

---

## 🎯 Success Criteria

Your deployment is successful when:
- [ ] Site loads at Vercel URL
- [ ] Landing page displays correctly
- [ ] Login/register works
- [ ] Merchant dashboard accessible
- [ ] Partner dashboard accessible
- [ ] Academy shows courses
- [ ] Stripe checkout completes
- [ ] No console errors
- [ ] Mobile responsive

---

## 🆘 Getting Help

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test Supabase connection
5. Review Stripe dashboard for webhook errors

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **React Router**: https://reactrouter.com/

---

**🚀 You're ready to deploy! Follow the steps above and your platform will be live.**
