const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.getShouts = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .collection('shouts')
    .get()
    .then(data => {
      let shouts = [];
      data.forEach(doc => {
        shouts.push(doc.data());
      });
      return response.json(shouts);
    })
    .catch(err => console.error(err));
});

exports.createShout = functions.https.onRequest((request, response) => {
  if (request.method !== 'POST') {
    return response.status(400).json({
      error: 'Method not allowed'
    });
  }
  const newShout = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection('shouts')
    .add(newShout)
    .then(doc => {
      response.json({
        message: `document ${doc.id} created successfully`
      });
    })
    .catch(err => {
      response.status(500).json({
        error: 'something went wrong'
      });
      console.error(err);
    });
});
