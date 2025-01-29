import { Hand, Deck } from './util.js';

const emojiDict = {
    'spades': '♠️',
    'clubs': '♣️',
    'hearts': '♥️',
    'diamonds': '♦️'
};

const firstDealerCard = document.createElement('div');
firstDealerCard.classList.add('card');
firstDealerCard.innerHTML = `<p>❓</p><p>❓</p>`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const vizualizeCard = (card, playerIndex, playerFlag) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `<p>${card.rank}</p><p>${emojiDict[card.suit]}</p>`;
    if (playerFlag) {
        document.getElementById(`player-${playerIndex}`).querySelector("div").appendChild(cardDiv);
    } else {
        document.querySelector('.dealer-container').appendChild(cardDiv);
    }
    cardDiv.classList.add('show');
    cardDiv.scrollIntoView({behavior: 'smooth'});
}

const showHitStayButtons = (player) => {
    return new Promise((resolve) => {
        const hitButton = document.createElement('button');
        hitButton.classList.add('options-button');
        hitButton.id = 'hit-button';
        hitButton.innerHTML = 'Hit';
        const stayButton = document.createElement('button');
        stayButton.classList.add('options-button');
        stayButton.id = 'stay-button';
        stayButton.innerHTML = 'Stay';
        const playerElement = document.getElementById(`player-${player}`);
        playerElement.insertBefore(stayButton, playerElement.firstChild);
        playerElement.insertBefore(hitButton, stayButton);
        playerElement.scrollIntoView({behavior: 'smooth'});

        hitButton.addEventListener('click', () => {
            resolve("hit");
            playerElement.removeChild(hitButton);
            playerElement.removeChild(stayButton);
            playerElement.scrollIntoView({behavior: 'smooth'});
        });
        stayButton.addEventListener('click', () => {
            resolve("stay");
            playerElement.removeChild(hitButton);
            playerElement.removeChild(stayButton);
            playerElement.scrollIntoView({behavior: 'smooth'});
        });
    });
}

const vizualizeFirstDealerCard = () => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `<p>❓</p><p>❓</p>`;
    cardDiv.id = 'first-dealer-card';
    document.querySelector('.dealer-container').appendChild(cardDiv);
    cardDiv.classList.add('show');
    cardDiv.scrollIntoView({behavior: 'smooth'});
}

const evaluateResults = (playerHands, dealerHand) => {
    const dealerScore = calculateScore(dealerHand);
    let playerResults = playerHands.map((hand, index) => {
        const score = calculateScore(hand);
        let reason = '';

        if (score > 21) {
            reason = 'Too many points';
        } else if (score === 21 && hand.getHand().length === 2) {
            reason = 'Blackjack';
        } else if (score <= 21) {
            reason = 'Points <= 21';
        }

        return {
            player: index + 1,
            score: score,
            reason: reason,
            busted: score > 21
        };
    });
    playerResults.push({
        player: 'Dealer',
        score: dealerScore,
        reason: dealerScore > 21 ? 'Too much points' : 'Dealer',
        busted: dealerScore > 21
    });

    // Sort results by score
    playerResults.sort((a, b) => {
        if (a.busted && !b.busted) return 1;
        if (!a.busted && b.busted) return -1;
        return b.score - a.score;
    });

    const resultsList = document.createElement('ol');
    resultsList.classList.add('results-list');
    for (let i = 0; i < playerResults.length; i++) {
        const result = playerResults[i];
        const resultItem = document.createElement('li');
        resultItem.innerHTML = `Player ${result.player}: ${result.score} - ${result.reason}`;
        if (result.busted) {
            resultItem.style.color = 'red';
        }
        resultsList.appendChild(resultItem);
    }
    document.querySelector('body').appendChild(resultsList);
    resultsList.scrollIntoView({behavior: 'smooth'});
}

