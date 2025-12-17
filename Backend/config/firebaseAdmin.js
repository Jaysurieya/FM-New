const admin = require("firebase-admin");

const serviceAccount = require("../fitmate-560ce-firebase-adminsdk-fbsvc-e2c6bdcc47.json"); 
// 👆 downloaded from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
