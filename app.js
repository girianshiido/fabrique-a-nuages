"use strict";

const SAVE_KEY = "fabrique-nuages-save-v2";
const LEGACY_SAVE_KEY = "fabrique-nuages-save-v1";
const TIME_API = "https://gettimeapi.dev/v1/time?timezone=UTC";
const COST_GROWTH = 1.15;
const MILESTONES = [1,5,10,25,50,75,100,150,200,300,400,500,750,1000,1500,2500];
const MILESTONE_NAMES = ["Premier souffle","Équipe complète","Rythme de croisière","Quart de cent","Essaim coordonné","Haute cadence","Cap du cent","Mécanique céleste","Double centaine","Production orbitale","Climat industriel","Grand cycle","Maîtrise des flux","Cap du millier","Horizon absolu","Transcendance"];

const units = [
  ["fan","Ventilateur","🌀",15,.2,"Pousse les premiers cumulus"],
  ["kite","Cerf-volant","🪁",90,1.2,"Capture les filaments d’humidité"],
  ["balloon","Ballon-sonde","🎈",650,8,"Condense les courants froids"],
  ["tower","Tour d’orage","⚡",4200,42,"Domestique les averses électriques"],
  ["greenhouse","Serre à brume","🌱",3.2e4,260,"Fait pousser des nappes de brouillard"],
  ["lighthouse","Phare à halos","🔆",2.8e5,1800,"Tisse la lumière dans la vapeur"],
  ["zeppelin","Zeppelin-citerne","🎐",2.6e6,1.25e4,"Récolte des océans suspendus"],
  ["glacier","Glacier portatif","🧊",2.7e7,9e4,"Refroidit des vallées entières"],
  ["monsoon","Moulin de mousson","🌊",3.1e8,7e5,"Fait tourner les saisons humides"],
  ["stormforge","Forge-foudre","🔨",4e9,6e6,"Martèle des éclairs liquides"],
  ["satellite","Satellite pluviomètre","🛰️",6e10,5.2e7,"Cartographie chaque goutte du globe"],
  ["jetstream","Accélérateur de jet-stream","✈️",1e12,4.8e8,"Plie les rivières du ciel"],
  ["cyclone","Réacteur cyclonique","🌀",1.9e13,4.7e9,"Compacte les tempêtes en énergie"],
  ["aurora","Collecteur d’aurores","🌌",4e14,5e10,"Distille le vent solaire"],
  ["moonwell","Puits lunaire","🌙",9e15,5.8e11,"Pompe les marées atmosphériques"],
  ["cloudcity","Cité-nuage","🏙️",2.2e17,7e12,"Une métropole dédiée à la pluie"],
  ["planet","Terraformeur planétaire","🌍",6e18,9e13,"Réécrit le climat d’un monde"],
  ["comet","Comète irrigatrice","☄️",1.8e20,1.2e15,"Sème de la glace entre les planètes"],
  ["star","Condenseur stellaire","☀️",6e21,1.8e16,"Essore la couronne des étoiles"],
  ["nebula","Nébuleuse-usine","🌈",2.2e23,2.8e17,"Assemble des nuages interstellaires"],
  ["pulsar","Pulsar hydraulique","💫",9e24,4.8e18,"Pulse des déluges relativistes"],
  ["galaxy","Spirale galactique","🌀",4e26,9e19,"Fait tourner des milliards de climats"],
  ["singularity","Singularité humide","🕳️",2e28,1.8e21,"Condense au-delà des lois physiques"],
  ["multiverse","Météore du multivers","♾️",1.2e30,4e22,"Fait pleuvoir sur toutes les réalités"]
].map(([id,name,icon,baseCost,production,description],index)=>({id,name,icon,baseCost,production,description,index}));

