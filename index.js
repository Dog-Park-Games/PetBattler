// Defining some global variables to track the state of the game.
let deckId; // Identifier for a deck of cards from the API.
let computerScore = 0; // Score for the computer.
let myScore = 0; // Score for the human player.

// Fetching HTML elements from the DOM to interact with in the script.
const cardsContainer = document.getElementById("cards"); // Container for card images.
const newDeckBtn = document.getElementById("new-deck"); // Button to request a new deck of cards.
const drawCardBtn = document.getElementById("draw-cards"); // Button to draw new cards.
const header = document.getElementById("header"); // Header to display game status messages.
const remainingText = document.getElementById("remaining"); // Text element to display the number of remaining cards.
const computerScoreEl = document.getElementById("computer-score"); // Text element to display the computer's score.
const myScoreEl = document.getElementById("my-score"); // Text element to display the human player's score.

// Function to request a new deck of cards from the API.
function handleClick() {
	fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
		.then((res) => res.json())
		.then((data) => {
			remainingText.textContent = `Remaining cards: ${data.remaining}`; // Updating remaining cards count.
			deckId = data.deck_id; // Saving the deck id for further requests.
			console.log(deckId); // Logging the deck id for debugging purposes.
		});
}

// Attaching event listeners to buttons.
newDeckBtn.addEventListener("click", handleClick); // New deck request on click.

// Event listener to draw two cards from the deck when button is clicked.
drawCardBtn.addEventListener("click", () => {
	fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`) // API request to draw two cards.
		.then((res) => res.json())
		.then((data) => {
			remainingText.textContent = `Remaining cards: ${data.remaining}`; // Updating remaining cards count.
			// Updating card images.
			cardsContainer.children[0].innerHTML = `<img src=${data.cards[0].image} class="card" />`;
			cardsContainer.children[1].innerHTML = `<img src=${data.cards[1].image} class="card" />`;

			const winnerText = determineCardWinner(data.cards[0], data.cards[1]); // Determining the winner of the round.
			header.textContent = winnerText; // Updating header with round results.

			// Check if there are no remaining cards.
			if (data.remaining === 0) {
				drawCardBtn.disabled = true; // Disable draw card button when there are no cards left.
				// Determine and display the game winner based on scores.
				if (computerScore > myScore) {
					header.textContent = "The computer won the game!";
				} else if (myScore > computerScore) {
					header.textContent = "You won the game!";
				} else {
					header.textContent = "It's a tie game!";
				}
			}
		});
});

// Function to determine the winner of a round of card draw.
function determineCardWinner(card1, card2) {
	// Array representing the order of card values.
	const valueOptions = [
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"JACK",
		"QUEEN",
		"KING",
		"ACE",
	];
	const card1ValueIndex = valueOptions.indexOf(card1.value); // Get index of first card's value.
	const card2ValueIndex = valueOptions.indexOf(card2.value); // Get index
	// Check and compare the values of the two cards.
	if (card1ValueIndex > card2ValueIndex) {
		// If first card's value is greater.
		computerScore++; // Increase the computer's score by 1.
		computerScoreEl.textContent = `Computer score: ${computerScore}`; // Update the score display for the computer.
		return "Computer wins!"; // Return a message indicating that the computer won this round.
	} else if (card1ValueIndex < card2ValueIndex) {
		// If second card's value is greater.
		myScore++; // Increase the human player's score by 1.
		myScoreEl.textContent = `My score: ${myScore}`; // Update the score display for the human player.
		return "You win!"; // Return a message indicating that the human player won this round.
	} else {
		// If the values of the two cards are equal.
		return "War!"; // Return a message indicating that the round is a tie.
	}
}
