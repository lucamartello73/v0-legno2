# Vercel CLI Commands Reference

## 🔑 Quick Setup

Your Vercel project is linked and ready. Use these commands to manage environment variables:

---

## 📋 View Current Environment Variables

```bash
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## ➕ Add Environment Variables (Interactive)

### Gmail SMTP Configuration

```bash
# 1. Add GMAIL_USER
npx vercel env add GMAIL_USER production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: your-email@gmail.com

# 2. Add GMAIL_APP_PASSWORD
npx vercel env add GMAIL_APP_PASSWORD production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: xxxx xxxx xxxx xxxx (your 16-char App Password)

# 3. Add GMAIL_FROM_NAME
npx vercel env add GMAIL_FROM_NAME production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: MARTELLO 1930
```

### Supabase Configuration (if needed)

```bash
# 4. Add SUPABASE_URL
npx vercel env add SUPABASE_URL production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: https://xxxxxxxxxxx.supabase.co

# 5. Add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: your-service-role-key

# 6. Add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: https://xxxxxxxxxxx.supabase.co (same as SUPABASE_URL)

# 7. Add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# When prompted, enter: your-anon-key
```

---

## 🔍 Pull Environment Variables to Local

```bash
# Download env vars to .env.local for local development
npx vercel env pull .env.local --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🗑️ Remove Environment Variable

```bash
npx vercel env rm VARIABLE_NAME production --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🚀 Deploy to Production

```bash
# Deploy current branch to production
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn

# Deploy specific branch
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn --branch main
```

---

## 🔄 Redeploy (trigger rebuild)

```bash
# Useful after adding environment variables
npx vercel --prod --force --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 📊 View Deployment Status

```bash
# List recent deployments
npx vercel ls --token 4vqyCW9kl80g3RsrpgzqnSEn

# View specific deployment logs
npx vercel logs DEPLOYMENT_URL --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🔗 Get Project Information

```bash
# View project details
npx vercel inspect --token 4vqyCW9kl80g3RsrpgzqnSEn

# View project URL
npx vercel alias ls --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🎯 Quick Start Guide

### Option 1: Use Dashboard (EASIEST)
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with values
5. Redeploy

### Option 2: Use Interactive Script
```bash
export VERCEL_TOKEN=4vqyCW9kl80g3RsrpgzqnSEn
./scripts/setup-vercel-env.sh
```

### Option 3: Use CLI Commands (Above)
Copy and run each command above, entering values when prompted.

---

## 📝 Notes

- **Token**: Your token `4vqyCW9kl80g3RsrpgzqnSEn` is already configured
- **Project**: `lucamartello73-4767s-projects/webapp`
- **GitHub**: Connected to `https://github.com/lucamartello73/v0-legno2`
- **Environments**: Set variables for Production, Preview, AND Development

---

## ✅ Verification

After setting variables, verify with:

```bash
# Check variables are set
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn

# Should show:
# GMAIL_USER
# GMAIL_APP_PASSWORD
# GMAIL_FROM_NAME
# (and Supabase variables if set)
```

Then test:

```bash
# Deploy
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn

# Test email endpoint
# Visit: https://your-domain.vercel.app/api/test-email?email=your@email.com
```

---

## 🐛 Troubleshooting

### "No credentials found"
- Use `--token` flag with every command
- Token: `4vqyCW9kl80g3RsrpgzqnSEn`

### "Project not found"
- Run: `npx vercel link --token 4vqyCW9kl80g3RsrpgzqnSEn --yes`

### Environment variables not working
- Redeploy after adding variables
- Check variables are set for correct environment
- Use `npx vercel env pull` to verify locally

---

## 📚 More Info

- Full setup guide: `VERCEL_ENV_SETUP.md`
- Gmail setup: `GMAIL_SETUP.md`
- Deployment checklist: `DEPLOYMENT_CHECKLIST.md`
