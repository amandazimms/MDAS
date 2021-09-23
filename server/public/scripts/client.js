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