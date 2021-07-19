const express = require('express');
const router = express.Router();
const ImageObj = require('../models/image')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public',ImageObj.clothingImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png']
const multer = require('multer');
const { param } = require('.');
const upload = multer({
    dest : uploadPath,
    fileFilter : (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }

})


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
    renderNewPage(res, new ImageObj()); 
});

function renderNewPage(res, image, hasError = false) {
    const params = {
        image : image
    }
    if(hasError) params.errorMessage = 'Kıyafet eklenirken hata oluştu'
    res.render('images/new', params)
}

// Create image route
router.post('/', upload.single('clothingImage'), async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    console.log(req)
    const image = new ImageObj({
        category : req.body.categories,
        imageName : fileName
    })
    try {
        const newImage = await image.save()
        //res.redirect('images/${newImage.id}')
        res.redirect('images')
    } catch (err) {
        if(image.imageName != null) {
            removeImage(image.imageName)
        }
        console.log(err)
        renderNewPage(res, image, true)
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

function removeImage(fileName) {
    fs.unlink(path.join(uploadPath,fileName), err => {
        console.error(err)
    })
}

module.exports = router;