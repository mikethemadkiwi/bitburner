/** @param {NS} ns */
import { scanNetworkWithRoot, scanNetworkForPurchasedServers} from "./lib/MK_Utils.js"
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  //// Vars
  let pServers = await scanNetworkForPurchasedServers(ns, "home", [], '')
  let seenServers = await scanNetworkWithRoot(ns, "home", [], '')
  var devVal;
  // ns.tprint('Servers: ', dave.length);
  // if (ns.hasTorRouter()) ns.tprint("TOR router detected.");
  while (true){
    ns.clearLog()
    var maxRamNeeded = ns.getPurchasedServerMaxRam()
    var firsttwofour = 0;
    for (var targetServer of Object.keys(seenServers)){
      var player = ns.getPlayer()
      let servername = seenServers[targetServer]
      if (ns.hasRootAccess(servername)) {
        var pservername = 'mk_' + servername;
        if (!ns.serverExists(pservername)){
          if (player.money >= 220000){
            var pservername = 'mk_' + servername;
            if (pservername != 'mk_home'){
              if (pservername != 'mk_darkweb'){
                if (firsttwofour<24){
                  ns.purchaseServer(pservername, 4);
                  ns.print(`|| You Bought ${pservername} `);
                  ns.scp('BasicHack.js', pservername)
                }                
              }
            }
          } else{
            var pservername = 'mk_' + servername;
            if (pservername != 'mk_home'){
              if (pservername != 'mk_darkweb'){
                ns.print(`|| Waiting Funds for Purchase: ${pservername}`);
              }
            }
          }
        } else{
          //upgrade the existing server if we can afford it.
          firsttwofour++;
          var mRam = ns.getServerMaxRam(pservername)
          var dCost = (mRam*2)
          var reqHM = ns.getPurchasedServerUpgradeCost(pservername, dCost)          
          if (player.money >= reqHM){
            if(maxRamNeeded>mRam){
              ns.upgradePurchasedServer(pservername, dCost)
              // ns.tprint(`|| You Bought ram:(${dCost}) for ${pservername}`);
              ns.killall(pservername)
              ns.scp('BasicHack.js', pservername)
            }
          }
          if (!ns.scriptRunning('BasicHack.js', pservername)) {
            var freeram = (ns.getServerMaxRam(pservername) - ns.getServerUsedRam(pservername))
            var maxThreads = Math.floor(freeram/ns.getScriptRam('BasicHack.js'))
            if (maxThreads>=1) {
              ns.exec('BasicHack.js', pservername, maxThreads, servername, 0, false)
              // ns.tprint(`|| ${pservername} Threads: ${maxThreads} Target: ${servername}`);
            }
          }          
          var availThreads = Math.floor(ns.getServerMaxRam(pservername)/ns.getScriptRam('BasicHack.js'))
          let currcost = (ns.getPurchasedServerUpgradeCost(pservername, (ns.getServerMaxRam(pservername)*2)))
          if (currcost<1){ 
            // currcost = (currcost*1000) 
            ns.print(`${pservername} Ram: ${ns.getServerMaxRam(pservername)} T:{${availThreads}} Upgrade: ${ns.nFormat(currcost, "$0.000a")}`)
          }else{            
            ns.print(`${pservername} Ram: ${ns.getServerMaxRam(pservername)} T:{${availThreads}} Upgrade: ${ns.nFormat(currcost, "$0.000a")}`)
          }
        }
      }
    }

    ns.print(`======== Info: =========`)
    ns.print(`Tracked Servers:  ${firsttwofour}`);
    await ns.sleep(100)
  }
}