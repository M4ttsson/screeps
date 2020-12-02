var roleMiner = {

    body() {
        // TODO: should return better depending on control level
        return [WORK, WORK, WORK, MOVE]
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // TODO: go to closest source instead (or close and active)
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        // TODO: double check so the current position is above a container
    }
};

module.exports = roleMiner;