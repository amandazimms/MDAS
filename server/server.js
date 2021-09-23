//REQUIRES
let express = require('express'); //think of this as server-side version of jquery or something similar
let app = express(); //now app is going to use everything that is returned after we run express. think of 'app' as how jquery uses '$'
let bodyParser = require('body-parser'); //NEEDED for POSTS to work

//USES
app.use( express.static( 'server/public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

//GLOBALS
const port = 5000; 
let equationHistory = [];

//SPIN UP THAT SERVER
app.listen(port, ()=> { //we use arrow functions on server side
  console.log('server is up on', port); 
});


//ROUTES

//HOMEPAGE-GET
app.get('/', (req, res) => { //our 2 arguments req and res (remember they're alphabetical!) to pass to this arrow function...
  console.log('get route hit'); //anytime someone goes to localhost:5000 in their browser, this will appear in our console here.
});

//EQUATIONS-GET
app.get( '/equations', ( req, res ) => { //if I understand correctly, this is the mirror-image of our ajax "GET" to /equations...
  res.send( equationHistory );          //...you need both for it to work
});


//EQUATIONS-POST
app.post( '/equations', ( req, res ) => { //if I understand correctly, this is the mirror-image of our ajax "POST" to /equations...
  res.sendStatus( 200 );                  //...you need both for it to work

  //FYI! req.body is the following object!  { firstNumber: '3', secondNumber: '1', operator: '+' }

  //do the math!
  switch (req.body.operator){
    case '+': //if it was a plus...
      req.body.answer = Number(req.body.firstNumber) + Number(req.body.secondNumber); //add them
      break;
    case '-': //same for minus
      req.body.answer = Number(req.body.firstNumber) - Number(req.body.secondNumber);
      break;
     case '*': //multiply
      req.body.answer = Number(req.body.firstNumber) * Number(req.body.secondNumber);
      break;
    case '/': //divide
      req.body.answer = Number(req.body.firstNumber) / Number(req.body.secondNumber);
      break;
    default: //if something else...?
      console.log('error: invalid operator');
  }

  equationHistory.push(req.body); //push the resulting object into our equation history array!
});
