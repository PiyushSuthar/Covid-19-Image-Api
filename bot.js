//Requiring Modules
var fs = require('fs')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const getIt = require("./mainFunct")
const ForinstaGram = require("./forInstagram")

//Port
const port = process.env.PORT || 8000;

app.use(function(req,res,next) {
//   res.set('Cache-control', `no-store, no-cache, max-age=0`)
  res.setHeader("Cache-Control", `public, max-age=3600`);
  next()
})

app.use("/ig",ForinstaGram)


//Getting Complete Data WorldWide
app.get("/", (req, res) => {
  //Fetch Api
  fetch('https://disease.sh/v2/all')
    .then(res => res.json())
    .catch(err => console.log(err))
    .then(json => {
      res.setHeader("Content-Type", "image/png");
      getIt(json, "false", "")
        .catch(err => {
          res.sendStatus(404);
          res.send(err);
          console.log(err)
        })
        .then(data => {
          res.send(data);
          console.log("Done")
        }) 
    })
})

//Getting Latest Data Worldwide
app.get("/latest", (req, res) => {
  fetch('https://disease.sh/v2/all')
    .catch(err =>{
      res.send("Error Occured")
      console.log(err)
    })
    .then(response =>{
      if (response.ok) {
        return response.json()
      } else {
        return res.json("error: Something is wrong.")
      }
    })
    .then(data => {
      res.setHeader("Content-Type", "image/png");
      getIt(data, "true", "")
        .catch(err =>{
          res.sendStatus(404);
          res.send(err);
          console.log(err)
        })
        .then(data => {
          res.send(data);
          console.log("Done")
        }) 
    })
})

//Getting complete data for a specific country
app.get("/country/:id", (req, res) => {
  var country = req.params.id;
  fetch(`https://disease.sh/v2/countries/${country}`)
    .catch(err => {
      res.send("Error Occured")
      console.log(err)
    })
    .then(response => {
      if(!response.ok){
        res.sendStatus(404)
        res.json({
          error: "Couldn't find Country"
        })
        return;
      }
      return response.json()
    })
    .then(data => {
      res.setHeader("Content-Type", "image/png");
      getIt(data, "false", data.country)
        .catch(err => {
          res.sendStatus(404);
          res.send(err);
          console.log(err)
        })
        .then(data => {
          res.send(data); 
          console.log("Done")
        })
    })
})

//Getting Latest Stats for a specific country
app.get("/country/:id/latest",(req,res)=> getCountryLatest(req,res))
//Specified 2 routes for my personal use :)
app.get("/latest/:id", (req,res)=> getCountryLatest(req,res))

//Function for above routes
var getCountryLatest = (req, res) => {
  var country = req.params.id;
  fetch(`https://disease.sh/v2/countries/${country}`)
    .catch(err => {
      res.send("Error Occured")
      console.log(err)
    })
    .then(response => {
      if(!response.ok){
        res.sendStatus(404)
        res.json({
          error: "Couldn't find Country"
        })
        return;
      }
      return response.json()
    })
    .then(data => {
      res.setHeader("Content-Type", "image/png");
      getIt(data, "true", data.country)
        .catch(err => {
          res.sendStatus(404);
          res.send(err);
          console.log(err)
        })
        .then(data => {
          res.send(data);
          console.log("Done")
        }) 
    })
}

//Listening for request...;)
app.listen(port)
