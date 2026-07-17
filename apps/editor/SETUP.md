# Setup Instructions

## Initial Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Box.com credentials and other settings.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open http://localhost:3000
   - You'll be redirected to the login page
   - Use the credentials from your `.env` file (ADMIN_EMAIL and ADMIN_PASSWORD)

## Push to GitHub

To push this repository to GitHub:

1. **Create a new repository on GitHub** (if you haven't already):
   - Go to https://github.com/new
   - Create a new repository (e.g., `newspaper-editor-cms`)

2. **Add the remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

   Or if using SSH:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Box.com Configuration

1. Go to https://developer.box.com/
2. Create a new Box App
3. Configure OAuth 2.0 settings
4. Generate a Developer Token or set up Service Account authentication
5. Copy the credentials to your `.env` file:
   - `BOX_CLIENT_ID`
   - `BOX_CLIENT_SECRET`
   - `BOX_ENTERPRISE_ID`
   - `BOX_ACCESS_TOKEN`

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Update `JWT_SECRET` to a strong random string
3. Configure HTTPS
4. Set up proper database for user management (currently using in-memory store)
5. Configure CORS settings for your newspaper domain
6. Set up environment variables on your hosting platform

## API Integration with newspaper.centuriesmutual.com

The article submission endpoint (`/api/articles/submit`) will attempt to POST to:
```
https://newspaper.centuriesmutual.com/api/articles
```

Make sure:
- The endpoint exists on the newspaper domain
- Authentication headers are configured if required
- CORS is properly configured on the newspaper domain

