const {Database} = require('sqlite3');

const db = new Database('db.sqlite');

console.log("init storage...")

db.exec(`
    CREATE TABLE IF NOT EXISTS challengers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(100),
        contact VARCHAR(100),
        box_1 TIME,
        box_2 TIME,
        box_3 TIME,
        box_4 TIME
    )`);

const user_available = (username, callback) => {

    db
        .prepare("SELECT username FROM challengers WHERE username = ?")
        .get([username], (err, res) => callback(err !== null || res === undefined));

}

const add = (username, contact, callback) => {

    db
        .prepare("INSERT INTO challengers(username, contact) VALUES (?, ?)")
        .run([username, contact], (err) => callback(err));


}

const update_user_box = (username, box, time) => {

    db
        .prepare("UPDATE challengers SET box_" + box + "=? WHERE username = ?")
        .run([time, username]);

}

const get_user = (username) => {

    db
        .prepare("UPDATE challengers(username, box_" + box + ") SET (?)")
        .run([time]);

}

const get_users = (callback) => {

    db.all("SELECT\n" +
        "        coalesce(box_1, 0) + coalesce(box_2, 0) + coalesce(box_3, 0) + coalesce(box_4, 0) as total,\n" +
        "        CASE WHEN box_1 IS NOT NULL THEN 1 ELSE 0 END +\n" +
        "        CASE WHEN box_2 IS NOT NULL THEN 1 ELSE 0 END +\n" +
        "        CASE WHEN box_3 IS NOT NULL THEN 1 ELSE 0 END +\n" +
        "        CASE WHEN box_4 IS NOT NULL THEN 1 ELSE 0 END AS open,\n" +
        "        *\n" +
        "FROM challengers\n" +
        "WHERE open > 0\n" +
        "ORDER BY open DESC, total ASC", (err, res) => {

        if(err == null) {

            callback(res)

        }else {

            callback([])

        }

    })

}




module.exports = {user_available, add, get_user, get_users, update_user_box};