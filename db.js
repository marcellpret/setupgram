const spicePg = require("spiced-pg");
const db = spicePg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.addImage = (username, url, title, description) => {
    return db.query(
        `INSERT INTO images (username, url, title, description)
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `,
        [username, url, title, description]
    );
};
