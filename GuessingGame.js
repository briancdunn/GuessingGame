var pastGuesses = [];
var answer = newAnswer();
var gameOver = false;
var alreadyGuessed = false;

// generate number from 1 to 100
function newAnswer() {
	return Math.floor(Math.random()*(100)+1);
}

// reset game variables and HTML
function newGame() {

	answer = newAnswer();

	pastGuesses = [];
	gameOver = false;

	// reset guess counter
	$("#guessesLeft").text("5 guesses");

	// clear input box
	$("#guessInput").val("");

	// delete info displayed about player guesses
	$("#infoHere p").remove();

	// return page background to white
	$("#wholePage").removeClass("victory defeat");
}

// handles player input into guess form, called by "Submit Guess" button
$("#inputBox").submit(function(event) {
	event.preventDefault();
	
	// check whether game has ended
	if(gameOver == 0) {

		// check whether input is a valid number
		if(+$("#guessInput").val() > 0 && +$("#guessInput").val() < 101) {
			
			// if player has already entered at least one guess, checks to make sure new guess isn't a repeat of any previous guess
			if(pastGuesses.length > 0) {
				for(var i = 0; i < pastGuesses.length; i++) {
					if(+$("#guessInput").val() == pastGuesses[i]) {
						alreadyGuessed = true;
					}
				}
			}

			// if new guess wasn't found to match any previous guess, handle new guess
			if(!alreadyGuessed) {

				// add new guess to array of previous guesses
				pastGuesses.push(+$("#guessInput").val());

				// create new paragraph to receive info about guess
				$("#infoHere").prepend("<p></p>");
				
				// update remaining guesses counter
				if(pastGuesses.length < 4 || pastGuesses.length ==5) {
					$("#guessesLeft").text(5-pastGuesses.length + " guesses");
				}
				// don't use plural if 1 guess remaining
				else if(pastGuesses.length == 4) {
					$("#guessesLeft").text("1 guess");
				}

				// check if guess equals answer
				if(pastGuesses[pastGuesses.length-1] == answer) {
					// inform player of correct guess
					$("#infoHere p").first().text("You guessed correctly! Click \"Play Again\" for a new game!");
					
					// set background to blue
					$("#wholePage").addClass("victory");
					
					// flip variable to prevent player from continuing to input guesses
					gameOver = true;
				}
				// if guess isn't correct, add info about guess to page HTML and check whether player has reached 5 guess limit
				else {

					// if player has entered previous guesses, add info comparing new guess to previous guess
					if(pastGuesses.length > 1) {

						// if new guess is closer to answer than previous guess, add red font <span> to top <p> below button saying guess is hotter
						if(Math.abs(answer-pastGuesses[pastGuesses.length-1]) < Math.abs(answer-pastGuesses[pastGuesses.length-2])) {
							$("#infoHere p").first().append("<span class=\"hot\">" + pastGuesses[pastGuesses.length-1] + " is hotter than " + pastGuesses[pastGuesses.length-2] + "! </span>");
						}
						// if new guess is farther from answer than previous guess, add blue font <span> to top <p> below button saying guess is colder
						else {
							$("#infoHere p").first().append("<span class=\"cold\">" + pastGuesses[pastGuesses.length-1] + " is colder than " + pastGuesses[pastGuesses.length-2] + ". </span>");
						}
					}

					// if guess is very close to answer, add bold red font <span> to top <p> below button saying guess is super hot
					if(Math.abs(answer-+$("#guessInput").val()) < 10) {
						$("#infoHere p").first().append("<span class=\"super hot\">" + pastGuesses[pastGuesses.length-1] + " is super hot!</span>");
					}
					// if guess is close to answer, add red font <span> to top <p> below button saying guess is hot
					else if(Math.abs(answer-+$("#guessInput").val()) < 20) {
						$("#infoHere p").first().append("<span class=\"hot\">" + pastGuesses[pastGuesses.length-1] + " is hot.</span>");
					}
					// if guess is far from answer, add blue font <span> to top <p> below button saying guess is cold
					else if(Math.abs(answer-+$("#guessInput").val()) < 40) {
						$("#infoHere p").first().append("<span class=\"cold\">" + pastGuesses[pastGuesses.length-1] + " is cold.</span>");
					}
					// if guess is very far from answer, add bold blue font <span> to top <p> below button saying guess is super cold
					else {
						$("#infoHere p").first().append("<span class=\"super cold\">" + pastGuesses[pastGuesses.length-1] + " is super cold!</span>");
					}

					// clear input box if player has guesses remaining
					if(pastGuesses.length < 5) {
						$("#guessInput").val("");
					}
					// if player has no more guesses remaining, keep final guess in input box and end game
					else {

						// set variable to prevent additional guesses
						gameOver = true;

						// turn page background red
						$("#wholePage").addClass("defeat");

						// add <p> below button informing player that they lose
						$("#infoHere").prepend("<p>You lose! Click \"Play Again\" for a new game.</p>");
					}
				}
			}
			// disregard new guess if it was found to match a previous guess
			else {

				// alert player about dubplicate guess
				alert("You already guessed " + +$("#guessInput").val() + ".");
				
				// reset variable to avoid treating next guess as duplicate
				alreadyGuessed = false;

				$("#guessInput").val("")
			}
		}
		// disregard input if it isn't a number from 1 to 100
		else {
			alert("You must enter a number from 1 to 100.");
			$("#guessInput").val("");
		}
	}
	// if game is already over and last guess was correct, prevent player from making new guesses
	else if(pastGuesses[pastGuesses.length-1] == answer) {
		alert("You already won this game! Click \"Play Again\" for a new game.");
	}
	// if game is already over and last guess wasn't correct, prevent player from making new guesses
	else {
		alert("You ran out of guesses! Click \"Play Again\" for a new game.");
	}
});

// reset game when "Play Again" button is clicked
$("#playAgain").on("click",function(event) {
	event.preventDefault();
	newGame();
});

// when player clicks "Hint" button, add new <p> containing answer to info below "Submit Guess" button
$("#hint").on("click",function(event) {
	event.preventDefault();
	$("#infoHere").prepend("<p>The answer is " + answer + ".</p>");
});