/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || 300;
  ///////////////////////
  ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  var hPlayer = ns.getPlayer()
  const STATS = {
    "str" : "strength",
    "def" : "defense",
    "dex" : "dexterity",
    "agi" : "agility"
  }
  ///////////////////////
  // Stat Upgrades
  ///////////////////////
  ns.singularity.stopAction()
  ns.singularity.travelToCity("Sector-12")
  for (var stat of ["str", "def", "dex", "agi"]){
    while (hPlayer.skills[STATS[stat]] < target){
      if (!ns.singularity.isBusy()){
        ns.singularity.gymWorkout("Powerhouse Gym", stat, true)
      }
      ns.print(`Training: [${stat}] ${hPlayer.skills[STATS[stat]]} / ${target}`)
      await ns.sleep(1000)
      hPlayer = ns.getPlayer()
    }
    ns.singularity.stopAction()
    ns.singularity.travelToCity("Sector-12")
    ns.tprint(`Training complete: [${stat}]`)
  }
}