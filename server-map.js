/** @param {NS} ns */
export async function main(ns) {
	let serverList = ns.scan('home');
	for (let host of serverList) {
		let ping = ns.scan(host);
		for (let pingedHost of ping) {
			if (serverList.includes(pingedHost) === false) {
				serverList.push(pingedHost);
			}
		}
	}		
	await ns.write ('server_list.txt', JSON.stringify(serverList), 'w')
	ns.tprint("Mapped all servers");
}