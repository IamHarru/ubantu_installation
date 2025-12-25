const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const path = require("path");
const upload = require("./multer/multer-config.js");
const { islogin } = require("./middleware/user-login.js");

const {
    duser,
    userlogin,
    logoutuser,
    deleteuser,
    fetchuser,
    createuser,
} = require("./controllers/userauthcontroller.js");

const {
    uploadfile,
    fetchfiles,
    deletefiles,
    downloadfiles,
    viewfiles,
} = require("./controllers/fileauthcontroller.js");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const FRONTEND_PATH = path.join(__dirname, "..", "frontend");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.static(FRONTEND_PATH));

app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "html", "index.html"));
});

app.post("/create", createuser);
app.post("/login", userlogin);
app.get("/logout", logoutuser);

app.get("/users", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "html", "users.html"));
});

app.get("/files", islogin, (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "html", "home.html"));
});

app.get("/api/users", fetchuser);
app.get("/api/usern", islogin, duser);

app.post("/uploadfiles", islogin, upload.single("ufiles"), uploadfile);

app.get("/api/files", islogin, fetchfiles);
app.get("/deletefiles/:id", islogin, deletefiles);
app.get("/download/:id", islogin, downloadfiles);
app.get("/view/:id", viewfiles);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
