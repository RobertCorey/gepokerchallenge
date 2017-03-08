var tournament = require('./test/tournament')
    , MachinePoker = require('machine-poker')

var table = tournament.createTable({hands:1});
table.addObserver(MachinePoker.observers.narrator);
table.start();