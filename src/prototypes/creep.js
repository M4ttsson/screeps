Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

Creep.prototype.findClosestToRepair = function findClosestToRepair() {

    let allBroken = this.room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax});
    allBroken = _.sortBy(allBroken, (b) => this.pos.getRangeTo(b.pos));
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
        mostBrokenRamp = _.sortBy(mostBrokenRamp, (b) => [b.hits / b.hitsMax, this.pos.getRangeTo(b.pos)]);
        return mostBrokenRamp[0];
    }

    // repair up to 1 %
    let mostBroken = _.filter(allBroken, t => t.structureType == STRUCTURE_WALL && t.hits < t.hitsMax * 0.01);
    if (mostBroken.length > 0) {
        mostBroken = _.sortBy(mostBroken, (b) => [b.hits / b.hitsMax, this.pos.getRangeTo(b.pos)]);
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
}

Creep.prototype.fetchEnergyFromContainer = function fetchEnergyFromContainer(dropped) {
    
    if (dropped) {
        // TODO: doublecheck so this works!
        let droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (r) => r.resourceType == RESOURCE_ENERGY });
        if (droppedEnergy) {
            if (this.withdraw(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                console.log('fetching dropped energy');
                this.moveTo(droppedEnergy, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
            return;
        }
        else {
            let tombstone = this.pos.findClosestByRange(FIND_TOMBSTONES, { filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0 });
            if (tombstone) {
                if (this.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    console.log('fetching tombstone energy');
                    this.moveTo(tombstone, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                return;
            }
        }
    }

    var targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (targets.length > 0) {
        if (this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0], {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    } 
}


Creep.prototype.fetchEnergy = function fetchEnergy(harvest) {
    // first check containers
    var targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (targets.length > 0) {
        if (this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0], {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    } 
    else {
        // borrow energy from spawn etc if not spawning anything
        var spawn = this.room.find(FIND_MY_SPAWNS)[0];
        if (!spawn.memory.needcreep) {
            var targets = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // TODO: sort by content, take from closest or most energy
            if (targets.length > 0) {
                if (this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                return;
            }
        }
         // if nothing else, harvest
        if (harvest) {
            var sources = this.room.find(FIND_SOURCES);
            if (this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
    }
}