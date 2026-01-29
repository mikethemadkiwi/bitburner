//////////////////////////////////////////////////////////////////
// Get Free Ram on Host
export function hasFreeRam(ns, tarHost, scriptSize){
  let target = tarHost || 'n00dles';
  let sSize = scriptSize || 4;
  let freeRam = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target))
  if (freeRam>= sSize){
    return true;
  }else{
    return false;
  }
}
//////////////////////////////////////////////////////////////////
// Get a List of all Hackable Servers.
// Scan Deep function. (recursive to serverArray object)
export async function scanNetworkWithRoot(ns, host, hostList, filter) {
  var confirmedfilter = filter || "";
  if (hostList.indexOf(host) == -1) {
    if (host != confirmedfilter){
      let prefix = host.substr(0, 3);
      if (prefix != 'mk_'){
        hostList.push(host);
        ns.scan(host).forEach(newhost => scanNetworkWithRoot(ns, newhost, hostList, host));
      } 
    }
  }
  return hostList;
}
//////////////////////////////////////////////////////////////////
// scans network for hosts that match the predefined prefix. ( mk_ )
// returns ONLY those servers.
export async function scanNetworkForPurchasedServers(ns, host, hostList) {
  if (hostList.indexOf(host) == -1) {
    ns.scan(host).forEach(newhost => {
      let prefix = newhost.substr(0, 3);
      if (prefix == 'mk_'){
        hostList.push(newhost);
      }
    });
  }
  return hostList;
}
//////////////////////////////////////////////////////////////////
// collects and confirms the number of hacked servers able to run scripts. 
// then returns the ram each should have based on the split
export async function scriptSizeOnServer(ns, seenServers) {
  var homeServer = ns.getServer("home")
  var homeFreeRam = (homeServer.maxRam - homeServer.ramUsed)
  var runningscripts = 0;
  for (var targetServer of Object.keys(seenServers)){
    let servername = seenServers[targetServer]
    if (ns.hasRootAccess(servername)) {
      runningscripts++;
    }
  }
  return (homeFreeRam/runningscripts)
}