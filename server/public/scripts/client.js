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

  console.log('operators?', operators);
  console.log('operatorSelected?', operatorSelected);

  let equationToSend = {
    firstNumber: firstNum,
    secondNumber: secondNum,
    operator: operatorSelected
  }

  $.ajax ({
    method: 'POST',
    url: '/equations',
    data: equationToSend
  }).then ( function(response) {
    //if successful... update Dom
    //todo getEquations(); ?
    $( '.num-input' ).val('');
  }).catch ( function(err) {
    alert('error sending equation');
    console.log('error:', err);
  });

 


  selectedButtonDarker( $(this) );
}