const playAgain = () => {
    const playAgainButtonDiv = document.createElement('div');
    playAgainButtonDiv.id = "play-again-button-div";
    const playAgainButton = document.createElement('button');
    playAgainButton.innerHTML = 'Play again';
    playAgainButton.classList.add('play-again-button');
    playAgainButtonDiv.appendChild(playAgainButton);
    document.querySelector('body').appendChild(playAgainButtonDiv);
    playAgainButtonDiv.scrollIntoView({behavior: 'smooth'});
    playAgainButton.addEventListener('click', () => {
        window.location.reload();
    });
}

const startGame = async (numPlayers) => {
    let deck = new Deck();
    let playerHands = [];
    // first card
    for (let i = 0; i < numPlayers; i++) {
        playerHands.push(new Hand());
        playerHands[i].addCard(deck.drawCard());
        vizualizeCard(playerHands[i].getHand()[0], i+1, true);
        await sleep(1000);
    }
    let dealerHand = new Hand();
    dealerHand.addCard(deck.drawCard());
    vizualizeFirstDealerCard();
    await sleep(1000);

    //second card
    for (let i = 0; i < numPlayers; i++) {
        playerHands[i].addCard(deck.drawCard());
        vizualizeCard(playerHands[i].getHand()[1], i+1, true);
        await sleep(1000);
    }
    dealerHand.addCard(deck.drawCard());
    vizualizeCard(dealerHand.getHand()[1], 0, false);
    await sleep(500);

    let stay = [];
    let playerScore = [];
    for (let i = 0; i < numPlayers; i++) {
        stay.push(false);
        playerScore.push(0);
    }
    // main game loop
    while(!stay.every((val) => val)) {
        for (let i = 0; i < numPlayers; i++) {
            if (!stay[i]) {
                playerScore[i] = calculateScore(playerHands[i]);
                console.log(playerScore[i]);
                if (playerScore[i] >= 21) {
                    document.getElementById(`player-${i+1}`).style.backgroundColor = 'lightgrey';
                    stay[i] = true;
                } else {
                    const action = await showHitStayButtons(i+1);
                    if (action === "hit") {
                        playerHands[i].addCard(deck.drawCard());
                        vizualizeCard(playerHands[i].getHand()[playerHands[i].getHand().length-1], i+1, true);
                        await sleep(500);
                    } else {
                        document.getElementById(`player-${i+1}`).style.backgroundColor = 'lightgrey';
                        stay[i] = true;
                    }
                }
            }
        }
    }

    // dealer's turn
    const secondCardDiv = document.createElement('div');
    secondCardDiv.classList.add('card');
    secondCardDiv.innerHTML = `<p>${dealerHand.getHand()[0].rank}</p><p>${emojiDict[dealerHand.getHand()[0].suit]}</p>`;
    await sleep(1000);
    const dealerContainer = document.querySelector('.dealer-container');
    dealerContainer.removeChild(document.getElementById('first-dealer-card'));
    dealerContainer.insertBefore(secondCardDiv, dealerContainer.querySelector('.card'));
    secondCardDiv.classList.add('show');
    secondCardDiv.scrollIntoView({behavior: 'smooth'});
    if (calculateScore(dealerHand) < 17) {
        dealerHand.addCard(deck.drawCard());
        vizualizeCard(dealerHand.getHand()[dealerHand.getHand().length-1], 0, false);
        await sleep(500);
    }
    dealerContainer.style.backgroundColor = 'lightgrey';
    evaluateResults(playerHands, dealerHand);
    await sleep(2000);
    playAgain();
}


const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    hand.getHand().forEach(card => {
        if (card.rank === 'A') {
            aces++;
            score += 11;
        } else if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
            score += 10;
        } else {
            score += parseInt(card.rank);
        }
    });

    // Reduziere den Wert von Assen, wenn der Spieler über 21 ist
    while (score > 21 && aces) {
        score -= 10;
        aces--;
    }
    return score;
}

export default startGame;