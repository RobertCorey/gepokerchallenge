var NUMBER_OF_TOURNAMENTS = 50,
    HANDS_PER_TOURNAMENT = 500,
    CHIPS = 1000,
    ROUND = 7,
    CHALLENGE = 2.0;

var tournament = require('./tournament')
    , MachinePoker = require('machine-poker')
    // , ChallBot = require('../players/challengerBot')
    // , challenger = MachinePoker.seats.JsLocal.create(ChallBot)
    , async = require('async')
    , sys = require('sys')
    , assert = require('assert');

var redColor   = '\033[31m'
    , greenColor = '\033[32m'
    , blueColor  = '\033[34m'
    , resetColor = '\033[0m';

function getPlayer(players, player) {
  for (var i=0; players.length > i; i++) {
    if (player.name === players[i].name) {
      return players[i];
    }
  }
}

var playerWinnings = {};
var totalBankroll = CHIPS*NUMBER_OF_TOURNAMENTS;
function runTournaments(n, next) {
  var opts = {
    hands: HANDS_PER_TOURNAMENT,
    chips: CHIPS
  }
  var table = tournament.createTable(opts)
  table.on('tournamentComplete', function (players) {
    for (var i=0; i < players.length; i++) {
      var p = players[i];
      if (playerWinnings[p.name]) {
        playerWinnings[p.name] += (p.chips - CHIPS);
      } else {
        playerWinnings[p.name] = CHIPS*NUMBER_OF_TOURNAMENTS;
      }
    }
    next(null, player.chips);
  });
  table.start();
}

function printTournamentResults() {
  sys.print(resetColor + "\n");
  console.log("Player Standings");
  sys.print(resetColor + "\n");
  var sortable = [];
  for (var name in playerWinnings) {
    sortable.push([name, playerWinnings[name]])
  }
  sortable.sort(function(a, b) {return b[1] - a[1]})
  for (var i=0; i<sortable.length; i++) {
    if (i==0) {
      sys.print(greenColor + (i+1) + ". " + sortable[i][0] + " $" + sortable[i][1] + resetColor + "\n");
    } else {
      sys.print(redColor + (i+1) + ". " + sortable[i][0] + " $" + sortable[i][1] + resetColor + "\n");
    }
  }
}
