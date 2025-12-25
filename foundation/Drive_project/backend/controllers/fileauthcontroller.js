const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const path = require('path')
const db = require('../db/connection');


const db = require("../db/connection");

function uploadfile(req, res) {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const {
        originalname,
        key,        // S3 object key
        mimetype,
        size,
        location,   // S3 public URL
    } = req.file;

    const userid = req.user.id;

    db.run(
        `INSERT INTO files 
     (original_name, stored_name, mime_type, size, path, user_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
        [originalname, key, mimetype, size, location, userid],
        function (err) {
            if (err) {
                console.error("sqlite error", err.message);
                return res.status(500).send(err.message);
            }
            res.redirect("/files");
        }
    );
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
        if (err || !row) return res.status(404).send("File not found");

        // Redirect browser to S3 file
        res.redirect(row.path);
    });
}


function viewfiles(req, res) {
    const { id } = req.params;

    db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).send("File not found");

        res.redirect(row.path);
    });
}
function deletefiles(req, res) {
  const { id } = req.params;

  // 1. Get file info
  db.get(`SELECT * FROM files WHERE id = ?`, [id], async (err, row) => {
    if (err || !row) {
      return res.status(404).send("File not found");
    }

    try {
      // 2. Delete from S3
      const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: row.stored_name, // S3 object key (uploads/abc123.png)
      };

      await s3.send(new DeleteObjectCommand(deleteParams));

      // 3. Delete from DB
      db.run(`DELETE FROM files WHERE id = ?`, [id], (dbErr) => {
        if (dbErr) {
          return res.status(500).send("DB delete failed");
        }
        res.redirect("/files");
      });

    } catch (s3Err) {
      console.error("S3 delete error:", s3Err);
      res.status(500).send("Could not delete file from S3");
    }
  });
}


module.exports = { uploadfile, fetchfiles, deletefiles, downloadfiles, viewfiles };

