/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  var hPlayer = ns.getPlayer()
  while (true) {
    ///////////////////////
    ns.clearLog() 
    ns.print(`Karma: ${Math.floor(hPlayer.karma)}`)
    ///////////////////////
    await ns.sleep(1000)
    hPlayer = ns.getPlayer()
  }
}