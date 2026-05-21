/** @param {NS} ns */
export async function main(ns) {
  //// Vars  
  function getMemberWeightForTask(taskStats, memberStats) {
    const weight = 
        taskStats["hackWeight"] / 100 * memberStats["hack"] +
        taskStats["strWeight"] / 100 * memberStats["str"] +
        taskStats["agiWeight"] / 100 * memberStats["agi"] +
        taskStats["defWeight"] / 100 * memberStats["def"] +
        taskStats["dexWeight"] / 100 * memberStats["dex"] +
        taskStats["chaWeight"] / 100 * memberStats["cha"];
    return weight;
  }
  ///////
  function getTerritoryWeight(territoryExponent) {
      var gangInfo = ns.gang.getGangInformation();
      return (Math.pow(gangInfo["territory"] * 100, territoryExponent) / 100);
  }
  ///////
  function getWantedGainForTaskByMember(taskStats, memberStats) {
    if (taskStats["baseWanted"] == 0) {
      return 0;
    }    
    const weight = getMemberWeightForTask(taskStats, memberStats);
    const weightWithDifficulty = weight - 3.5 * taskStats["difficulty"]
    if (weightWithDifficulty <= 0) {
      return 0;
    }
    const territoryWeight = getTerritoryWeight(taskStats["territory"]["wanted"])
    if (taskStats["baseWanted"] > 0) {
      return (7 * taskStats["baseWanted"] / (Math.pow(3 * weightWithDifficulty * territoryWeight, 0.8)));
    } else {
      return (0.4 * taskStats["baseWanted"] * weightWithDifficulty * territoryWeight);
    }
  }
  ///////////////////////
  // ns.ui.openTail();
  ns.disableLog('ALL');
  ns.clearLog()
  var hPlayer = ns.getPlayer()
  ///////////////////////
  if (!ns.gang.inGang()){
    ns.tprint(`Not Currently in a gang. Waiting -54000 Karma`)
    while (hPlayer.karma>-54000){
      await ns.sleep(10 * 1000)
      hPlayer = ns.getPlayer()
    }
    ns.gang.createGang("Slum Snakes")
    ns.tprint(`Created Slum Snake Gang.`)
  }else{ // we are in a gang, do stuff
    var gangInfo = ns.gang.getGangInformation();
    var gangMembers = ns.gang.getMemberNames();
    ns.tprint(`[Gang] ${gangInfo.faction} ${gangMembers.length} members.`)
    if (ns.fileExists("Formulas.exe", "home")){
      if (ns.scriptRunning("ZZ_RunMe.js", 'home')){
        ns.scriptKill("ZZ_RunMe.js", 'home')
      }
      ns.run("ZZ_RunMe.js")  
    }
    else {
      
      ////////
      while (true){
        ns.clearLog()
        var gangInfo = ns.gang.getGangInformation();
        var gangMembers = ns.gang.getMemberNames();
        // New Recruits First. ALWAYS.
        ns.print(`Wanted Gain Decimal: ${gangInfo.wantedLevelGainRate}`)
        if (ns.gang.getRecruitsAvailable()>0){
          if (gangInfo.respectForNextRecruit <= gangInfo.respect){
            ns.gang.recruitMember(`G${gangMembers.length}`);
            ns.tprint(`G${gangMembers.length} Recruited!`);
          }
        }
        var highesthacker = 'G0'; // change to thug_01 when the system begins again.
        var highesthackerinfo = ns.gang.getMemberInformation(highesthacker)
        var highesthackerid = 0
        for (var member of Object.keys(gangMembers)){
          var membername = gangMembers[member]
          var memberinfo = ns.gang.getMemberInformation(membername)
          if (memberinfo.str>highesthackerinfo.str) {highesthacker = membername; highesthackerid = member; highesthackerinfo = memberinfo};
        }  
        for (var member of Object.keys(gangMembers)){ 
          var memberinfo = ns.gang.getMemberInformation(membername)
        }
        for (var member of Object.keys(gangMembers)){ 
          gangInfo = ns.gang.getGangInformation();
          var membername = gangMembers[member]
          var memberinfo = ns.gang.getMemberInformation(membername)
          if (memberinfo.str_asc_mult<5){
            ns.gang.setMemberTask(membername, 'Train Combat');
          }
          else {
            if (gangInfo.wantedLevelGainRate > 0){
              ns.gang.setMemberTask(membername, 'Vigilante Justice');
            }
            else {
              if (membername == highesthacker){

                  ns.gang.setMemberTask(membername, 'Vigilante Justice');

              }
              else{
                if (memberinfo.str_asc_mult<10){
                  ns.gang.setMemberTask(membername, 'Train Combat');
                }
                else{
                  if (memberinfo.str<1000){
                    ns.gang.setMemberTask(membername, 'Train Combat');
                  }
                  else{

                    // ns.gang.setMemberTask(membername, 'Mug People')
                    // ns.gang.setMemberTask(membername, 'Deal Drugs')
                    // ns.gang.setMemberTask(membername, 'Strongarm Civilians')
                    // ns.gang.setMemberTask(membername, 'Run a Con')
                    // ns.gang.setMemberTask(membername, 'Armed Robbery')
                    ns.gang.setMemberTask(membername, 'Traffick Illegal Arms')
                    // ns.gang.setMemberTask(membername, 'Human Trafficking')

                  }
                }
              }
            }
            
          }
          ns.print(`${membername}: ${memberinfo.task}`)
        }
        await ns.sleep(await ns.gang.nextUpdate())
      }
      ////////
    }
  }
}