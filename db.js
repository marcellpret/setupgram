const spicePg = require("spiced-pg");
const db = spicePg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 3`);
};

module.exports.addImage = (username, url, title, description, tags) => {
    return db.query(
        `INSERT INTO images (username, url, title, description,tags)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [username, url, title, description, tags]
    );
};

module.exports.getImage = (imageId) => {
    return db.query(
        `SELECT *, 
        (SELECT id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1) as "previousImg",
        (SELECT id FROM images
        WHERE id > $1
        ORDER BY id ASC
        LIMIT 1) as "nextImg"
        FROM images 
        WHERE id=$1`,
        [imageId]
    );
};

module.exports.addComment = (username, comment, imageId) => {
    return db.query(
        `INSERT INTO comments (username, comment, imageId)
        VALUES ($1,$2,$3)
        RETURNING username, comment
    `,
        [username, comment, imageId]
    );
};

module.exports.getComments = (imageId) => {
    return db.query(
        `SELECT * FROM comments 
        WHERE imageId=$1`,
        [imageId]
    );
};

module.exports.getMoreImages = (lowestId) => {
    return db.query(
        `SELECT *,(
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1) 
        AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [lowestId]
    );
};

module.exports.getAllTags = () => {
    return db.query(`SELECT tags FROM images`);
};

module.exports.getImagesByTag = (tag) => {
    return db.query(
        `SELECT * 
        FROM images 
        WHERE $1 = ANY(tags)
        ORDER BY id DESC
        LIMIT 3`,
        [tag]
    );
};
