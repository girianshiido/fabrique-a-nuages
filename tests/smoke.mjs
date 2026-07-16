import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const definitions = app.split("els.cloud.addEventListener")[0];
const dummy = () => ({
  className:"",textContent:"",innerHTML:"",hidden:false,disabled:false,dataset:{},style:{width:"",setProperty(){}},
  classList:{add(){},remove(){},toggle(){}},setAttribute(){},querySelector(){return dummy()},close(){},showModal(){},animate(){},
});
const storage = new Map();
const context = {
  console,Date,Math,Number,Object,Array,String,RegExp,JSON,Intl,setTimeout,clearTimeout,
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  document:{querySelector:dummy,querySelectorAll:()=>[],body:dummy(),createElement:dummy},
  window:{},innerWidth:1200,innerHeight:800,fetch:async()=>{throw new Error("offline test")}
};

const checks = `
assert.equal(units.length,24,"Le jeu doit contenir 24 automates");
assert.equal(MILESTONES.length,16,"Chaque automate doit avoir 16 paliers");
assert.equal(globalUpgrades.length,20,"Le jeu doit proposer 20 innovations globales");
const ids=units.flatMap(unit=>MILESTONES.map((_,index)=>unitUpgradeId(unit,index)));
assert.equal(new Set(ids).size,384,"Les 384 identifiants de paliers doivent être uniques");
state=initialState();state.owned.fan=10;
assert.equal(baseProduction(),2,"Dix ventilateurs doivent produire 2 gouttes/s avant bonus");
state.upgrades.push(unitUpgradeId(units[0],0),unitUpgradeId(units[0],1),unitUpgradeId(units[0],2));
assert.equal(unitMultiplier(units[0]),8,"Les trois premiers paliers doivent cumuler trois multiplicateurs ×2");
state.runTotal=1e9;state.drops=1e9;state.lifetime=1e9;state.pendingPath="storm";initialized=true;
state.buyMode="max";
assert.equal(canPrestige(),true,"La première Aube doit être disponible à 1 milliard");
prestige();
assert.equal(state.cycles,1,"Le prestige doit accorder exactement une Aube");
assert.equal(state.dawns,1,"Le prestige doit créditer une Aube dépensable");
assert.equal(state.currentPath,"storm","Le cycle doit commencer dans la voie choisie");
assert.equal(state.buyMode,"max","Le mode d’achat doit être conservé après un cycle");
assert.equal(permanentMultiplier(),1.25,"Un cycle doit apporter le bonus de base de 25 %");
buyDawn("first_light");
assert.equal(dawnBalance(),0,"L’Aube achetée doit quitter le solde disponible");
assert.equal(permanentMultiplier(),1.5625,"La Première lueur doit s’ajouter au bonus de cycle");
assert.equal(state.runTotal,0,"Le total de l’ère doit repartir à zéro");
assert.equal(state.owned.fan,0,"Les automates doivent être perdus au prestige");
assert.equal(state.lifetime,1e9,"Le total historique doit être conservé");
state.stats.contractsCompleted=160;
assert.equal(contractTarget(contractTemplates[0]),500,"Les contrats de condensation doivent plafonner à 500 clics");
assert.equal(contractDuration(contractTemplates[0],500),100,"500 clics doivent laisser 100 secondes");
assert.equal(contractDuration(contractTemplates[1],1e30),90,"Les contrats de réserve doivent conserver leur durée normale");
state.stats.contractsCompleted=0;
state.contract={id:"clicks",target:2,progress:0,startedAt:0,expiresAt:Date.now()+60000};
recordContractProgress("clicks",1);recordContractProgress("clicks",1);
assert.equal(state.stats.contractsCompleted,1,"Un contrat doit être validé lorsque sa cible est atteinte");
state.activeEvent={id:"golden",spawnedAt:0,expiresAt:Date.now()+60000,boostUntil:0};
claimEvent();
assert.equal(state.stats.eventsCaptured,1,"Un phénomène rare doit pouvoir être capturé");
assert.equal(state.activeEvent,null,"Un événement instantané doit disparaître après capture");
state.pathUpgrades.push("path_storm_spark");
assert.equal(rainPower(),4,"La voie des orages doit renforcer les averses");
assert.equal(pathTechList().length,8,"Chaque voie doit proposer huit recherches exclusives");
state.drops=1e20;
buyProject("project_storm_coil");
assert.equal(state.relics.storm,1,"Un projet doit créer une relique persistante");
assert.equal(relicMultiplier(),1.1,"Une relique doit renforcer définitivement la production");
state.expedition=[];state.lifetime=100;updateExpedition();
assert.equal(state.expedition[0],"first_drop","L’expédition doit valider ses jalons dans l’ordre");
state.expedition=expeditionChapters.slice(0,7).map(chapter=>chapter.id);state.owned.fan=100;state.activeBoss=null;
startBoss();
assert.equal(state.activeBoss.id,"storm_boss","La première tempête-boss doit pouvoir démarrer");
recordBossAction("clicks",25);
recordBossProgress(state.activeBoss.target);
assert.equal(state.expedition.includes("storm_boss"),true,"Une tempête-boss doit valider son jalon à l’objectif");
state.stats.clicks=100;updateAchievements();
assert.equal(state.unlockedAchievements.includes("clicker"),true,"Les succès doivent être débloqués automatiquement");
state.finalBuilt=true;state.newGamePlus=0;beginNewGamePlus();
assert.equal(state.planet,"mars","La conclusion terrestre doit révéler Mars");
assert.equal(units.length,30,"Mars doit contenir 30 nouveaux automates");
assert.equal(MILESTONES.length,20,"Les automates martiens doivent avoir une progression plus longue");
assert.equal(expeditionChapters.length,15,"La conquête martienne doit proposer quinze jalons");
assert.equal(unitMilestonePower(units[0],11),7777777,"Le 500e premier automate doit provoquer un cap spectaculaire");
assert.equal(unitMilestonePower(units[28],0),1000,"Les automates colossaux doivent commencer par un palier ×1000");
state.owned.dust_scoop=500;state.owned.mars_heart=1;clockOffset=-Date.now()+1000;
assert.equal(marsResonancePhase(),0,"Le test doit placer Mars dans l’Écho des pionniers");
assert.equal(marsResonanceMultiplier(units[0])>marsResonanceMultiplier(units[29]),true,"La résonance doit pouvoir rendre le premier automate dominant");
clockOffset=0;
assert.equal(finalCost(),1e78,"La fin martienne doit être beaucoup plus éloignée");
state.finalBuilt=true;beginNewGamePlus();
assert.equal(state.newGamePlus,1,"Nouvelle Météo+ doit augmenter le niveau permanent");
assert.equal(newGamePlusMultiplier(),1.5,"Nouvelle Météo+ doit accélérer la progression suivante");
`;

vm.runInNewContext(`${definitions}\n${checks}`, {...context,assert});
console.log("✓ Économie, paliers et prestige validés");
