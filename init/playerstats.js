/** @param {NS} ns */
export async function main(ns) {
  ///////////////////////
  // ns.ui.openTail();
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
    while (hPlayer.skills[STATS[stat]] < 100){
      if (!ns.singularity.isBusy()){
        ns.singularity.gymWorkout("Powerhouse Gym", stat, true)
      }
      ns.print(`Training: [${stat}] ${hPlayer.skills[STATS[stat]]} / 100`)
      await ns.sleep(1000)
      hPlayer = ns.getPlayer()
    }
    ns.singularity.stopAction()
    ns.singularity.travelToCity("Sector-12")
    ns.tprint(`Training complete: [${stat}]`)
  }
  ///////////////////////
  // Karma for Gang
  ///////////////////////
  while (hPlayer.karma>-54000){
    if (!ns.singularity.isBusy()){
      ns.singularity.commitCrime("Homicide", false)
    }
    ns.print(`Committing Homicide: [Karma] ${Math.floor(hPlayer.karma)} / -54000`)
    await ns.sleep(10 * 1000)
    hPlayer = ns.getPlayer()
  }
  ns.tprint(`Karma at Gang Threshhold: ${Math.floor(hPlayer.karma)}`)
}