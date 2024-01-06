const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./multer");
const { uploadS3 } = require("./s3");
const basicAuth = require("basic-auth");

app.use(express.static("./public"));
app.use(express.json());

const auth = function (req, res, next) {
    const creds = basicAuth(req);
    if (!creds || creds.name != "marcellpret" || creds.pass != "1234") {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials to see this stuff."'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};

app.use(auth);

app.get("/images", (req, res) => {
    db.getImages().then(({ rows }) => {
        res.json({ rows });
    });
});

app.get("/tags", (req, res) => {
    db.getAllTags().then(({ rows }) => {
        console.log("rows: ", rows);

        let allTags = rows.flatMap((item) => item.tags);

        res.json([...new Set(allTags)]);
    });
});

app.post("/upload", uploader.single("file"), uploadS3, (req, res) => {
    console.log(req.body);
    const { username, title, description } = req.body;

    const tags = req.body.tags.split(",").map((word) => word.trim());

    console.log(tags);

    const url = `https://s3.amazonaws.com/example-imageboard/${req.file.filename}`;
    if (req.file) {
        db.addImage(username, url, title, description, tags)
            .then(({ rows }) => {
                res.json({ rows });
            })
            .catch((err) => console.log("err: ", err));
    } else {
        res.json({ success: false });
    }
});

app.get("/images/:imageId", (req, res) => {
    db.getImage(req.params.imageId)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ rows });
        })
        .catch((err) => console.log("err: ", err));
});

app.get("/filter-by-tag/:tag", (req, res) => {
    db.getImagesByTag(req.params.tag)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ rows });
        })
        .catch((err) => console.log("err: ", err));
});

app.get("/comments/:imageId", (req, res) => {
    db.getComments(req.params.imageId).then(({ rows }) => {
        res.json({ rows });
    });
});

app.get("/more-images/:lowestId", (req, res) => {
    db.getMoreImages(req.params.lowestId).then(({ rows }) => {
        console.log("rows with Lowest ID: ", rows);
        res.json({ rows });
    });
});

app.post("/upload/comment", (req, res) => {
    console.log("req.body in upload comment: ", req.body);

    const { username, comment, imageId } = req.body;
    db.addComment(username, comment, imageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => console.log("err: ", err));
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
