import BoxSDK from 'box-node-sdk';

let boxClient: any = null;

export function getBoxClient() {
  if (!boxClient) {
    const sdk = new BoxSDK({
      clientID: process.env.BOX_CLIENT_ID || '',
      clientSecret: process.env.BOX_CLIENT_SECRET || '',
    });

    // Use service account or user token
    const accessToken = process.env.BOX_ACCESS_TOKEN || '';
    boxClient = sdk.getBasicClient(accessToken);
  }

  return boxClient;
}

export async function uploadFileToBox(
  fileName: string,
  fileContent: Buffer | string,
  folderId: string = '0'
): Promise<any> {
  const client = getBoxClient();
  
  try {
    const file = await client.files.uploadFile(
      folderId,
      fileName,
      fileContent
    );
    return file;
  } catch (error) {
    console.error('Error uploading file to Box:', error);
    throw error;
  }
}

export async function createFolder(folderName: string, parentFolderId: string = '0'): Promise<any> {
  const client = getBoxClient();
  
  try {
    const folder = await client.folders.create(parentFolderId, folderName);
    return folder;
  } catch (error) {
    console.error('Error creating folder in Box:', error);
    throw error;
  }
}

export async function getFolderContents(folderId: string = '0'): Promise<any> {
  const client = getBoxClient();
  
  try {
    const items = await client.folders.getItems(folderId);
    return items;
  } catch (error) {
    console.error('Error getting folder contents from Box:', error);
    throw error;
  }
}

export async function getFileDownloadUrl(fileId: string): Promise<string> {
  const client = getBoxClient();
  
  try {
    const url = await client.files.getDownloadURL(fileId);
    return url;
  } catch (error) {
    console.error('Error getting file download URL from Box:', error);
    throw error;
  }
}

