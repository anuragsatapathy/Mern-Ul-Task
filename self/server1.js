//Server without Express 
import http from "http";

const server = http.createServer((req, res) =>{
    if(req.url === "/"){
        res.writeHead(200,{"content-type" : "text/plain"});
        res.end("Hello from node server");
    }
});

server.listen(3000,() =>{
    console.log("server running on port 30000");
});

//Server with Express
import express from "express";
const app = express();
const PORT=3000;

app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`);
});