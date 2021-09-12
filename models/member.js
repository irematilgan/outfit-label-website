const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const OutfitObj = require('../models/outfit')
//const passportLocalMongoose = require('passport-local-mongoose');
const outfitReference = new mongoose.Schema({
    outfitId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'OutfitObj'
    },
    score : {
        type : Number
    }
});

const memberSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    brands : {
        type : [String],
        default : []
    },
    outfitId : {
        type : String,
        default : '0'
    },
    finished : {
        type : Boolean,
        default : false
    },
    givenScores : [outfitReference]
});

memberSchema.pre('save', async function (next) {
    try {
        console.log(this.password)
        this.password = await bcrypt.hashSync(this.password,10);
        next();
    } catch(err) {
        console.log(err);
    }

});

memberSchema.methods.comparePasswords = function(plainPassword, callback) {
    return callback(null, bcrypt.compareSync(plainPassword, this.password));
}

//memberSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Member', memberSchema);