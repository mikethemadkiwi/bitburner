/** @param {NS} ns */
export async function main(ns) {
  ///////////////////////
  // ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  var hPlayer = ns.getPlayer()
  var cities = {
    Volhaven: "Volhaven",
    Chongqing: "Chongqing",
    NewTokyo: "New Tokyo",
    Ishima: "Ishima",
    Aevum: "Aevum"
  };
  ns.singularity.stopAction()
  ns.tprint('Beginning in: ', "Sector-12")
  ns.singularity.travelToCity("Sector-12")
  for (var key in cities){
    ns.tprint('Travelling to: ', cities[key])
    ns.singularity.stopAction()
    ns.singularity.travelToCity(cities[key])
    await ns.sleep(2500)
  }
  ns.singularity.stopAction()
  ns.tprint('Returning to: ', "Sector-12")
  ns.singularity.travelToCity("Sector-12")

}