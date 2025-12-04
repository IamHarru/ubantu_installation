const express = require('express');
const app = express();
const path = require('path')
const usermodel = require('./models/user');

app.use(express.json()); /// here i can get the form data 
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))  // / here app get all the static file 
app.set('view engine', 'ejs') /// front end file 

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/create', async (req, res) => {
    let { name, image, gmail, gender } = req.body
    let usercreated = await usermodel.create({
        name, gender, gmail, image
    })
    // res.send(usercreated)
    res.redirect('/read')

})
app.get('/read', async (req, res) => {
    let users = await usermodel.find();
    res.render('read', { users })
})
app.get('/edit/:userid', async (req, res) => {
    let user = await usermodel.findOne({ _id: req.params.userid });
    res.render('edit1', { user })
})
app.post('/update/:userid', async (req, res) => {
    let { name, gender, gmail, image } = req.body
    let edituser = await usermodel.findOneAndUpdate({ _id: req.params.userid }, { name, gmail, gender, image, }, { new: true })
    res.redirect('/read')
})
app.get('/delete/:_id', async (req, res) => {
    let { _id } = req.params
    let deleteuser = await usermodel.findOneAndDelete({ _id })
    res.redirect('/read')
})
app.listen(5000, (err) => {
    if (err) {
        console.log(err.message, "\n err hai bhai")
    }
    else {
        console.log("it's running")
    }
})