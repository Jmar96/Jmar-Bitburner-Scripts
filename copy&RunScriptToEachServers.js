/** @param {NS} ns */
export async function main(ns) {
    //create array of servers
    let serversSeen = ['home']
    for (let i = 0; i < serversSeen.length; i++) {
        let thisScan = ns.scan(serversSeen[i]);
        for (let j = 0; j < thisScan.length; j++) {
            // ns.print(thisScan);
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }

    //
    const taskName = 'early-hack-template.js';

    for(let i = 0; i<serversSeen.length; i++){
        if (!ns.fileExists("early-hack-template.js")) {
            const serv = serversSeen[i];
            let taskThreadCount = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ns.getScriptRam(taskName));
            
            ns.scp(taskName,serv);
            ns.brutessh(serv);
            ns.nuke(serv);
            ns.exec(taskName,serv,taskThreadCount);
            
        }
    }


}