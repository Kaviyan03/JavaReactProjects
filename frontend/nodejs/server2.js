const http = require("http");
const fs = require("fs");

const server = http.createServer((req, resp) => {

    // const data = `<!DOCTYPE html> 
    // <html>
    //     <head>
    //         <title>Home</title>
    //     </head>
    //     <body>
    //         <h3>Home Page</h3>
    //         <p>This is a Sample para</p>
    //     </body>
    // </html>`;

    const data = {

        id: 10,
        name: "Raj Kumar",
        mobile: "0923738583"

    }

    // resp.writeHead("Content-Type", "text/html");
    resp.writeHead(200,{"Content-Type": "application/json"});
    resp.write(JSON.stringify(data));
    resp.end();
})

server.listen(8000, () => console.log("Server is running on: http://localhost:8000"));