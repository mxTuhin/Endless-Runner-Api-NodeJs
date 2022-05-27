const express  = require('express');
const router = express.Router();
module.exports = router;
const Model = require('../models/model');
const Score = require('../models/score');
const {json} = require("express");
const bcrypt = require('bcrypt');

// Post Methods

router.get('/', (req, res)=>{
    res.send("API System Initiated");
});

router.post('/new_user', async (req, res) => {
    const user = await Model.findOne({username: req.body.username})
    if(user!=null){
        res.status(400).json({message: "Username Exists"})
    }else{
        const salt = await bcrypt.genSalt(10);
        console.log(req.body.username);
        console.log(req.body.password);
        console.log(req.body.name);
        console.log(req.body.age);
        const s_hash = Math.random().toString(36).slice(2, 12);
        try{
            const data = new Model({
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, salt),
                name: req.body.name,
                age: req.body.age,
                score: 0,
                stacked_amount: 0,
                is_locked: false,
                avatar: "1 2",
                device_details_hash: req.body.device_details_hash,
                device_ip: req.body.device_ip,
                reason: "None",
                address: "",
                secure_hash: s_hash
            });
            try {
                var dataToSave = await data.save();
                res.status(200).json(dataToSave)
            } catch (error) {
                res.status(400).json({message: error.message})
            }
        }catch (error){
            res.status(400).json({message: error.message})
        }


    }

});

router.get('/login/:username/:password', async (req, res)=>{
    const user = await Model.findOne({username: req.params.username,});
    const s_hash = Math.random().toString(36).slice(2, 12);
    if(user!=null){
        const validPass = await bcrypt.compare(req.params.password, user.password);
        user.secure_hash = s_hash;
        try{
            var hash_user = await user.save();
        }catch (error){
            res.status(400).json({message: "Problem Hash Setup"});
        }
        if(validPass){
            res.status(200).json(hash_user);
        }else{
            res.status(400).json({message: "Invalid Password"})
        }
    }else{
        res.status(400).json({message: "User Does Not Exists"})
    }

});

router.get('/update_address/:username/:address', async (req, res)=>{
    const user = await Model.findOne({username: req.params.username});
    if(user!=null){
        user.address = req.params.address;
        try{
            var dataToSave = await user.save();
            res.status(200).json(dataToSave);
        }catch (error){
            res.status(400).json({message: "Problem Uploading Score"});
        }
    }else{
        res.status(400).json({message: "User Doesnt Exists"});
    }

});

router.get('/delete_all', async (req, res) => {
    await Model.deleteMany({id: {}})
    res.send("Deleted")
})

router.get('/delete_score', async (req, res) => {
    await Score.deleteMany({id: {}})
    res.send("Deleted")
})



router.get('/set_score/:username/:score/:hash/:ip/:avatar/:s_hash', async (req, res) => {
    const user = await Model.findOne({username: req.params.username});
    if(user!=null){
        if(user.secure_hash===req.params.s_hash){
            user.score = user.score + parseInt(req.params.score);

            const score = new Score({
                username: req.params.username,
                score: parseInt(req.params.score),
                device_details_hash: req.params.hash,
                device_ip: req.params.ip,
                avatar: req.params.avatar,
                secure_hash: req.params.s_hash
            });

            try{
                var dataToSave = await user.save();
                await score.save();
            }catch (error){
                res.status(400).json({message: "Problem Uploading Score"});
            }

            res.status(200).json(dataToSave);
        }else{
            res.status(400).json({message: "Hash Mismatch"});
        }
    }else{
        res.status(400).json({message: "User Does Not Exists"});
    }
})

router.get('/get_score', async (req, res) => {
    var sorting_oder = {score: -1};
    const leaderboard = await Model.find().sort(sorting_oder);
    try{
        res.status(200).json(leaderboard);
    }catch (error){
        res.status(400).json({message: "Problem Getting Score"});
    }

})