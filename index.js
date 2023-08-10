const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/admin', adminRouter);
app.use('/users', userRouter);

const PORT = process.env.PORT;
const DATABASE = 'courses';
const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;

// Connect to MongoDB cloud instance
mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.uv82io6.mongodb.net/${DATABASE}`);

// local instance
// mongoose.connect(`mongodb://127.0.0.1:27017/${DATABASE}`);

// Start the server
app.listen( PORT || 3000, () => {
  console.log('Server running on port 3000');
});
