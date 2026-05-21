/** @param {NS} ns */
import { scanNetworkWithRoot, scanNetworkForPurchasedServers, scanNetworkForNonPurchasedServers} from "./lib/MK_Utils.js"
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  var PurchasedServers = []
  var SeenServers = await scanNetworkWithRoot(ns, "home", [], '')
  var player = ns.getPlayer() 
  var getServerLimit = ns.cloud.getServerLimit()
  while (PurchasedServers.length < getServerLimit){
    for (let i = 0; i < getServerLimit; i++) {
      
      var pservername = 'mk_' + i;
      if (!ns.serverExists(pservername)){
          if (player.money > 500000){
            await ns.cloud.purchaseServer(pservername, 4);
            PurchasedServers = await scanNetworkForPurchasedServers(ns, "home", [])
            ns.print(`|| You Bought ${pservername} `);
            ns.scp('BasicHack.js', pservername)
          }
      }

    }
    await ns.sleep(100)
    player = ns.getPlayer() 
  }
  while (true){

    await ns.sleep(100)
  }
}