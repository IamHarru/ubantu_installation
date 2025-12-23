const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cookie = require('cookie-parser')
const path = require('path')
const upload = require('./multer/multer-config.js')
const { islogin } = require('./middleware/user-login.js')
const { duser, userlogin, logoutuser, deleteuser, fetchuser, createuser } = require('./controllers/userauthcontroller.js')
const { uploadfile, fetchfiles, deletefiles, downloadfiles, viewfiles } = require('./controllers/fileauthcontroller.js');

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookie());
app.use(express.static(path.join(__dirname, 'frontend')))
app.use('/upload', express.static('upload'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/html/index.html"))
})
app.post('/create', createuser);
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html/users.html'))

})
app.post('/login', userlogin)
app.get('/logout', logoutuser)
app.get('/api/users', fetchuser)
app.get('/api/usern', islogin, duser)
app.get('/delete/:id', deleteuser)

app.get('/files', islogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html/home.html'))
})
app.post('/uploadfiles', islogin, upload.single('ufiles'), uploadfile)

app.get('/api/files', islogin, fetchfiles)
app.get('/deletefiles/:id', islogin, deletefiles)
app.get('/download/:id', islogin, downloadfiles);

app.get('/view/:id', viewfiles)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
