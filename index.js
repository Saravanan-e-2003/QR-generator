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

app.post("/generate", (req, res) => {
    try {
        const inputText = req.body.url || "Default QR";
        console.log("Generating QR for:", inputText);  // Debugging log

        const qrBuffer = qr.imageSync(inputText, { type: "png" });
        const qrBase64 = `data:image/png;base64,${qrBuffer.toString("base64")}`;

        console.log("QR generated successfully!");  // Debugging log
        res.render("index", { qrImage: qrBase64 });
    } catch (error) {
        console.error("Error generating QR:", error);
        res.render("index", { qrImage: null });
    }
});

app.get("/", (req, res) => {
    res.render("index", { qrImage: null });
});

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