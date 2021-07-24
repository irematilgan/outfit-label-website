const mongoose = require('mongoose')
const ImageObj = require('../models/image')
const outfitSchema = mongoose.Schema({
    imageTop : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ImageObj'
    },
    imageBottom : {
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