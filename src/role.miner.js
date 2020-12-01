var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // TODO: go to closest source instead (or close and active)
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else
        {
            // create storage if not already exists
            // TODO: check if current position is on top instead
            if (creep.pos.createConstructionSite(STRUCTURE_STORAGE) == ERR_INVALID_TARGET){
                console.log(creep.build(creep.pos));
            }
        }

        if (creep.store.getFreeCapacity() == 0) {
            // suicide when done with storage and spawn without carry
            Game.spawns['Spawn1'].memory.trueMiner = true;
            creep.suicide();
        }
    }
};

module.exports = roleMiner;