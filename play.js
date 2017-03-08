var tournament = require('./test/tournament')
    , MachinePoker = require('machine-poker')

var table = tournament.createTable({hands:10000});
table.addObserver(MachinePoker.observers.narrator);
table.start();