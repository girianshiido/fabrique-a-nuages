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
state.runTotal=1e9;state.drops=1e9;state.lifetime=1e9;initialized=true;
assert.equal(canPrestige(),true,"La première Aube doit être disponible à 1 milliard");
prestige();
assert.equal(state.cycles,1,"Le prestige doit accorder exactement une Aube");
assert.equal(permanentMultiplier(),3,"La première Aube doit tripler la production");
assert.equal(state.runTotal,0,"Le total de l’ère doit repartir à zéro");
assert.equal(state.owned.fan,0,"Les automates doivent être perdus au prestige");
assert.equal(state.lifetime,1e9,"Le total historique doit être conservé");
`;

vm.runInNewContext(`${definitions}\n${checks}`, {...context,assert});
console.log("✓ Économie, paliers et prestige validés");
