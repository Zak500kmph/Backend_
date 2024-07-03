import { initializeApp } from 'firebase/app';
import 'firebase/storage';
import "dotenv/config";
import fs from "fs"

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

initializeApp(firebaseConfig);

// Function to upload file to Firebase Storage
const uploadToFirebase = async (fileUrl,name) => {
  try {
    if (!fileUrl) return null;
    const response = await fetch(fileUrl);
    const fileBuffer = await response.arrayBuffer();

    const storageRef = firebase.storage().ref(`random/${name}`);
    await storageRef.put(fileBuffer);

    // Optionally, get the download URL for the uploaded file
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
  } catch (err) {
    console.error('Error uploading file:', err.message);
    fs.unlink(fileUrl)
    return null
  }
};

export { uploadToFirebase };
