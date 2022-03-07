const express = require('express');
const mongoose = require('mongoose');



const userRoutes = require('./routes/user');

const app = express();
mongoose.connect('mongodb+srv://admin:K8poE4jPqR0hk5Kl@cluster0.vgsg3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



  app.use('/api/auth', userRoutes);


  module.exports = app;