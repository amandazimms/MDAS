$(document).ready(onReady);

let operatorSelected;
let operators = ['+', '-', '*', '/'];

function onReady(){
  $( '#submit-button' ).on( 'click', submitEquation )

  $( '#add-button' ).on( 'click', selectAddAsOperator );
  $( '#subtract-button' ).on( 'click', selectSubtractAsOperator );
  $( '#multiply-button' ).on( 'click', selectMultiplyAsOperator );
  $( '#divide-button' ).on( 'click', selectDivideAsOperator );

  $( '#clear-button' ).on( 'click', clearFields );
}

//THIS IS NOT DRY but I can't figure out how to pass a parameter with .on('click');
//and I don't care much because the stretch goals look very different anyway
function selectAddAsOperator() {
  operatorSelected = operators[0]; 
  selectedButtonDarker( $(this) );
}

function selectSubtractAsOperator() {
  operatorSelected = operators[1]; 
  selectedButtonDarker( $(this) );
}

function selectMultiplyAsOperator() {
  operatorSelected = operators[2]; 
  selectedButtonDarker( $(this) );
}

function selectDivideAsOperator() {
  operatorSelected = operators[3];
  selectedButtonDarker( $(this) );
}

function selectedButtonDarker(theThis){
  //function to make all buttons except 'this' go back to their normal color,
  //and make 'this' button darker
  theThis.siblings('.math-button').css('background-color', '#C7D4DA');
  theThis.css('background-color', '#7FA5B6');
}

function clearFields(){
  //function clear input fields of numbers
  $( '.num-input' ).val('')
  selectedButtonDarker( $(this) );
}


function submitEquation() {
  //function that collects inputs to form an equation and sends them to server
  //it does not do the actual calculating (the server does).

  let firstNum = $('#first-num-input').val();
  let secondNum = $('#second-num-input').val();

  console.log('operators?', operators);
  console.log('operatorSelected?', operatorSelected);

  let equationToSend = {
    firstNumber: firstNum,
    operator: operatorSelected,
    secondNumber: secondNum,
    answer: 0
  }

  $.ajax ({

    method: 'POST',
    url: '/equations',
    data: equationToSend

  }).then ( function(response) {

    getEquations();//if successful... update Dom
    $( '.num-input' ).val(''); //clear input fields
    selectedButtonDarker( $(this) ); //clear operator button and make this the dark button instead

  }).catch ( function(err) {

    alert('error sending equation');
    console.log('error:', err);
  });
}

function getEquations() {
  //function that gets all the equations we've done from the server
  //and displays them on the dom like any normal calculator would ;)

  $.ajax ({

    method: 'GET',
    url: '/equations'

  }).then ( function(response) {

    let equationHistory = $("#equation-history");
    equationHistory.empty();

    for (let i=0; i<response.length; i++)
    {
      equationHistory.append( 
        `<li>${response[i].firstNumber} ${response[i].operator} ${response[i].secondNumber} = ${response[i].answer}</li>
        `);
    };

  }).catch( function(err) {

    alert('error getting equation history');
    console.log('error:', err)

  });
}