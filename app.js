const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
require('dotenv').config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

require("./app/routes/user.routes")(app);

module.exports=app;