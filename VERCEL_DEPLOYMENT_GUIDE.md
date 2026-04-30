# 🚀 Vercel Deployment Guide for Centuries Mutual

## Your Current Auth0 Configuration

✅ **Auth0 Tenant**: `dev-a6tfhplq28n7ket3.us.auth0.com`  
✅ **Client ID**: `j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq`  
✅ **Development URL**: `http://localhost:3020`  
✅ **Auth0 Secret**: Already configured  

## Step 1: Deploy to Vercel

```bash
# Push your code to GitHub
git add .
git commit -m "Complete Auth0 integration with production config"
git push origin main
```

## Step 2: Configure Vercel Environment Variables

In your Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
AUTH0_SECRET=42890444fd825b449e84d0634def87253827c54bf0b4d967ec86a98177eafe84
AUTH0_BASE_URL=https://centuriesmutual.com
AUTH0_ISSUER_BASE_URL=https://dev-a6tfhplq28n7ket3.us.auth0.com
AUTH0_CLIENT_ID=j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq
AUTH0_CLIENT_SECRET=jvQdXe_LiHIqPik-QklWdY_lXq3X7-Ic2CjMUxN2D7P_lbZ7FPnd6dQ40vzM7OHE
```

**Perfect! Your domain `centuriesmutual.com` is configured!**

## Step 3: Update Auth0 Dashboard

Go to [Auth0 Dashboard](https://manage.auth0.com) → **Applications** → **Centuries Mutual** → **Settings**

### Copy these exact URLs to your Auth0 Dashboard:

#### **Application URIs**
- **Login URI**: `https://centuriesmutual.com/login`

#### **Allowed Callback URLs**
```
http://localhost:3020/api/auth/callback,https://centuriesmutual.com/api/auth/callback
```

#### **Allowed Logout URLs**
```
http://localhost:3020,https://centuriesmutual.com
```

#### **Allowed Web Origins**
```
http://localhost:3020,https://centuriesmutual.com
```

#### **Allowed Origins (CORS)**
```
http://localhost:3020,https://centuriesmutual.com
```

#### **Back-Channel Logout (Optional)**
- **Logout URI**: `https://centuriesmutual.com/backchannel-logout`

## Step 4: Enable Facebook Login

1. Go to **Authentication** → **Social** → **Facebook**
2. Toggle **"Enabled"** to ON
3. Add your Facebook App ID and Secret
4. Save changes

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Click **"Client Login"**
3. Test both Facebook and Email login
4. Verify logout works correctly

## 🔧 Development vs Production

### Development (localhost:3020)
- Uses your current `.env.local` file
- Auth0 URLs include `http://localhost:3020`
- Perfect for testing

### Production (Vercel)
- Uses Vercel environment variables
- Auth0 URLs include your Vercel domain
- Live for your users

## 🚨 Important Notes

1. **Keep the same AUTH0_SECRET** in both environments
2. **Your Auth0 tenant is already configured** correctly
3. **Client ID and Secret** are already set up
4. **Only change the AUTH0_BASE_URL** for production

## 🎯 What Happens After Deployment

✅ **Users can login** with Facebook or email  
✅ **Sessions are secure** and encrypted  
✅ **Mobile responsive** on all devices  
✅ **Professional UI** with your branding  
✅ **Automatic redirects** to dashboard after login  

## 🆘 Troubleshooting

### "Invalid Callback URL"
- Check Auth0 application settings
- Ensure callback URL matches exactly

### "Connection Not Found"
- Verify Facebook connection is enabled
- Check Facebook App ID and Secret

### "User Not Redirected"
- Check AUTH0_BASE_URL environment variable
- Verify dashboard URL in Auth0 settings

## 🎉 You're Ready!

Your website will have **enterprise-grade authentication** that:
- Looks professional on all devices
- Provides multiple secure login options
- Scales automatically with your business
- Keeps user data completely secure

**Next**: Deploy to Vercel and update your Auth0 URLs!
