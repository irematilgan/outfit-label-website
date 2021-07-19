const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    url : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    }
}, {timestamps : true})

module.exports = mongoose.model('ImageObj',imageSchema)