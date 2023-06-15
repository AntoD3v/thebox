const storage = require("../storage/database.js")

const get_leaderboard = (callback) => {

    storage.get_users((users) => {

        users = users.map(user => {
            let temp = [user.box_1, user.box_2, user.box_3, user.box_4];
            return {
                username: user.username,
                boxes: temp,
                open: temp.filter(e => e !== null).length,
                total: temp[temp.length - 1]
            }
        })

        users.sort((a, b) => {

            if(a.open !== b.open) return a.open > b.open ? -1 : 1;

            if(a.total === 0) return 1;
            if(b.total === 0) return -1;

            return a.total > b.total ? 1 : (a.total < b.total ? -1 : 0)

        })

        if(users.length > 0) {

            let position = 1;
            users[0].position = 1;
            for(var i=1; i < users.length; i++) {

                if(users[i].total !== users[i - 1].total || users[i].open !== users[i].open) {
                    position++;
                }
                users[i].position = position;

            }
            
        }

        callback(users);

    })

}

module.exports = {get_leaderboard}