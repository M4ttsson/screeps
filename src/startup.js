
var startup = {

    containerLocations = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 }
    ],

    setupContainers(spawn) {
        var sources = spawn.room.find(FIND_SOURCES);

        // only one source support...
        var source = sources[0];

        this.containerLocations.forEach(element => {
            var result = spawn.room.createConstructionSite(source.pos.x + element.x, source.pos.y + element.y, STRUCTURE_CONTAINER);
            console.log(result);
        });
        
        spawn.memory.initialized = true;
    }

}



module.exports = startup;