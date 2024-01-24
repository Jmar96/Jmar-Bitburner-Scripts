/** @param {NS} ns */
//create a array list of avaliable servers
function dpList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n); return dpList(ns, n, set);
    });
    return Array.from(set.keys());
}
export async function main(ns) {
    //copy and run script to each available server
    let availableServers = dpList(ns);
    const taskName = "early-hack-template.js";

    for (let i = 0; i < availableServers.length; ++i) {
        const serv = availableServers[i];
        let threadCountNeeded = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ns.getScriptRam(taskName));

        if (ns.getServerRequiredHackingLevel(serv) < ns.getHackingLevel()) {
            if (!ns.fileExists(taskName, serv)) {

                ns.tprint("NoExist (will create) | Threads available: " + threadCountNeeded + " | " + serv);

                ns.scp(taskName, serv);
                // ns.brutessh(serv);
                if (ns.fileExists("BruteSSH.exe", "home")) {
                    await ns.brutessh(serv);
                }
                if (ns.fileExists("FTPCrack.exe", "home")) {
                    await ns.ftpcrack(serv);
                }
                if (ns.fileExists("relaySMTP.exe", "home")) {
                    await ns.relaysmtp(serv);
                }
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    await ns.httpworm(serv);
                }
                if (ns.fileExists("SQLInject.exe", "home")) {
                    await ns.sqlinject(serv);
                }
                // ns.nuke(serv);
                if (!ns.hasRootAccess(serv)) {
                    await ns.nuke(serv);
                }
                if (threadCountNeeded > 0) {
                    ns.exec(taskName, serv, threadCountNeeded);
                }

            } else {
                ns.tprint("Exist (wont create) | Threads available: " + threadCountNeeded + " | " + serv);
            }
        }

    }


}