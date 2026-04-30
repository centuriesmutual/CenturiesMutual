# Box.com Integration Setup Guide

This guide will help you set up Box.com integration to pull newspaper articles and PDFs from your Box.com folder.

## Prerequisites

- A Box.com account with admin access
- Node.js project with the Box SDK installed (`npm install box-node-sdk`)

## Step 1: Create a Box Developer App

1. Go to [Box Developer Console](https://app.box.com/developers/console)
2. Click "Create New App"
3. Choose "Custom App" -> "Server Authentication (JWT)"
4. Fill in the app details:
   - App Name: "Centuries Mutual Newspaper"
   - Description: "Integration for newspaper articles and PDFs"
5. Click "Create App"

## Step 2: Configure Your App

1. In your app's "Configuration" tab, note down:
   - **Client ID**
   - **Client Secret**
   - **Enterprise ID** (if you have one)

2. Go to "JWT Key Pair" section and:
   - Click "Generate a Public/Private Keypair"
   - Download the private key file (it will be named something like `private_key_123456.pem`)
   - Note the **Public Key ID**

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Box.com API Configuration
BOX_CLIENT_ID=your_client_id_here
BOX_CLIENT_SECRET=your_client_secret_here
BOX_PUBLIC_KEY_ID=your_public_key_id_here
BOX_ENTERPRISE_ID=your_enterprise_id_here
BOX_PASSPHRASE=your_passphrase_if_any
BOX_FOLDER_ID=your_newspaper_folder_id_here
```

## Step 4: Add Private Key File

1. Rename your downloaded private key file to `box-private-key.pem`
2. Place it in your project root directory
3. Make sure it's added to `.gitignore` to keep it secure

## Step 5: Get Folder ID

1. Navigate to your Box.com folder containing newspaper articles
2. Copy the folder ID from the URL (e.g., `https://app.box.com/folder/123456789`)
3. The folder ID is the number at the end of the URL

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/box-news`
3. You should see a JSON response with your Box.com files

## API Endpoint

The integration creates an API endpoint at `/api/box-news` that returns:

```json
{
  "success": true,
  "folderName": "Newspaper Articles",
  "totalItems": 5,
  "items": [
    {
      "id": "123456789",
      "name": "newsletter-january-2024.pdf",
      "type": "file",
      "fileType": "PDF",
      "url": "https://app.box.com/file/123456789",
      "downloadUrl": "https://app.box.com/file/123456789/download",
      "lastModified": "2024-01-15T10:30:00Z",
      "size": 2048576,
      "description": "January 2024 Newsletter",
      "tags": ["newsletter", "january"],
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "lastUpdated": "2024-01-15T12:00:00Z"
}
```

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" Error**: Check that your private key file is correctly placed and the Public Key ID matches
2. **"Folder not found" Error**: Verify the folder ID is correct and the app has access to the folder
3. **"Authentication failed" Error**: Check that all environment variables are set correctly

### Security Notes:

- Never commit your private key file to version control
- Use environment variables for all sensitive information
- Consider using Box.com's webhook system for real-time updates
- Implement proper error handling and logging

## Next Steps

1. Update your newspaper page to fetch data from the API endpoint
2. Implement caching to reduce API calls
3. Add error handling for when Box.com is unavailable
4. Consider implementing a refresh mechanism for the newspaper content
