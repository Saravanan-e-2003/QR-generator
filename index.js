import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import qr from "qr-image"
import fs from 'fs';

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/generate",(req,res)=>{
    var qr_png = qr.image("my_qr",{type:'png',size:10});
    qr_png.pipe(fs.createWriteStream(path.join(__dirname,"public","image","my_qr.png")));
    res.render(path.join(__dirname,"views","index.ejs"));
})

app.get("/",(req,res)=>{
    res.render(path.join(__dirname,"views","index.ejs"));
})

app.listen(port, ()=>{
    console.log(`running on http://localhost:${port}/`);
})