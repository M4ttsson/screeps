
/*
Purpose is to move energy from containers to spawn, extensions, towers in that order
*/
var hauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
            creep.memory.hauling = true;
            creep.say('🚌 hauling')
        }
        if (creep.memory.hauling && creep.store.getUsedCapacity() == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 fetching');
        }
        if (creep.memory.hauling) {
            
            // TODO: If enemy present, prioritize towers
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                creep.memory.building = false;
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        } 
        else {
            creep.fetchEnergyFromContainer();
        }
    },

    spawn: function(room) {
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.room.name == room.name);
    //    console.log('Haulers: ' + haulers.length, room.name);

        if (haulers.length < 1) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = 'Hauler' + Game.time;
        let body = [CARRY, CARRY, CARRY, MOVE, MOVE];
        let memory = {
            role: 'hauler'
        };

        return {
            name,
            body,
            memory
        };
    }

}

module.exports = hauler;
