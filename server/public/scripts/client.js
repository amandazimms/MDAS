$(document).ready(onReady);

//global vars used to store the operator button info, since in this project,
//when an operator button is pressed it remains 'down' until an equation is calculated
let operatorSelected;
let operators = ['+', '-', '*', '/'];

function onReady(){
  //setup math operator, submit, and clear buttons and what they do
  $( '#submit-button' ).on( 'click', submitEquation )

  $( '#add-button' ).on( 'click', selectAddAsOperator );
  $( '#subtract-button' ).on( 'click', selectSubtractAsOperator );
  $( '#multiply-button' ).on( 'click', selectMultiplyAsOperator );
  $( '#divide-button' ).on( 'click', selectDivideAsOperator );

  $( '#clear-button' ).on( 'click', clearFields );
}

//THIS IS NOT DRY but I can't figure out how to pass a parameter with .on('click');
//and I don't care much because the stretch goals look very different anyway
function selectAddAsOperator() { //update global var & visuals to show that the add button is 'down' 
  operatorSelected = operators[0]; 
  selectedButtonDarker( $(this) );
}

function selectSubtractAsOperator() { //update global var & visuals to show that the subtract button is 'down'
  operatorSelected = operators[1]; 
  selectedButtonDarker( $(this) );
}

function selectMultiplyAsOperator() { //update global var & visuals to show that the multiply button is 'down'
  operatorSelected = operators[2]; 
  selectedButtonDarker( $(this) );
}

function selectDivideAsOperator() { //update global var & visuals to show that the divide button is 'down'
  operatorSelected = operators[3];
  selectedButtonDarker( $(this) );
}

function selectedButtonDarker(theThis){
  //function to make all buttons except 'this' go back to their normal color,
  //and make 'this' button darker - 
  //shows user which math operator button is 'down' and ready to use for calculating
  theThis.siblings('.math-button').css('background-color', '#C7D4DA');
  theThis.css('background-color', '#7FA5B6');
}

function clearFields(){
  //function to clear input fields of numbers
  $( '.num-input' ).val('')
  //also 'clears' the 'down' effect of any operator buttons pushed
  selectedButtonDarker( $(this) );
}


function submitEquation() {
  //function that collects inputs, puts them in an object, and sends them to server
  //it does not do the actual calculating (the server does).

  let firstNum = $('#first-num-input').val(); //get number values
  let secondNum = $('#second-num-input').val(); //get number values

  let equationToSend = {
    firstNumber: firstNum,
    operator: operatorSelected, //didn't need to 'get' this since it's global
    secondNumber: secondNum,
    answer: 0
  }

  $.ajax ({ //hey ajax...

    method: 'POST', //do a "POST" to server
    url: '/equations', //specifically, on the /equations area
    data: equationToSend //send it our equation object

  }).then ( function(response) { //if that was successful...

    getEquations(); //update the DOM with the history of previous equations (including this one)
    $( '.num-input' ).val(''); //clear user input fields so they can enter another equation
    selectedButtonDarker( $(this) ); //clear whichever operator button was 'down' and make '=' the dark button instead

  }).catch ( function(err) { //if that was not successful...

    alert('error sending equation'); //alert us
    console.log('error:', err);
  });
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