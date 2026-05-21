/** @param {NS} ns */
export async function main(ns) {
  let auglist = ns.singularity.getOwnedAugmentations()
  ns.tprint(auglist)
  ns.tprint(auglist.length)
}