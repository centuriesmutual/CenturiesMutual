# Auth0 Setup Guide for Centuries Mutual

## Step 1: Create Auth0 Account and Application

1. **Go to [Auth0 Dashboard](https://manage.auth0.com/)**
2. **Sign up/Login** to your Auth0 account
3. **Create a new Application:**
   - Click "Applications" → "Create Application"
   - Name: "Centuries Mutual"
   - Type: **"Single Page Application"**
   - Click "Create"

## Step 2: Configure Application Settings

### Basic Settings:
- **Allowed Callback URLs:** `http://localhost:3020/api/auth/callback`
- **Allowed Logout URLs:** `http://localhost:3020`
- **Allowed Web Origins:** `http://localhost:3020`
- **Allowed Origins (CORS):** `http://localhost:3020`

### Advanced Settings:
- **Grant Types:** Check "Authorization Code" and "Refresh Token"
- **Token Endpoint Authentication Method:** "None"

## Step 3: Enable Facebook Social Connection

1. **Go to Authentication → Social**
2. **Click "Create Connection"**
3. **Select "Facebook"**
4. **Configure Facebook App:**
   - You'll need a Facebook Developer account
   - Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
   - Get App ID and App Secret from Facebook
   - Add Facebook App ID and Secret to Auth0
5. **Enable the connection**

## Step 4: Enable Database Connection (Email/Password)

1. **Go to Authentication → Database**
2. **Click on "Username-Password-Authentication"**
3. **Enable "Disable Sign Ups"** if you want to control user registration
4. **Configure password policy** as needed

## Step 5: Update Environment Variables

Replace the values in `.env.local`:

```bash
# Your Auth0 domain (found in Auth0 Dashboard → Applications → Settings)
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'

# Your Auth0 application credentials (found in Auth0 Dashboard → Applications → Settings)
AUTH0_CLIENT_ID='your_actual_client_id'
AUTH0_CLIENT_SECRET='your_actual_client_secret'
```

## Step 6: Test the Login Flow

1. **Start your development server:** `npm run dev`
2. **Go to:** `http://localhost:3020/login`
3. **Test both login methods:**
   - Facebook login (requires Facebook app setup)
   - Email/Password login (works immediately)

## Step 7: Production Configuration

For production deployment, update:
- **Allowed Callback URLs:** `https://yourdomain.com/api/auth/callback`
- **Allowed Logout URLs:** `https://yourdomain.com`
- **Allowed Web Origins:** `https://yourdomain.com`
- **AUTH0_BASE_URL:** `https://yourdomain.com`

## Features Included:

✅ **Facebook Login** - Social authentication with Facebook
✅ **Email/Password Login** - Traditional email and password authentication
✅ **User Registration** - New users can create accounts
✅ **Session Management** - Secure session handling
✅ **User Profile** - Access to user information
✅ **Logout Functionality** - Secure logout process
✅ **Mobile Responsive** - Works on all devices

## Troubleshooting:

- **"Invalid redirect_uri"** - Check callback URLs in Auth0 settings
- **"Connection not found"** - Ensure Facebook connection is enabled
- **"Client not found"** - Verify CLIENT_ID and CLIENT_SECRET
- **"Domain not found"** - Check ISSUER_BASE_URL format

## Security Notes:

- Never commit `.env.local` to version control
- Use strong, unique secrets
- Enable MFA for Auth0 dashboard access
- Regularly rotate secrets in production
