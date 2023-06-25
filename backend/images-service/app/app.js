const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const serviceAccount = require('./permissions.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xpose-4f48c-default-rtdb.firebaseio.com",
    storageBucket: "gs://xpose-4f48c.appspot.com"
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    const userId = req.body.userId;
    const file = req.file;
  
    // Generate a unique file name
    const fileName = `${userId}_${Date.now()}_${file.originalname}`;
  
    // Upload the file to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(fileName);
  
    const stream = fs.createReadStream(file.path);
    const writeStream = fileUpload.createWriteStream();
  
    stream.pipe(writeStream);
  
    writeStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'Error uploading file' });
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
            userId: userId,
            fileName: fileName,
            url: url[0],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          };
      
          await imageRef.set(image);
      
          // Return the file URL in the response
          res.json({ url: url[0] });
        } catch (err) {
          console.error('Error generating signed URL or saving file record:', err);
          res.status(500).json({ error: 'Error generating signed URL or saving file record' });
        }
      });
      
  });
  

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
