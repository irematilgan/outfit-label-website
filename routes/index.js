const express = require('express');
const router = express.Router();
const path = require('path')
const ImageObj = require('../models/image')
const Outfit = require('../models/outfit')
let imageTopId = null
let imageBottomId = null
router.get('/', async (req, res) => {
    params = {}
    try {
        const imageTops = await ImageObj.find({'category' : 'top'})
        const imageBottoms = await ImageObj.find({'category' : 'bottom'})
        imageTopId = await imageTops.length > 0? imageTops[0]._id : null
        imageBottomId = await imageBottoms.length > 0? imageBottoms[0]._id : null
        params.imageTop = imageTops.length > 0? imageTops[0].clothingImagePath : null
        params.imageBottom = imageBottoms.length > 0? imageBottoms[0].clothingImagePath : null
        renderHomePage(res, params)
    } catch (error) {
        renderHomePage(res,params,false)
    }

});


router.post('/new', async (req,res) => {
    const buttonRes = req.body.outfitButton
    if(buttonRes == 'Save') {
        if(imageTopId != null && imageBottomId != null) {
            console.log(req.body)
            const outfit = new Outfit({
                imageTop : imageTopId,
                imageBottom : imageBottomId,
                score : req.body.compScore
            })
            try {
                const newOutfit = await outfit.save()
                res.redirect('/')
            } catch (err){
                console.log('Outfit could not be saved!..')
                console.log(err)
            }
        } else {
            res.render('/',{errorMessage : 'Alt veya üst kıyafet bulunamadı'})
        }
    } else if(buttonRes == 'Randomize') {
        params = {}
        console.log('Randomize')
        try {
            const imageTopsRand = await ImageObj.find({'category' : 'top'})
            const imageBottomsRand = await ImageObj.find({'category' : 'bottom'})
            const randomResTop = Math.floor(Math.random()*imageTopsRand.length)
            const randomResBottom = Math.floor(Math.random()*imageBottomsRand.length)
            imageTopId = await imageTopsRand[randomResTop]._id
            imageBottomId = await imageBottomsRand[randomResBottom]._id
            params.imageTop = imageTopsRand[randomResTop].clothingImagePath
            params.imageBottom = imageBottomsRand[randomResBottom].clothingImagePath
            renderHomePage(res, params)
        } catch (err) {
            renderHomePage(res,params,false)
        }


    }



})

function renderHomePage(res, params, hasError = false) {
    params.errorMessage = null
    if(hasError) {
        params = {}
        params.errorMessage = "Sayfa gösterilirken hata oluştu."
    }
    res.render('index', params); 
}

module.exports = router;