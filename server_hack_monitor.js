// imports
import { scanNetworkWithRoot, scriptSizeOnServer} from "./lib/MK_Utils.js"
export async function main(ns) {
  // Variables
  var homeServer = "home";
  var sleepTime = 2000;
  var scaledRam = 0.25;
  var localAttack = "BasicHack.js" 
  var monitorScript = "monitor.js"
  // Arrays
  var serverDontHackList = ['home', 'darkweb'];
  var factionServers = ['CSEC', 'avmnite-02h', 'I.I.I.I'];
  var seenServerList = [];
  var hackedServerList = [];
  var serverThreadList = [];
  var serverTickText = [];
  // Stored Values
  var playerHack;
  var numCracks;
  var threadscanfit;
  const crackList = {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "relaySMTP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm,
    "SQLInject.exe": ns.sqlinject
  };
  // Checks
  function getNumCracks(){
    const homeServer = "home";
    return Object.keys(crackList).filter(function (file){
      return ns.fileExists(file, homeServer)
    }).length;
  }   
  function penetrate(tarHost){
    const homeServer = "home";
    for (var filename of Object.keys(crackList)){
      if (ns.fileExists(filename, homeServer)){
        var runthis = crackList[filename];
        runthis(tarHost)
      }
    }
  }
  function canHack(serverHackLevel){
    return serverHackLevel <= playerHack;
  }
  function hasCracksforPorts(reqPorts){
    return numCracks >= reqPorts;
  }
  function hasRam(maxRam, programRam){
    return maxRam > programRam;
  }
  //
  function isInBlacklist(tarHost){
    var donthack = serverDontHackList.filter(function (node){ return (node == tarHost) })
    // filter the 'mk_*' servers??
    if (donthack == tarHost){return true}else{return false}
  }
  
  function isAFactionServer(tarHost){
    var fsv = factionServers.filter(function (node){ return (node == tarHost) })
    if (fsv == tarHost){return true}else{return false}
  }
  //
  function isInSTL(tarHost){
    var isinit = serverThreadList.filter(function (node){ return (node == tarHost) })
    if (isinit == tarHost){return true}else{return false}
  }
  //
  async function fitScripts(){
    if (ns.scriptRunning(localAttack, 'home')){
      ns.scriptKill(localAttack, 'home')
    }
    var spacetouse = await scriptSizeOnServer(ns, seenServerList)
    threadscanfit = (spacetouse/ns.getScriptRam(localAttack))
    for (var targetServer of Object.keys(seenServerList)){
      let servername = seenServerList[targetServer]
      if (ns.hasRootAccess(servername)) {
        if (threadscanfit>1){
          if (servername != "home"){
            if (servername != "darkweb"){
              await ns.run(localAttack, Math.floor(threadscanfit), servername);
            }
          }
        }
      }
    }
  }

  /////////////////////////////////////////
  ///// Prep Stuff
  ns.ui.openTail();
  ns.disableLog('ALL');
  if (ns.isRunning(localAttack)){
    ns.scriptKill(localAttack)
  }
  if (ns.isRunning(monitorScript)){
    ns.scriptKill(monitorScript)
  }
  // Populate Seen Server List
  seenServerList = await scanNetworkWithRoot(ns, "home", [], '')
  // Run Behaviour on List.
  while (true) {
    serverTickText = []
    playerHack = ns.getHackingLevel()
    numCracks = getNumCracks();
    var lowest = -1;
    var lowestname = ''
    for (var tarHost of seenServerList){
      if(hackedServerList[tarHost]==null){
        var reqPorts = ns.getServerNumPortsRequired(tarHost);
        var serverHackLevel = ns.getServerRequiredHackingLevel(tarHost)
        if (canHack(serverHackLevel)){
          if (!isInBlacklist(tarHost)){
            if (hasCracksforPorts(reqPorts)){
              penetrate(tarHost) // FUUUUUUUUUGGGGG.
              await ns.nuke(tarHost)
              hackedServerList[tarHost] = {}
              hackedServerList[tarHost].name = tarHost
              serverTickText.push(`Host Hacked: ${tarHost}`)
              await fitScripts()
            }
            else{
              serverTickText.push(`Waiting Crack Programs [${getNumCracks()}/${reqPorts}]: ${tarHost}`)
            }              
          }
          else{
            hackedServerList[tarHost] = {}
            hackedServerList[tarHost].name = tarHost
          }
        }
        else{
          var thislow = ns.getServerRequiredHackingLevel(tarHost)
          if (lowest == -1){
            lowest = thislow
            lowestname = tarHost
          }else{
            if (lowest>thislow){
              lowestname = tarHost
              lowest = thislow;
            }
          }   
          let isfaction = false         
          if (isAFactionServer(tarHost)){
            isfaction = true
            serverTickText.push(`Waiting Backdoor! [${serverHackLevel}]: ${tarHost}`)
            // await ns.singularity.connect(tarHost)
            // await ns.singularity.installbackdoor() //?
            // await ns.singularity.connect('home')
          }else{
            serverTickText.push(`Waiting HackLevel [${serverHackLevel}]: ${tarHost}`)
          }
        }
      }
      else{
        if (!isInBlacklist(tarHost)){
          hackedServerList[tarHost].usedram = ns.getServerUsedRam(tarHost)
          hackedServerList[tarHost].maxram = ns.getServerMaxRam(tarHost)                
          if (hasRam(ns.getServerMaxRam(tarHost)), localAttack){
            if (!isInSTL(tarHost)){
              if (ns.scriptRunning(localAttack, tarHost)){
                ns.scriptKill(localAttack, tarHost)
              }          
              await ns.scp(localAttack, tarHost);
              var freeram = (ns.getServerMaxRam(tarHost) - ns.getServerUsedRam(tarHost))
              var maxThreads = Math.floor(freeram/ns.getScriptRam(localAttack))
              if (maxThreads>=1) {
                ns.exec(localAttack, tarHost, maxThreads, tarHost, 0, false)
                serverTickText.push(`[${localAttack}]: rt:[${maxThreads}] ${tarHost}`)
              }        
              hackedServerList[tarHost].threads = maxThreads
              serverThreadList.push(tarHost)
            }
          }
        }
      }
    }
    var hServ = ns.getServer('home')
    var hPlayer = ns.getPlayer()
    var hasTor = ns.hasTorRouter()
    ns.clearLog()     
    ns.print(`======== ${Date.now()} =========`)
    for (var textBlob of serverTickText){
      ns.print(textBlob)
    }
    ns.print(`======== Home: =========`)
    ns.print(`Ram: ${ns.getServerMaxRam("home")}, Cores: ${hServ.cpuCores} `)
    ns.print(`Running with ${Math.floor(threadscanfit)} Threads/Server`)
    ns.print(`Karma: ${hPlayer.karma} HackLvl: ${ns.getHackingLevel()} Money: ${ns.nFormat(hPlayer.money, "$0.000a")}`)
    ns.print(`======== Next Hack: =========`)
    var diff = (lowest-ns.getHackingLevel())
    ns.print(`${lowestname} [${lowest}] ${diff} Remaining.`)
    ns.print(`======== Programs: =========`)
    ns.print(`Tor: ${hasTor}`);
    await ns.sleep(sleepTime);
  }
}
// fuggin nesting man... Jebus...