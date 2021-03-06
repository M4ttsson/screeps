var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('🚌 transp')
        }
        if (!creep.memory.harvesting && creep.store.getFreeCapacity() > 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        if (creep.memory.harvesting) {
            
            let source = Game.getObjectById(creep.room.memory.mainSource); // TODO: Set this somehow in order to have harvesters at both main and distanst?
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        } else {
            // check so haulers has spawned 
            var haulers = _.filter(Game.creeps, (haul) => haul.memory.role == 'hauler' && haul.room.name == creep.room.name);
            if (haulers.length > 0) {
                let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                if (closestContainer) {
             //       console.log("Dropping at closest container");
                    if (creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestContainer, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
            }
            // TODO: Else drop and go back to mining!
        }
    },

    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
   //     console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < room.memory.numOfHarvesters) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    /** @param {Room} room **/
    spawnData: function(room) {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        let name = 'Harvester' + Game.time;
        let memory = {
            role: 'harvester',
        };

        let body = [];
        // spawn small if not capacity or lonely
        if (room.energyCapacityAvailable < 450 || harvesters.length == 0) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        else {
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            body.push(MOVE);
        }

        return {
            name,
            body,
            memory
        };
    }

}

module.exports = harvester;
