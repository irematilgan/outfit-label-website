const express = require('express');
const router = express.Router();
const Outfit = require('../models/outfit');
const ImageObj = require('../models/image');
const Member = require('../models/member');

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('./login');
}

// All outfits route
router.get('/', isLoggedIn, async (req,res) => {

    params = {};
    let outfitArr = [];
    const userId = req.session.context;

    try {
        const member = await Member.findOne({_id : userId}).exec();
        if(typeof member.givenScores !== 'undefined') {
            arrLen = member.givenScores.length;
        } else {
            arrLen = 0;
        }
        console.log(arrLen);
        for(i = 0; i < arrLen; i++) {
            let outfit = await Outfit.find({_id : member.givenScores[i].outfitId}).exec();

            outfitDict = {
                compScore : member.givenScores[i].score,
                id : member.givenScores[i].outfitId,
            };
            outfitDict.images = [];
            for(var j = 0; j < outfit[0].images.length; j++) {
                var img = await ImageObj.findById(outfit[0].images[j]);
                outfitDict.images.push(img.clothingImagePath);
            }
            
            outfitArr.push(outfitDict)
        }
        //onsole.log(outfitArr[0]);
        res.render('./outfits/index',{outfits : outfitArr,errorMessage : null, isLoggedIn : true});
        
        
        
        
    } catch (error) {
        console.log(error)
        res.render('./outfits/index', {errorMessage : 'Kombinler cagrilamadi'})
    }
})


// Page to add outfit with more than one clothes
router.get('/new', async(req,res) => {
    
});

// Add outfit to the database
router.post('/', async(req,res) => {
    console.log(req.body);
    const newScore = req.body.newScore;
    const memberId = req.session.context;
    const outfitId = req.body.outfitId;
    // members -> givenScores -> score
    // outfits -> givenMembers -> score
    try {
        const currentOutfit = await Outfit.findById(outfitId);
        var i = 0;
        while(i < currentOutfit.givenMembers.length && currentOutfit.givenMembers[i].memberId != memberId) {
            i++;
        }
        if(i < currentOutfit.givenMembers.length) {
            currentOutfit.givenMembers[i].score = newScore;
            await Outfit.updateOne({_id : outfitId},{$set : currentOutfit});
        }
        
        const currentMember = await Member.findById(memberId);
        var i = 0;
        while(i < currentMember.givenScores.length && currentMember.givenScores[i].outfitId != outfitId) {
            i++;
        }
        if(i < currentMember.givenScores.length) {
            currentMember.givenScores[i].score = newScore;
            await Member.updateOne({_id : memberId},{$set : currentMember});
        }
        console.log(currentOutfit);
        console.log(currentMember);
        res.redirect('../outfits/');

    } catch(err) {
        console.log(err);
    }



});

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
