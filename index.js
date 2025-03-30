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
    const qr_png = qr.imageSync("my_qr", { type: "png" }); 
    const qr_base64 = `data:image/png;base64,${qr_png.toString("base64")}`; 

    res.render("index", { qrImage: qr_base64 });
})

app.get("/",(req,res)=>{
    res.render("index", { qrImage: null }); 
})

app.get("/download",(req,res)=>{
    const qrPath = path.join(__dirname, "public", "image", "my_qr.png");

    fs.access(qrPath,fs.constants.F_OK, (err)=>{
        if (err) {
            console.error("Download Error: File not found");
            return res.render("index", { error: "QR Code not found. Please generate first." });
        }
        res.download(qrPath,"my_qr.png",(err)=>{
            if(err){
                console.log(err);
                res.render("index");
            }
        })
    })

    
})

app.listen(port, ()=>{
    console.log(`running on http://localhost:${port}/`);
})