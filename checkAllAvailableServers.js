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

        if (ns.getServerRequiredHackingLevel(serv) > ns.getHackingLevel()) {
            ns.tprint("WARN: Insufficient hacking skill for %s", serv);
        } else {
            if (!ns.fileExists(taskName, serv)) {
                ns.tprint("NoExistScript (will create) | Threads available: " + threadCountNeeded + " | " + serv);
            } else {
                ns.tprint("ScriptExist (wont create) | Threads available: " + threadCountNeeded + " | " + serv);
            }
        }

    }


}