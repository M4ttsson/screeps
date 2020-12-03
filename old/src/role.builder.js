var roleBuilder = {

    body() {
        // TODO: should return better depending on control level
        return [WORK, CARRY, MOVE]
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        // TODO: Should fetch from store, not harvest!
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {

            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }});
            if (targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                // borrow energy from spawn etc if not spawning anything
                var spawn = Game.spawns['Spawn1'];
                if (!spawn.memory.spawncreep || spawn.memory.spawncreep === '') {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }});
                    // TODO: dåligt att bara ta 0:an. Ta den med mest. 
                    if (targets.length > 0) {
                        if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
                // final solution mine more
                else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;