const globalUpgrades = [
  ["soft_gloves","Gants en vapeur","🧤",80,30,"click",2,"Condensation manuelle ×2"],
  ["silver_cloud","Doublure argentée","☁️",700,250,"all",1.5,"Toute la production ×1,5"],
  ["barometer","Baromètre sensible","🌡️",4500,1800,"pressure",-4,"L’averse se déclenche 4 clics plus tôt"],
  ["warm_current","Courant ascendant","♨️",2e4,8000,"click",3,"Condensation manuelle ×3"],
  ["night_shift","Équipe de nuit","🌙",1.2e5,5e4,"offline",2,"Gains hors ligne ×2"],
  ["rain_dance","Danse de la pluie","💃",8e5,3e5,"rainPower",1,"Bonus d’averse augmenté de +1"],
  ["precision","Engrenages précis","⚙️",5e6,2e6,"cost",.93,"Prix des automates −7 %"],
  ["forecast","Prévision parfaite","📡",4e7,1.5e7,"all",2,"Toute la production ×2"],
  ["storm_bottle","Orage en bouteille","🧪",3e8,1e8,"rainDuration",15,"Les averses durent 15 s de plus"],
  ["static_fingers","Doigts électrostatiques","👆",2e9,8e8,"clickPps",.05,"Chaque clic ajoute 5 % de la production/s"],
  ["time_capsule","Capsule temporelle","⌛",2e10,7e9,"offlineHours",12,"Jusqu’à 24 h de gains hors ligne"],
  ["cloud_union","Union des nuages","🤝",3e11,1e11,"all",3,"Toute la production ×3"],
  ["quantum_drop","Goutte quantique","💧",5e12,2e12,"click",10,"Condensation manuelle ×10"],
  ["eternal_rain","Pluie persistante","🌧️",9e13,3e13,"rainDuration",30,"Les averses durent 30 s de plus"],
  ["cheap_matter","Matière légère","🪶",2e15,8e14,"cost",.9,"Prix des automates −10 %"],
  ["weather_ai","Oracle climatique","🔮",6e16,2e16,"all",5,"Toute la production ×5"],
  ["pressure_zero","Œil du cyclone","👁️",2e18,7e17,"pressure",-4,"L’averse se déclenche 4 clics plus tôt"],
  ["golden_rain","Pluie dorée","✨",8e19,3e19,"rainPower",2,"Bonus d’averse augmenté de +2"],
  ["cosmic_shift","Relève cosmique","🌠",4e22,1e22,"offline",5,"Gains hors ligne ×5"],
  ["infinite_sky","Ciel sans bord","♾️",1e27,3e26,"all",10,"Toute la production ×10"]
].map(([id,name,icon,cost,unlock,type,value,description])=>({id,name,icon,cost,unlock,type,value,description}));

const initialOwned = () => Object.fromEntries(units.map(u=>[u.id,0]));
const initialState = () => ({
  drops:0,runTotal:0,lifetime:0,pressure:0,rainUntil:0,owned:initialOwned(),upgrades:[],cycles:0,
  buyMode:"1",sound:true,startedAt:Date.now(),runStartedAt:Date.now(),lastTick:Date.now(),savedAt:Date.now(),
  stats:{clicks:0,unitsBought:0,upgradesBought:0,bestPps:0,offlineEarned:0}
});

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let state = load();
let clockOffset = 0;
let initialized = false;
let lastFullRender = 0;
let lastUnlockedCount = 0;
const els = {
  drops:$("#dropCount"),perSecond:$("#perSecond"),perClick:$("#perClick"),run:$("#runDrops"),lifetime:$("#lifetimeDrops"),time:$("#playTime"),
  totalUnits:$("#totalUnits"),dawns:$("#dawnCount"),cycles:$("#cycleCount"),boost:$("#permanentBoost"),cloud:$("#cloudButton"),
  pressure:$("#pressureFill"),pressureLabel:$("#pressureLabel"),pressureBar:$(".pressure-bar"),pressureHint:$("#pressureHint"),weather:$(".weather-label"),
  weatherText:$("#weatherText"),weatherTimer:$("#weatherTimer"),rainLayer:$("#rainLayer"),units:$("#unitList"),upgrades:$("#upgradeList"),
  lockedUpgrades:$("#lockedUpgradeList"),upgradeCount:$("#upgradeCount"),upgradeBadge:$("#upgradeBadge"),unlockedBadge:$("#unlockedUnitsBadge"),
  records:$("#recordGrid"),eraTrack:$("#eraTrack"),eraLabel:$("#eraLabel"),toast:$("#toast"),achievement:$("#achievement"),sound:$("#soundButton"),
  help:$("#helpDialog"),prestige:$("#prestigeDialog"),prestigeButton:$("#prestigeButton"),prestigeTitle:$("#prestigeTitle"),prestigeProgress:$("#prestigeProgress"),
  prestigeDescription:$("#prestigeDescription"),prestigeReward:$("#prestigeReward"),nextCycleInfo:$("#nextCycleInfo"),timeStatus:$("#timeStatus")
};

