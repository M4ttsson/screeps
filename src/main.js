
var startup = require('startup');
var creepSpawner = require('creep.spawner');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');

/* TODO: 
1. Hitta närmaste source, skapa pos för angreppsytor och skapa containrar. status för när de är klara? 
2. harvesters fyller spawn sen bygger containrar, 1 uppgrader
2. När containrar är färdigbyggda, sluta med harvesters och skapa miners. Upptäck när det är dags att spawna ny pga död
3. Skapa carriers som bär runt saker
4. Därefter skapa builders vid behov.



State machine för spawn
State för skapa containrar
*/


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var spawn = Game.spawns['Spawn1'];
    if (!spawn.memory.initialized) {
        startup.setupContainers(spawn);
        spawn.memory.miners = false;
    }
    if (!spawn.memory.miners) {
    // TODO: check so containers are done!
        var containersToBuild = spawn.room.find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_CONTAINER }} );
        if (containersToBuild == 0) {
            spawn.memory.miners = true;
        }
    }

    // spawn creepers
    creepSpawner.spawnCreeps(spawn);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
    }
}