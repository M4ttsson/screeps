let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes');


module.exports.loop = function() {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // run spawn & tower logic for each room in our empire
    _.forEach(Game.myRooms, r => {
        roomLogic.init(r);
        roomLogic.setCreepNumber(r);
        roomLogic.spawning(r);
        roomLogic.towerLogic(r);
    });

    // run each creep role see /creeps/index.js
    for (var name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = creep.memory.role;
       // console.log("creep " + name + " " + role);
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }
}
