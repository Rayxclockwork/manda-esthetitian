'use strict';

//dependencies//
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');


// dotenv //
require('dotenv').config();

// Server//
const app = express();
const PORT = process.env.PORT || 3001;

//app middleware//
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((request, response) => {
  console.log('methodOverride Callback');
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    console.log(method);
    delete request.body._method;
    return method;
  }
}));

app.set('view engine', 'ejs');

//routes//
app.get('/', getHome);
app.get('/services', getServices);
app.get('/portfolio', getPortfolio);
app.post('/getLocation', getLocation);


//route handlers//
function getHome(req, res) {
	res.render('pages/index')
}

function getServices(req, res) {
	res.render('pages/services')
}

function getPortfolio(req, res) {
	res.render('pages/portfolio')
}

function getLocation(request, response) {
  let location = request.body.location;

  superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.LOCATION_API_KEY}`)
    .then(resultsFromSuperagent => {
      let yourAddress = resultsFromSuperagent.body.results[0].formatted_address;
      let clinicAddress = '6316 NW Barry Rd, Kansas City, MO 64154';
      let directionsURL = `http://maps.google.com/maps?saddr="${yourAddress}"&daddr=${clinicAddress}`;
      response.redirect(directionsURL);
    })
    .catch(error => console.error(error));
}


//error function//
function handleError(err, response) {
	console.log('ERROR START ==================');
	console.error(err);
	console.log('ERROR END ====================');
	if (response) {
	  response
		.status(500)
		.render('pages/error', {
		  // header: 'Something went wrong',
		  error: err.toString()
		});
	}
  }
  
  // ========== Listen on PORT ==========
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));