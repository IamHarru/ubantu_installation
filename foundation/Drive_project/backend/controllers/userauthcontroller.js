const path = require('path')
const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createuser(req, res) {
    let { name, email, password } = req.body
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        else {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Server error");
                }
                else {
                    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Database error");


                        }
                        if (row) {
                            return res.send('User already exists with this email');
                        }

                        db.run(
                            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                            [name, email, hash],
                            (err) => {
                                if (err) console.log(err);
                                else console.log("User added!");
                                let token = jwt.sign({ email , name ,id: row.id }, process.env.JWT_token)
                                res.cookie('token', token)
                                res.redirect('/files')
                            }
                        );


                    })
                }
            })

        };
    })
}

function userlogin(req, res) {
    let {email, password } = req.body
    db.get(`SELECT  * FROM users WHERE email =?`, [email], (err, row) => {
        if (err) {
            return res.status(500).send("database error");
        }
        if (!row) {
            return res.send('somthing went wrong with the username')
        }
        const name = row.name
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).send("password compare error");
            }
            if (!result) {
                return res.status(400).send('somthing went wrong with the password')
            }

            const token = jwt.sign({ email, name:name, id: row.id }, process.env.JWT_token)
            return res
                .cookie('token', token)
                .redirect('/files')

        })

    })
}
function logoutuser(req, res) {
    res.clearCookie('token')
    res.redirect('/')
}

function deleteuser(req, res) {
    const { id } = req.params;
    db.run(
        `DELETE FROM users WHERE id = ? `,
        [id],
        (err) => {
            if (err) {
                res.send(err.message)
            }
            else {
                res.redirect('/users')
            }
        })
};

function fetchuser(req, res) {
    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            res.status(500).send("Error retrieving users");
        }
        else {
            res.json(rows);
        }
    });

};

function duser(req, res) {

    res.json({
        name: req.user.name,
        email: req.user.email
    })

}
module.exports = { duser, userlogin, logoutuser, fetchuser, deleteuser, createuser };
