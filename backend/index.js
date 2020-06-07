let reqs = 0;

// берём Express
const express = require('express');

//CORS
const cors = require('cors');

// берём path
const path = require('path');

// создаём Express-приложение
const  app = express();

//Задаем фековый JWT-token

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Expose-Headers', 'JWT-token,jwt-token,JWT-reauth,jwt-reauth');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'JWT-token,content-type,jwt-token,testLogin');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    // next();
  setTimeout( next, 750);
});

//создаем маршруты для сервисов 
app.get( '/accessible-data/:service', function( req, res ) {
  switch ( req.params.service ) {
    case 'getPersonalAccounts':
      res.sendfile('./backend/services/accounts.json');
      break;
    
    case 'getBDocRegister':
      res.sendfile('./backend/services/igk.json');
      break;

    case 'getSrcIncomNSI':
      res.sendfile('./backend/services/purposecode.json');
      break;
    
    case 'getFAIP':
      res.sendfile('./backend/services/faip.json');
      break;
    
    case 'getCommonData':
      res.sendfile('./backend/services/commonData.json');
      break;

    case 'getLetterOfCreditData':
      res.sendfile('./backend/services/letterOfCreditData.json');
      break;

    case 'getCommonDetailedData':
      res.sendfile('./backend/services/commonDataDetailed.json');
      break;

    case 'getLetterOfCreditDetailedData':
      res.sendfile('./backend/services/letterOfCreditDataDetailed.json');
      break;
    
    case 'isNewDataExist':
      res.sendfile('./backend/services/hasUpdate.json');
      break;

    case 'getAppVersion':
      res.send('2.8.101-dev-01');
      break
  }
} );

app.post( '/accessible-data/:service', function( req, res ) {
  switch ( req.params.service ) {
    case 'getReportData':
      res.sendfile('./backend/services/report.xlsx');
      break;
  }
} );



app.use(
  express.static(
    path.join( __dirname, 'assets' )
  )
);

// запускаем сервер на порту 3000
app.listen( 3000 );

// отправляем сообщение
console.log( 'Сервер стартовал!' );

/**
 * @function
 * @name prepareResponseWithJwt
 * 
 * @argument {Object} req
 * @argument {Object} res
 * @returns none
 */
function prepareResponseWithJwt ( req, res ) {  
  // if ( !req.get('JWT-token') || reqs >= 30 ) {
  //   res.set('JWT-reauth', '' );
  //   reqs = 0;
  // } else {
  //   res.set('JWT-token', createJwtToken () );
  //   reqs++;
  // }  
}

/**
 * @function
 * @name createJwtToken
 * 
 * @argument none
 * @returns {string} generated JWT-token
 */
function createJwtToken () {
  return (new Date()).getTime().toString(16).replace(/(?=(.{4})+(?!.))/g,'-');
}
