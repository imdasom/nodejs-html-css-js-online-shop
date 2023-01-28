import http from 'http';
import MainController from "./controllers/MainController.js";
import { HOST_NAME, PORT } from "./constants.js";
import db from "./database/db.js";

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  try {
    MainController.handle(req, res);
  } catch(error) {
    const errorObj = JSON.parse(error.message);
    res.statusCode = errorObj.statusCode;
    res.end(error.message);
  }
});

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http://${HOST_NAME}:${PORT}/`);
});
