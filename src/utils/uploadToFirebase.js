// firebaseAdmin.js
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { uuid } from 'uuidv4';
import fs from 'fs'
const serviceAccount = JSON.parse(
  await readFile(
    new URL("../sensitive_info/backend-c5d4f-firebase-adminsdk-46cy4-4ee665659d.json", import.meta.url)
  )
); // Update the path to your service account key JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'backend-c5d4f.appspot.com' // Replace with your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

uuid()
async function uploadToFirebase(localFilePath,firebaseFilePath){
  try{
  await bucket.upload(localFilePath, {
    destination: firebaseFilePath,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });
  const file = bucket.file(firebaseFilePath);
  const [displayUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500' // Expires far in the future or according to your requirements
  });

  fs.unlinkSync(localFilePath)
  return displayUrl
}
catch(error){
  fs.unlinkSync(localFilePath)
}
}
export { uploadToFirebase };
