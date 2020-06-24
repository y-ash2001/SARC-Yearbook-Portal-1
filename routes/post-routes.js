const router = require('express').Router()
const bodyParser = require('body-parser');
const User = require('../models/user')
const multer = require('multer')
const path = require('path');
const transporter = require('../config/mail')
const keys = require('../config/keys')
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
    let quote = req.body.user.quote
    User.findByIdAndUpdate(_id, {bitsId : bitsid, quote : quote}).then(() => {
      res.redirect('/profile/' + req.params.id)
    }).catch((e) => {
      console.log(e)
    })
  })
  
router.post('/nominate/:id', (req, res) => {
    let id = req.params.id
    let nomineeid = req.body.user.nominee
    User.findById(id).then((user) => {
      nominatorid = user.id
      name = user.name
      User.findOne({bitsId : nomineeid}).then((user) => {
        if (user) {
          if(user.nominatedby.some(e => e.id === nominatorid)) {
            res.redirect('/profile/' + req.params.id) 
          }
          else {
            const email = user.email
            User.findOneAndUpdate({bitsId : nomineeid}, {
              $push : { nominatedby : {
                $each : [{
                  name : name,
                  id : nominatorid
                }]
              }}
            }).then(() => {
              let mailOptions = {
                from : keys.email.user,
                to : email,
                subject : 'Online Yearbook',
                text : "You've been nominated to write a caption! Login at <> to know more."
              }
              transporter.sendMail(mailOptions, (err, data) => {
                if(err) {
                  console.log(err)
                }
                else {
                  res.redirect('/profile/' + req.params.id)
                }
              })
            }).catch((e) => {
            console.log(e)
        })
        }
      }
      else {
        res.render('nominate', {id : id, msg : 'This user does not exist. Enter a different ID'})
      }
    })
  })
})
  
router.post('/edit/:id', (req, res) => {
    id = req.params.id
    disc = req.body.user.disc
    quote = req.body.user.quote
    bitsid = req.body.user.bitsid
    User.findById(id).then((user) => {
      if (disc==='') disc = user.discipline
      else disc = req.body.user.disc
      if (quote==='') quote = user.quote
      else quote = req.body. user.quote
      if (bitsid==='') bitsid = user.bitsId
      else bitsid = req.body.user.bitsid
      User.findByIdAndUpdate(id, {
        discipline : disc, 
        quote : quote, 
        bitsId : bitsid
      }).then(() => {
        res.redirect('/profile/' + req.params.id)
      }).catch((e) => {
        console.log(e)
      })
    })
  })
  
router.post('/:id1/:id2/caption', (req, res) => {
    caption = req.body.user.caption
    id1 = req.params.id1
    id2 = req.params.id2
    if (caption === '') {
      res.render('caption', {msg : 'Please enter a valid caption!'})
    }
    else {
      User.findById(id1).then((user) => {
        name = user.name
        User.findById(id2).then((user2) => {
          let captions = user2.captions
          if(captions.find(o => o.name ===name )) {
            for(let i=0; i<captions.length; i++) {
              if(captions[i].name===name) {
                captions[i].caption=caption
              }
              user2.updateOne({captions : captions}).then(() => {
                res.redirect('/profile/' + id1)
              })
            }
          }
          else {
            user2.updateOne({
              $push : { captions : {
                $each : [{
                  name : name,
                  caption : caption
                }]
              }}
            }).then(() => {
              res.redirect('/profile/' + id1)
            })
          }
        })
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
        req.flash('error', 'Please upload an image!')
        res.render('upload', {id:id, error: req.flash('error')})
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