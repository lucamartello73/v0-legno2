# Vercel Environment Variables Setup Guide

## 🔐 Required Environment Variables

Your Vercel project is now linked and ready for environment variable configuration. You need to set the following variables:

---

## 📧 Gmail SMTP Configuration (REQUIRED)

### 1. GMAIL_USER
- **Description**: Your Gmail email address
- **Example**: `martello1930@gmail.com`
- **Required for**: Sending customer and admin quote emails

### 2. GMAIL_APP_PASSWORD
- **Description**: Gmail App Password (NOT your regular Gmail password)
- **Example**: `xxxx xxxx xxxx xxxx` (16 characters)
- **How to generate**:
  1. Go to https://myaccount.google.com/security
  2. Enable 2-Step Verification (if not already enabled)
  3. Go to App passwords section
  4. Generate new app password for "Mail" and "Other (Custom name)"
  5. Copy the 16-character password

### 3. GMAIL_FROM_NAME
- **Description**: Display name for sender
- **Example**: `MARTELLO 1930`
- **Default**: Will use email address if not set

---

## 🗄️ Supabase Configuration (ALREADY SET?)

Check if these are already configured in Vercel:

### 4. SUPABASE_URL
- **Description**: Your Supabase project URL
- **Example**: `https://xxxxxxxxxxx.supabase.co`

### 5. SUPABASE_SERVICE_ROLE_KEY
- **Description**: Supabase service role key (SECRET)
- **Find at**: Supabase Dashboard → Project Settings → API

### 6. NEXT_PUBLIC_SUPABASE_URL
- **Description**: Public Supabase URL (same as SUPABASE_URL)
- **Note**: Exposed to client-side code

### 7. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Description**: Supabase anonymous key
- **Find at**: Supabase Dashboard → Project Settings → API

---

## 🚀 How to Set Environment Variables

### Option 1: Vercel Dashboard (RECOMMENDED)
1. Go to https://vercel.com/dashboard
2. Select your project: **webapp**
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `GMAIL_USER`
   - Value: `your-email@gmail.com`
   - Environment: ✅ Production ✅ Preview ✅ Development
5. Click **Save**
6. Repeat for all variables

### Option 2: Vercel CLI (Command Line)
```bash
# Set GMAIL_USER
npx vercel env add GMAIL_USER production --token YOUR_TOKEN
# When prompted, enter: your-email@gmail.com

# Set GMAIL_APP_PASSWORD
npx vercel env add GMAIL_APP_PASSWORD production --token YOUR_TOKEN
# When prompted, enter: xxxx xxxx xxxx xxxx

# Set GMAIL_FROM_NAME
npx vercel env add GMAIL_FROM_NAME production --token YOUR_TOKEN
# When prompted, enter: MARTELLO 1930
```

**Important**: For each variable, you'll be asked which environments to apply to:
- Select: **Production, Preview, Development** (all)

---

## ✅ Verification Steps

### After setting variables:

1. **Check variables are set**:
```bash
npx vercel env ls --token YOUR_TOKEN
```

2. **Redeploy the application**:
```bash
npx vercel --prod --token YOUR_TOKEN
```

3. **Test email functionality**:
   - Visit: `https://your-domain.vercel.app/api/test-email?email=test@example.com`
   - Check if test email is received

---

## 🔒 Security Notes

1. **NEVER commit** `.env` or `.env.local` files to Git
2. **App Password** is different from Gmail password - use App Password only
3. **Service Role Key** should NEVER be exposed to client-side code
4. All secret keys should be marked as **Secret** in Vercel (hidden in logs)

---

## 🐛 Troubleshooting

### "Authentication failed" error
- ✅ Verify 2-Step Verification is enabled in Gmail
- ✅ Use App Password, not regular Gmail password
- ✅ Remove any spaces from App Password when entering
- ✅ Check GMAIL_USER matches the account that generated the App Password

### "Missing environment variables" error
- ✅ Ensure all 3 Gmail variables are set
- ✅ Redeploy after adding variables
- ✅ Check variables are set for correct environment (Production/Preview/Development)

### Emails not sending
- ✅ Check Vercel function logs for errors
- ✅ Test with `/api/test-email` endpoint first
- ✅ Verify Gmail account is not locked or suspended
- ✅ Check "Sent" folder in Gmail for confirmation

---

## 📋 Quick Checklist

Before deploying to production:

- [ ] Gmail 2-Step Verification enabled
- [ ] App Password generated
- [ ] `GMAIL_USER` set in Vercel
- [ ] `GMAIL_APP_PASSWORD` set in Vercel
- [ ] `GMAIL_FROM_NAME` set in Vercel
- [ ] Supabase variables already set (verify)
- [ ] Test email endpoint works
- [ ] Production deployment successful

---

## 🎯 Current Status

✅ Vercel project linked: `lucamartello73-4767s-projects/webapp`
✅ GitHub repository connected: `https://github.com/lucamartello73/v0-legno2`
⚠️ **No environment variables set yet**

**Next Action**: Set Gmail SMTP credentials using Option 1 (Dashboard) or Option 2 (CLI) above.

---

## 📞 Need Help?

Refer to:
- `GMAIL_SETUP.md` - Detailed Gmail App Password setup
- `DEPLOYMENT_CHECKLIST.md` - Full production deployment guide
- Vercel Docs: https://vercel.com/docs/concepts/projects/environment-variables
