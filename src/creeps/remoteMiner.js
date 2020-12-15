
/*
Purpose is to go to a distant source and static harvesting

// TODO: Maybe replace harvesters at closest location as well?f
*/
var remoteMiner = {

    /** @param {Creep} creep **/
    buildContainer: function(creep, source) {
        let res = creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
        if (res == 0) {
            console.log("Created construction site for container");
        }
        else if (!creep.room.memory.remoteStorage) {
            // store construction site in memory
            let constSite = creep.pos.lookFor("constructionSite")[0];
            creep.room.memory.remoteStorage = constSite.id;
        }

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {

            let site = Game.getObjectById(creep.room.memory.remoteStorage);
            if (!site || creep.build(site) != 0) {
                // double check so it is finished and store in room memory
                console.log("Remote storage done");
                let storage = creep.pos.lookFor("structure")[0];
                creep.room.memory.remoteStorage = storage.id;
                creep.memory.ready = true;
            }
        }
        else {
            creep.harvest(source);
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // TODO: parameter somehow?
        let source = Game.getObjectById(creep.memory.target);
        if (creep.memory.inPosition) {
            if (creep.memory.ready) {
                // container is finished, check so it does not need repair and then mine and drop excess
                let storage = Game.getObjectById(creep.room.memory.remoteStorage);
                if (storage.hits < storage.maxHits / 2) {
                    if (creep.store.getUsedCapacity() == 0) {
                        if (creep.withdraw(storage) == ERR_NOT_ENOUGH_RESOURCES) {
                            creep.harvest(source);
                        }
                    }
                    else {
                        creep.repair(storage);
                    }
                }
                else {
                    creep.harvest(source);
                }
            }
            else {
                this.buildContainer(creep, source);
            }
        }
        else {
            let storage = Game.getObjectById(creep.room.memory.remoteStorage);
            let inPos = false;
            if (!storage) {
                storage = source;
                inPos = creep.pos.isNearTo(storage.pos);
            }
            else {
                inPos = creep.pos.isEqualTo(storage.pos);
            }
            if (inPos) {
                creep.memory.inPosition = true;
                console.log("Remote miner is in position!")
            }
            else {
                // move to position
                creep.moveTo(storage, {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        }

        
    },

    spawn: function(room) {
        var remoteMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner' && creep.room.name == room.name);
   //     console.log('Harvesters: ' + harvesters.length, room.name);

        if (remoteMiners.length < room.memory.numOfRemoteMiners) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    /** @param {Room} room **/
    spawnData: function(room) {
        let name = 'RemoteMiner' + Game.time;
        let memory = {
            role: 'remoteMiner',
            target: room.memory.distantSource // TODO: send source here or something
        };

        let body = [];
        if (room.energyCapacityAvailable >= 600) {
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            body.push(MOVE);
            body.push(MOVE);
        }
        else {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        return {
            name,
            body,
            memory
        };
    }

}

module.exports = remoteMiner;