function load(){
  try{
    const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem(LEGACY_SAVE_KEY));
    if(!saved)return initialState();
    const fresh=initialState(),legacyMap={gloves:"soft_gloves",blades:"unit_fan_0",forecast:"silver_cloud",thunder:"storm_bottle"};
    const legacyTotal=Number(saved.total)||0;
    const migratedUpgrades=[...new Set((saved.upgrades||[]).map(id=>legacyMap[id]||id).filter(id=>globalUpgrades.some(u=>u.id===id)||/^unit_[a-z]+_\d+$/.test(id)))];
    return {...fresh,...saved,runTotal:saved.runTotal??legacyTotal,lifetime:saved.lifetime??legacyTotal,owned:{...fresh.owned,...saved.owned},upgrades:migratedUpgrades,stats:{...fresh.stats,...saved.stats},cycles:Number(saved.cycles)||0};
  }catch{return initialState()}
}
function now(){return Date.now()+clockOffset}
function save(){if(!initialized)return;state.savedAt=now();localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
async function synchronizeAndRestore(){
  let networkNow=Date.now(),source="local";
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3500),started=Date.now();
  try{
    const response=await fetch(TIME_API,{cache:"no-store",signal:controller.signal});
    if(!response.ok)throw new Error("time unavailable");
    const data=await response.json(),ended=Date.now();networkNow=Number(data.timestamp)*1000+(ended-started)/2;
    if(!Number.isFinite(networkNow))throw new Error("invalid time");clockOffset=networkNow-ended;source="online";
  }catch{clockOffset=0;networkNow=Date.now()}finally{clearTimeout(timeout)}
  const elapsed=Math.min(offlineHours()*3600,Math.max(0,(networkNow-(state.savedAt||networkNow))/1000));
  const earned=baseProduction()*offlineMultiplier()*elapsed;
  addDrops(earned);state.stats.offlineEarned+=earned;state.lastTick=networkNow;initialized=true;
  els.timeStatus.className=`time-status ${source}`;els.timeStatus.querySelector("span").textContent=source==="online"?"Heure réseau":"Heure locale";
  els.timeStatus.title=source==="online"?"Production hors ligne vérifiée en UTC":"Réseau indisponible : heure de l’appareil utilisée";
  if(earned>=1)toast(`Retour à la fabrique : +${format(earned)} gouttes en ${formatTime(elapsed)}.`);
  render(true);save();
}

