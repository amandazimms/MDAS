$(document).ready(onReady);

let operatorSelected;
let operators = ['+', '-', '*', '/'];

function onReady(){
  $( '#submit-button' ).on( 'click', submitEquation )

  $( '#add-button' ).on( 'click', selectAddAsOperator );
  $( '#subtract-button' ).on( 'click', selectSubtractAsOperator);
  $( '#multiply-button' ).on( 'click', selectMultiplyAsOperator);
  $( '#divide-button' ).on( 'click', selectDivideAsOperator);
}

//When the submit (`=` button) is clicked, capture this input,
// bundle it up in an object, and send this object to the server via a POST.

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
  theThis.siblings('.math-button').css('background-color', '#C7D4DA');
  theThis.css('background-color', '#7FA5B6');
}


function submitEquation() {
  let firstNum = $('#first-num-input').val();
  let secondNum = $('#second-num-input').val();

  selectedButtonDarker( $(this) );
  console.log('operator selected', operatorSelected);
}

