const sqlite3 = require('sqlite3').verbose();

const openDBPromise = new Promise(
    (resolve,reject) =>{
        const db = new sqlite3.Database('database.sqlite', (err) => {
            if (err) {
                console.error(err.message);
                reject(err.message);
            }
            console.log('Connected to the database.');
            resolve(db);
        });
    });

let db;

try {
    openDBPromise.then((res)=>{
        db = res;

        db.run(`CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE
            )`, (err) => {
                        if (err) {
                            console.error(err.message);
                        }
            console.log('Table created.');
        });
    }).catch((err)=>{
        console.log(err);
    })
} catch (err) {
    // SQLITE_CANTOPEN can handle here!
    console.log("SQLITE OPEN ERROR");
    console.log(err);
    return [];
}




const createUser = (first_name,last_name, email) => {
    db.run(`INSERT INTO users (first_name,last_name, email) VALUES (?,? , ?)`, [first_name,last_name, email], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Data inserted.');
    });
}

const getUser = (inputEmail) => {
    return new Promise((resolve,reject)=>{
        db.all(`SELECT email FROM users WHERE  email = ?`,[inputEmail],(err,data)=>{
            if(err){
                reject(err);
            }
            resolve(data)
        });
    });
}

const getUsers = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

const updateUser = (id, first_name,last_name) => {
    db.run(`UPDATE users SET first_name = ?, last_name= ? WHERE id = ?`, [first_name,last_name, id], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Data updated.');
    });
}

const deleteUser = (id) => {
    db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Data deleted.');
    });
}


const closeDB = ()=>{
    db.close((err) => { console.error(err); });
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    closeDB,
    getUser
}

