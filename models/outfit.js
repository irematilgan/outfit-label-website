const mongoose = require('mongoose')
const ImageObj = require('../models/image')
const MemberObj = require('../models/member')

const memberReference = new mongoose.Schema({
    memberId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'MemberObj'
    },
    score : {
        type : Number
    }
})

const outfitSchema = new mongoose.Schema({
    images : [{
        required : false,
        type: mongoose.Schema.Types.ObjectId,
        ref : 'ImageObj',
        default : []
    }],
    clothesCounter: {
        required : true,
        type : Number
    },
    givenMembers : [memberReference]
},{timestamps : true})

// const outfitSchema = mongoose.Schema({
//     imageTop : {
//         required : true,
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'ImageObj'
//     },
//     imageBottom : {
//         required : true,
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'ImageObj'
//     },
//     score : {
//         required : false,
//         type : Number
//     }
// })

module.exports = mongoose.model('Outfit',outfitSchema)