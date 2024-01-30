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
        let svrMoneyAvailable = ns.getServerMoneyAvailable(serv);
        let portsRequired = ns.getServerNumPortsRequired(serv);
        let p = 0;

        if (ns.getServerRequiredHackingLevel(serv) > ns.getHackingLevel()) {
            ns.tprint("WARN: Insufficient hacking skill for ", serv);
        } else {
            if (!ns.fileExists(taskName, serv)) {
                // ns.brutessh(serv);
                if (ns.fileExists("BruteSSH.exe", "home")) {
                    p = p + 1;
                }
                if (ns.fileExists("FTPCrack.exe", "home")) {
                    p = p + 1;
                }
                if (ns.fileExists("relaySMTP.exe", "home")) {
                    p = p + 1;
                }
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    p = p + 1;
                }
                if (ns.fileExists("SQLInject.exe", "home")) {
                    p = p + 1;
                }
                // if number of port mets then nuke and copy/run scripts
                if (p >= portsRequired) {
                    ns.tprint("INFO-NoExistScript (will create on " + serv + ") | Threads available: " + threadCountNeeded + " | Money: " + svrMoneyAvailable);
                } else {
                    ns.rm(taskName, serv);
                    ns.tprint("ERROR::NotExist but |Ports (P[" + p + "] > PR[" + portsRequired + "])| (wont create & delete existing on " + serv + ") | Threads available: " + threadCountNeeded + " | Money: " + svrMoneyAvailable);
                }
            } else {
                if (threadCountNeeded > ns.getScriptRam(taskName)) {
                    ns.rm(taskName, serv);
                    ns.tprint("ERROR::ScriptExist but not running (delete script on " + serv + ") | Threads available: " + threadCountNeeded + " | Money: " + svrMoneyAvailable);
                } else {
                    ns.tprint("ScriptExist (wont create " + serv + ") | Threads available: " + threadCountNeeded + " | Money: " + svrMoneyAvailable);
                }
            }
        }

    }


}