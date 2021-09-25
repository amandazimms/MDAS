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

  let originalEquationWithoutAnswer = Object.values(req.body); //todo this feels redundant, but setting one equal to the other seemed to screw it up later like they remembered being linked?
  let equationAsArray = Object.values(req.body);
  //why did I do all that work to turn the equation into an object only to then convert it back to an array? great question. 

  //DO THE MATH!
  //ORDER OF OPERATIONS: first, * and /, left to right
  for(let i=0; i<equationAsArray.length; i++){ //loop through the equation to search for  * or / 
    if(equationAsArray[i] === '*' || equationAsArray[i] === '/'){ //if we find multiplication or division
      let threeToMathify = equationAsArray.splice(i-1, 3); //take the number before and after it, and it, maintaining order, and store
      let finishedThreeMath = threeMemberMath(threeToMathify); //mathify that stored 3 member array
      equationAsArray.splice(i-1, 0, finishedThreeMath); //splice the result back in the same place its 3 ingredients came from
      i--; //decrement i, because we just sliced out part of the array and would otherwise skip the next thing in it
    }
  }
  //ORDER OF OPERATIONS: second, + and -, left to right
  for(let i=0; i<equationAsArray.length; i++){ //loop through the equation again to search for + or - 
    if(equationAsArray[i] === '+' || equationAsArray[i] === '-'){ //if we find addition or subtraction
      let threeToMathify = equationAsArray.splice(i-1, 3); //take the number before and after it, and it, maintaining order, and store
      let finishedThreeMath = threeMemberMath(threeToMathify); //mathify that stored 3 member array
      equationAsArray.splice(i-1, 0, finishedThreeMath); //splice the result back in the same place its 3 ingredients came from
      i--; //decrement i, because we just sliced out part of the array and would otherwise skip the next thing in it
    }
  }

  let fullEquationWithAnswer = originalEquationWithoutAnswer.join('') + '=' + equationAsArray[0]; //join together the original, along with the answer (that's now in a 1-item array), with =, to show on the DOM
    console.log(fullEquationWithAnswer);
  equationHistory.push(fullEquationWithAnswer); //push the resulting object into our equation history array!
});

threeMemberMath = (threeItemMathArray) => {
  //function that takes in an array exactly 3 indices long, 
  //where 0 and 2 are numbers, and 1 is one of the operators +-/*.
  //performs the math and returns the answer.
  if(threeItemMathArray[1] === '+')
    return Number(threeItemMathArray[0]) + Number(threeItemMathArray[2]);

  else if(threeItemMathArray[1] === '-')
    return  Number(threeItemMathArray[0]) -  Number(threeItemMathArray[2]);

  else if(threeItemMathArray[1] === '*')
    return  Number(threeItemMathArray[0]) *  Number(threeItemMathArray[2]);

  else if(threeItemMathArray[1] === '/')
    return  Number(threeItemMathArray[0]) /  Number(threeItemMathArray[2]);

  else {
    console.log("error: invalid equation sent to threeNumberMath function");
    return 666;
  }
}