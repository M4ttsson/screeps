

/** @param {Room} room **/
function setCreepNumber(room) {
    
    // If level has changed compared to stored level, increase creep counts, else nothing
    if (room.memory.rclLevel != room.controller.level) {
        // two harvesters, one upgrader
        console.log("Initializing room creep memory at rcl level " + room.controller.level);
        room.memory.rclLevel = room.controller.level

        switch (room.memory.rclLevel) {
            case 1:
                console.log("two harvesters, one upgrader")
               room.memory.numOfHarvesters = 2;
               room.memory.numOfUpgraders = 1;
                break;

            case 2: 
                console.log("two harvesters, two upgraders, one builder")
                room.memory.numOfHarvesters = 2;
                room.memory.numOfUpgraders = 2;
                room.memory.numOfBuilders = 1;
                break;

            case 3: 
                console.log("two harvesters, two upgraders, one builder, one hauler, one repairer")
                room.memory.numOfHarvesters = 2;
                room.memory.numOfUpgraders = 2;
                room.memory.numOfBuilders = 1;
                room.memory.numOfHaulers = 1;
                room.memory.numOfRepairers = 1;
                break;

            case 4:
                console.log("two harvesters, two upgraders, one builder, one hauler, two repairer")
                room.memory.numOfHarvesters = 2;
                room.memory.numOfUpgraders = 2;
                room.memory.numOfBuilders = 1;
                room.memory.numOfHaulers = 1;
                room.memory.numOfRepairers = 2;
                break;
        
            default:
                // if undefined level, just keep going
                console.log("Creep number unchanged from before")
                break;
        }
    }
    
    

}

module.exports = setCreepNumber;