function hasUpgrade(id,s=state){return s.upgrades.includes(id)}
function globalEffect(type,base,combine=(a,b)=>a*b){return globalUpgrades.filter(u=>u.type===type&&hasUpgrade(u.id)).reduce((value,u)=>combine(value,u.value),base)}
function permanentMultiplier(){return Math.pow(3,state.cycles)}
function allMultiplier(){return globalEffect("all",1)}
function clickMultiplier(){return globalEffect("click",1)}
function offlineMultiplier(){return globalEffect("offline",1)}
function offlineHours(){return 12+globalEffect("offlineHours",0,(a,b)=>a+b)}
function costMultiplier(){return globalEffect("cost",1)}
function pressureMax(){return Math.max(8,20+globalEffect("pressure",0,(a,b)=>a+b))}
function rainDuration(){return 15+globalEffect("rainDuration",0,(a,b)=>a+b)}
function rainPower(){return 2+globalEffect("rainPower",0,(a,b)=>a+b)}
function isRaining(){return state.rainUntil>now()}
function rainMultiplier(){return isRaining()?rainPower():1}
function unitUpgradeId(unit,index){return `unit_${unit.id}_${index}`}
function unitMultiplier(unit,s=state){
  return MILESTONES.reduce((mult,_,index)=>s.upgrades.includes(unitUpgradeId(unit,index))?mult*(index>=12?3:2):mult,1);
}
function baseProduction(s=state){
  const production=units.reduce((sum,u)=>sum+(s.owned[u.id]||0)*u.production*unitMultiplier(u,s),0);
  return production*allMultiplier()*permanentMultiplier();
}
function production(){return baseProduction()*rainMultiplier()}
function clickValue(){
  const ppsBonus=globalEffect("clickPps",0,(a,b)=>a+b)*baseProduction();
  return (1*clickMultiplier()*permanentMultiplier()+ppsBonus)*rainMultiplier();
}
function addDrops(amount){if(!Number.isFinite(amount)||amount<=0)return;state.drops+=amount;state.runTotal+=amount;state.lifetime+=amount}

function unitCost(unit,count=1,owned=state.owned[unit.id]){
  const first=unit.baseCost*Math.pow(COST_GROWTH,owned)*costMultiplier();
  const total=first*(Math.pow(COST_GROWTH,count)-1)/(COST_GROWTH-1);
  return Math.ceil(total);
}
function maxAffordable(unit){
  const first=unit.baseCost*Math.pow(COST_GROWTH,state.owned[unit.id])*costMultiplier();
  if(state.drops<first)return{count:0,cost:0};
  const count=Math.min(100000,Math.floor(Math.log(1+state.drops*(COST_GROWTH-1)/first)/Math.log(COST_GROWTH)));
  return{count,cost:unitCost(unit,count)};
}
function purchaseQuote(unit){if(state.buyMode==="max")return maxAffordable(unit);const count=Number(state.buyMode);return{count,cost:unitCost(unit,count)}}
function buyUnit(id,event){
  if(!initialized)return;const unit=units.find(u=>u.id===id),quote=purchaseQuote(unit);
  if(!quote.count||state.drops<quote.cost)return;const before=state.owned[id];state.drops-=quote.cost;state.owned[id]+=quote.count;state.stats.unitsBought+=quote.count;
  checkCrossedMilestones(unit,before,state.owned[id]);playTone(275+unit.index*9,.055);burst(event);render(true);save();
}
function milestoneUpgrade(unit,index){
  const milestone=MILESTONES[index],power=index>=12?3:2;
  return{id:unitUpgradeId(unit,index),unit,index,icon:unit.icon,name:`${unit.name} — ${MILESTONE_NAMES[index]}`,description:`Production de ${unit.name} ×${power}`,cost:Math.ceil(unit.baseCost*(milestone+2)*Math.pow(1.9,index+1)),condition:`Posséder ${format(milestone)} ${unit.name.toLowerCase()}${milestone>1?"s":""}`,unlocked:state.owned[unit.id]>=milestone,color:index>=12?"#eee4ff":"#e4f5ff"};
}
function nextUnitUpgrade(unit){for(let i=0;i<MILESTONES.length;i++)if(!hasUpgrade(unitUpgradeId(unit,i)))return milestoneUpgrade(unit,i);return null}
function availableUpgrades(){
  const unitOnes=units.map(nextUnitUpgrade).filter(u=>u&&u.unlocked);
  const globals=globalUpgrades.filter(u=>!hasUpgrade(u.id)&&state.runTotal>=u.unlock).map(u=>({...u,condition:`Produire ${format(u.unlock)} gouttes dans cette ère`,unlocked:true,color:"#fff0ca"}));
  return [...unitOnes,...globals].sort((a,b)=>a.cost-b.cost);
}
function lockedUpgradeHints(){
  const unitHints=units.map(nextUnitUpgrade).filter(u=>u&&!u.unlocked);
  const globalHints=globalUpgrades.filter(u=>!hasUpgrade(u.id)&&state.runTotal<u.unlock).map(u=>({...u,condition:`À ${format(u.unlock)} gouttes`}));
  return [...unitHints,...globalHints].sort((a,b)=>(a.unit?MILESTONES[a.index]:a.unlock)-(b.unit?MILESTONES[b.index]:b.unlock)).slice(0,6);
}
function buyUpgrade(id,event){
  if(!initialized||hasUpgrade(id))return;
  let upgrade=globalUpgrades.find(u=>u.id===id);
  if(!upgrade){const match=id.match(/^unit_(.+)_(\d+)$/),unit=match&&units.find(u=>u.id===match[1]);if(unit)upgrade=milestoneUpgrade(unit,Number(match[2]))}
  if(!upgrade||state.drops<upgrade.cost)return;
  const unlocked=upgrade.unit?upgrade.unlocked:state.runTotal>=upgrade.unlock;if(!unlocked)return;
  state.drops-=upgrade.cost;state.upgrades.push(id);state.stats.upgradesBought++;playTone(520,.13);burst(event,true);toast(`${upgrade.name} installée !`);render(true);save();
}
function checkCrossedMilestones(unit,before,after){MILESTONES.forEach(m=>{if(before<m&&after>=m)achievement(`${unit.name} : cap des ${format(m)}`)})}

