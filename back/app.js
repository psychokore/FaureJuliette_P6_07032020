const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();



const userRoutes = require('./routes/user');
const saucesRoute = require('./routes/sauces');

const app = express();
mongoose.connect(process.env.DATABASE_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', saucesRoute);
  app.use('/images', express.static(path.join(__dirname, 'images')));


  module.exports = app;