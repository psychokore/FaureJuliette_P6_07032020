const { json } = require('express');
const Sauce = require('../models/sauces');
const fs = require('fs');
const sauces = require('../models/sauces');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauces = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauces.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => {
        res.status(500).json({ error: 'Internal server error' })}
        );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  );
};

exports.modifySauce = async (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    const sauce = await Sauce.findOne({_id: req.params.id});
    if (!sauce) {
        return res.status(404).json({
            error: 'Ressource not found'
        })
    };
    if (req.file) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
    }
    const userId = req.auth.userId
  Sauce.updateOne({ _id: req.params.id, userId }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(500).json({ error: 'Internal server error' }));
};

exports.deleteSauce = (req, res, next) => {
  const userId = req.auth.userId;
  Sauce.findOne({ _id: req.params.id, userId})
    .then(sauces => {
        if (!sauces) {
            return res.status(404).json({
                error: 'Ressource not found'
            })
        };
      const filename = sauces.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(500).json({ error: 'Internal server error' }));
      });
    })
    .catch(error => res.status(500).json({ error: 'Internal server error' }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (Sauces) => {
      res.status(200).json(Sauces);
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  );
};

exports.likeSauce =  (req, res, next) => {
  if (!req.body.like){
    return res.status(400).json({error: 'Missing fields'})
  }
  Sauce.findOne({ _id: req.params.id })
  .then(sauces => {

      const user = req.auth.userId
      const like = req.body.like        

      switch(like) {
          case 0 : console.log("neutre")
          if(sauces.usersLiked.includes(user)){
              Sauce.updateOne(
                  { _id: req.params.id },
                  {
                      $inc:{ likes: -1,},
                      $pull:{ usersLiked : user, }
                  }
              )
              .then(() => res.status(201).json({ message: 'neutre' }))
              .catch(error => res.status(500).json({ error: 'Internal server error' }))
          }
          else if(sauces.usersDisliked.includes(user)){
              Sauce.updateOne(
                  { _id: req.params.id },
                  {
                      $inc:{ dislikes: -1,},
                      $pull:{ usersDisliked : user, }
                  }
              )
              .then(() => res.status(201).json({ message: 'neutre' }))
              .catch(error => res.status(500).json({ error: 'Internal server error' })) 
          }

          break      
          case 1 : console.log("positif")

          Sauce.updateOne(
              { _id: req.params.id },
              {
                  $inc:{ likes : 1},
                  $push:{usersLiked : user,}
              }
          )
          .then(() => res.status(201).json({ message: 'sauce likée' }))
          .catch(error => res.status(500).json({ error: 'Internal server error' }))
          break
          case -1 : console.log("negatif")
          Sauce.updateOne(
              { _id: req.params.id },
              {
                  $inc: { dislikes : 1},
                  $push:{usersDisliked : user,}
              }
          )
          .then(() => res.status(201).json({ message: 'sauce dislikée' }))
          .catch(error => res.status(500).json({ error: 'Internal server error' }))
      }
  })
  .catch(error => res.status(500).json({ error }))
};