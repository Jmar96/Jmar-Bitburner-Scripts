/** @param {NS} ns */
function dpList(ns, current = "home", set = new Set()) 
{
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => 
    {
        set.add(n); return dpList(ns, n, set);
    });
    return Array.from(set.keys());
}
export async function main(ns) {
    //copy and run script to each available server
    let availableServers = dpList(ns);
    const taskName = 'early-hack-template.js';

    for (let i = 0; i < availableServers.length; ++i) {
        const serv = availableServers[i];
        if (!ns.fileExists(taskName)) {
            let threadCountNeeded = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ns.getScriptRam(taskName));

            ns.scp(taskName, serv);
            ns.brutessh(serv);
            ns.nuke(serv);
            ns.exec(taskName, serv, threadCountNeeded);

        }
    }


}