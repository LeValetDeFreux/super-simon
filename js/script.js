console.log('start');

//Script Modale règle et fail
var rules = document.getElementById('rulesModal');
var fail = document.getElementById('failModal');
var button = document.getElementById('rulesButton');
var span = document.getElementsByClassName('close')[0];

button.onclick = function () {
  rules.style.display = 'block';
}

span.onclick = function () {
  rules.style.display = 'none';
}

// Quitte l'affichage de la modale fail
window.onclick = function(event) {
  if (event.target == fail) {
    fail.style.display = 'none';
  }
}


// Random

function getRandomIntAsString(max) {
  return '' + Math.ceil(Math.random() * Math.ceil(max))
}

function repeatWait(n, seconds, fn, finalFn) {
  if (n <= 0) return finalFn()
  fn()
  setTimeout(repeatWait, seconds*1000, n-1, seconds, fn, finalFn)
}

// Super-Simon

const game = {
  startButton: null,
  prompts: [], // cells to click
  selections: [], // last clicked cells
  playersTurn: false,
  gameOver: false,
  currentPrompt: 0,

// Selection de cellule (game)

  getCellSelector(number) {
    query = `.cell[data-number='${number}']`
    cellSelector = document.querySelector(query)
    return cellSelector
  },


// Montre la cellule (game)

  displayCurrentPrompt() {
    cell = this.getCellSelector(this.prompts[this.currentPrompt])
    cell.classList.add('prompted');
    setTimeout(() => {
      cell.classList.remove('prompted');
    }, 500)
  },

// Selection de cellule joueur

  givePrompts() {
    this.playersTurn = false
    this.currentPrompt = 0
    repeatWait(this.prompts.length, 1, () => {
      this.displayCurrentPrompt()
      this.currentPrompt += 1
    }, () => {
      this.playersTurn = true
    })
  },

// Cellule correcte

  correct() {
    console.log('correct')
    if (game.selections.length >= game.prompts.length ) {
      setTimeout(() => {
        this.nextTurn()
      }, 1000) // 1 seconde
    }
  },

// Mauvaise cellule

  incorrect() {
    console.log('incorrect')
    this.startButton.classList.remove('displayNone')
    fail.style.display = 'block'
    game.stop()
  },

// Lancement jeu, passage au niveau suivant

  start() {
    this.startButton.classList.add('displayNone')
    this.selections = []
    this.prompts = [getRandomIntAsString(4)]
    this.givePrompts()
    startButton.textContent = 'Start'
    fail.style.display = 'none'
  },
  stop() {
    this.playersTurn = false;
  },
  nextTurn() {
    this.selections = []
    this.prompts.push(getRandomIntAsString(4))
    this.givePrompts()
  }

}

// Event joueur

var mousedownTarget = null;

function handleCellMousedown(event) {
  if (game.playersTurn == false) return
  mousedownTarget = event.target
  mousedownTarget.classList.add('prompted')
}

function handleCellMouseup(event) {
  if (game.playersTurn == false) return
  mousedownTarget.classList.remove('prompted')
}

function handleCellClick(event) {
  if (game.playersTurn == false) return
  const cell = event.target
  game.selections.push(cell.dataset.number)
  if ( game.selections.join('')
        == game.prompts.slice(0, game.selections.length).join('') ) {
    game.correct()
  } else {
    game.incorrect()
    const startButton = document.querySelector('button.start')
    startButton.textContent = "Retry"
  }
}

// Cellule selectionné par le joueur

const cells = document.querySelectorAll('.cell')
for (cell of cells) {
  cell.addEventListener('mousedown', handleCellMousedown)
  cell.addEventListener('mouseup', handleCellMouseup)
  cell.addEventListener('click', handleCellClick)
}

// Boutton start, pour lancer du jeu

const startButton = document.querySelector('button.start')
startButton.addEventListener('click', (event) => {
  game.startButton = event.target
  game.start()
})