function pressCloud(event){
  if(!initialized)return;const gain=clickValue();addDrops(gain);state.stats.clicks++;
  if(!isRaining()){
    state.pressure++;
    if(state.pressure>=pressureMax()){state.pressure=0;state.rainUntil=now()+rainDuration()*1000;toast(`Averse déclenchée : production ×${rainPower()} !`);playTone(650,.2);rainSplash()}
  }
  els.cloud.classList.add("pressed");setTimeout(()=>els.cloud.classList.remove("pressed"),90);floatNumber(event.clientX||innerWidth/2,event.clientY||innerHeight/2,`+${format(gain)}`);playTone(185+state.pressure*7,.025);render();
}

function prestigeRequirement(cycles=state.cycles){return 1e9*Math.pow(1000,cycles)}
function canPrestige(){return state.runTotal>=prestigeRequirement()}
function openPrestige(){
  const requirement=prestigeRequirement(),ready=canPrestige();
  els.prestigeDescription.textContent=ready?`Cette ère a produit ${format(state.runTotal)} gouttes. Une nouvelle Aube rendra définitivement toute ta production trois fois plus puissante.`:`Il faut produire ${format(requirement)} gouttes dans cette ère avant de pouvoir recommencer.`;
  els.prestigeReward.textContent=ready?`+1 Aube · bonus ×${format(Math.pow(3,state.cycles+1))}`:"Aube non disponible";
  els.nextCycleInfo.textContent=`Après ce redémarrage : ${state.cycles+1} Aube${state.cycles+1>1?"s":""}, objectif suivant ${format(prestigeRequirement(state.cycles+1))}.`;
  $("#confirmPrestige").disabled=!ready;els.prestige.showModal();
}
function prestige(){
  if(!canPrestige())return;const kept={cycles:state.cycles+1,lifetime:state.lifetime,startedAt:state.startedAt,sound:state.sound,stats:state.stats};
  state={...initialState(),...kept};initialized=true;els.prestige.close();achievement(`Aube ${state.cycles} — production permanente ×${format(permanentMultiplier())}`);render(true);save();
}

