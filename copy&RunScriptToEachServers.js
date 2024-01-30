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
    let portsRequired = ns.getServerNumPortsRequired(serv);
    let p = 0;

    if (ns.getServerRequiredHackingLevel(serv) < ns.getHackingLevel()) {
      if (!ns.fileExists(taskName, serv)) {
        if (threadCountNeeded > 0) {

          // ns.brutessh(serv);
          if (ns.fileExists("BruteSSH.exe", "home")) {
            await ns.brutessh(serv);
            p = p + 1;
          }
          if (ns.fileExists("FTPCrack.exe", "home")) {
            await ns.ftpcrack(serv);
            p = p + 1;
          }
          if (ns.fileExists("relaySMTP.exe", "home")) {
            await ns.relaysmtp(serv);
            p = p + 1;
          }
          if (ns.fileExists("HTTPWorm.exe", "home")) {
            await ns.httpworm(serv);
            p = p + 1;
          }
          if (ns.fileExists("SQLInject.exe", "home")) {
            await ns.sqlinject(serv);
            p = p + 1;
          }
          // if number of port mets then nuke and copy/run scripts
          if (p >= portsRequired) {
            ns.tprint("NotExist (will create) | Threads available: " + threadCountNeeded + " | " + serv);
            ns.scp(taskName, serv);
            // ns.nuke(serv);
            if (!ns.hasRootAccess(serv)) {
              await ns.nuke(serv);
            }
            ns.exec(taskName, serv, threadCountNeeded);
          } else {
            ns.tprint("WARN::NotExist but Ports (P[" + p + "] > PR[" + portsRequired + "])| (wont create) | Threads available: " + threadCountNeeded + " | " + serv);
          }

        } else {
          ns.tprint("WARN::NotExist but [O]Threads available (wont create) | Threads available: " + threadCountNeeded + " | " + serv);
        }

      } else {
        ns.tprint("WARN::Exist (wont create) | Threads available: " + threadCountNeeded + " | " + serv);
      }
    }

  }


}