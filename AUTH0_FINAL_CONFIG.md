# 🎯 FINAL Auth0 Configuration for centuriesmutual.com

## Copy These Exact URLs to Your Auth0 Dashboard

Go to: [Auth0 Dashboard](https://manage.auth0.com) → **Applications** → **Centuries Mutual** → **Settings**

### Application URIs
```
Login URI: https://centuriesmutual.com/login
```

### Allowed Callback URLs
```
http://localhost:3020/api/auth/callback,https://centuriesmutual.com/api/auth/callback
```

### Allowed Logout URLs
```
http://localhost:3020,https://centuriesmutual.com
```

### Allowed Web Origins
```
http://localhost:3020,https://centuriesmutual.com
```

### Allowed Origins (CORS)
```
http://localhost:3020,https://centuriesmutual.com
```

### Back-Channel Logout (Optional)
```
Logout URI: https://centuriesmutual.com/backchannel-logout
```

## Vercel Environment Variables

Add these to your Vercel dashboard:

```
AUTH0_SECRET=42890444fd825b449e84d0634def87253827c54bf0b4d967ec86a98177eafe84
AUTH0_BASE_URL=https://centuriesmutual.com
AUTH0_ISSUER_BASE_URL=https://dev-a6tfhplq28n7ket3.us.auth0.com
AUTH0_CLIENT_ID=j0sBGVXdiwjz95DuVaXl4ErMnvDxFmnq
AUTH0_CLIENT_SECRET=jvQdXe_LiHIqPik-QklWdY_lXq3X7-Ic2CjMUxN2D7P_lbZ7FPnd6dQ40vzM7OHE
```

## ✅ You're All Set!

Your Auth0 is now configured for:
- ✅ **Development**: `http://localhost:3020`
- ✅ **Production**: `https://centuriesmutual.com`
- ✅ **Facebook Login**: Enabled
- ✅ **Email/Password**: Enabled
- ✅ **Secure Sessions**: Configured

**Next**: Deploy to Vercel and test your login!
