const path = require('path')
const db = require('../db/connection');


function uploadfile(req, res) {

    if (!req.file) {

        return res.status(400).send("No file uploaded");

    }

    else {

        const {
            originalname, filename, mimetype, size, fpath
        } = req.file;

        const userid = req.user.id
        db.run(`INSERT INTO files (original_name, stored_name , mime_type ,size ,  path ,user_id) VALUES(?,?,?,?,?,?)`, [originalname, filename, mimetype, size, fpath, userid],
            function (err) {
                if (err) {
                    console.error("sqllite error", err.message)
                    return res.status(500).send(err.message);
                }
              
                res.redirect('/files');
            })
    }

}
function fetchfiles(req, res) {
    const id = req.user.id
    db.all(`SELECT * FROM files WHERE user_id =? `, [id], (err, rows) => {
        if (err) {
            res.status(500).send("Error retrieving users");
        }
        else {
            res.json(rows);
        }
    })
}

function downloadfiles(req, res) {
    const { id } = req.params;
    db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error("sqlite error", err.message);
            return res.status(500).send("Server error");
        }
        if (!row) return res.status(404).send("File not found");

        const fileOnDisk = row.path && row.path.length ? row.path : path.join(__dirname, '../upload', row.stored_name);

        res.download(fileOnDisk, row.original_name, (downloadErr) => {
            if (downloadErr) {
                console.error("Download error:", downloadErr);
                if (!res.headersSent) res.status(500).send("Could not download file");
            }
        });
    });
}
function deletefiles(req, res) {
    const { id } = req.params
    db.run(`DELETE FROM files WHERE id =? `, [id], (err) => {
        if (err) {
            res.send(err.message)
        }
        else {
            res.redirect('/files')
        }
    })
}

function viewfiles(req, res) {
    const { id } = req.params;
    db.get(`SELECT * FROM files WHERE  id = ?`, [id], (err, row) => {
        const fileondisk = row.path && row.path.length ? path.resolve(row.path) : path.join(__dirname, '../upload', row.stored_name);
        console.log('File path:', fileondisk);

        res.sendFile(fileondisk)
    })
}
module.exports = { uploadfile, fetchfiles, deletefiles, downloadfiles, viewfiles };

