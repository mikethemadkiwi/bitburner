/** @param {NS} ns */
export async function main(ns) { 
  const target = ns.args[0] || 30;
  let awaitTime = 1000
  let numkills = 0
  ///////////////////////
  ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  ///////////////////////
  ns.print(`Beginning Homicide for Speakers Faction ${numkills}/${target}`)
  ns.singularity.stopAction()
  ns.singularity.travelToCity("Sector-12") 
  while (numkills < target){
    if (!ns.singularity.isBusy()){
      awaitTime = ns.singularity.commitCrime('Homicide')
    }
    await ns.sleep(awaitTime)
    numkills += 1
    ns.print(`Kills needed for Speakers Faction ${numkills}/${target}`)
  }
  ns.singularity.stopAction()
}