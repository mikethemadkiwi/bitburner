/** @param {NS} ns */
const sPasswords = [];
var details;
var usingpassword;
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
export const serverSolver = async (ns, hostname) => {
  details = ns.dnet.getServerDetails(hostname);
  if (!details.isConnectedToCurrentServer || !details.isOnline) {
    return false;
  }
  //////////////////////////////////////////////////////////////////////////
  if (details.hasSession) {
    sPasswords[hostname] = details.data
    return true;
  }
  switch (details.modelId) {
    case "ZeroLogon":
      return authenticateWithNoPassword(ns, hostname, details);
    case "FreshInstall_1.0":
      return authenticateWithFreshInstall(ns, hostname, details);
    case "DeskMemo_3.1":
      return authenticateWithDeskMemo(ns, hostname, details);
    case "CloudBlare(tm)":
      return authenticateWithCloudBlare(ns, hostname, details);
    case "Laika4":
      return authenticateWithLaika(ns, hostname, details);

    // case "NIL":
      // return authenticateWithNIL(ns, hostname, details);
      // return false;
    ///////////////////////////////////////////////////////
    default:
      ns.print(`Unrecognized modelId: ${details.modelId} - Skipping.`);
      // ns.tprint(`DEATILS`, details)
      return false;
  }
};
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
const authenticateWithNoPassword = async (ns, hostname, details) => {
  ns.print(`Solving: [ ${hostname} - ${details.modelId} ]`)
  const result = await ns.dnet.authenticate(hostname, "");
  sPasswords[hostname] = "";
  return result.success;
};
//////////////////////////////////////////////////////////////////////////
const authenticateWithFreshInstall = async (ns, hostname) => {
  ns.print(`Solving: [ ${hostname} - ${details.modelId} ]`)
  if (details.passwordFormat == "alphabetic"){
    if (details.passwordLength == 4){
      const result = await ns.dnet.authenticate(hostname, "root");
      if (result.success){
        sPasswords[hostname] = "root";
        ns.print(`Password: ${sPasswords[hostname]}`)
      }
      return result.success;
    }
    if (details.passwordLength == 5){
      const result = await ns.dnet.authenticate(hostname, "admin");
      if (result.success){
        sPasswords[hostname] = "admin";
        ns.print(`Password: ${sPasswords[hostname]}`)
      }
      return result.success;
    }
    if (details.passwordLength == 8){
      const result = await ns.dnet.authenticate(hostname, "password");
      if (result.success){
        sPasswords[hostname] = "password";
        ns.print(`Password: ${sPasswords[hostname]}`)
      }
      return result.success;
    }
  }else{
    if (details.passwordLength == 4){
      const result = await ns.dnet.authenticate(hostname, "0000");
      if (result.success){
        sPasswords[hostname] = "0000";
        ns.print(`Password: ${sPasswords[hostname]}`)
      }
      return result.success;
    }
    if (details.passwordLength == 5){
      const result = await ns.dnet.authenticate(hostname, "12345");
      if (result.success){
        sPasswords[hostname] = "12345";
        ns.print(`Password: ${sPasswords[hostname]}`)
      }
      return result.success;
    }
  }
}
//////////////////////////////////////////////////////////////////////////
const authenticateWithDeskMemo = async (ns, hostname, details) => {  
  ns.print(`Solving: [ ${hostname} - ${details.modelId} ]`)
  var num = details.passwordHint.slice(-details.passwordLength)
  const result = await ns.dnet.authenticate(hostname, `${num}`);
  if (result.success){
    sPasswords[hostname] = num;
    ns.print(`Password: ${num}`)
  }
  return result.success;
}
//////////////////////////////////////////////////////////////////////////
const authenticateWithCloudBlare = async (ns, hostname, details) => {  
  ns.print(`Solving: [ ${hostname} - ${details.modelId} ]`)
  var decryptedNum = details.data.split("").filter(char => !isNaN(char) && char !== " ").join("");
  const result = await ns.dnet.authenticate(hostname, `${decryptedNum}`);
  if (result.success){
    sPasswords[hostname] = decryptedNum;
    ns.print(`Password: ${decryptedNum}`)
  }
  return result.success;
}
//////////////////////////////////////////////////////////////////////////
const authenticateWithLaika = async (ns, hostname, details) => {  
  ns.print(`Solving: [ ${hostname} - ${details.modelId} ]`)
  var dogpass = ""
  if (details.passwordLength == 3){
    dogpass = "max"
    const result = await ns.dnet.authenticate(hostname, `${dogpass}`);
    if (result.success){
      sPasswords[hostname] = dogpass;
      ns.print(`Password: ${dogpass}`)
    }
    return result.success;
  }
  if (details.passwordLength == 4){
    dogpass = "spot"
    const try1 = await ns.dnet.authenticate(hostname, dogpass);
    if (try1.success){
      sPasswords[hostname] = dogpass;
      ns.print(`Password: ${dogpass}`)
      return try1.success
    }
    else{
      dogpass = "fido"
      const result = await ns.dnet.authenticate(hostname, `${dogpass}`);
      if (result.success){
        sPasswords[hostname] = dogpass;
        ns.print(`Password: ${dogpass}`)
      }
      return result.success;
    }
  }
  if (details.passwordLength == 5){
    dogpass = "rover"
    const result = await ns.dnet.authenticate(hostname, `${dogpass}`);
    if (result.success){
      sPasswords[hostname] = dogpass;
      ns.print(`Password: ${dogpass}`)
    }
    return result.success;
  }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
export function autocomplete(data) {
  return ["--tail"];
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
export async function main(ns) {
  while (true) {
    // ns.ui.openTail();
    ns.disableLog('ALL');
    const nearbyServers = ns.dnet.probe();
    for (const hostname of nearbyServers) {
      const authenticationSuccessful = await serverSolver(ns, hostname);
      //////////////////////////////////////////////////////////////////////////
      if (!authenticationSuccessful) {
        continue;
      }
      await ns.dnet.connectToSession(hostname, sPasswords[hostname]);
      await ns.scp(ns.getScriptName(), hostname);
      await ns.exec(ns.getScriptName(), hostname, {
        preventDuplicates: true,
      });
      //////////////////////////////////////////////////////////////////////////
      var freeableRam = await ns.dnet.getBlockedRam(hostname)
      if (freeableRam>0){
        await ns.dnet.memoryReallocation()
      }
      let fileList = await ns.ls(hostname)
      for (const filename of fileList) {
        var suffix = filename.slice(-3)
        if (suffix != 'che'){
          if (suffix != "exe"){
            await ns.scp(filename, 'darkweb');
          }
          else{
            ns.print(`Exe Found: `, filename, hostname)
          }
        }else{
          ns.print(`Cache Found: `, filename, hostname)
          // await ns.dnet.openCache(filename)
        }
      }
      //////////////////////////////////////////////////////////////////////////
    }
    await ns.sleep(5000);
  }
}