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

    db.all("SELECT username, contact, box_1, box_2, box_3, box_4 FROM challengers", (err, res) => {

        if(err == null) {

            callback(res)

        }else {

            callback([])

        }

    })

}




module.exports = {user_available, add, get_user, get_users, update_user_box};