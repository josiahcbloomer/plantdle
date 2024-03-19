let wordlist = [
	"RNCPV",
	"NGCH",
	"ITQY",
	"ITGGP",
	"ECTTQV",
	"YJGGNDCTTQY",
	"ITGGPJQWUG",
	"RTWPKPI",
	"UGGFNKPI",
	"GXGTITGGP",
	"OCTKIQNF",
	"RQNNKPCVKQP",
]

let winScreen = document.querySelector(".win-screen")
let winMsg = winScreen.querySelector(".win-msg")
let nextButton = winScreen.querySelector("button")
let wordCounter = document.querySelector(".bottom-controls #word-on")

wordlist = wordlist.map(w => caesarCipher(w, -2))

let wordOn = 7;
let guessOn = 0;

let typedSoFar = "";

window.addEventListener("keydown", e => {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	if (e.key === "Backspace") {
        if (typedSoFar.length > 0) {
            document.querySelector(`#tile-${guessOn}-${typedSoFar.length-1}`).innerHTML = "";
            typedSoFar = typedSoFar.slice(0, -1);
        }
    }
    else if (e.key === "Enter") {
        if (typedSoFar.length === wordlist[wordOn].length) submitGuess()
    } else if (typedSoFar.length < wordlist[wordOn].length && alphabet.includes(e.key.toUpperCase())) {
        document.querySelector(`#tile-${guessOn}-${typedSoFar.length}`).innerHTML = `<p>${e.key}</p>`;
        typedSoFar += e.key.toUpperCase();
    }
})

let boardEl = document.querySelector(".board")
function startNewRow() {
    let rowEl = document.createElement("div")
    rowEl.classList.add("row")
    rowEl.id = `row-${guessOn}`

    for (let i = 0; i < wordlist[wordOn].length; i++) {
        let tileEl = document.createElement("div")
        tileEl.classList.add("tile")
        tileEl.id = `tile-${guessOn}-${i}`
        tileEl.innerHTML = "";
        rowEl.appendChild(tileEl)
    }

    boardEl.appendChild(rowEl)
}

function submitGuess() {
    let word = wordlist[wordOn]
    let guess = typedSoFar.split("")

    // count frequency of letters in word
    let lettersInWord = {};
    for (let i = 0; i < 26; i++) {
        lettersInWord[String.fromCharCode(i + 65)] = word.split("").filter(c => c.charCodeAt(0) === i + 65).length;
    }

    // check all green letters first
    guess.forEach((letter, position) => {
        let guessTile = document.querySelector(`#tile-${guessOn}-${position}`)
        if (word.charAt(position) == letter) {
            lettersInWord[letter]--;
            guessTile.classList.add("green")
        }
    })
    
    // now check for yellow ones
    guess.forEach((letter, position) => {
        let guessTile = document.querySelector(`#tile-${guessOn}-${position}`)
        if (guessTile.classList.contains("green")) return;

        if (lettersInWord[letter] > 0) {
            lettersInWord[letter]--;
            guessTile.classList.add("yellow")
        } else {
            guessTile.classList.add("grey")
        }
    })

    if (typedSoFar === word) {
        winScreen.classList.add("active")
        nextButton.disabled = false;
        if (guessOn >= 1) {
            winMsg.textContent = `We guessed the word "${word}" in ${guessOn + 1} guesses!`
        } else {
            winMsg.textContent = `We guessed the word "${word}" on the first try! Wait, how???`
        }

        if (wordOn === wordlist.length - 1) {
            winMsg.innerHTML += "<br>Great job! That's all for today!"
            nextButton.style.display = "none"
        }
    } else {
        // next guess
        guessOn++;
        typedSoFar = "";
        startNewRow()
    }
}

function newGame(wordIndex = wordOn+1) {
    nextButton.disabled = true;
    wordOn = wordIndex;
    wordCounter.value = wordOn+1;

    guessOn = 0;
    typedSoFar = "";
    winScreen.classList.remove("active")
    boardEl.innerHTML = "";
    startNewRow()
}
newGame(0)

wordCounter.addEventListener("change", e => {
    if (guessOn > 0) {
        if (!confirm("Are you sure you want to switch words?\nYou'll lose progress on the current word.")) {
            wordCounter.value = wordOn+1;
            return
        }
    }
    
    wordOn = parseInt(wordCounter.value) - 1;
    newGame(wordOn)
})

function caesarCipher(text, shift) {
	let result = ""
	for (let i = 0; i < text.length; i++) {
		let charCode = text.charCodeAt(i)
		if (charCode >= 65 && charCode <= 90) {
			charCode += shift
			if (charCode > 90) {
				charCode -= 26
			}
			if (charCode < 65) {
				charCode += 26
			}
		}
		result += String.fromCharCode(charCode)
	}
	return result
}

// this has to happen on load because otherwise the animations play immediately
window.addEventListener("load", () => {
    winScreen.style.display = "flex";
})