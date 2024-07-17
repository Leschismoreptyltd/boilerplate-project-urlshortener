require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({extended: true}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const originalUrl = [];
const shortUrl =[];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const foundOriginalUrl = originalUrl.indexOf(url);

  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({
      error: "invalid url"
    })
  }
  if( foundOriginalUrl < 0){

    originalUrl.push(url);
    shortUrl.push(originalUrl.length);
    res.json({
      original_url: url,
      short_url: shortUrl.length
    })
    console.log("Inside if statement: This is the url: ", url);
    console.log("This is the original url array: ", originalUrl);
    console.log("This is the short url array: ", shortUrl);
    return;
  }

  return res.json({
    original_url: url,
    short_url: originalUrl.indexOf(url) + 1
  })

  console.log("Outside if statement: This is the url: ", url);
  console.log("This is the original url array: ", originalUrl);
  console.log("This is the short url array: ", shortUrl);
})

app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundShortUrl = shortUrl.indexOf(id);
  console.log("index of short url is: ", foundShortUrl, "The id is: ", id);
  if(foundShortUrl < 0){
    return res.json({
      error: "No short URL found for the given input."
    })
  }

  return res.redirect(originalUrl[foundShortUrl]);
  /* const redirectUrl = originalUrl[index];
  console.log("Redirect url: ", redirectUrl);
  return res.redirect(redirectUrl); */
  
/*   console.log(originalUrl, shortUrl);
  res.redirect(redirectUrl);
  return;  */
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
