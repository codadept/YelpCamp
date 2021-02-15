const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        Schema                  = mongoose.Schema;


const UserSchema = new Schema({
    email:{
        type: String,
        required: [true, 'Email must be entered!'],
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose);       // Its adding a password field in the Schema, its adding username in the schema
                                                // its checking for duplicate username and provides additional methods
module.exports = mongoose.model('User', UserSchema);