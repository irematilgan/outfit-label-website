const mongoose = require('mongoose')
const Outfit = require('../models/outfit')
var ObjectId = mongoose.Types.ObjectId; 

const imageSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    clothingId : {
        type : String,
        required : false
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

imageSchema.pre('remove', async function(next){
    if(this.category === 'top') {
        Outfit.find({imageTop : new ObjectId(this.id)}, (err,images)=>{
            if(err) {
                next(err)
            } else if(images.length > 0) {
                images.forEach(image => {
                    image.remove()
                })
            } 
        })
    } else if(this.category === 'bottom'){
        Outfit.find({imageBottom : this.id}, (err, images)=>{
            if(err) {
                next(err)
            } else if(images.length > 0) {
                images.forEach(image => {
                    image.remove()
                })
            } 
        })
    }

})

module.exports = mongoose.model('ImageObj',imageSchema)