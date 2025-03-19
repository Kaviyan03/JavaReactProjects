const http = require("http");
const mysql = require("mysql2");

const host = "localhost";
const port = 8000;


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Revathi1978",
    database: "mobilestoredb"
});


const server = http.createServer((req, resp) => {
    con.query("SELECT * FROM mobile_tbl", (err, result) => {
        if (err) {
            resp.writeHead(500, { "Content-Type": "text/plain" });
            return resp.end("Database error!");
        }

        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.end(JSON.stringify(result)); // Send data as JSON
    });
});


server.listen(port, () => console.log(`Server running at http://${host}:${port}`));
