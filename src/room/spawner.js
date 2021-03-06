let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

/** @param {Room} room **/
function spawnCreeps(room) {

    // lists all the creep types to console
 //   _.forEach(creepTypes, type => console.log(type));

    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room);
    });

    if (creepTypeNeeded == null) {
//        console.log('no creeps need to spawn');
        return;
    }

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);
    console.log(room, JSON.stringify(creepSpawnData));

    if (creepSpawnData) {
        // find the first or 0th spawn in the room
        let spawn = room.find(FIND_MY_SPAWNS)[0];

        // save that we are trying to spawn
        spawn.memory.needcreep = true;
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {
            memory: creepSpawnData.memory
        });

        console.log("Tried to Spawn:", creepTypeNeeded, result)
        if (result == OK) {
            spawn.memory.needcreep = false;

            spawn.room.visual.text(
                '🛠️' + creepSpawnData.memory, // bug here, object object
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}

module.exports = spawnCreeps;
