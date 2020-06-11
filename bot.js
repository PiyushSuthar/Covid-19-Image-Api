const puppeteer = require('puppeteer')
var fs = require('fs')
const fetch = require('node-fetch')
const express = require('express')
const { json } = require('express')
const app = express()
const port = process.env.PORT || 8000;

// Function for capitalizing the first word of the string
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


app.get("/", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  fetch('https://disease.sh/v2/all')
    .then(res => res.json())
    .catch(err => console.log(err))
    .then(json => { res.setHeader("Content-Type", "image/png"); getIt(json, "false", "", "image.png").catch(err => console.log(err)).then(data => { res.send(data), console.log("Done") }) })
  //   .then(json => getIt(json, "false", "", "image.png").then(res.sendFile('image.png', options, (err)=>{
  //     console.log(err)
  //  })));
})

app.get("/country/:id", (req, res) => {
  const options = {
    root: __dirname,
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var country = req.params.id;
  fetch(`https://disease.sh/v2/countries/${country}`)
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(data => { res.setHeader("Content-Type", "image/png"); getIt(data, "false", data.country, country).catch(err => console.log(err)).then(data => { res.send(data), console.log("Done") }) })
  //  .then(json =>  getIt(json, "false", json.country, country).then(res.sendFile(`${country}.png`, options, (err)=>{
  //     console.log(err)
  //  })))

})

app.listen(port)



async function getIt(data, live, country, filename) {

  try {

    const worldTemplate = `<!DOCTYPE html>
   <html lang="en">
     <body>
       <style>
         body {
           margin: 0;
           height: 700px;
           width: 1200px;
           background: white;
           color: #323232;
           font-family: roboto, sans-serif;
         }
         .outer {
           height: 700px;
           width: 1200px;
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
           <h1>${country === "" ? "" : `${country}'s `}Covid-19 Stats</h1>
         </div>
         <div class="inner">
           <div class="total-cases">
             <h3>${live === "true" ? "Today" : "Total"} Cases</h3>
             <h1>${numberWithCommas(data.cases)}</h1>
           </div>
           <div class="total-deaths">
             <h3>${live === "true" ? "Today" : "Total"} Deaths</h3>
             <h1>${numberWithCommas(data.deaths)}</h1>
           </div>
           <div class="total-recovered">
             <h3>${live === "true" ? "Today" : "Total"} Recovered</h3>
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
      width: 1200,
      height: 700
    });
    await page.setContent(worldTemplate)
    var _page = await page.screenshot({ type: "png" })
    await browser.close()
    return _page

  } catch (error) {
    console.log(error);
    return "{Error on our side}"
  }

}
