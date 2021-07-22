const express = require('express');
const router = express.Router();
const path = require('path')
const ImageObj = require('../models/image')

router.get('/', async (req, res) => {
    params = {}
    try {
        const imageTops = await ImageObj.find({'category' : 'top'})
        const imageBottoms = await ImageObj.find({'category' : 'bottom'})
        params.imageTop = imageTops.length > 0? imageTops[0].clothingImagePath : null
        params.imageBottom = imageBottoms.length > 0? imageBottoms[0].clothingImagePath : null
        
        
        renderHomePage(res, params)
    } catch (error) {
        renderHomePage(res,params,false)
    }

});

function renderHomePage(res, params, hasError = false) {
    params.errorMessage = null
    if(hasError) {
        params = {}
        params.errorMessage = "Sayfa gösterilirken hata oluştu."
    }
    res.render('index', params); 
}

module.exports = router;