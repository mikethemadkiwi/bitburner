/** @param {NS} ns */
export async function main(ns) {
  const hostReq = ns.args[0] || 'Madhaus';
  const ramReq = ns.args[1] || 16;
  const reqHM = ns.cloud.getServerUpgradeCost(hostReq, ramReq)
  const reqCost = (reqHM/1000000)
  ns.toast(`|| ${hostReq} ram:(${ramReq})? || Response: ${reqCost}m`, "success", 10000);
}