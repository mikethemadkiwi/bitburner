/** @param {NS} ns */
import { scanNetworkWithRoot, scanNetworkForPurchasedServers} from "./lib/MK_Utils.js"
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  while (true){
    ns.clearLog()
    var maxRamNeeded = ns.getPurchasedServerMaxRam()
    let seenServers = await scanNetworkWithRoot(ns, "home", [], '') 
    for (var targetServer of Object.keys(seenServers)){
      let pServers = await scanNetworkForPurchasedServers(ns, "home", [], '')
      var player = ns.getPlayer()
      let servername = seenServers[targetServer]
      var pservername = 'mk_' + servername;
      if (ns.hasRootAccess(servername)) {
        if (!ns.serverExists(pservername)){
            if (pservername != 'mk_home'){
              if (pservername != 'mk_darkweb'){
                if (pServers.length<25){
                  if (player.money >= 220000){
                    ns.purchaseServer(pservername, 4);
                    ns.print(`|| You Bought ${pservername} `);
                    ns.scp('BasicHack.js', pservername)
                  }
                }                
              }
            }
        } else{
          //upgrade the existing server if we can afford it.
          var mRam = ns.getServerMaxRam(pservername)
          var dCost = (mRam*2)
          var reqHM = ns.getPurchasedServerUpgradeCost(pservername, dCost)          
          if (player.money >= reqHM){
            if(maxRamNeeded>mRam){
              ns.upgradePurchasedServer(pservername, dCost);
              ns.killall(pservername)
              ns.scp('BasicHack.js', pservername)
            }
          }
          if (!ns.scriptRunning('BasicHack.js', pservername)) {
            var freeram = (ns.getServerMaxRam(pservername) - ns.getServerUsedRam(pservername))
            var maxThreads = Math.floor(freeram/ns.getScriptRam('BasicHack.js'))
            if (maxThreads>=1) {
              ns.exec('BasicHack.js', pservername, maxThreads, servername, 0, false)
            }
          }          
          var availThreads = Math.floor(ns.getServerMaxRam(pservername)/ns.getScriptRam('BasicHack.js'))
          let currcost = (ns.getPurchasedServerUpgradeCost(pservername, (ns.getServerMaxRam(pservername)*2)))
          if (currcost<1){ 
            ns.print(`${pservername} Ram: ${ns.getServerMaxRam(pservername)} T:{${availThreads}} Upgrade: ${ns.nFormat(currcost, "$0.000a")}`)
          }else{            
            ns.print(`${pservername} Ram: ${ns.getServerMaxRam(pservername)} T:{${availThreads}} Upgrade: ${ns.nFormat(currcost, "$0.000a")}`)
          }
        }
      }
    }
    await ns.sleep(100)
  }
}