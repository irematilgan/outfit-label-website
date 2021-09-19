const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport')
const ImageObj = require('../models/image')
const Member = require('../models/member')
const Outfit = require('../models/outfit')
const mongoose = require('mongoose');
const db = mongoose.connection;




function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('./login');
}


// route for Home-Page
router.get("/", isLoggedIn, async (req, res) => {

    params = {}
    try {
        const currentMember = await Member.findById(req.session.context);

        params.finished = false;

        if(currentMember.outfitId == '0') {
            const outfits = await Outfit.find({})
            if(outfits.length != 0) {
                currentMember.outfitId = outfits[0].id;   
                await Member.updateOne({_id : currentMember.id}, {$set : currentMember});
            } else {
                res.redirect('./images/new');
            }

        } 

        var outfit = await Outfit.findById(currentMember.outfitId);
        var nextOutfit = await Outfit.findOne({_id: {$gt: currentMember.outfitId}}).sort({_id: 1});
        //limit(1)[0]
        //var nextId = db.outfit.find({_id: {$gt: currentMember.outfitId}}).sort({_id: 1 }).limit(1)
        //console.log("CURRENT ID : " + currentMember.outfitId);
        
        if(nextOutfit == null && currentMember.finished == true) {
            params.finished = true;
            params.imageLen = 0;
            params.images = [];
            renderHomePage(res,params)
        } else {
            if (currentMember.finished == true){
                currentMember.finished = false;
                currentMember.outfitId = nextOutfit._id;
                await Member.updateOne({_id : currentMember._id}, {$set : currentMember});
                outfit = nextOutfit;
            }
            if(nextOutfit != null) {
                console.log("NEXT ID : " + nextOutfit._id);
            }
            
            
            const imageIds = outfit.images;
            params.images = [];
            for(var i = 0; i < imageIds.length; i++) {
                var img = await ImageObj.findById(imageIds[i]);
                params.images.push(img.clothingImagePath);
            }
            params.imageLen = imageIds.length
            
            renderHomePage(res,params);
        }
        
        
        

        

        // const imageTops = await ImageObj.find({'category' : 'top'})
        // const imageBottoms = await ImageObj.find({'category' : 'bottom'})
        // imageTopId = await imageTops.length > 0? imageTops[0]._id : null
        // imageBottomId = await imageBottoms.length > 0? imageBottoms[0]._id : null
        // params.imageTop = imageTops.length > 0? imageTops[0].clothingImagePath : null
        // params.imageBottom = imageBottoms.length > 0? imageBottoms[0].clothingImagePath : null
        // renderHomePage(res, params)
    } catch (error) {
        console.log(error)
        renderHomePage(res,params,false)
    }
});


router.post('/new', async (req,res) => {
    const buttonRes = req.body.outfitButton

    if(buttonRes == 'Save') {
        try {
            const currentMember = await Member.findById(req.session.context);
            //console.log(currentMember.outfitId);
            if(currentMember.givenScores == null) {
                currentMember.givenScores = [];
            }
            currentMember.givenScores.push({outfitId : currentMember.outfitId, score : req.body.compScore});

            const outfit = await Outfit.findById(currentMember.outfitId);
            if(outfit.givenMembers == null) {
                outfit.givenMembers = [];
            }
            outfit.givenMembers.push({memberId : currentMember.id, score : req.body.compScore});
            //console.log(currentMember.givenMembers.length);
            //outfit.scores.push(req.body.compScore);
            //var nextId = Outfit.find({_id: {$gt: outfit._id}}).sort({_id: 1}).limit(1)[0];
            //var nextId = db.outfits.find({_id: {$gt: outfit._id}}).sort({_id: 1 }).limit(1)
            var nextOutfit = await Outfit.findOne({_id: {$gt: currentMember.outfitId}}).sort({_id: 1});
            if(nextOutfit != null) {
                currentMember.outfitId = nextOutfit.id;
            } else {
                currentMember.finished = true;
            }
            await Outfit.updateOne({_id : outfit._id}, {$set : outfit});
            await Member.updateOne({_id : currentMember._id}, {$set : currentMember});
            res.redirect('../');
            
        } catch (err) {
            console.log(err);
            res.redirect('../');
        }

        // if(imageTopId != null && imageBottomId != null) {
        //     console.log(req.body)
        //     const outfit = new Outfit({
        //         imageTop : imageTopId,
        //         imageBottom : imageBottomId,
        //         score : req.body.compScore
        //     })
        //     try {
        //         const newOutfit = await outfit.save()
        //         res.redirect('/')
        //     } catch (err){
        //         console.log('Outfit could not be saved!..')
        //         console.log(err)
        //     }
        // } else {
        //     res.render('/',{errorMessage : 'Alt veya üst kıyafet bulunamadı'})
        // }
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