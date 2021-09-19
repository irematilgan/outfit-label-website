const express = require('express');
const router = express.Router();
const ImageObj = require('../models/image')
const Outfit = require('../models/outfit')
// const uploadPath = path.join('public',ImageObj.clothingImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png']
// const multer = require('multer');
const { param } = require('.');
// const upload = multer({
//     dest : uploadPath,
//     fileFilter : (req, file, callback) =>{
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }

// })


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('../login');
}

router.get('/', isLoggedIn, async (req, res) => {
    let searchOptions = {}
    //ImageObj.remove({category : "alt"}).catch((err) => {
    //    console.log(err)
    //})

    if(req.query.categories != null && req.query.categories !== 'all') {
        searchOptions.category = req.query.categories
    }

    try {
        const images = await ImageObj.find(searchOptions)
        // console.log(images)
        res.render('images/index',{
            images : images,
            searchOptions : searchOptions,
            isLoggedIn : true
            //searchOptions : req.query
        })

    } catch {
        res.redirect('/')
    }
});

// New image route
router.get('/new',isLoggedIn,(req, res) => {
    renderNewPage(res, new ImageObj()); 
});

function renderNewPage(res, image, hasError = false) {
    const params = {
        image : image, 
        isLoggedIn : true
    }
    if(hasError) params.errorMessage = 'Kıyafet eklenirken hata oluştu'
    res.render('images/new', params)
}

// Create image route
router.post('/', async (req,res) => {
    
    try {
        var clothingImgs = req.body.clothingImg;
        var categories = req.body.categories
        var clothesLength = clothingImgs.length;
        const outfit = new Outfit({clothesCounter : clothesLength});
        for(var i = 0; i < clothesLength; i++) {
            var image = new ImageObj({
                category : categories[i],
                imageName : clothingImgs[i].name
            });
            saveImage(image, clothingImgs[i]);
            outfit.images.push(image);
            var newImage = await image.save();
        }
        const newOutfit = await outfit.save();
        res.redirect('images');

        // req.pipe(req.busboy);
        // req.busboy.on('file', function (fieldname, file, filename) {
        //     console.log(file);
        //     console.log("Uploading: " + filename); 
        // });
        // for (var key in req.body) {
        //     if (Object.hasOwnProperty.bind(req.body)(key)) {
        //       item = req.body[key];
        //       if(Array.isArray(item)) {
        //         for(var i = 0; i < item.length; i++) {
        //             if(item[i] == '') {res.redirect('images/new');}
        //             filenames.push(item[i]);
        //         }
        //       } else {
        //         categories.push(item)
        //       }
              
        //     }
        // }

        // var images = [];
        // for(var i = 0; i < filenames.length; i++) {
        //     var image = new ImageObj({
        //         category : categories[i],
        //         imageName : filenames[i]
        //     });
        //     saveImage(image, filenames[i]);
        //     console.log(image);
        //     images.push(image);
        // }

        // const outfit = new Outfit({
        //     images : images,
        //     clothesCounter : filenames.length
        // });

        // console.log(outfit);
        
    } catch (err) {
        console.log(err);
    }

    // try {
    //     const fileName = req.file != null ? req.file.filename : null
    //     // console.log(req)
    //     const image = new ImageObj({
    //         category : req.body.categories,
    //         imageName : fileName
    //     })
    
    //     saveImage(image, req.body.clothingImage)
    //     const newImage = await image.save()
    //     //res.redirect('images/${newImage.id}')
    //     res.redirect('images')
    // } catch (err) {
    //     renderNewPage(res, null, true)
    // }

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

router.delete('/:id', async (req,res) => {
    let img
 
    try {
        img = await ImageObj.findById(req.params.id)
        await img.remove()
        res.redirect(`/images`)
    } catch (error){
        console.log(error)
        if(img == null) {
            res.redirect('/')
        } else {
            res.redirect(`/images/${img.id}`)
        }
    }
})

// function removeImage(fileName) {
//     fs.unlink(path.join(uploadPath,fileName), err => {
//         console.error(err)
//     })
// }

function saveImage(image, imageEncoded) {
    if(imageEncoded == null) return
    const img = JSON.parse(imageEncoded)
    if(img != null && imageMimeTypes.includes(img.type)) {
        image.clothingImage = new Buffer.from(img.data, 'base64')
        image.clothingImageType = img.type
    }
}

module.exports = router;