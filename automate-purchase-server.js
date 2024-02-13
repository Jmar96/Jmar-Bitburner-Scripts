function getAveTaskNamesThreads(ns, arr_taskNames) {
  let totalTaskNamesThreads = 0;
  let getAve = 0;
  for (let taskName of arr_taskNames) {
    totalTaskNamesThreads = ns.getScriptRam(taskName) + totalTaskNamesThreads;
  }
  getAve = Math.floor(totalTaskNamesThreads / arr_taskNames.length);
  return getAve;
}
/** @param {NS} ns */
export async function main(ns) {
  // How much RAM each purchased server will have. In this case, it'll
  const ram = 8000;

  //your pruchased server name
  const serverName = "Zerver-B01-N"
  // Iterator we'll use for our loop
  let i = 0;
  //script file name
  // const taskName = "early-hack-template.js";
  let taskNames = ["early-hack-template.js", "hackfoodnstuff.js", "hackjoesguns.js"
                    , "hacksigmaCosmetics.js", "hacknectarNet.js", "hackhongFangTea.js"
                    , "hack-max-hardware.js", "hackharakiri-sushi.js", "hack-neo-net.js"
                    , "hack-iron-gym.js", "hack-CSEC.js", "hack-darkweb.js"
                    , "hack-omega-net.js", "hack-crush-fitness.js", "hack-silver-helix.js"
                    , "hack-zer0.js", "hack-millenium-fitness.js", "hack-rothman-uni.js"];
  //compute the thread count per task
  let threadCount = Math.floor(ram / getAveTaskNamesThreads(ns, taskNames));
  let threadCountPerTask = Math.floor(threadCount / taskNames.length);

  // Continuously try to purchase servers until we've reached the maximum
  // amount of servers
  ns.tprint("$" + ns.getPurchasedServerCost(ram) + " [" + ram + "]");
  while (i < ns.getPurchasedServerLimit()) {
    // Check if we have enough money to purchase a server
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      // If we have enough money, then:
      //  1. Purchase the server
      //  2. Copy our hacking script onto the newly-purchased server
      //  3. Run our hacking script on the newly-purchased server with 3 threads
      //  4. Increment our iterator to indicate that we've bought a new server
      let hostname = ns.purchaseServer(serverName + i, ram);
      // ns.scp(taskName, hostname);
      // ns.exec(taskName, hostname, threadCountNeeded);
      for (let taskName of taskNames) {
        ns.scp(taskName, hostname);
        ns.exec(taskName, hostname, threadCountPerTask);
        await ns.sleep(700);
      }
      ++i;
    }
    //Make the script wait for a second before looping again.
    //Removing this line will cause an infinite loop and crash the game.
    await ns.sleep(1000);
  }
}