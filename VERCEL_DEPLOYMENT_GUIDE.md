# Vercel Deployment Guide

Quick reference guide for deploying Local Link Marketplace to Vercel.

## Prerequisites

- Vercel account ([sign up](https://vercel.com))
- GitHub account
- Git installed locally

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment to Vercel"

# Create main branch
git branch -M main

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/local-link-marketplace.git

# Push
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node Version**: 18.x or higher

### 3. Add Environment Variables

In Vercel project settings, add these environment variables:

**Settings → Environment Variables → Add New**

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://aqfcewyribyxnsqqrqut.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

Make sure to select all three environments (Production, Preview, Development) for each variable.

### 4. Deploy

Click "Deploy" and wait for the build to complete (usually 1-2 minutes).

### 5. Access Your Site

After deployment, Vercel provides:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each pull request
- **Deployment logs**: For debugging

## Custom Domain Setup

### Option 1: Buy Through Vercel
1. Settings → Domains → Buy Domain
2. Search and purchase domain
3. Auto-configured

### Option 2: Use Existing Domain
1. Settings → Domains → Add
2. Enter your domain (e.g., `locallink.com`)
3. Add DNS records at your registrar:
   - **A Record**: Point to Vercel's IP
   - **CNAME**: Point `www` to `cname.vercel-dns.com`
4. Verify domain
5. SSL auto-configures (takes 5-10 minutes)

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request
- **Instant rollbacks**: Redeploy any previous deployment

## Vercel CLI (Optional)

Install for local deployments and management:

```bash
# Install globally
npm i -g vercel

# Login
vercel login

# Deploy from local
vercel

# Deploy to production
vercel --prod
```

## Monitoring & Analytics

Access in Vercel dashboard:
- **Analytics**: Page views, performance metrics
- **Logs**: Real-time function logs
- **Speed Insights**: Core Web Vitals
- **Deployment history**: All past deployments

## Environment Management

Vercel provides three environments:

1. **Production** - `main` branch
2. **Preview** - Pull requests and other branches
3. **Development** - Local development

Set different environment variables per environment as needed.

## Troubleshooting

### Build Fails
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure `package.json` has correct build command
- Run `npm run build` locally to test

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Redeploy after adding new variables
- Check all three environments are selected

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records at registrar
- Check SSL certificate status in Vercel

### Supabase Connection Issues
- Verify Supabase project is active
- Check environment variables are correct
- Ensure Supabase RLS policies allow access

## Performance Optimization

Vercel automatically provides:
- Global CDN distribution
- Edge caching
- Automatic image optimization
- Brotli compression
- HTTP/2 and HTTP/3

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: Available in dashboard
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Your app is now live and automatically deploys with every push to GitHub!**
