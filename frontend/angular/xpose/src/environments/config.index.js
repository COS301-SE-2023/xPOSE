const fs = require('fs');
const path = require('path');

function replaceEnvironmentValues(fileName, params) {
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    let fileContent = data;
    params.forEach((param, index) => {
      const placeholder = `<SPOT ${index}>`;
      fileContent = fileContent.replace(new RegExp(placeholder, 'g'), param);
    });

    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to the file:', err);
        return;
      }
      console.log(`Updated values in ${fileName}`);
    });
  });
}

const environmentFileName = 'environment.ts';
const environmentProdFileName = 'environment.prod.ts';
const params = process.argv.slice(2);

if (params.length !== 11) {
  console.error('Please provide exactly 11 parameters.');
  return;
}

replaceEnvironmentValues(environmentFileName, params);
replaceEnvironmentValues(environmentProdFileName, params);
