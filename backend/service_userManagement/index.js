import express from 'express';
import bodyParser from  'body-parser';
import userRoute from './routes/users.js';

const app = express();
const PORT = 8002;

// initialize body-parser middleware
app.use(bodyParser.json()); // will be using Json  data
app.use('/users', userRoute);
app.get('/', (req, res) => res.send("Hello from homepage"));

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));