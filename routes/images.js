const express = require('express');
const router = express.Router();
const ImageObj = require('../models/image')

router.get('/',async (req, res) => {
    let searchOptions = {}
    //ImageObj.remove({category : "alt"}).catch((err) => {
    //    console.log(err)
    //})

    if(req.query.categories != null && req.query.categories !== 'all') {
        searchOptions.category = req.query.categories
    }

    try {
        const images = await ImageObj.find(searchOptions)
        console.log(images)
        res.render('images/index',{
            images : images,
            searchOptions : searchOptions
            //searchOptions : req.query
        })

    } catch {
        res.redirect('/')
    }
});

// New image route
router.get('/new',(req, res) => {
    res.render('images/new', {image : new ImageObj()}); 
});

// Create image route
router.post('/',async (req,res) => {
    
    const image = new ImageObj({
        url : req.body.img_url,
        category : req.body.categories
    })
    try {
        const newImage = await image.save()
        //res.redirect('images/${newImage.id}')
        res.redirect('images')
    } catch{
        res.render('images/new', {
                        image: image,
                        errorMessage: 'Error creating image'
                   })
    }

    //image.save((err, newImage) => {
    //    if (err) {
    //        res.render('images/new', {
    //            image: image,
    //            errorMessage: 'Error creating image'
    //        })
    //    } else {
    //        //res.redirect('images/${newImage.id}')
    //        res.redirect('images')
    //    }
    //})
    
})

module.exports = router;