const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log(err))


const path = require('path')
const usermodel = require('./model/user')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})


app.post('/create', async (req, res) => {
    let { email, image, name } = req.body
    let users = await usermodel.findOne({ email })
    try {
        if (!users) {

            const user = await usermodel.create({
                name,
                email,
                image
            })

            res.redirect('/')
        }
    }
    catch (error) {

        return res.send('user already exist')

    }



})
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, './public/list.html'));
});
app.get('/api/users', async (req, res) => {
    const users = await usermodel.find();
    res.json(users);
});


app.get('/edit/:_id', (req, res) => {
    res.sendFile(path.join(__dirname, './public/edit.html'));
});

app.get('/api/user/:_id', async (req, res) => {
    let { _id } = req.params;
    const user = await usermodel.findById(_id);
    res.json(user);
});
app.get('/delete/:_id', async (req, res) => {
    let { _id } = req.params
    const user = await usermodel.findOneAndDelete({ _id })
    res.redirect('/users')
})
app.listen(3000)
