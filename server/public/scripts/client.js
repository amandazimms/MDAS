$(document).ready(onReady);

function onReady(){
  $('button').each( function(index, value) { //loop through all buttons
    if (this.id !== "equals-button" && this.id !== "clear-button") { //(skipping these two buttons, which behave differently)
      $( `#${this.id}`).on('click', //for each one, on click, assign them to...
        { parameter: this.dataset.id }, addToInputField //run this function, with their data-id as the parameter
      );
    }
  });
  $( '#equals-button' ).on( 'click', submitEquation );
  $( '#clear-button' ).on( 'click', clearFields );
}

function addToInputField(value) {
  //function that receives the button's value (3, ., *, etc) and adds it to the readonly input ('visualization') area

  let equationVisualizer = $( '#equation-visualizer' ); //get the visualization area
  let equationVal = equationVisualizer.val(); //and its value

  equationVal += value.data.parameter; //add to the end of that val, the new value (button that was just pressed)
  equationVisualizer.val(equationVal); //and (re)set the value to this new, longer value
}

function clearFields(){
  //function to clear input fields of numbers
  $( '#equation-visualizer' ).val('');
}

function submitEquation() { //called from equals button
  //function that collects input, puts them in an object, and sends them to server
  //it does not do the actual calculating (the server does).

  let val = $( '#equation-visualizer' ).val(); //get val of whatever user typed in

  let regExofOperators = /(?=[\/\+\*\-])|(?<=[\/\+\*\-])/; //define a list of our operators using regEx
  //breakdown of this regEx:  [] means match ANYthing inside here (like or's). 
                          //  every \ is escaping so that the special chars like + and / can be read as the plain old character, not a fancy js thing.
                          //  the ?=() and ?<=() allow the .split to work by INCLUDING the separator (+, *) in the resulting array.
                          //    this is the most liquid understanding for me now - why do we need both '?=' and '?<=' ? I don't know, but it works. 
                          //  the | works like or: match either the thing before or the thing after
                          //  regexes always start and end with /'s

  let valArray = val.split(regExofOperators); //split the string into an array, using operators as the 'splitpoint'
  //example: '7*33/99.99' becomes ['7', '*', '3', '/', '99.99']

  if (equationValidator(valArray)){ //run the equation through our validation function, which will check for problems like two operators in a row, etc. 
    //run the following only if the equation is valid:
    
    let equationToSend = equationObjectBuilder(valArray);

    $.ajax ({ //hey ajax...
  
      method: 'POST', //do a "POST" to server
      url: '/equations', //specifically, on the /equations area
      data: equationToSend //send it our equation object
  
      }).then ( function(response) { //if that was successful...
  
      getEquations(); //update the DOM with the history of previous equations (including this one)
      $( '#equation-visualizer' ).val(''); //clear user input fields so they can enter another equation
  
      }).catch ( function(err) { //if that was not successful...
  
      alert('error sending equation'); //alert us
      console.log('error:', err);
    });
  }//end if. note - we do not need an else for if the equationValidator returns false; in those cases, the validator handles the errors
}

function equationObjectBuilder(valueArray){ //called from within submitEquation()
  //function that takes in an equation array, 
  //  where numbers and operators are already neatly separated into their own array indices..
  //and bundles it as an object with n number of properties
  //  delineating whether the value is a number or operator. examples:
  //  7*9.1 becomes { 0number: 7, 1operator: *, 2number: 9.1 }

  let operatorsRegEx = /[\/\+\*\-]/; //define our list of operators
  let equationObject = {}; //define an empty object to hold the resulting equation

  for(let i=0; i<valueArray.length; i++){ //loop through our array of values
    if(valueArray[i].match(operatorsRegEx)){ //if value at this index is an operator
      const key = i+'operator'; //declare a constant named, for example, 2operator
      equationObject[key] = valueArray[i]; //and set that as one of the properties of the object, example: 2operator: *
    } else { //if it's a number
      const key = i+'number'; //declare a constant named, for example, 1number
      equationObject[key] = valueArray[i]; //and set that as one of the properties of the object, example: 1number: 7
    } 
  }
  return equationObject;
}

