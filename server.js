// ./app.js
import express from "express";
import mountRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import http from "http";
import fs from "fs";
import cors from "cors";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// parse application/json
app.use(bodyParser.json());

mountRoutes(app);

const PORT = 3000;

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});

http
  .createServer(function (req, res) {
    console.log("~~~ hello", req.url);
    if (req.url?.includes("main.js")) {
      fs.readFile("main.js", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.write(data);
        return res.end();
      });
    } else if (req.url?.includes("main.css")) {
      fs.readFile("main.css", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.write(data);
        return res.end();
      });
    } else {
      fs.readFile("index.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    }
  })
  .listen(8080);