function isUnitUnlocked(unit){return unit.index<4||state.runTotal>=unit.baseCost*.18||(unit.index>0&&state.owned[units[unit.index-1].id]>0)}
function nextMilestone(unit){const owned=state.owned[unit.id];return MILESTONES.find(m=>m>owned)||null}
function render(force=false){
  const raining=isRaining(),pps=production(),pMax=pressureMax();
  els.drops.textContent=format(state.drops);els.perSecond.textContent=format(pps);els.perClick.textContent=format(clickValue());els.run.textContent=format(state.runTotal);els.lifetime.textContent=format(state.lifetime);
  els.time.textContent=formatTime((Date.now()-state.startedAt)/1000);els.totalUnits.textContent=format(Object.values(state.owned).reduce((a,b)=>a+b,0));els.dawns.textContent=state.cycles;els.cycles.textContent=state.cycles;els.boost.textContent=`×${format(permanentMultiplier())}`;
  els.pressure.style.width=`${state.pressure/pMax*100}%`;els.pressureLabel.textContent=`${state.pressure} / ${pMax}`;els.pressureBar.setAttribute("aria-valuemax",pMax);els.pressureBar.setAttribute("aria-valuenow",state.pressure);els.pressureHint.textContent=`À ${pMax} : averse ×${rainPower()} pendant ${rainDuration()} secondes`;
  els.weather.classList.toggle("rain",raining);els.cloud.classList.toggle("rain",raining);els.rainLayer.classList.toggle("active",raining);els.weatherText.textContent=raining?`Averse ×${rainPower()}`:"Ciel calme";els.weatherTimer.textContent=raining?`${Math.max(0,(state.rainUntil-now())/1000).toFixed(1)} s`:"";
  state.stats.bestPps=Math.max(state.stats.bestPps,pps);renderPrestigeTeaser();renderSky();
  if(force||Date.now()-lastFullRender>650){lastFullRender=Date.now();renderUnits();renderUpgrades();renderRecords()}
}
function renderPrestigeTeaser(){
  const req=prestigeRequirement(),ready=canPrestige(),percent=Math.min(100,state.runTotal/req*100);
  els.prestigeButton.disabled=!ready;els.prestigeTitle.textContent=ready?"Une Aube t’attend":"Encore inaccessible";els.prestigeProgress.textContent=ready?`Redémarrer avec un bonus ×${format(Math.pow(3,state.cycles+1))}`:`${format(state.runTotal)} / ${format(req)} · ${percent.toFixed(percent<1?2:0)} %`;
}
function renderSky(){const highest=units.reduce((max,u)=>state.owned[u.id]>0?Math.max(max,u.index):max,0),stage=Math.min(5,Math.floor(highest/4));document.body.dataset.sky=stage}
function renderUnits(){
  const unlocked=units.filter(isUnitUnlocked),locked=units.find(u=>!isUnitUnlocked(u));
  els.unlockedBadge.textContent=`${unlocked.length} / ${units.length}`;
  const cards=unlocked.map(u=>{
    const quote=purchaseQuote(u),owned=state.owned[u.id],next=nextMilestone(u),previous=[0,...MILESTONES].filter(m=>m<=owned).pop()||0,progress=next?Math.min(100,(owned-previous)/(next-previous)*100):100,affordable=quote.count&&state.drops>=quote.cost;
    return `<button class="unit-card ${affordable?"affordable":""}" type="button" data-unit="${u.id}" ${!affordable?"disabled":""}><span class="unit-icon">${u.icon}</span><span class="unit-info"><span class="unit-title"><strong>${u.name}</strong><em>×${format(owned)}</em></span><small>${u.description} · ${format(u.production*unitMultiplier(u)*allMultiplier()*permanentMultiplier())}/s chacun</small><span class="unit-progress"><i style="--progress:${progress}%"></i><small>${next?`prochain cap ${format(next)}`:"tous les caps franchis"}</small></span></span><span class="unit-buy"><b class="unit-price">${quote.count?format(quote.cost):"∞"} ◆</b><small>${quote.count?`Acheter ×${format(quote.count)}`:"Limite atteinte"}</small></span></button>`;
  });
  if(locked)cards.push(`<div class="locked-unit"><span class="unit-icon">${locked.icon}</span><span><strong>Prochain automate : ${locked.name}</strong><small>Se révèle à ${format(locked.baseCost*.18)} gouttes ou avec ${units[locked.index-1].name}</small></span></div>`);
  if(unlocked.length<units.length-1)cards.push(`<p class="more-units">+ ${units.length-unlocked.length-1} technologies encore inconnues</p>`);
  if(unlocked.length>lastUnlockedCount&&lastUnlockedCount>0)achievement(`${unlocked[unlocked.length-1].name} découvert`);lastUnlockedCount=unlocked.length;els.units.innerHTML=cards.join("");
}
function renderUpgrades(){
  const available=availableUpgrades(),visible=available.slice(0,12);els.upgradeBadge.textContent=available.length;els.upgradeCount.textContent=state.upgrades.length;
  els.upgrades.innerHTML=visible.length?visible.map(u=>`<button class="upgrade-card" type="button" data-upgrade="${u.id}" ${state.drops<u.cost?"disabled":""} style="--upgrade-color:${u.color||"#fff0ca"}"><span class="upgrade-top"><span class="upgrade-icon">${u.icon||u.unit.icon}</span><strong>${u.name}</strong></span><p>${u.description}</p><span class="upgrade-bottom"><small>${u.condition}</small><b>${format(u.cost)} ◆</b></span></button>`).join(""):`<div class="empty-upgrades">Aucune recherche disponible pour le moment.<br>Achète des automates et franchis de nouveaux caps.</div>`;
  els.lockedUpgrades.innerHTML=lockedUpgradeHints().map(u=>`<span class="research-hint">🔒 ${u.name} · ${u.condition}</span>`).join("");
}
function renderRecords(){
  const unlocked=units.filter(isUnitUnlocked).length,completed=MILESTONES.reduce((n,_,i)=>n+units.filter(u=>hasUpgrade(unitUpgradeId(u,i))).length,0);
  const records=[
    ["Meilleure production",`${format(state.stats.bestPps)} /s`,"Record tous cycles"],["Clics sur le nuage",format(state.stats.clicks),"Depuis l’origine"],["Automates achetés",format(state.stats.unitsBought),"Tous cycles"],
    ["Innovations installées",format(state.stats.upgradesBought),`${completed} caps d’automates`],["Gains hors ligne",format(state.stats.offlineEarned),`Limite ${offlineHours()} h`],["Prochain cycle",format(prestigeRequirement()),`${state.cycles} Aube${state.cycles>1?"s":""}`]
  ];
  els.records.innerHTML=records.map(r=>`<div class="record-card"><span>${r[0]}</span><b>${r[1]}</b><small>${r[2]}</small></div>`).join("");
  const era=Math.min(6,Math.ceil(unlocked/4));els.eraLabel.textContent=`Ère ${era}`;els.eraTrack.innerHTML=Array.from({length:6},(_,i)=>`<div class="era-node ${i<era?"reached":""}"><b>${["🌤️","🌧️","⚡","🌌","🪐","♾️"][i]}</b><small>${["Troposphère","Mousson","Tempête","Cosmos","Galaxie","Infini"][i]}</small></div>`).join("");
}

