

/** @param {Room} room **/
function initMemory(room) {
    // store sources locations 


    // run once
    if (!room.memory.init) {
        let sources = room.find(FIND_SOURCES);
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        
        let sorted = _.sortBy(sources, (x) => { 
            let path = spawn.pos.findPathTo(x.pos, { swampCost: 10 });
            console.log(path.length + " " + x.id);
            return path.length;
        });

        // closest is main
        room.memory.mainSource = sorted[0].id;

        // if more, save long distance
        if (sorted.length > 1) {
            room.memory.distantSource = sorted[1].id;
                // TODO: Handle more than two per room
        }

        // also store spawn
        room.memory.spawn = spawn.id;

        room.memory.init = true;
    }
}

module.exports = initMemory;