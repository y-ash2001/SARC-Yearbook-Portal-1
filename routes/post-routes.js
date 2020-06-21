const router = require('express').Router()
const bodyParser = require('body-parser');
const User = require('../models/user')
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination : './public/assets/images/uploads/',
  filename : function(req, file, cb) {
    cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({
  storage : storage
}).single('profileImage')

router.post('/profile', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const email = req.body.email;
    const user = new User({
      name : name,
      imageUrl : imageUrl,
      email : email
    });
    User.countDocuments({email : email}).then((count) => {
      if (count<1) {
        user.save().then(() => {
        }).catch((error) => {
          console.log('Error!')
        });
      }
    })
  });
  
router.post('/addid/:id', (req, res) => {
    let _id = req.params.id
    let bitsid = req.body.user.bitsid
    User.findByIdAndUpdate(_id, {bitsId : bitsid}).then(() => {
      res.redirect('/profile/' + req.params.id)
    }).catch((e) => {
      console.log(e)
    })
  })
  
router.post('/nominate/:id', (req, res) => {
    let id = req.params.id
    let nomineeid = req.body.user.nominee
    User.findById(id).then((user) => {
      name = user.name
      User.findOne({bitsId : nomineeid}).then((user) => {
        if(user.nominatedby.includes(name)) {
          res.redirect('/profile/' + req.params.id) 
        }
        else {
          User.findOneAndUpdate({bitsId : nomineeid}, {
            $push : { nominatedby : {
              $each : [
                name
              ]
            }}
          }).then(() => {
          res.redirect('/profile/' + req.params.id)
          }).catch((e) => {
          console.log(e)
      })
    }
  })
})
})
  
router.post('/edit/:id', (req, res) => {
    disc = req.body.user.disc
    quote = req.body.user.quote
    id = req.params.id
    User.findByIdAndUpdate(id, {discipline : disc, quote : quote}).then(() => {
      res.redirect('/profile/' + req.params.id)
    }).catch((e) => {
      console.log(e)
    })
  })
  
router.post('/:id/:name/caption', (req, res) => {
    caption = req.body.user.caption
    id = req.params.id
    name = req.params.name
    if (caption === '') {
      res.render('caption', {msg : 'Please enter a valid caption!'})
    }
    else {
    User.findOneAndUpdate({name : name}, {
      $push : { captions : {
        $each : [{
          name : name,
          caption: caption
        }
        ]
      }}
    }).then(() => {
      res.redirect('/profile/' + req.params.id)
    })
  }
  })

router.post('/:id/upload', (req, res) => {
  let id = req.params.id
  upload(req, res, (err) => {
    if (err) {
      // Display Error
    }
    else {
      if (typeof req.file==='undefined') {
        res.render('upload', {msg : 'Please upload an image!', id:id})
      }
      else {
        User.findByIdAndUpdate(id, {imageUrl : '/assets/images/uploads/' + req.file.filename}).then(() => {
        res.redirect('/profile/' + id)
      })
    }
      }
    })
})

router.post('/:id/search', (req, res) => {
  let id = req.params.id
  let bitsid = req.body.user.bitsid
  res.redirect('/' + id + '/search/' + bitsid)
  })
  
module.exports = router