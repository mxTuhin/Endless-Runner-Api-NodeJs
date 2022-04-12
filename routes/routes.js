const express  = require('express');
const router = express.Router();
module.exports = router;
const Model = require('../models/model');
const Score = require('../models/score');
const {json} = require("express");
const bcrypt = require('bcrypt');

// Post Methods

router.post('/new_user', async (req, res) => {
    const user = await Model.findOne({username: req.query.username})
    if(user!=null){
        res.status(400).json({message: "Username Exists"})
    }else{
        const salt = await bcrypt.genSalt(10);
        const data = new Model({
            username: req.query.username,
            password: await bcrypt.hash(req.query.password, salt),
            name: req.query.name,
            age: req.query.age,
            score: 0,
            stacked_amount: 0,
            is_locked: false,
            avatar: "1 2",
            device_details_hash: req.query.device_details_hash,
            device_ip: req.ip,
            reason: "None"
        });
        try {
            var dataToSave = await data.save();
            res.status(200).json(dataToSave)
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }

});

router.get('/login/:username/:password', async (req, res)=>{
    const user = await Model.findOne({username: req.params.username, password: req.params.password});
    if(user!=null){
        res.status(200).json(user);
    }else{
        res.status(400).json({message: "Something Went Wrong"})
    }

});

router.get('/delete_all', async (req, res) => {
    await Model.deleteMany({id: {}})
    res.send("Deleted")
})

router.post('/set_score/', async (req, res) => {
    const user = await Model.findOne({username: req.query.username});
    if(user!=null){
        user.score = user.score + parseInt(req.query.score);

        const score = new Score({
            username: req.query.username,
            score: parseInt(req.query.score),
            device_details_hash: req.query.device_details_hash,
            device_ip: req.query.device_ip,
            avatar: req.query.avatar
        });

        try{
            var dataToSave = await user.save();
            await score.save();
        }catch (error){
            res.status(400).json({message: "Problem Uploading Score"});
        }

        res.status(200).json(dataToSave);
    }else{
        res.status(400).json({message: "Something Went Wrong"});
    }
})