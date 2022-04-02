const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Crypto = require('node-crypt');

const User = require('../models/user');

const crypto = new Crypto({
  key: process.env.CRYPTO_KEY,
  hmacKey: process.env.CRYPTO_HMACKEY,
})

exports.signup = async (req, res, next) => {
  if (!req.body.password || !req.body.email){
    return res.status(400).json({error: 'Missing fields'})
  }
  const crypt = req.body.mail;
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: crypt,
    password: hash
  });
   user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(500).json({ error: 'Internal server error' }));
  };

  exports.login = (req, res, next) => {
    if (!req.body.password || !req.body.email){
      return res.status(400).json({error: 'Missing fields'})
    }
    user.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'Les identifiants sont incorrects' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(404).json({ error: 'Les identifiants sont incorrects' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  { userId: user._id},
                  process.env.JWTOKEN,
                  { expiresIn: '1800'}
              )
            });
          })
          .catch(error => res.status(500).json({ error: 'Internal server error' }));
      })
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
  };