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
})
  
router.post('/addid/:id', async (req, res) => {
    let _id = req.params.id
    let bitsid = req.body.user.bitsid
    let quote = req.body.user.quote
    await User.findByIdAndUpdate(_id, {bitsId : bitsid, quote : quote})
    res.redirect('/profile/' + req.params.id)
  })
  
router.post('/nominate/:id', async (req, res) => {
    let id = req.params.id
    let nomineeid = req.body.user.nominee
    const user1 = await User.findById(id)
    nominatorid = user1.id
    name = user1.name
    const user2 = await User.findOne({bitsId : nomineeid})
    if (user2) {
      if (user2.nominatedby.some(e => e.id === nominatorid)) {
        res.render('nominate', {id : id, success : 'User has already been nominated!'})
      }
      else {
        const email = user2.email
        await user2.updateOne({
          $push : { nominatedby : {
            $each : [{
              name : name,
              id : nominatorid
            }]
        
        }}
        })
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
            res.render('nominate', {id : id, success : 'User nominated successfully!'})
          }
      })
    }}
    else {
        res.render('nominate', {id : id, error : 'This user does not exist! Enter a different ID.'})
      }
    })

router.post('/edit/:id', async (req, res) => {
    id = req.params.id
    disc = req.body.user.disc
    quote = req.body.user.quote
    bitsid = req.body.user.bitsid
    const user = await User.findById(id)
    if (disc==='') disc = user.discipline
    else disc = req.body.user.disc
    if (quote==='') quote = user.quote
    else quote = req.body. user.quote
    if (bitsid==='') bitsid = user.bitsId
    else bitsid = req.body.user.bitsid
    await User.findByIdAndUpdate(id, {
    discipline : disc, 
    quote : quote, 
    bitsId : bitsid
    })
    res.render('edit-details', {id : req.params.id, msg: 'Details updated successfully!'})
  })
  
router.post('/:id1/:id2/caption', async (req, res) => {
    caption = req.body.user.caption
    id1 = req.params.id1
    id2 = req.params.id2
    if (caption === '') {
      res.render('caption', {id:id1, id1:id2, name:user2.name, error : 'Please enter a valid caption!'})
    }
    else {
      const user1 = await User.findById(id1)
      name = user1.name
      const user2 = await User.findById(id2)
      let captions = user2.captions
      if(captions.find(o => o.name ===name )) {
        for(let i=0; i<captions.length; i++) {
          if(captions[i].name===name) {
          captions[i].caption=caption
        }}
        await user2.updateOne({captions : captions})
        res.render('caption', {id:id1, id1:id2, name:user2.name, success : 'Caption added successfully!'})
      }
      else {
        await user2.updateOne({
           $push : { captions : {
            $each : [{
              name : name,
              caption : caption
          }]
        }}})
        res.render('caption', {id:id1, id1:id2, name:user2.name, success : 'Caption added successfully!'})
      }
    }})

router.post('/:id/upload', (req, res) => {
  let id = req.params.id
  upload(req, res, (err) => {
    if (err) {
      // Display Error
    }
    else {
      if (typeof req.file==='undefined') {
        res.render('upload', {id:id, msg : 'Please upload a valid image!'})
      }
      else {
        User.findByIdAndUpdate(id, {imageUrl : '/assets/images/uploads/' + req.file.filename}).then(() => {
        res.redirect('/profile/' + id)
      })
    }
      }
    })
})

router.post('/:id/search', async (req, res) => {
  let id = req.params.id
  let bitsid = req.body.user.bitsid
  let user = await User.findOne({bitsId : bitsid})
  if (user) res.redirect('/' + id + '/search/' + bitsid)
  else {
    let user = await User.findById(id) 
    res.render('profile', {user : user, msg : 'User not found!'})
  }})
  
module.exports = router