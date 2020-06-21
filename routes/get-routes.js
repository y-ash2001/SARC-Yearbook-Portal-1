const router = require('express').Router()
const bodyParser = require('body-parser');
const User = require('../models/user')

router.get('/profile/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
      if(!user) {
        return res.status(400).send()
      }
      res.render('profile', {user : user})
    }).catch((e) => {
      res.status(500).send()
    })
  }) 
  
router.get('/profile/:id/edit', (req, res) => {
    res.render('edit-details', {id : req.params.id})
  }) 
  
router.get('/:id/nominate', (req, res) => {
    res.render('nominate', {id : req.params.id})
  })
  
router.get('/:id/nomination', (req, res) => {
    let _id = req.params.id
    User.findById(_id).then((user) => {
      let nominee = user
      if (nominee.nominatedby) {
        User.findOne({bitsId : nominee.nominatedby}).then((user) => {
          let nominator = user
          res.render('nomination', {nominee : nominee, nominator : nominator})
        })
      }
      else {
        res.send("<h1>You have not been nominated yet!</h1>")
      }
    }).catch((e) => {
      console.log('User could not be found')
    })
  })
  
router.get('/:id/notifications', (req, res) => {
    id = req.params.id
    User.findById(id).then((user) => {
      const nominees = user.nominatedby
      res.render('notifications', {id:id, nomineelist:nominees})
    })
  })
  
router.get('/:id/:name/caption', (req, res) => {
    id = req.params.id
    name = req.params.name
    res.render('caption', {id:id, name:name})
  })

router.get('/:id/search/:bitsid', (req, res) => {
  let userid = req.params.id
  let resultid = req.params.bitsid
  User.findOne({bitsId : resultid}).then((user) => {
    res.render('public-profile', {user : user, id : userid})
  })
})

router.get('/:id/upload', (req, res) => {
  let id = req.params.id
  res.render('upload', {id : id})
})

router.get('/:id/developers', (req, res) => {
  res.render('developers', {id : req.params.id})
})

module.exports = router