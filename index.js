const dbConnect = require('./config/mongo');
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", require("./routes"));
app.use(express.static("storage")) // http://localhost:3000/file.jpg

const port = process.env.PORT || 3000;

dbConnect();

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port);
})