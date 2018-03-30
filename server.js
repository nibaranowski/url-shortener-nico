// server.js
// where your node app starts

// init project
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

const app = express()

app.use(bodyParser.json());
app.use(cors());



var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
 
var mongodbUri = 'mongodb://nibaranowski:great123456@ds239097.mlab.com:39097/url-shorterner';
 
mongoose.connect(mongodbUri, options);
var conn = mongoose.connection; 





 

app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})



app.get("/:numberToGo", (request, response) => {
  var number = request.params.numberToGo;

  var shortenUrlToGo = 'https://url-shortener-nico.glitch.me/' + number;

  // shortUrl is the collection from shortUrl.js (database mongoose)
  shortUrl.findOne({'shortenUrl' : shortenUrlToGo}, (err, data) => {
    if (err) return response.send('error reading datase');
    var re = new RegExp("^(http|https)://", "i");

    // data is the document that matched from the collection
    var strToCheck = data.originalUrl;

    if (re.test(strToCheck)) {
      response.redirect(301, data.originalUrl);
    }
    else {
      response.redirect(301, 'http://' + data.originalUrl);
    }
  });
});



app.get("/new/:urlToShorten(*)", (request, response) => {
  var urlToShorten = request.params.urlToShorten;

  var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  if(regex.test(urlToShorten)=== true){
    var short = Math.floor(Math.random()*100000).toString();


    var data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shortenUrl: 'https://url-shortener-nico.glitch.me/' + short // we assign random number as the short url

      }
    );

    data.save(err => {
      if (err) {
        return response.send('error saving to database');
      }
    });



    return response.json(data);
  }
  else {
    var data = new shortUrl(
      {
        originalUrl: 'Invalid url',
        shortenUrl: 'Invalid url'// we assign random number as the short url

      });
    return response.json(data);
  }
})

                          









const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
