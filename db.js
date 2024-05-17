 import mysql from 'mysql';
const conn  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tovoznow",
    charset: 'utf8mb4'
});

conn.connect(function (err) {
    if (err) throw err;
    console.log('database connected successfully');

})

// Export Sequelize instance
export { conn };