export async function main(ns) {
    const flags = ns.flags([
        ['refreshrate', 200],
        ['help', false],
    ])
    if (flags._.length === 0 || flags.help) {
        ns.tprint("This script helps visualize the money and security of a server.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`)
        return;
    }
    ns.ui.openTail();
    ns.disableLog('ALL');
    while (true) {
        const server = flags._[0];
        let money = ns.getServerMoneyAvailable(server);
        if (money === 0) money = 1;
        const maxMoney = ns.getServerMaxMoney(server);
        const minSec = ns.getServerMinSecurityLevel(server);
        const sec = ns.getServerSecurityLevel(server);
        ns.clearLog(server);
        ns.print(`${server}`);
        ns.print(` $_______: ${ns.nFormat(money, "$0.000a")} / ${ns.nFormat(maxMoney, "$0.000a")} (${(money / maxMoney * 100).toFixed(2)}%)`);
        ns.print(` security: +${(sec - minSec).toFixed(2)}`);
        ns.print(` hack____: ${ns.format.time(ns.getHackTime(server))} (t=${Math.ceil(ns.hackAnalyzeThreads(server, money))})`);
        if (maxMoney > 1){
          ns.print(` grow____: ${ns.format.time(ns.getGrowTime(server))} (t=${Math.ceil(ns.growthAnalyze(server, maxMoney / money))})`);
        }
        ns.print(` weaken__: ${ns.format.time(ns.getWeakenTime(server))} (t=${Math.ceil((sec - minSec) * 20)})`);
        //
        
        //
        const securityThreshold = minSec + 5;
        const moneyThreshold = maxMoney * 0.75;
        const currentSec = Math.round(sec);
        const currentMoney = Math.round(money);
        if (currentSec > securityThreshold) {      
          ns.print(`Phase: Weaken `);
        } else if (currentMoney < moneyThreshold) {
          ns.print(`Phase: Grow`);
        } else {
          ns.print(`Phase: Hack`);
        }
        await ns.sleep(flags.refreshrate);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}