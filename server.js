const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./multer");
const { uploadS3 } = require("./s3");

app.use(express.static("./public"));
app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages().then(({ rows }) => {
        res.json({ rows });
    });
});

app.post("/upload", uploader.single("file"), uploadS3, (req, res) => {
    const { username, title, description } = req.body;
    const url = `https://s3.amazonaws.com/example-imageboard/${req.file.filename}`;
    if (req.file) {
        db.addImage(username, url, title, description).then(({ rows }) => {
            res.json({ rows });
        });
    } else {
        res.json({ success: false });
    }
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
