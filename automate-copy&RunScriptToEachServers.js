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
  function getAveTaskNamesThreads(ns, arr_taskNames) {
    let totalTaskNamesThreads = 0;
    let getAve = 0;
    for (let taskName of arr_taskNames) {
      totalTaskNamesThreads = ns.getScriptRam(taskName) + totalTaskNamesThreads;
    }
    getAve = Math.floor(totalTaskNamesThreads / arr_taskNames.length);
    return getAve;
  }
  function countPortsOpened(ns, serv) {
    let portOpened = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
      ns.brutessh(serv);
      portOpened = portOpened + 1;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
      ns.ftpcrack(serv);
      portOpened = portOpened + 1;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
      ns.relaysmtp(serv);
      portOpened = portOpened + 1;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
      ns.httpworm(serv);
      portOpened = portOpened + 1;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
      ns.sqlinject(serv);
      portOpened = portOpened + 1;
    }
    return portOpened;
  }
  
  export async function main(ns) {
    //copy and run script to each available server
    let availableServers = dpList(ns);
    /*const taskName = "early-hack-template.js";
    const taskName02 = "hackfoodnstuff.js";
    const taskName03 = "hackjoesguns.js";
    const taskName04 = "hacksigmaCosmetics.js";
    const taskName05 = "weaken.js";*/
    let taskNames = ["early-hack-template.js", "hackfoodnstuff.js", "hackjoesguns.js", "hacksigmaCosmetics.js", "hacknectarNet.js", "hackhongFangTea.js", "hack-max-hardware.js", "hackharakiri-sushi.js", "hack-neo-net.js", "hack-iron-gym.js"];
    let firstTaskName = taskNames[0];
    // var resultMsg = "Undefined!";
    while (true) {
      for (let i = 0; i < availableServers.length; ++i) {
        const serv = availableServers[i];
        let portsRequired = ns.getServerNumPortsRequired(serv);
        let p = 0;
        // let threadCountNeeded = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ns.getScriptRam(taskName));
        let threadCount = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / getAveTaskNamesThreads(ns, taskNames));
        let threadCountPerTask = Math.floor(threadCount / taskNames.length);
  
        if (ns.getServerRequiredHackingLevel(serv) < ns.getHackingLevel()) {
          if (threadCountPerTask > 0) {
            // ns.print("Server: " + serv + ", threadCount: "+threadCount+", threadCountPerTask: "+threadCountPerTask);
            for (let taskName of taskNames) {
              p = countPortsOpened(ns, serv);
              // if number of port mets then nuke and copy/run scripts
              if (p >= portsRequired) {
                //if doesn't have rootaccess then nuke
                if (!ns.hasRootAccess(serv)) {
                  await ns.nuke(serv);
                }
                //if script not exist then copy and run
                if (!ns.fileExists(taskName, serv)) {
                  ns.print("INFO::NotExist (will copy and run the script[" + taskName + "]) | Threads available: " + threadCount + ", Threads used: " + threadCountPerTask + " | " + serv);
                  await ns.scp(taskName, serv);
                  await ns.exec(taskName, serv, threadCountPerTask);
                } else {
                  ns.print("WARN::Script Exist (wont create) | Threads available: " + threadCount + " | " + serv);
                }
              } else {
                ns.print("ERROR::Ports opened [" + p + "] vs Ports required [" + portsRequired + "])| (wont create) | Threads available: " + threadCount + " | " + serv);
              }
              await ns.sleep(700);
            }
          } else if (threadCount > 0) {
            if (p >= portsRequired) {
              //if doesn't have rootaccess then nuke
              if (!ns.hasRootAccess(serv)) {
                await ns.nuke(serv);
              }
              //if script not exist then copy and run
              if (!ns.fileExists(firstTaskName, serv)) {
                ns.print("INFO::NotExist (will copy and run the script[" + firstTaskName + "]) | Threads available: " + threadCount + ", Threads used: " + threadCount + " | " + serv);
                await ns.scp(firstTaskName, serv);
                await ns.exec(firstTaskName, serv, threadCount);
              } else {
                ns.print("WARN::Script Exist (wont create) | Threads available: " + threadCount + " | " + serv);
              }
            } else {
              ns.print("ERROR::Ports opened [" + p + "] vs Ports required [" + portsRequired + "])| (Wont create) | Threads available: " + threadCount + " | " + serv);
            }
          } else {
            ns.print("ERROR::[O]Threads available | Threads available: " + threadCount + " | " + serv);
          }
        } else {
          ns.print("WARN::Required hacking level not met.");
        }
        await ns.sleep(700);
      }
      await ns.sleep(10000);
    }
  }