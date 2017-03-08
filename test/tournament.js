var MachinePoker = require('machine-poker')
    , SneakyCharlie = require('../players/sneakyCharlieBot')
    , SmartBot = require('../players/smartBot')
    , MercBot = require('../players/mercBot')
    , TollusBot = require('../players/tollusBot')
    , FlopsASetBot = require('../players/flopsASetBot')
    , BlaBot = require('../players/blaBot')
    , WhistleTipsBot = require('../players/whistleTipsBot')
    , CallBot = require('../players/callBot')
    , UnpredictableBot = require('../players/unpredictableBot')
    , RandBot = require('../players/randBot')
    , JsSeat = MachinePoker.seats.JsLocal;

exports.createTable = function (challenger, opts) {
  var table = MachinePoker.create({
    maxRounds: opts.hands || 100,
    chips: opts.chips || 1000
  });

  table.addPlayers(
    [
    JsSeat.create(FlopsASetBot),
    JsSeat.create(BlaBot),
    JsSeat.create(WhistleTipsBot),
    JsSeat.create(SneakyCharlie),
    challenger
    ]
  );
  return table;
}
