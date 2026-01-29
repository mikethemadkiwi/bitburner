/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  while (true) {
    const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.75;
    const currentSec = Math.round(ns.getServerSecurityLevel(target));
    const currentMoney = Math.round(ns.getServerMoneyAvailable(target));
    if (currentSec > securityThreshold) {      
      await ns.weaken(target);
    } else if (currentMoney < moneyThreshold) {      
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}