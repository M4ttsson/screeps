

/* 
Attacks enemies on sight
Heals when power stored is 25%+. 
Repairs when power stored is 50%+.
*/ 

/** @param {Room} room **/
function towerLogic(room) {

    let towers = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER });

    _.forEach(towers, tower => {
        // run each function in prio order, only one action per tick
        if (attackHostiles(tower)) {
            return; // == continue
        }
        else if (healCreeps(tower)) {
            return; // == continue
        }
        else {
            repairStructures(tower);
        }
    });
}

/** @param {StructureTower} tower **/
function attackHostiles(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        console.log("!!!! UNDER ATTACK !!!!");
        let res = tower.attack(closestHostile);
        console.log("attacked hostile " + res);
        return true;
    }
    return false;
}

/** @param {StructureTower} tower **/
function healCreeps(tower) {
    // only heal if storage is above 25%
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) < tower.store.getCapacity(RESOURCE_ENERGY) / 4) {
        return false;
    }
    var injuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax / 2})
    if (injuredCreep) {
        let res = tower.heal(injuredCreep);
        console.log("healed injured creep " + res);
        return true;
    }
    return false;
}

/** @param {StructureTower} tower **/
function repairStructures(tower) {
    // only repair if storage is above 50%
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) < tower.store.getCapacity(RESOURCE_ENERGY) / 2) {
        return false;
    }

    var damagedStruct = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: (c) => c.hits < c.hitsMax / 2})
    if (damagedStruct) {
        let res = tower.repair(damagedStruct);
        console.log("repaired structure " + res);
        return true;
    }
    return false;
}

module.exports = towerLogic;