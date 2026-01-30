/** @param {NS} ns */
import { scanNetworkWithRoot, scanNetworkForPurchasedServers, scriptSizeOnServer} from "./lib/MK_Utils.js"
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  //// Vars
  const crackList = {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "relaySMTP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm,
    "SQLInject.exe": ns.sqlinject
  };  
  var player = ns.getPlayer()
  var hacknetcost = ns.hacknet.getPurchaseNodeCost();
  while (true){
    ns.clearLog() 
    ///////////////////////   
    player = ns.getPlayer()
    const homeServer = "home";
    const numberNodes = ns.hacknet.numNodes()
    var hacknetcost = ns.hacknet.getPurchaseNodeCost();
    let pServers = await scanNetworkForPurchasedServers(ns, "home", [], '')
    var hServ = ns.getServer(homeServer)
    var hPlayer = ns.getPlayer()
    var hasTor = ns.hasTorRouter()
    var nodeincome = 0;
    for (let i = 0; i < numberNodes; i++) {
      var nStat = ns.hacknet.getNodeStats(i)
      nodeincome = (nodeincome + nStat.production)
    }
    ///////////////////////
    ns.print(`======== Home: =========`)
    ns.print(`Ram: ${ns.getServerMaxRam(homeServer)}, Cores: ${hServ.cpuCores} `)
    ns.print(`Karma: ${hPlayer.karma} HackLvl: ${ns.getHackingLevel()} Money: ${ns.nFormat(hPlayer.money, "$0.000a")}`)
    ns.print(`======== Hacknet: =========`)
    ns.print(`Processing: ${numberNodes} Hacknet Nodes.`)
    hacknetcost = ns.hacknet.getPurchaseNodeCost();
    ns.print(`Current Node Purchase Cost: ${ns.nFormat(hacknetcost, "$0.000a")}`)
    ns.print(`Hacknet Cash/Sec: ${ns.nFormat(nodeincome, "$0.000a")}`)
    ns.print(`======== Purchased Servers: =========`)
    ns.print(`Upgrading:  ${pServers.length}`);
    ns.print(`======== Programs Purchased: =========`)
    ns.print(`Tor: ${hasTor}`);
    for (var filename of Object.keys(crackList)){
      ns.print(`${filename}: ${ns.fileExists(filename, homeServer)}`)
    }
    ///////////////////////
    await ns.sleep(1000)
  }
}