module.exports = {
    insertFile:
        "INSERT INTO files (file_name, file_path, file_size, file_type,user_id) VALUES (?, ?, ?, ?,?)",

    getAllFiles:
        "SELECT * FROM files",

    deleteFile:
        "DELETE FROM files WHERE id = ?"
};
