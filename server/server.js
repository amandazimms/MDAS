//requires
let express = require('express'); //think of this as server-side version of jquery or something similar
let app = express(); //now app is going to use everything that is returned after we run express. think of 'app' as how jquery uses '$'
//NEEDED for POSTS to work:
let bodyParser = require('body-parser');

// uses
app.use( express.static( 'server/public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

//global vars
const port = 5000; 


//spin up server
app.listen(port, ()=> { //we will use arrow functions on server side
  console.log('server is up on', port);
});


//GET ROUTES

//HOMEPAGE
app.get('/', (req, res) => { //our 2 arguments req and res (remember they're alphabetical!) to pass to this arrow function...
  console.log('get route hit'); //anytime someone goes to localhost:5000 in their browser, this will appear in our console here.
  res.send('meow'); //anytime someone goes to localhost:5000 in their browser, they will see this on the page
});

//EQUATIONS
app.post( '/equations', ( req, res ) => {
  res.sendStatus( 200 );

  let answer;
  //req.body is the following object!  { firstNumber: '3', secondNumber: '1', operator: '+' }
  switch (req.body.operator){
    case '+':
      answer = Number(req.body.firstNumber) + Number(req.body.secondNumber);
      break;
    case '-':
      answer = Number(req.body.firstNumber) - Number(req.body.secondNumber);
      break;
     case '*':
      answer = Number(req.body.firstNumber) * Number(req.body.secondNumber);
      break;
    case '/':
      answer = Number(req.body.firstNumber) / Number(req.body.secondNumber);
      break;
    default:
      console.log('error: invalid operator');
  }

  console.log('the answer is:', answer);
});

