/** @param {NS} ns */
export async function main(ns) {
  ///////////////////////
  const PURCHASELIST = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "Formulas.exe",
    "ServerProfiler.exe",
    "AutoLink.exe",
    "DeepscanV1.exe",
    "DeepscanV2.exe",
    "DarkscapeNavigator.exe"
  ];
  ///////////////////////
  // ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  var hPlayer = ns.getPlayer()
  ///////////////////////
  // Tor Router / Darkweb
  ///////////////////////
  if (ns.hasTorRouter()) {
    ns.tprint("TOR router detected.")
  }
  else {
    ns.tprint(`Awaiting Tor Purchase.`)
    while (hPlayer.money < 200000){
      await ns.sleep(1000)
      hPlayer = ns.getPlayer()
    } 
    ns.singularity.purchaseTor()
    ns.tprint("TOR router purchased.")
  };
  ///////////////////////
  // Program Purchasing
  ///////////////////////
  for (var program in PURCHASELIST){
    if (!ns.fileExists(PURCHASELIST[program], "home")){
      ns.tprint(`Awaiting Income for: ${PURCHASELIST[program]}.`)
      let costofprog = ns.singularity.getDarkwebProgramCost(PURCHASELIST[program])
      while (costofprog > hPlayer.money){
        ns.clearLog()
        let cdiff = (costofprog-hPlayer.money)
        ns.print(`Awaiting Income for: ${PURCHASELIST[program]}`)
        ns.print(`Cost: $${costofprog}`)
        ns.print(`Remaining: $${Math.floor(cdiff)}`)
        await ns.sleep(1000)
        hPlayer = ns.getPlayer()
      }
      ns.singularity.purchaseProgram(PURCHASELIST[program])
      ns.tprint(`Purchased: ${PURCHASELIST[program]}.`)
    }
    else {
      ns.tprint(`Exists: ${PURCHASELIST[program]}.`)
    }
  }
  
}