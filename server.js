'use strict';

//dependencies//
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');


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