function equationValidator(valueArray){  //called from within submitEquation()
  //function that checks if an equation is valid

  let operatorsRegEx = /[\/\+\*\-]/; //define our list of operators
  let hasAnOperator = false; //initialize this as false - then see for loop below

  //CHECK FOR BEGINS OR ENDS WITH OPERATOR
  if(valueArray[0].match(operatorsRegEx) || valueArray[valueArray.length-1].match(operatorsRegEx) ){
    console.log('ERROR: begins or ends with operator');
    alert('ERROR: cannot begin or end equation with an operator');
    return false;
  }

  else { //made this an else rather than running it every time - otherwise multiple errors = multiple alerts, and user can be overwhelmed?
      for(let i=0; i<valueArray.length; i++){
        //CHECK FOR TWO OPERATORS IN A ROW
        if ( i!==valueArray.length-1 ) { //for all but the first item in the array, 
          if ( valueArray[i].match(operatorsRegEx) && valueArray[i+1].match(operatorsRegEx) ){ //check if this, and the next item, are both operators
            console.log('ERROR: two operators in a row');
            alert('ERROR: cannot enter two operators in a row');
            return false;
          }  
        }
        //CHECK FOR TWO DECIMALS WITHIN A NUMBER
        let decimalArray = valueArray[i].match(/\./g); //within each number (each item in the valueArray), look for matches with '.' and store these in an array
       
        if (decimalArray && decimalArray.length > 1) { //if that resulting array of decimals exists, and is >1, we have too many decimals
          console.log('ERROR: more than one decimal'); 
          alert('ERROR: cannot include more than one decimal in each number');
          return false;
        } 
        //CHECK FOR ANY OPERATORS IN EQUATION
        if (valueArray[i].match(operatorsRegEx)) { //if this is an operator
          hasAnOperator = true; //flip this bool
        }
      } //(cont. CHECK FOR ANY OPERATORS IN EQUATION)
      if (!hasAnOperator){ //check if this bool was ever flipped - were any of the array items an operator?
        console.log('ERROR: no operator');
        alert('ERROR: must include at least one operator');
        return false;
      }
  } 
  //PASS! - if we've gotten this far, all the error tests came up with good news
  return true;
}

function getEquations() {
  //function that gets all the equations we've done from the server
  //and displays them on the dom like any normal calculator would ;)

  $.ajax ({ //hey ajax...

    method: 'GET', //do a "GET" from server
    url: '/equations' //specifically, on the /equations area

  }).then ( function(response) { //if that was successful...

    let equationHistory = $("#equation-history"); //get the output area where we want to display things on the DOM
    equationHistory.empty(); //empty it out from whatever was appended there last time, so we don't have any duplicating

    for (let i=0; i<response.length; i++) { //for (whatever we got back from the server - our history of equations)
      equationHistory.append( //append them to this appropriate area
        `<li>${response[i]}</li>
        `);
    };

  }).catch( function(err) { //if that was not successful...

    alert('error getting equation history'); //alert us
    console.log('error:', err)

  });
}

function displayCurrentAnswer(){
  //function that displays the answer of the current equation in the 'input' area of the calculator, as it is displayed on real life calculators.

  $.ajax ({ //hey ajax...

    method: 'GET', //do a "GET" from server
    url: '/equations' //specifically, on the /equations area

  }).then ( function(response) { //if that was successful...

    //todo 
    //empty the input area and put the currentAnswer (stored on serverside) in the input instaed.

}).catch( function(err) { //if that was not successful...

  alert('error displaying answer'); //alert us
  console.log('error:', err)

});
}

//todo - delete this - not using with stretch goals part?
// function selectedButtonDarker(theThis){
//   //function to make all buttons except 'this' go back to their normal color,
//   //and make 'this' button darker - 
//   //shows user which math operator button is 'down' and ready to use for calculating
//   theThis.siblings('.math-button').css('background-color', '#C7D4DA');
//   theThis.css('background-color', '#7FA5B6');
// }