
/*
purpose: Repair towers, walls, ramparts, containers/storage then roads then everything else in that order.
*/
var repairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // TODO: Should fetch from store, not harvest!
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 resupply');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if (creep.memory.repairing) {
            let target = this.findClosestToRepair(creep);
            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        } 
        else {
            creep.fetchEnergy(true);
        }
    },

    /** @param {Creep} creep **/
    findClosestToRepair: function(creep) {

        let allBroken = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax});
        allBroken = _.sortBy(allBroken, (b) => creep.pos.getRangeTo(b.pos));
        console.log(allBroken.length + " in need of repairs");

        // TODO: figure out why _.find does not work!
        let towers = _.filter(allBroken, (t) => t.structureType == STRUCTURE_TOWER); 
        if(towers.length > 0) {
            return towers[0];
        }

        let containers = _.filter(allBroken, t => t.structureType == STRUCTURE_CONTAINER && t.hits < t.hitsMax / 2);
        if (containers.length > 0) {
            return containers[0];
        }

        // repair up to 1 %
        let mostBrokenRamp = _.filter(allBroken, t => t.structureType == STRUCTURE_RAMPART && t.hits < t.hitsMax * 0.01);
        if (mostBrokenRamp.length > 0) {
            mostBrokenRamp = _.sortBy(mostBrokenRamp, (b) => [b.hits / b.hitsMax, creep.pos.getRangeTo(b.pos)]);
            return mostBrokenRamp[0];
        }

        // repair up to 1 %
        let mostBroken = _.filter(allBroken, t => t.structureType == STRUCTURE_WALL && t.hits < t.hitsMax * 0.01);
        if (mostBroken.length > 0) {
            mostBroken = _.sortBy(mostBroken, (b) => [b.hits / b.hitsMax, creep.pos.getRangeTo(b.pos)]);
            return mostBroken[0];
        }

        // finally roads 
        let roads = _.filter(allBroken, t => t.structureType == STRUCTURE_ROAD && t.hits < t.hitsMax / 2);
        if (roads.length > 0) {
            return roads[0];
        }

        // if nothing prioritized is needed, take the closest and finish. 
        if (allBroken.length > 0) {
            let target = allBroken[0];
            console.log("Finishing repairing " + target.structureType + "  " + target.hits + "/" + target.hitsMax);
            return target;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.room.name == room.name);
        var targets = room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax / 2 })
        console.log('Repairers: ' + creeps.length, room.name);
        console.log('Repair sites: ' + targets.length);

        if (creeps.length < 1 && targets.length > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = 'Repairer' + Game.time;
        let memory = {
            role: 'repairer'
        };

        let body = [];
        if (room.energyCapacityAvailable < 450) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        else {
            body.push(WORK);
            body.push(CARRY);
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
};

module.exports = repairer;
