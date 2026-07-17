import BoxSDK from 'box-node-sdk';

/**
 * Box.com API Integration for Newspaper Articles
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Box Developer App:
 *    - Go to https://app.box.com/developers/console
 *    - Click "Create New App"
 *    - Choose "Custom App" -> "Server Authentication (JWT)"
 *    - Fill in app details
 * 
 * 2. Get your credentials:
 *    - Go to your app's "Configuration" tab
 *    - Copy the "Client ID" and "Client Secret"
 *    - Generate a "JWT Key Pair" and download the private key
 * 
 * 3. Set up environment variables in .env.local:
 *    BOX_CLIENT_ID=your_client_id_here
 *    BOX_CLIENT_SECRET=your_client_secret_here
 *    BOX_PRIVATE_KEY_PATH=./box-private-key.pem
 *    BOX_PUBLIC_KEY_ID=your_public_key_id_here
 *    BOX_ENTERPRISE_ID=your_enterprise_id_here
 *    BOX_FOLDER_ID=your_newspaper_folder_id_here
 * 
 * 4. Upload your private key file to the project root as "box-private-key.pem"
 * 
 * 5. Get the folder ID:
 *    - Navigate to your Box folder containing newspaper articles
 *    - Copy the folder ID from the URL
 */

export async function GET() {
  try {
    // Check if Box credentials are configured
    if (!process.env.BOX_CLIENT_ID || !process.env.BOX_CLIENT_SECRET) {
      return Response.json({
        success: false,
        error: 'Box API credentials not configured',
        message: 'Please configure BOX_CLIENT_ID and BOX_CLIENT_SECRET environment variables',
      }, { status: 503 });
    }

    // Initialize Box SDK
    const sdk = new BoxSDK({
      clientID: process.env.BOX_CLIENT_ID,
      clientSecret: process.env.BOX_CLIENT_SECRET,
      appAuth: {
        keyID: process.env.BOX_PUBLIC_KEY_ID,
        privateKey: process.env.BOX_PRIVATE_KEY,
        passphrase: process.env.BOX_PASSPHRASE || '',
      },
    });

    // Get service account client
    const client = sdk.getAppAuthClient('enterprise', process.env.BOX_ENTERPRISE_ID);

    // Get folder contents
    const folderId = process.env.BOX_FOLDER_ID;
    const folder = await client.folders.get(folderId, {
      fields: 'name,items',
    });

    // Process files and folders
    const items = folder.item_collection.entries.map(item => {
      const baseUrl = 'https://app.box.com/file/';
      const sharedLink = item.type === 'file' ? `${baseUrl}${item.id}` : null;
      
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        fileType: item.type === 'file' ? getFileType(item.name) : 'folder',
        url: sharedLink,
        downloadUrl: item.type === 'file' ? `${baseUrl}${item.id}/download` : null,
        lastModified: item.modified_at,
        size: item.size || 0,
        description: item.description || '',
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.modified_at,
      };
    });

    // Sort by last modified date (newest first)
    items.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    return Response.json({
      success: true,
      folderName: folder.name,
      totalItems: items.length,
      items: items,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Box API Error:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}

/**
 * Helper function to determine file type from filename
 */
function getFileType(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  
  const typeMap = {
    'pdf': 'PDF',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'txt': 'Text File',
    'jpg': 'Image',
    'jpeg': 'Image',
    'png': 'Image',
    'gif': 'Image',
    'mp4': 'Video',
    'avi': 'Video',
    'mov': 'Video',
    'mp3': 'Audio',
    'wav': 'Audio',
    'zip': 'Archive',
    'rar': 'Archive',
  };

  return typeMap[extension] || 'Unknown';
}

/**
 * Helper function to format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
