const express  = require('express');
const router = express.Router();
module.exports = router;
const Model = require('../models/model');

// Post Methods

router.post('/new_user', async (req, res) => {
    const {uName, pass, Name, Age} =req.query;
    const data = new Model({
        username: req.query.username,
        password: req.query.password,
        name: req.query.name,
        age: req.query.age
    });
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/delete_all', async (req, res) => {
    await Model.deleteMany({id: {}})
    res.send("Deleted")
})

router.get('/get_score/:user_id', (req, res)=>{

})