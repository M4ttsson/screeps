var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');


var creepSpawner = {

    // TODO antal harvesters = containers - 1
    NumOfHarvesters: 2,
    NumOfUpgraders: 1,
    NumOfBuilders: 2,
    
    spawnCreeps(spawn) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);


        if (!spawn.memory.spawncreep || spawn.memory.spawncreep === '') {
            if (harvesters.length < this.NumOfHarvesters) {
                // spawn harvesters
                spawn.memory.spawncreep = 'harvester';
            }
            else if (upgraders.length < this.NumOfUpgraders) {
                spawn.memory.spawncreep = 'upgrader';
            }
            // dont spawn builder before containers are built
            else if (builders.length < this.NumOfBuilders && constructionSites.length > 0) {
                spawn.memory.spawncreep = 'builder';
            }
            if (spawn.memory.spawncreep != '') {
                console.log('spawning ' + spawn.memory.spawncreep);
            }
        }

        switch (spawn.memory.spawncreep) {
            case 'miner':
                var newName = 'Miner' + Game.time;
                console.log('Spawning new miner: ' + newName);
                spawn.spawnCreep(roleMiner.body(), newName,
                    {memory: {role: 'miner'}});
                break;

            case 'harvester':
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep(roleHarvester.body(), newName,
                    {memory: {role: 'harvester'}});
                break;

            case 'upgrader':
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep(roleUpgrader.body(), newName,
                    {memory: {role: 'upgrader'}});
                break;
            
            case 'builder':
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(roleBuilder.body(), newName,
                    {memory: {role: 'builder'}});
                break;
        
            default:
                break;
        }

        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
            spawn.memory.spawncreep = '';
        }

    }
}

module.exports = creepSpawner;