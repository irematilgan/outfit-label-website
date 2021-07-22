const mongoose = require('mongoose')
const ImageObj = require('../models/image')
const outfitSchema = mongoose.Schema({
    imageNameTop : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ImageObj'
    },
    imageNameBottom : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ImageObj'
    },
    score : {
        required : true,
        type : Number
    }
})

module.exports = mongoose.model('Outfit',outfitSchema)