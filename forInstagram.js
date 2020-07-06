var express = require('express')
var router = express.Router()
const getIt = require("./mainFunct")

router.get("/", (req,res)=>{
    fetch('https://disease.sh/v2/all')
    .catch(err =>{
      res.send("Error Occured")
      console.log(err)
    })
    .then(response =>{
      if (response.ok) {
        return response.json()
      } else {
          res.sendStatus(404)
        res.json("error: Something is wrong.")
        return;
      }
    })
    .then(data => {
      res.setHeader("Content-Type", "image/png");
      getIt(data, "false", "","ig")
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

router.get('/latest', (req,res)=>{
    fetch('https://disease.sh/v2/all')
    .catch(err =>{
      res.send("Error Occured")
      console.log(err)
    })
    .then(response =>{
      if (response.ok) {
        return response.json()
      } else {
          res.sendStatus(404)
        res.json("error: Something is wrong.")
        return;
      }
    })
    .then(data => {
      res.setHeader("Content-Type", "image/png");
      getIt(data, "true", "","ig")
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