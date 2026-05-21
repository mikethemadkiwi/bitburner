/** @param {NS} ns */
export async function main(ns) {
  const hostReq = ns.args[0] || 'Madhaus';
  const ramReq = ns.args[1] || 16;
  const reqHM = ns.cloud.getServerUpgradeCost(hostReq, ramReq);
  const hmMilli = (reqHM/1000000)
  const player = ns.getPlayer();
  if (player.money > reqHM) {
    ns.cloud.upgradeServer(hostReq, ramReq)
    ns.toast(`|| You Bought ram:(${ramReq}) for ${hostReq}`, "success", 10000);
  }else {
    ns.toast(`|| You cannot afford ram:(${ramReq}) for ${hostReq} Response: ${hmMilli}m needed.`, "success", 10000);
  }
}