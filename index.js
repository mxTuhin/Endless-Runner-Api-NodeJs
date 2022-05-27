require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const home = require('./routes/home');
const cors = require("cors");
const http = require("http");
const https = require("https");



const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error)=>{
    console.log(error);
})

database.on('connected', ()=>{
    console.log("Database Connected");
})



const app = express();
app.use(
    express.urlencoded({ extended: true })
);

app.get('', (req, res)=>{
    res.send("App Started Successfully");
});

app.use(cors());
app.use(express.json());
app.use('/api', routes);
// app.use('/', home);




app.listen(3000, ()=>{
    console.log('Server Started at ${3000}')
});


// http.createServer(app).listen(80);
// https.createServer(app).listen(443);
