/** @param {NS} ns */
export async function main(ns) {
    // How much RAM each purchased server will have. In this case, it'll
    // be 8GB.
    const ram = 8;
    //your pruchased server name
    const serverName = "jmarServer-Batch01-svr"
    //desired quantity
    let quantity = 10;
  
    for (let i = 0; i < quantity; ++i) {
      // Check if we have enough money to purchase a server
      if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
        // If we have enough money, then:
        //  1. Purchase the server
        //  2. Copy our hacking script onto the newly-purchased server
        //  3. Run our hacking script on the newly-purchased server with 3 threads
        //  4. Increment our iterator to indicate that we've bought a new server
        let hostname = ns.purchaseServer(serverName + i, ram);
        ns.scp("early-hack-template.js", hostname);
        ns.exec("early-hack-template.js", hostname, 3);
      }
      //Make the script wait for a second before looping again.
      //Removing this line will cause an infinite loop and crash the game.
      await ns.sleep(1000);
      ns.tprint("Server Purchased : " + serverName + i);
    }
  }