var MachinePoker = require('machine-poker')
    , BlaBot = require('../players/blaBot')
    , CallBot = require('../players/callBot')
    , RandBot = require('../players/randBot')
    , JsSeat = MachinePoker.seats.JsLocal;

exports.createTable = function (opts) {
  var table = MachinePoker.create({
    maxRounds: opts.hands || 100,
    chips: opts.chips || 1000
  });

  table.addPlayers(
    [
    JsSeat.create(CallBot),
    JsSeat.create(BlaBot),
    JsSeat.create(RandBot)
    ]
  );
  return table;
}
