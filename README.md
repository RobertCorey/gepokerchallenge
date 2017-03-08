![JS Poker](http://img.mdp.im.s3.amazonaws.com/2013m19Untitled_83t55f.jpg)

# JS Poker

A No-limit Texas Hold'em poker tournament for Javascript bots played via pull requests with Travis CI as the dealer.

## Rules

1. The game is No-limit Texas Hold'em ($5-10), with each player starting with $1000
2. After each hand the following will happen:
  A. results of the hand will be added to an accumulater so if you win 100 one hand then lose 25 your total will be 75
  B. Your chips will be refilled up to 1000, meaning every bot starts each hand with $1000 dollars or 10 BB
3. After 250,000 the winner will be determined!

## Installation
npm install
### Building a better poker bot

You can test out your bot with a small 100 hand game using `play.js`

    node play.js

The output will include each bots betting actions and cards held in order
to make tuning and debugging easier.

#### Game data and bot actions

Bots are handed a game data object with the current state of the game and simply have
to return a wager as an integer.

#### Game data

Here's an example game date payload: [GameData.json](https://gist.github.com/mdp/050cd82f651eb9f9b9c8)

Game object consists of 6 properties:

- `self` Your bots current standing/cards
- `hand` The current number hand being played
- `state` The betting state of the game. Ex. 'river'
- `betting` Betting options available - These are incremental wager options
- `players` Array of each player, their actions for any round, and wager/stack
- `community` Community cards

#### Bot Actions

In Texas Hold'em, you're only real options are to stay in the game, or fold. With that in mind
bots only need to return an integer representing the additional amount they wish to
add to the pot.

The game objects `betting` property shows the betting options available to the player/bot. `call`
represents the additional amount needed to stay in the game, while `raise` represents the minimum amount
a player can bet if they wish to raise.

- Wagers of less than the amount required to call are considered a 'fold'
- Wagers of '0', when the call amount is '0', are considered a check.
- Wagers greater than the call, but less than the minimum raise will result in a call
- A negative wager will force a fold.
- Failure to return an integer will assume a wager of '0', which may in turn result in a fold

#### Example players

Here's an extremely simple bot that only raises each betting round:

    // I only raise!
    module.exports = function () {
      var info = {
        name: "RaiseBot"
      };
      function play(game) {
        if (game.state !== "complete") {
          return game.betting.raise;
        }
      }

      return { play: play, info: info }
    }

Take a look at the code for the current set of players. Here are a couple decent examples:

- TimidBot only plays pairs [players/timidBot.js](players/timidBot.js)
- UnpredictableBot raises randomly at different stages of the game [players/unpredictableBot.js](players/unpredictableBot.js)

### Resources

- [Texas Hold'em Wikipedia](http://en.wikipedia.org/wiki/Texas_hold_'em)
### Requirements

- Node.js >= 0.10
- an 80386sx microprocessor or better with at least 8 MB of RAM
- OSx, Ubuntu, BSD, or some other POSIX compatible file system. (I don't have a windows machine to test with. Happy to take PR's to fix this)
