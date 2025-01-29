class Card {
    constructor(suit, rank) {
        this._suit = suit;
        this._rank = rank;
    }
    get suit() {
        return this._suit;
    }
    get rank() {
        return this._rank;
    }
}

class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    getHand() {
        return this.cards;
    }
}

class Deck {
    constructor() {
        // 52 cards in a deck
        // cards order: spades, clubs, hearts, diamonds: + card value
        this.cards = [];
        for (let i = 0; i < 52; i++) {
            this.cards.push(8);
        }
        this.suits = ['spades', 'clubs', 'hearts', 'diamonds'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    }
    checkAvailable(suit, rank) {
        const index = this.suits.indexOf(suit) * 13 + this.ranks.indexOf(rank);
        return this.cards[index] > 0;
    }
    drawCard() {
        const suit = Math.floor(Math.random() * 4);
        const rank = Math.floor(Math.random() * 13);
        if (!this.checkAvailable(this.suits[suit], this.ranks[rank])) {
            return this.drawCard();
        }
        this.cards[suit * 13 + rank]--;
        return new Card(this.suits[suit], this.ranks[rank]);
    }
}

export { Hand, Deck };