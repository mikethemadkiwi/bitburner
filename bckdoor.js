/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog();
	ns.disableLog("disableLog")
	ns.disableLog("brutessh")
	ns.disableLog("ftpcrack")
	ns.disableLog("relaysmtp")
	ns.disableLog("httpworm")
	ns.disableLog("sqlinject")
	ns.disableLog("nuke")
	ns.disableLog("sleep")
	ns.disableLog("getHackingLevel")
	ns.disableLog("getServerRequiredHackingLevel")
	ns.disableLog("getServerNumPortsRequired")
	ns.disableLog("scan")
	ns.ui.openTail();


  var factionServers = ['n00dles', 'CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z'];
  function isAFactionServer(tarHost){
    var fsv = factionServers.filter(function (node){ return (node == tarHost) })
    if (fsv == tarHost){return true}else{return false}
  }
  // yes i get it n00dles isnt a faction server... 
  // but we hack it enough to require the extra buffs from backdooring it

	ns.singularity.connect("home");
	let portLevel = 0;
	let returnPath = [];
	let alreadyScanned = ["home"];
	let ownedServers = ns.cloud.getServerNames();
	ns.print(timeStamp() + " Script Start")  

	while (true) {
		portLevel = portUpdate();
		returnPath.push(ns.singularity.getCurrentServer());
		await depthScan();
		let goback = returnPath.pop();
		ns.singularity.connect(goback);
		await ns.sleep(15000);
	}

	async function depthScan() {
		let scanList = ns.scan(ns.singularity.getCurrentServer());
		while ((scanList.length) > 0) {
			let newHost = scanList.pop();
			let newHostScan = ns.scan(newHost);

			ownedServers = ns.cloud.getServerNames();
			if (alreadyScanned.includes(newHost) || ownedServers.includes(newHost) || newHostScan.some(sideServer => scanList.includes(sideServer))) {
				continue;
			} //Exclude already scanned, owned servers, and prevent connecting sideways instead of deeper

			returnPath.push(ns.singularity.getCurrentServer());
			ns.singularity.connect(newHost);


			let newHostDetails = ns.getServer(newHost);
			if (newHostDetails.backdoorInstalled == false && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(newHost) && portLevel >= ns.getServerNumPortsRequired(newHost)) {
				ns.print(newHost + " - is Backdoored: " + newHostDetails.backdoorInstalled + " - Portlevel " + portLevel);
	  		portHack(newHost); 
        //       
        if (newHost == "w0r1d_d43m0n"){
          ns.tprint("ACKTUALLY, we're avoiding WD for now. acess via 'The-Cave'.")
        }else{
          ns.tprint(newHost + " - Backdoored")
          await ns.singularity.installBackdoor();
        } 
        //         
      } 

			alreadyScanned.push(newHost);
			await depthScan(); //Is this recursion?
			let goback = returnPath.pop();
			ns.singularity.connect(goback);
		}
	}

	function portUpdate() { //update how many ports can be handled
		let portleveler = 0
		if (ns.fileExists("SQLInject.exe", "home")) { portleveler++; }
		if (ns.fileExists("HTTPWorm.exe", "home")) { portleveler++; }
		if (ns.fileExists("relaySMTP.exe", "home")) { portleveler++; }
		if (ns.fileExists("FTPCrack.exe", "home")) { portleveler++; }
		if (ns.fileExists("BruteSSH.exe", "home")) { portleveler++; }
		return portleveler;
	}
	function portHack(ftarget) {
		if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(ftarget); }
		if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(ftarget); }
		if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(ftarget); }
		if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(ftarget); }
		if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(ftarget); }
		ns.nuke(ftarget);
	}
	function timeStamp() {
		let currentDate = new Date();
		let time = "H" + currentDate.getHours() + " M" + currentDate.getMinutes();
		return (time);
	}
}