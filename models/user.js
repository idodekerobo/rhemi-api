const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
   firebaseUid: {
      type: String
   },
   restaurant: {
      // type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
      // not an array, maybe make an array of object id's when multiple restaurant functionality gets built
      type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant',
   },
   firstName: {
      type: String,
   },
   lastName: {
      type: String
   }
})
const User = mongoose.model('User', UserSchema);
module.exports = User;