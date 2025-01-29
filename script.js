import startGame from "./game.js";

const main = document.querySelector('main');
const form = document.querySelector('form');
const startButton = document.querySelector('button');
let numPlayers = 0;

startButton.addEventListener('click', () => {
    main.removeChild(startButton);
    form.style.visibility = 'visible';
});

function createPlayerElements(numPlayers) {
    const dealerContainer = document.createElement('div');
    dealerContainer.classList.add('dealer-container');
    dealerContainer.innerHTML = `<h2>Dealer</h2><div class="cards"></div>`;
    main.appendChild(dealerContainer);
    const playersContainer = document.createElement('div');
    playersContainer.classList.add('players-container');
    for (let i = 1; i <= numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.id = `player-${numPlayers-i+1}`;
        playerDiv.innerHTML = `<h2>Player ${numPlayers-i+1}</h2><div class="cards"></div>`;
        playersContainer.appendChild(playerDiv);
        playerDiv.style.width = `${50/numPlayers}%`;
    }
    main.appendChild(playersContainer);
    playersContainer.scrollIntoView({behavior: 'smooth'});
}

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindert das Standard-Formular-Submit-Verhalten
    numPlayers = document.querySelector('#numPlayers').value;
    main.removeChild(form);
    createPlayerElements(numPlayers);
    startGame(numPlayers);
});

