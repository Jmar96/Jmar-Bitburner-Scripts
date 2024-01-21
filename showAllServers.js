/** @param {NS} ns */
export async function main(ns) {
    let serversSeen = ['home']
    for (let i = 0; i < serversSeen.length; i++) {
        let thisScan = ns.scan(serversSeen[i]);
        for (let j = 0; j < thisScan.length; j++) {
            // ns.tprint(thisScan);
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }
    ns.tprint(serversSeen);
    return serversSeen;
}