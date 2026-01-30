/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.disableLog('ALL');
  //// Vars
  var player = ns.getPlayer();

  while (true){
    ns.clearLog()    
    player = ns.getPlayer()
    const numberNodes = ns.hacknet.numNodes()
    var hacknetcost = ns.hacknet.getPurchaseNodeCost();
    //buy loop. super dumb.
    if (numberNodes<ns.hacknet.maxNumNodes()){
      hacknetcost = ns.hacknet.getPurchaseNodeCost();
      if (hacknetcost<player.money){
        ns.hacknet.purchaseNode()
      }
    }
    ///////////////////////
    //Levels Upgrade
    for (let i = 0; i < numberNodes; i++) {
      var player = ns.getPlayer()
      var nStat = ns.hacknet.getNodeStats(i)
      if (nStat.level<200){
        //get cost of level upgrade by 1
        var costofupgrade = ns.hacknet.getLevelUpgradeCost(i, 1)
        if (costofupgrade<player.money){
          ns.hacknet.upgradeLevel(i, 1)
        }
      }
    }
    //Ram Upgrade
    for (let i = 0; i < numberNodes; i++) {
      var player = ns.getPlayer()
      var nStat = ns.hacknet.getNodeStats(i)
      if (nStat.ram<64){
        var costofupgrade = ns.hacknet.getRamUpgradeCost(i, 1)
        if (costofupgrade<player.money){
          ns.hacknet.upgradeRam(i, 1)
        }
      }
    }
    //Cores Upgrade
    for (let i = 0; i < numberNodes; i++) {
      var player = ns.getPlayer()
      var nStat = ns.hacknet.getNodeStats(i)
      if (nStat.cores<16){
        var costofupgrade = ns.hacknet.getCoreUpgradeCost(i, 1)
        if (costofupgrade<player.money){
          ns.hacknet.upgradeCore(i, 1)
        }
      }
    }
    ///////////////////////
    var nodeincome = 0;
    for (let i = 0; i < numberNodes; i++) {
      var nStat = ns.hacknet.getNodeStats(i)
      nodeincome = (nodeincome + nStat.production)
      ns.print(`Node[${i}] Lvl: ${nStat.level} Ram: ${nStat.ram} Cores: ${nStat.cores} Cash/Sec: ${ns.nFormat(nStat.production, "$0.000a")}`)
    }
    await ns.sleep(100)
  }
}