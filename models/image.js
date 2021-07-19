const mongoose = require('mongoose')
const path = require('path')
const clothingImageBasePath = 'uploads/images'

const imageSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    imageName : {
        type : String,
        required : true
    }
}, {timestamps : true})

imageSchema.virtual('clothingImagePath').get(function() {
    if(this.imageName != null) {
        return path.join('/',clothingImageBasePath,this.imageName)
    }
})

module.exports = mongoose.model('ImageObj',imageSchema)
module.exports.clothingImageBasePath = clothingImageBasePath