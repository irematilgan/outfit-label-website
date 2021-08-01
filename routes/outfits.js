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
                score : outfits[i].score,
                id : outfits[i].id
            })
            
        }

        res.render('./outfits/index',{outfits : outfitArr, errorMessage : null})
    } catch (error) {
        console.log(error)
        res.render('./outfits/index', {errorMessage : 'Kombinler cagrilamadi'})
    }
})

router.delete('/:id', async (req,res) => {
    let outfit;
    try{
        outfit = await Outfit.findById(req.params.id)
        await outfit.remove()
        res.redirect('/outfits')
    } catch (err){
        console.log(err)
        res.redirect(`/outfits/${outfit.id}`)
    }
})

module.exports = router
