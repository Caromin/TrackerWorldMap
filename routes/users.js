const express = require('express');
const firebase = require('firebase');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.send('respond with a resource');
});

router.post('/add', function(req, res) {
  // req.body will pass the json object sent from ajax in public javascript
  // connecting to firebase database  
  const database = firebase.database();
  // console.log('this is a test ' + req.body.dateArrived.length);
  
  // working as intended
  // referencing the country that was selected
  // child is referencing the state and pushing all the relative info to it
  if (req.body.providence === "") {
      return res.send({msg: 'You did not provide a state'})
  } else if (req.body.dateArrived.length !== 12) {
      return res.send({msg: 'There was a problem with the date send'})
  } else if (req.body.packageSize > 99) {
      return res.send({msg: 'I don\'t think you have a package larger than 99 kg'})
  }  else if (req.body.packageSize <= 0) {
      return res.send({msg: 'I don\'t think you have a package smaller than 0 kg'})
  } else {
    database.ref(`${req.body.country}`)
      .child(`${req.body.providence}`)
      .push({
        seized: req.body.packageStatus,
        courier: req.body.courier,
        agent: req.body.agent,
        packageSize: req.body.packageSize,
        dateArrived: req.body.dateArrived,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    return res.send({msg: 'Info was saved successfully!'});
  }
})

module.exports = router;