function format(number){
  if(!Number.isFinite(number))return "∞";if(number<0)return `−${format(-number)}`;if(number<1000)return number<10&&number%1?number.toFixed(1):Math.floor(number).toLocaleString("fr-FR");
  const suffixes=["k","M","Md","Bn","Qa","Qi","Sx","Sp","Oc","No","Dc","Ud","Dd","Td","Qad","Qid","Sxd","Spd","Ocd","Nod"];
  const tier=Math.floor(Math.log10(number)/3);if(tier<=suffixes.length){const value=number/Math.pow(1000,tier);return `${value<10?value.toFixed(2):value<100?value.toFixed(1):Math.floor(value)} ${suffixes[tier-1]}`}
  return number.toExponential(2).replace("e+","e");
}
function formatTime(seconds){const s=Math.max(0,Math.floor(seconds)),m=Math.floor(s/60);if(m<1)return `${s} s`;if(m<60)return `${m} min`;const h=Math.floor(m/60);if(h<24)return `${h} h ${m%60} min`;return `${Math.floor(h/24)} j ${h%24} h`}
function toast(message){els.toast.textContent=message;els.toast.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>els.toast.hidden=true,3300)}
function achievement(message){els.achievement.querySelector("b").textContent=message;els.achievement.hidden=false;clearTimeout(achievement.timer);achievement.timer=setTimeout(()=>els.achievement.hidden=true,3500)}
function floatNumber(x,y,text){const span=document.createElement("span");span.className="float-number";span.textContent=text;span.style.left=`${x}px`;span.style.top=`${y}px`;document.body.append(span);setTimeout(()=>span.remove(),850)}
function burst(event,gold=false){if(!event)return;for(let i=0;i<7;i++){const dot=document.createElement("i"),angle=Math.PI*2*i/7,distance=28+Math.random()*25;dot.className="purchase-burst";dot.style.left=`${event.clientX}px`;dot.style.top=`${event.clientY}px`;dot.style.background=gold?"#ffbf48":"#62cfff";dot.style.setProperty("--x",`${Math.cos(angle)*distance}px`);dot.style.setProperty("--y",`${Math.sin(angle)*distance}px`);document.body.append(dot);setTimeout(()=>dot.remove(),600)}}
function rainSplash(){els.cloud.animate?.([{transform:"scale(1)"},{transform:"scale(1.12)"},{transform:"scale(1)"}],{duration:500})}
let audioContext;
function playTone(frequency,duration){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.frequency.value=frequency;osc.type="sine";gain.gain.setValueAtTime(.03,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration)}catch{}}

