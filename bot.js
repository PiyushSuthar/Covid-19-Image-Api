const puppeteer = require('puppeteer')
var fs = require('fs')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const port = process.env.PORT || 8000;

// Function for capitalizing the first word of the string
function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }


app.get("/", (req,res)=>{
   const options = {
      root: __dirname,
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
   
   fetch('https://disease.sh/v2/all')
    .then(res => res.json())
    .then(json => getIt(json, "false", "", "image.png").then(res.sendFile('image.png', options, (err)=>{
      console.log(err)
   })));
})

app.get("/country/:id", (req,res)=>{
   const options = {
      root: __dirname+"/country",
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
   var country = req.params.id;
   fetch(`https://disease.sh/v2/countries/${country}`)
   .then(res => res.json())
   .then(json => getIt(json, "false", json.country, `country/${country}.png`).then(res.sendFile(`${country}.png`, options, (err)=>{
      console.log(err)
   })))
   
})

app.listen(port)



async function getIt(data, live, country, filename) {
   if (filename == "image.png") {
      return
   }else{
      fs.closeSync(fs.openSync(filename,"w"));
   }
   const worldTemplate = `<!DOCTYPE html>
   <html lang="en">
     <body>
       <style>
         body {
           margin: 0;
           height: 350px;
           width: 600px;
           background: white;
           color: #323232;
           font-family: roboto, sans-serif;
         }
         .outer {
           height: 335px;
           width: 600px;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
         }
         .inner {
           display: flex;
           flex-direction: row;
           align-items: center;
           justify-content: center;
         }
         .inner > div {
           margin: 15px;
         }
         .inner h1 {
           margin-top: 1px;
         }
         h3 {
           margin-bottom: 1px;
           font-weight: 400;
         }
         .total-cases {
           color: royalblue;
         }
         .total-deaths {
           color: red;
         }
         .total-recovered {
           color: green;
         }
       </style>
       <div class="outer">
         <div class="head">
           <h1>${country ===""?"": `${country}'s `}Covid-19 Stats</h1>
         </div>
         <div class="inner">
           <div class="total-cases">
             <h3>${live === "true"? "Today":"Total"} Cases</h3>
             <h1>${numberWithCommas(data.cases)}</h1>
           </div>
           <div class="total-deaths">
             <h3>${live === "true"? "Today":"Total"} Deaths</h3>
             <h1>${numberWithCommas(data.deaths)}</h1>
           </div>
           <div class="total-recovered">
             <h3>${live === "true"? "Today":"Total"} Recovered</h3>
             <h1>${numberWithCommas(data.recovered)}</h1>
           </div>
         </div>
         <div class="footer">
           <h3>Made with ❤ by @PiyushSthr</h3>
         </div>
       </div>
     </body>
   </html>
   `;
   
   console.log("Getting")
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 600,
        height: 350
    });
    await page.setContent(worldTemplate)
    await page.screenshot({ path: filename })
    await browser.close()
}
