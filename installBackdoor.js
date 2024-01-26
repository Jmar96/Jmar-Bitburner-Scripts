/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1) {
        ns.tprint("This script automates the installation of backdoor.");
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} CSEC`);
        return;
    }
    const serv = args._[0];

    const taskName = "early-hack-template.js";
    let threadCountNeeded = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ns.getScriptRam(taskName));

    if (ns.getServerRequiredHackingLevel(serv) < ns.getHackingLevel()) {

        // ns.brutessh(serv);
        if (ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(serv);
            ns.tprint("Done running BruteSSH.exe on " + serv);
        }
        if (ns.fileExists("FTPCrack.exe", "home")) {
            ns.ftpcrack(serv);
            ns.tprint("Done running FTPCrack.exe on " + serv);
        }
        if (ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(serv);
            ns.tprint("Done running relaySMTP.exe on " + serv);
        }
        if (ns.fileExists("HTTPWorm.exe", "home")) {
            ns.httpworm(serv);
            ns.tprint("Done running HTTPWorm.exe on " + serv);
        }
        if (ns.fileExists("SQLInject.exe", "home")) {
            ns.sqlinject(serv);
            ns.tprint("Done running SQLInject.exe on " + serv);
        }
        // ns.nuke(serv);
        if (!ns.hasRootAccess(serv)) {
            ns.nuke(serv);
            ns.tprint("Done running NUKE.exe on " + serv);
        }
        // ns.installBackdoor(serv); //not working

        ns.tprint("Successful! | Threads available: " + threadCountNeeded + " | " + serv);
    } else {
        ns.tprint("Unsuccessful! | Hacking lvl is Low! | Threads available: " + threadCountNeeded + " | " + serv);

    }
}