const express = require('express');
const firebase = require('firebase');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'RepFam' });
});

router.post('/info', function(req, res, next) {
  // connecting to firebase database
  const database = firebase.database();

  const grabData = new Promise(function(resolve, reject) {
    const info = [];
    const ref = database.ref(`${req.body.country}/${req.body.providence}`);

    // Checking first if there is a value for example --database.ref(usa/idaho)
    // if snapshot doesn't exist it will reject the promise
    ref.once('value', function(snapshot) {
      if (!snapshot.exists()) {
        const result = 'There is nothing here';
        reject(result)
        return;
      } else {
        console.log('this does exist!');

        ref.orderByChild('dateAdded').limitToLast(6).on('child_added', function(snapshot) {
          const seized = snapshot.val().seized;
          const agent = snapshot.val().agent;
          const courier = snapshot.val().courier;
          const dateArrived = snapshot.val().dateArrived;
          const packageSize = snapshot.val().packageSize;
    
          const singlePackage = {
            'seized': seized,
            'agent': agent,
            'courier': courier,
            'dateArrived': dateArrived,
            'packageSize': packageSize
          }
    
          info.unshift(singlePackage);
          resolve(info);
          return;
        })
      }
    })
  });

    // promise data === info, see above
    grabData.then(function(data) {
      res.send({msg: data});
    }).catch(function(data) {
      res.send({msg: data})
    })
});

module.exports = router;
