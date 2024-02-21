import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { azureStorageConfig } from './env.js'; // Ensure this path is accurate

const containerName = 'user-profile-images'; // Your Azure container name

export async function generateBlobSasUrl(blobName) {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // Grant read permissions
        startsOn: new Date(new Date().valueOf() - 3600 * 1000), // Optional: SAS token start time, 1 hour ago
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // SAS token expiry time, 1 hour from now
    }, blobServiceClient.credential).toString();

    return `${blobClient.url}?${sasToken}`;
}

function getBlobServiceClient() {
    const connectionString = azureStorageConfig.connectionString;
    if (!connectionString) {
        throw new Error('Azure Storage Connection String is not set in environment variables.');
    }
    return BlobServiceClient.fromConnectionString(connectionString);
}

export async function uploadFileToBlobStorage(blobName, stream, streamLength) {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(stream, streamLength);
    // Manually construct the blob URL to return
    const blobUrl = `https://${azureStorageConfig.accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    return blobUrl; // Ensure azureStorageConfig includes accountName or adjust accordingly
}

export async function deleteBlobFromStorage(blobName) {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    
    await blobClient.delete();
    console.log(`Blob ${blobName} deleted successfully`);
}

export async function updateBlobInStorage(blobName, stream, streamLength) {
    // This function is essentially the same as upload since uploading a blob with the same name overwrites it
    return uploadFileToBlobStorage(blobName, stream, streamLength);
}
