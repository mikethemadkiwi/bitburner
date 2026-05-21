/** @param {NS} ns */
export async function main(ns) {
  const hostReq = ns.args[0] || 'Madhaus';
  ns.cloud.deleteServer(hostReq)
}