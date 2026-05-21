/** @param {NS} ns */
export async function main(ns) {
  ///////////////////////
  // Stats Start
  ///////////////////////
  if (ns.scriptRunning("init/playerstats.js", 'home')){
    ns.scriptKill("init/playerstats.js", 'home')
  }
  ns.run("init/playerstats.js")  
  ///////////////////////
  // Program Purchases
  ///////////////////////
  if (ns.scriptRunning("init/buyprograms.js", 'home')){
    ns.scriptKill("init/buyprograms.js", 'home')
  }
  ns.run("init/buyprograms.js")
  ///////////////////////
  // Gang Start
  ///////////////////////
  if (ns.fileExists('Formulas.exe', 'home')){
    if (ns.scriptRunning("init/gangs_advanced.js", 'home')){
      ns.scriptKill("init/gangs_advanced.js", 'home')
    }
    ns.run("init/gangs_advanced.js")
  }
  else{
    if (ns.scriptRunning("init/gangs.js", 'home')){
      ns.scriptKill("init/gangs.js", 'home')
    }
    ns.run("init/gangs.js")
  }
  ///////////////////////
  // Hack Start ( run last to use ALL the remaining RAM! )
  ///////////////////////
  if (ns.scriptRunning("init/serverhack.js", 'home')){
    ns.scriptKill("init/serverhack.js", 'home')
  }
  ns.run("init/serverhack.js")
  //////////
  while (ns.scriptRunning("init/playerstats.js", 'home')){
    ns.print(`waiting on playstats to finish before running homicide.js`)
    await ns.sleep(5000)
  }
  ////////////////////////////
  if (ns.scriptRunning("init/homicide.js", 'home')){
    ns.scriptKill("init/homicide.js", 'home')
  }
  ns.run("init/homicide.js")
}