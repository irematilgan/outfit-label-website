const express = require('express')
const router = express.Router()
const Outfit = require('../models/outfit')
const ImageObj = require('../models/image')

// All outfits route
router.get('/', async (req,res) => {
    params = {}
    let outfitArr = []

    try {
        const outfits = await Outfit.find({})
        for(i = 0; i < outfits.length; i++) {
            const imageTop = await ImageObj.findById(outfits[i].imageTop)
            const imageBottom = await ImageObj.findById(outfits[i].imageBottom)
            outfitArr.push({
                imageTopImg : imageTop.clothingImagePath,
                imageBottomImg : imageBottom.clothingImagePath,
                score : outfits[i].score
            })
            
        }

        res.render('./outfits/index',{outfits : outfitArr, errorMessage : null})
    } catch (error) {
        console.log(error)
        res.render('./outfits/index', {errorMessage : 'Kombinler cagrilamadi'})
    }
})

module.exports = router
