/** @param {NS} ns */
export async function main(ns) {
    // How much RAM each purchased server will have. In this case, it'll
    const ram = 256;

    //your pruchased server name
    const serverName = "jServer-Batch02-svr"
    // Iterator we'll use for our loop
    let i = 0;
    //script file name
    const taskName = "early-hack-template.js";

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < ns.getPurchasedServerLimit()) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            let hostname = ns.purchaseServer(serverName + i, ram);
            let threadCountNeeded = Math.floor((ns.getServerMaxRam(serverName + i) - ns.getServerUsedRam(serverName + i)) / ns.getScriptRam(taskName));
            ns.scp(taskName, hostname);
            ns.exec(taskName, hostname, threadCountNeeded);
            ++i;
        }
        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(1000);
    }
}