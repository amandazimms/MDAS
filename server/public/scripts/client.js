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


// function selectedButtonDarker(theThis){
//   //function to make all buttons except 'this' go back to their normal color,
//   //and make 'this' button darker - 
//   //shows user which math operator button is 'down' and ready to use for calculating
//   theThis.siblings('.math-button').css('background-color', '#C7D4DA');
//   theThis.css('background-color', '#7FA5B6');
// }

function clearFields(){
  //function to clear input fields of numbers
  $( '#equation-visualizer' ).val('')
}


//todo start checking from here - this is new after stretch goals
//note - could use .split() method and use any/all of the operators as a separator,
//then we would have all the numbers as their own spots in the array, no matter how long...  

function submitEquation() { //called from equals button
  //function that collects input, puts them in an object, and sends them to server
  //it does not do the actual calculating (the server does).

  let val = $( '#equation-visualizer' ).val();

  let regExofOperators = /(?=[\/\+\*\-])|(?<=[\/\+\*\-])/; //define a list of our operators using regEx
  //breakdown of this regEx:  [] means match anything inside here. 
                          //  every \ is escaping so that the special chars like + and / can be read as the plain old character, not a fancy js thing.
                          //  the ?=() and ?<=() allow the .split to work by including the separator (+, *) in the resulting array.
                          //    this is the most liquid understanding for me now - why do we need both '?=' and '?<=' ? I don't know, but it works. 
                          //  the | works like or: match either the thing before or the thing after
                          //  regexes always start and end with /'s

  let valArray = val.split(regExofOperators); //split the string into an array, using operators as the 'splitpoint'
  //example: '7*33/99.99' becomes ['7', '*', '3', '/', '99.99']

  equationValidator(valArray);
  //if (equationValidator(valArray)){ //run the equation through our validation function, which will check for problems like two operators in a row, etc. 
      //if it passes, continue (send it to server, etc)

      //todo - need to update everything in this if statement to work with the stretch goals:
      // let equationToSend = {
      //   firstNumber: firstNum,
      //   operator: operatorSelected, //didn't need to 'get' this since it's global
      //   secondNumber: secondNum,
      //   answer: 0
      // }
    
      // $.ajax ({ //hey ajax...
    
      //   method: 'POST', //do a "POST" to server
      //   url: '/equations', //specifically, on the /equations area
      //   data: equationToSend //send it our equation object
    
      // }).then ( function(response) { //if that was successful...
    
      //   getEquations(); //update the DOM with the history of previous equations (including this one)
      //   $( '.num-input' ).val(''); //clear user input fields so they can enter another equation
      //   selectedButtonDarker( $(this) ); //clear whichever operator button was 'down' and make '=' the dark button instead
    
      // }).catch ( function(err) { //if that was not successful...
    
      //   alert('error sending equation'); //alert us
      //   console.log('error:', err);
      // });
  //}
  
}

function equationValidator(valueArray){
  //function that checks if an equation is valid

  let operatorsRegEx = /[\/\+\*\-]/; //define our list of operators
  let hasAnOperator = false; //initialize this as false - then see for loop below

  //CHECK FOR BEGINS OR ENDS WITH OPERATOR
  if(valueArray[0].match(operatorsRegEx) || valueArray[valueArray.length-1].match(operatorsRegEx) ){
    console.log('ERROR: begins or ends with operator');
    alert('ERROR: cannot begin or end equation with an operator');
  }

  else { //made this an else rather than running it every time - otherwise multiple errors = multiple alerts, and user can be overwhelmed?
      for(let i=0; i<valueArray.length; i++){
        //CHECK FOR TWO OPERATORS IN A ROW
        if ( i!==valueArray.length-1 ) { //for all but the first item in the array, 
          if ( valueArray[i].match(operatorsRegEx) && valueArray[i+1].match(operatorsRegEx) ){ //check if this, and the next item, are both operators
            console.log('ERROR: two operators in a row');
            alert('ERROR: cannot enter two operators in a row');
          }  
        }
        //CHECK FOR ANY OPERATORS IN EQUATION
        if (valueArray[i].match(operatorsRegEx)) { //if this is an operator
          hasAnOperator = true; //flip this bool
        }
        //CHECK FOR TWO DECIMALS WITHIN A NUMBER
        let decimalArray = valueArray[i].match(/\./g); //within each number (each item in the valueArray), look for matches with '.' and store these in an array
        console.log('decimal array for', valueArray[i], 'is', decimalArray);
        if (decimalArray && decimalArray.length > 1) { //if that resulting array of decimals is >1, we have too many decimals
          console.log('ERROR: more than one decimal'); 
          alert('ERROR: cannot include more than one decimal in each number');
        } 
      }
      if (!hasAnOperator){ //check if this bool was ever flipped - were any of the array items an operator?
        console.log('ERROR: no operator');
        alert('ERROR: must include at least one operator');
      }
  } 
  //two decimals within the same number
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
        `<li>${response[i].firstNumber} ${response[i].operator} ${response[i].secondNumber} = ${response[i].answer}</li>
        `);
    };

  }).catch( function(err) { //if that was not successful...

    alert('error getting equation history'); //alert us
    console.log('error:', err)

  });
}