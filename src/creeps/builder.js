var builder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // TODO: Should fetch from store, not harvest!
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 resupply');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        } else {
            creep.fetchEnergy(false);
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        var targets = room.find(FIND_CONSTRUCTION_SITES)
//        console.log('Builders: ' + builders.length, room.name);
//        console.log('Construction sites: ' + targets.length);

        if (builders.length < 1 && targets.length > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = 'Builder' + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {
            role: 'builder'
        };

        return {
            name,
            body,
            memory
        };
    }
};

module.exports = builder;
