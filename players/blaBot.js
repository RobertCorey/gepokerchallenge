module.exports = function () {
/**
 * NAME YOUR BOT HERE
 */
    var info = {
        name: 'blaBot',
    };

    function Card(card) {
        this.card = card;
        this.suit = this.getSuit();
        this.value = this.getValue();
    }
    /**
     * returns suit of card
     */
    Card.prototype.getSuit = function() {
        var suit = this.card.charAt(1);

        switch (suit) {
            case 'c':
                return 'club';
            case 's':
                return 'spade';
            case 'd':
                return 'diamond';
            case 'h':
                return 'heart';
        }
    };
    /**
     * returns value of card
     */
    Card.prototype.getValue = function() {
        var val = this.card.charAt(0);

        if (!isNaN(Number(val))) { return parseInt(val, 10); }

        switch (val) {
            case 'T':
                return 10;
            case 'J':
                return 11;
            case 'Q':
                return 12;
            case 'K':
                return 13;
            case 'A':
                return 14;
        }
    };

    function Hand(cards) {
        this.cards = cards.map(function(card) { return new Card(card); });
        this.sortCards();
        
        this.organized = this.organizeHand();
    }
    /**
     * PRIVATE HELPER
     */
    Hand.prototype.sortCards = function() {
        this.cards.sort(function(a, b) {
            return a.getValue() - b.getValue();
        });
    };
    /**PRIVATE called by constructor */
    Hand.prototype.organizeHand = function() {
        var organized = {
            suits: {
                spades: [],
                clubs: [],
                hearts: [],
                diamonds: []
            },
            values: {
                2: [], 3: [], 4: [], 5: [], 6: [],
                7: [], 8: [], 9: [], 10: [], 11: [],
                12: [], 13: [], 14: []
            }
        };

        this.cards.forEach(function(card) {
            organized.suits[card.getSuit() + 's'].push(card);
            organized.values[card.getValue()].push(card);
        });

        return organized;
    };

    Hand.prototype.isRoyalFlush = function() {
        return this.getHighCard() === 14 && this.isStraightFlush();
    };

    Hand.prototype.isStraightFlush = function() {
        return this.isFlush() && this.isStraight();
    };

    Hand.prototype.isQuads = function() {
        return this.getSameValueCount() === 4;
    };

    Hand.prototype.isFullHouse = function() {
        var hasTrips = false,
            hasPair = false,
            _this = this;

        Object.keys(this.organized.values).forEach(function(key) {
            if (_this.organized.values[key].length === 2) { hasPair = true; }
            if (_this.organized.values[key].length === 3) { hasTrips = true; }
        });

        return hasPair && hasTrips;
    };
    /**
     * @return true if hand contains a flush
     */
    Hand.prototype.isFlush = function() {
        return this.getSameSuitCount() === 5;
    };
    /**
     * returns true if hand contains a straight( 5 cards in a row )
     */
    Hand.prototype.isStraight = function() {
        var vals = this.cards.map(function(card) { return card.getValue(); }),
            previousCard = 0,
            cardsInHand = this.cards.length,
            cards = [],
            diff;

        if (cardsInHand < 5) return false;

        return vals.some(function(val) {
            previousCard = cards[cards.length - 1];
            diff = null;
            if (previousCard) { diff = val - previousCard; }
            if (diff > 1) {
                cards = [];
                cards.push(val);
            } else if (diff === 1) {
                cards.push(val);
            }
            if (cards.length === 5) return true;
        });
    };
    /**
     * returns true if hand contain 3 of the same value 
     */
    Hand.prototype.isTrips = function() {
        return this.getSameValueCount() === 3;
    };
    /**
     * @return true if hand contain two pairs
     */
    Hand.prototype.isTwoPair = function() {
        var pairCount = 0,
            _this = this;

        Object.keys(this.organized.values).forEach(function(key) {
            if (_this.organized.values[key].length === 2) { pairCount++; }
        });

        return pairCount === 2;
    };
    /**
     * @return true if hand contains a pair
     */
    Hand.prototype.isPair = function() {
        return this.getSameValueCount() === 2;
    };
    /**
     * @return the highest card in the hand
     */
    Hand.prototype.getHighCard = function() {
        var vals = this.cards.map(function(card) { return card.getValue(); });
        return Math.max.apply(null, vals);
    };
    /**
     * @returns object that counts the number of cards with the same value
     *
     */
    Hand.prototype.getSameValueCount = function() {
        var sameValueCount = 0,
            _this = this;

        Object.keys(this.organized.values).forEach(function(key) {
            if (_this.organized.values[key].length > sameValueCount) {
                sameValueCount = _this.organized.values[key].length;
            }
        });

        return sameValueCount;
    };
    /**
     * @returns object that shows that counts for each suit in the hand
     */
    Hand.prototype.getSameSuitCount = function() {
        var sameSuitCount = 0,
            _this = this;

        Object.keys(this.organized.suits).forEach(function(key) {
            if (_this.organized.suits[key].length > sameSuitCount) {
                sameSuitCount = _this.organized.suits[key].length;
            }
        });

        return sameSuitCount;
    };

    /**
     * @param Int cardsRequired number of cards of the same suit needed to be considered potential straight
     * @return Boolean true if number of cards in a row are greater than or equal to cards required
     */
    Hand.prototype.isPotentialStraight = function(cardsRequired) {
        var vals = this.cards.map(function(card) { return card.getValue(); }),
            previousCard = 0,
            matches = 0;

        // this could use some work
        vals.forEach(function(val) {
            if (~vals.indexOf(val + 1)) matches++;
        });

        return matches >= cardsRequired;
    };
    /**
     * @param Int cardsRequired number of cards of the same suit needed to be considered potential flush
     * @return Boolean true if number of cards of same suit is greater than or equal to cards required
     */
    Hand.prototype.isPotentialFlush = function(cardsRequired) {
        return this.getSameSuitCount() >= cardsRequired;
    };

    function Table(game) {
        this.game = game;
        this.players = game.players;
    }
    /**
     *  @return the size of the current big blind
     */
    Table.prototype.getBigBlind = function() {
        var bigBlind = 0;

        this.players.forEach(function(player) {
            if (player.blind > bigBlind) bigBlind = player.blind;
        });

        return bigBlind;
    };
    /**
     * @return object representing the state of the game
     */
    Table.prototype.getState = function() {
        return this.game.state;
    };
    /**
     * @return the community cards available to all players to make the best 5 card hand
     */
    Table.prototype.getCommunity = function() {
        return this.game.community;
    };
    /**
     * @return object representing the bets made by players previously this round
     */
    Table.prototype.getBets = function() {
        return this.game.betting;
    };

    function update(game) {
        var table = new Table(game);
        var hand = new Hand(game.self.cards.concat(table.getCommunity()));
        console.log(JSON.stringify(game, null, 2));
        return 100;
    }

    return {
        update: update,
        info: info
    };

};
