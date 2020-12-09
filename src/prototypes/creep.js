Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
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