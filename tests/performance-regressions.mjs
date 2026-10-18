import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8").split("els.cloud.addEventListener")[0];
const dummy=()=>({textContent:"",innerHTML:"",hidden:false,disabled:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},querySelector:()=>dummy(),showModal(){},close(){},animate(){}});
const storage=new Map();
const context={assert,console,Date,Math,Intl,JSON,document:{hidden:false,querySelector:dummy,querySelectorAll:()=>[],createElement:dummy,body:dummy()},window:{},innerWidth:1200,innerHeight:800,setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}};
vm.runInNewContext(source+`
function referenceUnit(unit){
  let value=MILESTONES.reduce((mult,_,i)=>state.upgrades.includes(unitUpgradeId(unit,i))?mult*unitMilestonePower(unit,i):mult,1);
  if(isPioneer(unit))for(let cap=500;cap<=state.owned[unit.id];cap+=500)if(state.upgrades.includes(pioneerSuperUpgradeId(unit,cap)))value*=PIONEER_SUPER_POWER;
  return value;
}
function referenceProduction(resonance=true){
  const raw=unit=>(state.owned[unit.id]||0)*unit.production*referenceUnit(unit);
  return units.reduce((sum,unit)=>{
    let multiplier=1;
    if(isMars()&&resonance){
      const phase=marsResonancePhase(),selected=item=>phase===0?item.index<5:phase===1?item.index>=5&&item.index<15:item.index>=15;
      if(selected(unit)&&raw(unit)>0){const strongest=units.reduce((n,item)=>Math.max(n,raw(item)),0),active=units.filter(item=>selected(item)&&raw(item)>0).length;multiplier=1+strongest*1.6/(Math.sqrt(active)*raw(unit));}
    }
    return sum+raw(unit)*multiplier;
  },0)*allMultiplier()*permanentMultiplier()*contractMultiplier();
}
function closeEnough(actual,expected,label){assert.ok(actual===expected||Math.abs(actual-expected)<=Math.abs(expected)*1e-12,label+': '+actual+' / '+expected)}
let seed=1729;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
for(const planet of ["earth","mars","venus"]){
  for(let sample=0;sample<10;sample++){
    configurePlanet(planet);state=initialState(planet);state.currentPath=["storm","engineer","chrono"][sample%3];state.cycles=sample;state.stats.contractsCompleted=sample*3;
    state.upgrades=globalUpgrades.filter(()=>random()>.5).map(item=>item.id);state.pathUpgrades=pathTechList().filter(()=>random()>.5).map(item=>item.id);state.projects=pathProjectList().filter(()=>random()>.5).map(item=>item.id);
    for(const unit of units){state.owned[unit.id]=[0,1,5,75,500,750,1500,2500][Math.floor(random()*8)];MILESTONES.forEach((_,index)=>{if(random()>.5)state.upgrades.push(unitUpgradeId(unit,index))});if(isPioneer(unit))for(let cap=500;cap<=state.owned[unit.id];cap+=500)if(random()>.5)state.upgrades.push(pioneerSuperUpgradeId(unit,cap));}
    for(let phase=0;phase<3;phase++){
      clockOffset=phase*120000+1000-Date.now();
      const expected=referenceProduction(),stable=referenceProduction(false);
      closeEnough(baseProduction(),expected,planet+' production phase '+phase);closeEnough(stableProduction(),stable,planet+' stable');
      withEconomyFrame(()=>{closeEnough(baseProduction(),expected,planet+' cached');closeEnough(stableProduction(),stable,planet+' stable cached');for(const unit of units)assert.equal(unitMultiplier(unit),referenceUnit(unit));});
    }
    state.upgrades.push(unitUpgradeId(units[0],0));closeEnough(baseProduction(),referenceProduction(),planet+' after mutation');
  }
}
clockOffset=0;
for(const planet of ["earth","mars","venus"]){
  for(const budget of [100,1e12,1e50,1e130]){
    configurePlanet(planet);state=initialState(planet);state.cycles=3;state.dawns=3;state.sound=false;state.runTotal=budget;state.drops=budget;for(const unit of units)state.owned[unit.id]=planet==='venus'?2000:750;
    const original=JSON.parse(JSON.stringify(state));
    for(let i=0;i<2000;i++){const upgrade=availableUpgrades().find(item=>state.drops>=item.cost);if(!upgrade)break;state.drops-=upgrade.cost;state.upgrades.push(upgrade.id);state.stats.upgradesBought++;}
    const expected={upgrades:state.upgrades,drops:state.drops,bought:state.stats.upgradesBought};
    state=original;initialized=true;buyAllAvailableUpgrades();
    assert.equal(JSON.stringify(state.upgrades),JSON.stringify(expected.upgrades),planet+' bulk purchase order, budget '+budget);assert.equal(state.drops,expected.drops,planet+' bulk budget');assert.equal(state.stats.upgradesBought,expected.bought);
  }
}
configurePlanet('venus');state=initialState('venus');state.owned.acid_scoop=100;state.venusUnitsBuilt=100000;state.venusAlchemyLevel=3;state.venusAlchemySeconds=75;state.sound=false;state.venusOverdrive=true;state.venusCorrosion=80;state.rainUntil=now()+100000;state.activeEvent={id:'supercell',boostUntil:now()+100000,expiresAt:now()+100000};state.nextEventAt=now()+1e9;state.nextContractAt=now()+1e9;state.expedition=venusExpeditionChapters.map(item=>item.id);
const rate=baseProduction()*offlineMultiplier();initialized=true;document.hidden=true;pauseGame();const pausedAt=backgroundStartedAt,initialDrops=state.drops;
clockOffset+=300000;tickGame();save();assert.equal(state.drops,initialDrops,'No simulation while hidden');assert.equal(state.savedAt,pausedAt,'Do not lose hidden time when saving');resumeGame();assert.equal(backgroundStartedAt,pausedAt,'A hidden page must stay paused');
document.hidden=false;resumeGame();closeEnough(state.drops,initialDrops+rate*(state.lastTick-pausedAt)/1000,'Offline production without temporary multipliers');assert.equal(state.venusAlchemySeconds,75,'No active-play distillation while hidden');assert.equal(state.venusAlchemyLevel,3);assert.equal(state.venusOverdrive,false);assert.equal(state.venusCorrosion,0);assert.equal(backgroundStartedAt,null);
const restoredDrops=state.drops;resumeGame();assert.equal(state.drops,restoredDrops,'Resume must be idempotent');
state.buyMode='max';save();state=load();assert.equal(state.buyMode,'max');assert.equal(state.venusAlchemySeconds,75);assert.equal(state.venusAlchemyLevel,3);
console.log('✓ Reference economy, bulk purchase order, cache freshness and background recovery validated');
`,context,{timeout:30000});
