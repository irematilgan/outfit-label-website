const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    clothingImage : {
        type : Buffer,
        required : true
    },
    clothingImageType : {
        type : String,
        required : true
    },
}, {timestamps : true})

imageSchema.virtual('clothingImagePath').get(function() {
    if(this.clothingImage != null && this.clothingImageType != null) {
        return `data:${this.clothingImageType};charset=utf-8;base64,${this.clothingImage.toString('base64')}`
    }
})

module.exports = mongoose.model('ImageObj',imageSchema)