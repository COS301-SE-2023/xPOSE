const app = require('./app');

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Gateway API server is running on port ${port}`);
});