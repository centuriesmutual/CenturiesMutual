# Vercel Deployment Configuration for Auth0

## Environment Variables for Vercel

When deploying to Vercel, you need to add these environment variables in your Vercel dashboard:

### Required Environment Variables:

```
AUTH0_SECRET=42890444fd825b449e84d0634def87253827c54bf0b4d967ec86a98177eafe84
AUTH0_BASE_URL=https://your-app-name.vercel.app
AUTH0_ISSUER_BASE_URL=https://dev-a6tfhplq28n7ket3.us.auth0.com
AUTH0_CLIENT_ID=j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq
AUTH0_CLIENT_SECRET=jvQdXe_LiHIqPik-QklWdY_lXq3X7-Ic2CjMUxN2D7P_lbZ7FPnd6dQ40vzM7OHE
```

## How to Add Environment Variables in Vercel:

### Method 1: Vercel Dashboard
1. **Go to your project in Vercel Dashboard**
2. **Click on "Settings" tab**
3. **Click on "Environment Variables"**
4. **Add each variable:**
   - Name: `AUTH0_SECRET`
   - Value: `42890444fd825b449e84d0634def87253827c54bf0b4d967ec86a98177eafe84`
   - Environment: `Production, Preview, Development`
   - Click "Save"

   Repeat for each variable:
   - `AUTH0_BASE_URL` = `https://your-app-name.vercel.app`
   - `AUTH0_ISSUER_BASE_URL` = `https://dev-a6tfhplq28n7ket3.us.auth0.com`
   - `AUTH0_CLIENT_ID` = `j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq`
   - `AUTH0_CLIENT_SECRET` = `jvQdXe_LiHIqPik-QklWdY_lXq3X7-Ic2CjMUxN2D7P_lbZ7FPnd6dQ40vzM7OHE`

### Method 2: Vercel CLI
```bash
vercel env add AUTH0_SECRET
# Enter: 42890444fd825b449e84d0634def87253827c54bf0b4d967ec86a98177eafe84

vercel env add AUTH0_BASE_URL
# Enter: https://your-app-name.vercel.app

vercel env add AUTH0_ISSUER_BASE_URL
# Enter: https://dev-a6tfhplq28n7ket3.us.auth0.com

vercel env add AUTH0_CLIENT_ID
# Enter: j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq

vercel env add AUTH0_CLIENT_SECRET
# Enter: jvQdXe_LiHIqPik-QklWdY_lXq3X7-Ic2CjMUxN2D7P_lbZ7FPnd6dQ40vzM7OHE
```

## Update Auth0 Application Settings

After deploying to Vercel, update your Auth0 application settings:

### In Auth0 Dashboard:
1. **Go to Applications → Your App → Settings**
2. **Update these URLs:**
   - **Allowed Callback URLs:** 
     ```
     http://localhost:3020/api/auth/callback,
     https://your-app-name.vercel.app/api/auth/callback
     ```
   - **Allowed Logout URLs:**
     ```
     http://localhost:3020,
     https://your-app-name.vercel.app
     ```
   - **Allowed Web Origins:**
     ```
     http://localhost:3020,
     https://your-app-name.vercel.app
     ```
   - **Allowed Origins (CORS):**
     ```
     http://localhost:3020,
     https://your-app-name.vercel.app
     ```

## Important Notes:

⚠️ **Replace `your-app-name`** with your actual Vercel app name
⚠️ **Keep both localhost and production URLs** in Auth0 settings for development
⚠️ **Never commit `.env.local`** to your repository
⚠️ **Use HTTPS URLs** for production (Vercel provides this automatically)

## Deployment Steps:

1. **Add environment variables to Vercel** (using method above)
2. **Update Auth0 application settings** with production URLs
3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```
4. **Test the login flow** on your production URL

## Testing:

- **Local:** `http://localhost:3020/login`
- **Production:** `https://your-app-name.vercel.app/login`

Both should work with Facebook and email/password authentication!
