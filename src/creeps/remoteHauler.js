/*
Purpose: Very fast long distance hauler.
Might replace regular hauler later! (but this has a single target)
*/ 


/*
Purpose is to go to a distant source and static harvesting

// TODO: Maybe replace harvesters at closest location as well?f
*/
var remoteHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
            creep.memory.hauling = true;
            creep.say('🚌 hauling')
            creep.memory.ready = false; // awaiting target
        }
        if (creep.memory.hauling && creep.store.getUsedCapacity() == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 fetching');
            creep.memory.ready = false; // awaiting target
        }

        if (creep.memory.hauling && !creep.memory.ready) {
            // go to storage, then containers, then spawn/extensions
            let possibleTargets = creep.room.find(FIND_STRUCTURES, { filter: (x) => { 
                return (x.structureType == STRUCTURE_CONTAINER 
                || x.structureType == STRUCTURE_STORAGE
                || x.structureType == STRUCTURE_SPAWN 
                || x.structureType == STRUCTURE_EXTENSION) 
                && x.store.getFreeCapacity(RESOURCE_ENERGY) > 0; 
                }
            });
            
            console.log(possibleTargets.length + " of targets");

            let target = _.filter(possibleTargets, (struct) => struct.structureType == STRUCTURE_STORAGE);
            if (target.length > 0) {
                console.log("Going to storage");
                creep.memory.target = target[0].id;
                creep.memory.ready = true;
            }
            else { // TODO: fix....
                target = _.filter(possibleTargets, (struct) => struct.structureType == STRUCTURE_CONTAINER && struct.id != room.memory.remoteStorage);
                if (target.length > 0) {
                    console.log("Going to containers");
                    creep.memory.target = target[0].id; 
                    creep.memory.ready = true;
                }
                else {
                    target = _.filter(possibleTargets, (struct) => struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION);
                    if (target.length > 0) {
                        console.log("Going to spawn/extensions");
                        creep.memory.target = target[0].id;
                        creep.memory.ready = true;
                    }
                    else {
                        console.log("No valid targets");
                    }
                }
            }

        }
        // extra parameters for clarity 
        else if (!creep.memory.hauling && !creep.memory.ready) { 
            // go to remote storage
            creep.memory.target = creep.room.memory.remoteStorage;
            creep.memory.ready = true;
        }

        if (creep.memory.ready) {
            //console.log("creep ready to go");
            let targ = Game.getObjectById(creep.memory.target);
            if (creep.memory.hauling) {
            //    console.log("creep ready to go haul");
                if (creep.transfer(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targ, { // TODO: Should move to common function
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
            else {
           //     console.log("creep ready to go withdraw");
                if (creep.withdraw(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targ, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        }


        
    },

    spawn: function(room) {
        var remoteHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHauler' && creep.room.name == room.name);
   //     console.log('Harvesters: ' + harvesters.length, room.name);
        
        let remoteStorage = Game.getObjectById(room.memory.remoteStorage);
        let remoteStorageDone = false;
        if (remoteStorage) {
            if (remoteStorage.store) {
                remoteStorageDone = true;
                //console.log("remote storage done");
            }
        }
        if (remoteHaulers.length < room.memory.numOfRemoteHaulers && remoteStorageDone) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    /** @param {Room} room **/
    spawnData: function(room) {
        let name = 'RemoteHauler' + Game.time;
        let memory = {
            role: 'remoteHauler',
            hauling: false,
        };

        let body = [];
        if (room.energyCapacityAvailable >= 500) {
            body.push(CARRY);
            body.push(CARRY);
            body.push(CARRY);
            body.push(CARRY);
            body.push(CARRY);
            body.push(CARRY);
            body.push(MOVE);
            body.push(MOVE);
            body.push(MOVE);
            body.push(MOVE);
        }
        else {
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

}

module.exports = remoteHauler;
