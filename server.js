const express = require('express');
var bodyParser = require('body-parser');
const User = require('./mongoose')

const app = express();
const port = 3000;

app.use(express.static('public'));
app.listen(port, () => console.log('Listening at port ' + port));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// app.get('/users', (req, res) => {
//   User.find({}).then((users) => {
//     res.send(users);
//   }).catch((e) => {
//     res.status(500).send()
//   })
// })
// GET REQUESTS
app.get('/profile/:id', (req, res) => {
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

app.get('/profile/:id/edit', (req, res) => {
  res.render('edit-details', {id : req.params.id})
}) 

app.get('/:id/nominate', (req, res) => {
  res.render('nominate', {id : req.params.id})
})

app.get('/:id/nomination', (req, res) => {
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

app.get('/:id/notifications', (req, res) => {
  id = req.params.id
  User.findById(id).then((user) => {
    const nominees = user.nominatedby
    res.render('notifications', {id:id, nomineelist:nominees})
  })
})

app.get('/:id/:name/caption', (req, res) => {
  id = req.params.id
  name = req.params.name
  res.render('caption', {id:id, name:name})
})
// POST REQUESTS

// app.post('/details/:id', (req, res) => {
//   let id = req.params.id
//   let bitsid = req.body.user.bitsid
//   let nominee = req.body.user.nominee
//   User.findByIdAndUpdate(id, {bitsId : bitsid})
//   .then((result) => {}).catch((e)=> {
//     console.log('Unable to update!')
//   })
//   User.findOneAndUpdate({bitsId : nominee}, {nominatedby : bitsid}).then((result) => {
//   res.redirect('/profile/' + req.params.id)
// }).catch((e) => {
//   console.log('Unable to update!')
// })
// })

app.post('/profile', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const email = req.body.email;
  const user = new User({
    name : name,
    imageUrl : imageUrl,
    email : email
  });
  User.countDocuments({ email : email}).then((count) => {
    if (count<1) {
      user.save().then(() => {
      }).catch((error) => {
        console.log('Error!')
      });
    }
  })
});

app.post('/addid/:id', (req, res) => {
  let _id = req.params.id
  let bitsid = req.body.user.bitsid
  User.findByIdAndUpdate(_id, {bitsId : bitsid}).then(() => {
    res.redirect('/profile/' + req.params.id)
  }).catch((e) => {
    console.log(e)
  })
})

app.post('/nominate/:id', (req, res) => {
  let id = req.params.id
  let nomineeid = req.body.user.nominee
  User.findById(id).then((user) => {
    name = user.name
    User.findOneAndUpdate({bitsId : nomineeid}, {
      $push : { nominatedby : {
        $each : [
          name
        ]
      }
      }
    }).then(() => {
      res.redirect('/profile/' + req.params.id)
    }).catch((e) => {
      console.log(e)
    })
  })
})

app.post('/edit/:id', (req, res) => {
  disc = req.body.user.disc
  quote = req.body.user.quote
  id = req.params.id
  User.findByIdAndUpdate(id, {discipline : disc, quote : quote}).then(() => {
    res.redirect('/profile/' + req.params.id)
  }).catch((e) => {
    console.log(e)
  })
})

app.post('/:id/:name/caption', (req, res) => {
  caption = req.body.user.caption
  id = req.params.id
  name = req.params.name
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
})
