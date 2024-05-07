const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const app = express();

const mongoDB = 'mongodb://mongodb:27017/demo';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model('Post', postSchema);

// Endpoint que retorna la lista de Posts junto con el Hostname (ID del contenedor) del servidor
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    const hostName = os.hostname();
    res.json({ hostName, posts });
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    res.status(500).send('Error fetching data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
