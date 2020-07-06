const puppeteer = require('puppeteer')

// A Small utility func() to format numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  module.exports = async function (data, live, country, template) {

    try {
  
      //Main Template (HTML/CSS/JAVACSRIPT)
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
              background: url("https://cdn.statically.io/gh/PiyushSuthar/Covid-19-Image-Api/36950d90/public/corona.png");
              background-repeat: no-repeat;
              background-size: auto;
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
              font-size: 50px;
            }
            h3 {
              margin-bottom: 1px;
              font-weight: 400;
              font-size: 30px;
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
            .head h1 {
              font-size: 60px;
            }
          </style>
          <div class="outer">
            <div class="head">
              <h1>${country === "" ? "" : `${country}'s `}Covid-19 Stats</h1>
            </div>
            <div class="inner">
              <div class="total-cases">
                <h3>${live === "true" ? "Today" : "Total"} Cases</h3>
                <h1>${live === "true" ? numberWithCommas(data.todayCases) : numberWithCommas(data.cases)}</h1>
              </div>
              <div class="total-deaths">
                <h3>${live === "true" ? "Today" : "Total"} Deaths</h3>
                <h1>${live === "true" ? numberWithCommas(data.todayDeaths) : numberWithCommas(data.deaths)}</h1>
              </div>
              <div class="total-recovered">
                <h3>${live === "true" ? "Today" : "Total"} Recovered</h3>
                <h1>${live === "true" ? numberWithCommas(data.todayRecovered) : numberWithCommas(data.recovered)}</h1>
              </div>
            </div>
            <div class="footer">
              <h3>Made with <span style="color:red;">❤</span> by @PiyushSthr</h3>
            </div>
          </div>
        </body>
      </html>
      
     `;
  
     const worldTemplateBackUp = `<!DOCTYPE html>
  <html lang="en">
    <body>
      <style>
        body {
          margin: 0;
          height: 566px;
          width: 1080px;
          background: white;
          color: #323232;
          font-family: roboto, sans-serif;
          background: url("https://cdn.statically.io/gh/PiyushSuthar/Covid-19-Image-Api/36950d90/public/corona.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        .outer {
          height: 566px;
          width: 1080px;
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
          font-size: 50px;
        }
        h3 {
          margin-bottom: 1px;
          font-weight: 400;
          font-size: 30px;
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
        .head h1 {
          font-size: 60px;
        }
      </style>
      <div class="outer">
        <div class="head">
          <h1>${country === "" ? "" : `${country}'s `}Covid-19 Stats</h1>
        </div>
        <div class="inner">
          <div class="total-cases">
            <h3>${live === "true" ? "Today" : "Total"} Cases</h3>
            <h1>
              ${live === "true" ? numberWithCommas(data.todayCases) :
              numberWithCommas(data.cases)}
            </h1>
          </div>
          <div class="total-deaths">
            <h3>${live === "true" ? "Today" : "Total"} Deaths</h3>
            <h1>
              ${live === "true" ? numberWithCommas(data.todayDeaths) :
              numberWithCommas(data.deaths)}
            </h1>
          </div>
          <div class="total-recovered">
            <h3>${live === "true" ? "Today" : "Total"} Recovered</h3>
            <h1>
              ${live === "true" ? numberWithCommas(data.todayRecovered) :
              numberWithCommas(data.recovered)}
            </h1>
          </div>
        </div>
        <div class="footer">
          <h3>Made with <span style="color:red;">❤</span> by @PiyushSthr</h3>
        </div>
      </div>
    </body>
  </html>
  `
  const igTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
    <style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: black;
    }
    .outer {
      height: 800px;
      width: 800px;
      background-image: url("https://cdn.statically.io/gh/PiyushSuthar/Covid-19-Image-Api/36950d90/public/2-COVID-19.png");
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: "Poppins", sans-serif;
    }
    .inner {
      margin-top: 120px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }
    .totalCases {
      max-width: 45%;
      width: 40%;
      margin: 40px;
    }
    .totalCases h1 {
      font-size: 50px;
      margin-top: 2px;
      font-weight: 500;
    }
    .totalCases h2 {
      font-size: 25px;
      margin-bottom: 2px;
      font-weight: 400;
    }
    .cases {
      background-color: rgb(252, 252, 224);
    }
    .active {
      background-color: rgb(236, 241, 255);
    }
    .deaths {
      background-color: rgb(255, 236, 236);
    }
    .recovered {
      background-color: rgb(215, 252, 208);
    }
    .cases,
    .active,
    .recovered,
    .deaths {
      border-radius: 15px;
      padding: 20px;
    }
  </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">
        <div class="totalCases cases">
          <h2>${live === "true" ? "Today" : "Total"} Cases</h2>
          <h1>${live === "true" ? numberWithCommas(data.todayCases) :
          numberWithCommas(data.cases)}</h1>
        </div>
        <div class="totalCases deaths">
          <h2>${live === "true" ? "Today" : "Total"} Deaths</h2>
          <h1>${live === "true" ? numberWithCommas(data.todayDeaths) :
          numberWithCommas(data.deaths)}</h1>
        </div>
        <div class="totalCases recovered">
          <h2>${live === "true" ? "Today" : "Total"} Recovered</h2>
          <h1> ${live === "true" ? numberWithCommas(data.todayRecovered) :
          numberWithCommas(data.recovered)}</h1>
        </div>
        <div class="totalCases active">
          <h2>Total Active</h2>
          <h1> ${numberWithCommas(data.active)}</h1>
        </div>
      </div>
    </div>
  </body>
</html>
`

      console.log("Getting")
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      })
      const page = await browser.newPage()
      await page.setViewport({
        width: template? 800 : 1200,
        height: template? 800 : 700
      });
      await page.setContent(template? igTemplate :worldTemplate)//Template Name
      var _page = await page.screenshot({ type: "png" })
      await browser.close()
      return _page
  
    } catch (error) {
      console.log(error);
      return "{Error on our side}"
    }
  
  }
  
  //That's it ;)