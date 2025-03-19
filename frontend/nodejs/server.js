//Import the http module
const http = require("http");

//Create a server
const server = http.createServer((req, resp) => {

    resp.setStatus = 200;
    resp.setHeader('Content-Type', 'text/plain');
    resp.end("Hello NodeJs from Server!!!");
});

server.listen(8000, () => console.log("My WebServer is running on: http://localhost:8000"));

