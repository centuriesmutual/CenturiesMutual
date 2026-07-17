# Newspaper Editor CMS

Enterprise-level newspaper editor CMS powered by Box.com SDK for managing and submitting articles to newspaper.centuriesmutual.com.

## Features

- 🔐 Secure authentication system with JWT
- 📝 Rich article editor with image upload support
- 📦 Box.com SDK integration for file storage
- 🚀 API endpoints for article submission
- 🎨 Modern, responsive UI built with Next.js and Tailwind CSS
- 📱 Enterprise-ready dashboard interface

## Prerequisites

- Node.js 18+ and npm/yarn
- Box.com account with API credentials
- Access to newspaper.centuriesmutual.com domain

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `BOX_CLIENT_ID`: Your Box.com Client ID
- `BOX_CLIENT_SECRET`: Your Box.com Client Secret
- `BOX_ENTERPRISE_ID`: Your Box.com Enterprise ID
- `BOX_ACCESS_TOKEN`: Your Box.com Access Token
- `JWT_SECRET`: A secure random string for JWT signing
- `ADMIN_EMAIL`: Admin user email
- `ADMIN_PASSWORD`: Admin user password

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Articles
- `POST /api/articles/submit` - Submit new article
- `GET /api/articles/list` - List articles from Box

## Project Structure

```
Editor/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── box.ts            # Box.com SDK integration
│   └── middleware.ts     # Auth middleware
└── package.json
```

## Box.com Setup

1. Create a Box.com developer account
2. Create a new Box App
3. Configure OAuth 2.0 settings
4. Generate a Developer Token or set up Service Account
5. Add credentials to `.env` file

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Use environment variables for all sensitive data
- Implement rate limiting for API endpoints
- Add HTTPS in production
- Consider implementing database for user management

## License

Proprietary - All rights reserved

