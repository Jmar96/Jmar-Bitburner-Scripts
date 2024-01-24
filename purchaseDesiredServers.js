/** @param {NS} ns */
export async function main(ns) {
  // How much RAM each purchased server will have.
  const ram = 128;
  //your pruchased server name
  const serverName = "jServer-Batch02-svr"
  //desired quantity
  let quantity = 2;
  //server limit
  let pservers = (ns.getPurchasedServers());
  let svrLimit = ns.getPurchasedServerLimit() - pservers.length;
  //msg
  let jmsg = "All Good!";
  //script file name
  const taskName = "early-hack-template.js";
  //calculate needed money
  let totalMoneyNeeded = quantity * ns.getPurchasedServerCost(ram);

  if (quantity > svrLimit) {
    jmsg = "NOTICE! Quantity exceeds the limit [" + svrLimit + "]. Quantity will be change from [" + quantity + "] to [" + svrLimit + "]";
    quantity = svrLimit;
  }

  if (ns.getServerMoneyAvailable("home") > totalMoneyNeeded) {
    ns.tprint(jmsg + ". Proceed to buying servers...");
    for (let i = 0; i < quantity; ++i) {
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
        ns.tprint("---Server Purchased : " + serverName + i + "----");
      } else {
        ns.tprint("---Insuficient Money : " + serverName + i + " (Cost: $" + ns.getPurchasedServerCost(ram) + ")----");
      }
      //Make the script wait for a second before looping again.
      //Removing this line will cause an infinite loop and crash the game.
      await ns.sleep(1000);
    }
    ns.tprint("==========DONE===========");
  } else {
    ns.tprint(jmsg + ". NOTICE! Insuficient Money (Total Cost: $" + totalMoneyNeeded + ")...");
  }

}