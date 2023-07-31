const fs = require('fs');

const [projectId, appId, databaseURL, storageBucket, locationId, apiKey, authDomain, messagingSenderId, measurementId, vapidKey, googleMapsAPIKey, apiUrl] = process.argv.slice(2);

const content = (isProduction) => `export const environment = {
  firebase: {
    projectId: "${projectId}",
    appId: "${appId}",
    databaseURL: "${databaseURL}",
    storageBucket: "${storageBucket}",
    locationId: "${locationId}",
    apiKey: "${apiKey}",
    authDomain: "${authDomain}",
    messagingSenderId: "${messagingSenderId}",
    measurementId: "${measurementId}",
    vapidKey: "${vapidKey}"
  },
  googleMapsAPIKey: "${googleMapsAPIKey}",
  production: ${isProduction},
  apiUrl: "${apiUrl}"
};`;

const folderPath = 'environments';
const environmentFilePath = `${folderPath}/environment.ts`;
const environmentProdFilePath = `${folderPath}/environment.prod.ts`;

// Create the environments folder
fs.mkdirSync(folderPath, { recursive: true });

// Write the content to environment.js
fs.writeFileSync(environmentFilePath, content(false));

// Write the content to environment.prod.js
fs.writeFileSync(environmentProdFilePath, content(true));

console.log('Environments and files created successfully!');
