const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let mongoose;
try {
  mongoose = require("mongoose");
} catch (err) {
  console.error(err);
}
mongoose.connect(process.env['u'], { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);
const exerciseSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true }
});
const Exercise = mongoose.model('Exercise', exerciseSchema);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Create a user
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  User.find({username: username}).countDocuments((err, count) => {
    if (err) console.error(err);
    if (count == 0){
      let user = new User({username: username});
      user.save();
      res.json({"username": user.username, "_id": user.id});
    } else {
      User.findOne({username: username}, (err, user) => {
        if (err) console.error(err);
        res.json({"username": user.username, "_id": user.id});
      })
    }
  })
})


// Get all users
app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) console.error(err);
    res.send(users)
  })
})


// Post an exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  let id = req.params._id;
  let desc = req.body.description;
  let dur = req.body.duration;
  let date = req.body.date ?
             new Date(req.body.date).toDateString() :
             new Date().toDateString();
  User.findOne({_id: id}, (err, user) => {
    if (err) console.error(err);
    let ex = new Exercise({
      username: user.username,
      description: desc,
      duration: dur,
      date: date
    });
    ex.save()
    res.json({
      _id: id,
      username: user.username,
      date: date,
      duration: parseInt(dur),
      description: desc
    });
  });
});


// Get user logs
app.get('/api/users/:_id/logs', (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let id = req.params._id;
  User.findOne({_id: id}, (err, user) => {
    if (err) console.error(err);
    Exercise.find({username: user.username}, (err, logs) => {
      if (err) console.error(err);
      let arr = []
      for (let ex of logs){
        if (
          (!from || new Date(ex.date).valueOf() >= new Date(from).valueOf())
          && (!to || new Date(ex.date).valueOf() <= new Date(to).valueOf())
          && (!limit || arr.length < parseInt(limit))){
            arr.push({
              "description": ex.description,
              "duration": ex.duration,
              "date": ex.date
            })
          };
      };
      res.json({
        _id: id,
        username: user.username,
        count: arr.length,
        log: arr
      });
    });
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
