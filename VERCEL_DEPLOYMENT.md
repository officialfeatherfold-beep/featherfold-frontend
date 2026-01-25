# 🚀 Vercel Deployment Instructions

## ✅ Frontend is Already Fixed!

Your frontend code is **correctly configured** to use environment variables:

```javascript
// All API calls use this pattern:
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
```

## 🔧 What You Need to Do in Vercel

### Step 1: Add Environment Variable in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

**Variable Name:** `VITE_API_BASE_URL`
**Value:** `https://your-railway-backend-url.railway.app/api`

*Replace `your-railway-backend-url.railway.app` with your actual Railway backend URL*

### Step 2: Redeploy

After adding the environment variable:
1. Go to the Deployments tab in Vercel
2. Click "Redeploy" or push a new commit

## 🎯 How It Works

- **Development**: Uses `http://localhost:5001/api` (fallback)
- **Production**: Uses `VITE_API_BASE_URL` from Vercel environment
- **Vite automatically exposes** variables starting with `VITE_` to the frontend

## 📋 Complete Environment Variables for Vercel

```
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

## 🔍 Verification

After deployment, check your browser's Network tab:
- All API calls should go to your Railway backend URL
- No calls to localhost:5001 in production

## ✅ Your Frontend is Ready!

The code is already production-ready with:
- ✅ Environment variable usage
- ✅ Proper fallbacks for development
- ✅ No hardcoded localhost URLs in production

**Just add the environment variable in Vercel and redeploy! 🚀**
