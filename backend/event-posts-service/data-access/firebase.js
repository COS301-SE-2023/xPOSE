const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('../permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://xpose-4f48c-default-rtdb.firebaseio.com',
  storageBucket: 'gs://xpose-4f48c.appspot.com',
});

// Function to upload image to Firebase Storage and return the imageURL
async function uploadImageToFirebase(uid, file) {
    return new Promise((resolve, reject) => {
        // Generate a unique file name
        const fileName = `${uid}_${Date.now()}_${file.originalname}`;
    
        // Upload the file to Firebase Storage
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(fileName);
    
        const stream = fs.createReadStream(file.path);
        const writeStream = fileUpload.createWriteStream();
    
        stream.pipe(writeStream);
    
        writeStream.on('error', (err) => {
          console.error('Error uploading file:', err);
          reject('Error uploading file');
        });
    
        writeStream.on('finish', async () => {
          try {
            // Get the public URL of the uploaded file
            const url = await fileUpload.getSignedUrl({
              action: 'read',
              expires: '03-01-2500', // Adjust the expiration date as needed
            });
    
            // Save the file record in the images collection
            const db = admin.firestore();
            const imageRef = db.collection('images').doc();
    
            const image = {
              userId: uid,
              fileName: fileName,
              url: url[0],
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
    
            await imageRef.set(image);
    
            // Resolve with the file URL
            resolve(url[0]);
          } catch (err) {
            console.error('Error generating signed URL or saving file record:', err);
            reject('Error generating signed URL or saving file record');
          }
        });
      });
  }

// Export the functions
module.exports = { uploadImageToFirebase, admin };
  