els.cloud.addEventListener("click",pressCloud);
els.units.addEventListener("click",event=>{const button=event.target.closest("[data-unit]");if(button)buyUnit(button.dataset.unit,event)});
els.upgrades.addEventListener("click",event=>{const button=event.target.closest("[data-upgrade]");if(button)buyUpgrade(button.dataset.upgrade,event)});
$(".buy-modes").addEventListener("click",event=>{const button=event.target.closest("[data-mode]");if(!button)return;state.buyMode=button.dataset.mode;$$('[data-mode]').forEach(b=>b.classList.toggle("active",b===button));render(true)});
$(".tabs").addEventListener("click",event=>{const button=event.target.closest("[data-tab]");if(!button)return;$$('[data-tab]').forEach(b=>b.classList.toggle("active",b===button));$$('.tab-page').forEach(p=>{const active=p.id===`${button.dataset.tab}Page`;p.classList.toggle("active",active);p.hidden=!active});render(true)});
els.prestigeButton.addEventListener("click",openPrestige);$("#confirmPrestige").addEventListener("click",prestige);
els.sound.addEventListener("click",()=>{state.sound=!state.sound;els.sound.setAttribute("aria-pressed",state.sound);els.sound.textContent=state.sound?"♪":"×";els.sound.setAttribute("aria-label",state.sound?"Désactiver les sons":"Activer les sons");save()});
$("#helpButton").addEventListener("click",()=>els.help.showModal());
$$('[data-close]').forEach(button=>button.addEventListener("click",()=>$("#"+button.dataset.close).close()));
[$("#helpDialog"),$("#prestigeDialog")].forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()}));
$("#resetButton").addEventListener("click",()=>{if(confirm("Effacer toute la progression, y compris les Aubes ?")){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(LEGACY_SAVE_KEY);state=initialState();initialized=true;els.help.close();render(true);save()}});

setInterval(()=>{if(!initialized)return;const current=now(),delta=Math.min(1,Math.max(0,(current-state.lastTick)/1000)),gain=production()*delta;addDrops(gain);state.lastTick=current;render()},250);
setInterval(save,10000);window.addEventListener("beforeunload",save);render(true);synchronizeAndRestore();
