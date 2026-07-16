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

const dawnNodes = [
  {id:"first_light",icon:"🌅",name:"Première lueur",cost:1,color:"#eee3ff",description:"Toute la production permanente +25 %",kind:"all",value:1.25},
  {id:"swift_touch",icon:"☝️",name:"Main rapide",cost:1,color:"#dff4ff",description:"Condensation manuelle ×2",kind:"click",value:2},
  {id:"deep_sleep",icon:"🛌",name:"Sommeil profond",cost:1,color:"#e4f7ec",description:"Gains hors ligne ×2",kind:"offline",value:2},
  {id:"storm_soul",icon:"⚡",name:"Âme d’orage",cost:2,color:"#fff0cc",description:"Averses : +1 multiplicateur",kind:"rainPower",value:1,requires:"first_light"},
  {id:"lean_air",icon:"🪶",name:"Air léger",cost:2,color:"#e7f1ff",description:"Automates 8 % moins chers",kind:"cost",value:.92,requires:"swift_touch"},
  {id:"prism",icon:"🌈",name:"Prisme céleste",cost:2,color:"#f3e5ff",description:"Événements rares 2× plus puissants",kind:"event",value:2,requires:"storm_soul"},
  {id:"contractor",icon:"📜",name:"Maître des contrats",cost:3,color:"#e8f5ed",description:"Récompenses de contrat ×2",kind:"contractReward",value:2,requires:"deep_sleep"},
  {id:"wide_horizon",icon:"🌄",name:"Horizon large",cost:3,color:"#fff3db",description:"Chaque contrat ajoute +4 % de production",kind:"contractBonus",value:.04,requires:"contractor"},
  {id:"born_ready",icon:"🧰",name:"Né prêt",cost:4,color:"#e7e5ff",description:"Chaque Aube commence avec 500 gouttes",kind:"start",value:500,requires:"lean_air"},
  {id:"eternal_weather",icon:"♾️",name:"Météo éternelle",cost:5,color:"#e6f8ff",description:"Toute la production permanente ×2",kind:"all",value:2,requires:"wide_horizon"}
];

const rareEvents = [
  {id:"rainbow",icon:"🌈",name:"Arc-en-ciel prismatique",description:"Clique pour obtenir ×12 condensation pendant 35 s",kind:"click",value:12,duration:35},
  {id:"supercell",icon:"⛈️",name:"Supercellule captive",description:"Clique pour obtenir ×5 production pendant 30 s",kind:"production",value:5,duration:30},
  {id:"golden",icon:"✨",name:"Front doré",description:"Clique pour gagner 90 secondes de production",kind:"instant",value:90,duration:0},
  {id:"aurora",icon:"🌌",name:"Aurore contractuelle",description:"Clique pour accélérer le contrat actif de 35 %",kind:"contract",value:.35,duration:0}
];

const contractTemplates = [
  {id:"clicks",icon:"☝️",name:"Impulsion manuelle",description:"Condense {target} fois avant la fin",metric:"clicks",time:75},
  {id:"drops",icon:"💧",name:"Réserve d’humidité",description:"Produis {target} gouttes avant la fin",metric:"drops",time:90},
  {id:"units",icon:"⚙️",name:"Montée en cadence",description:"Achète {target} automates avant la fin",metric:"units",time:90}
];

const paths = [
  {id:"storm",icon:"⚡",name:"Maître des orages",tagline:"Averses furieuses et clics explosifs",color:"#6654bf",pale:"#ece9ff",bonus:"Averses +1 multiplicateur",kind:"storm"},
  {id:"engineer",icon:"⚙️",name:"Ingénieur des nuages",tagline:"Automates massifs et chantiers efficaces",color:"#337f78",pale:"#e2f5ee",bonus:"Automates −8 %",kind:"engineer"},
  {id:"chrono",icon:"⌛",name:"Chronomancien climatique",tagline:"Temps, contrats et phénomènes rares",color:"#9060ac",pale:"#f3e7fa",bonus:"Contrats +50 % de récompense",kind:"chrono"}
];
const pathTechs = {
  storm:[
    ["spark","Étincelle captive","⚡",2e9,"rainPower",1,"Averses +1 multiplicateur"],["thunderhand","Main de tonnerre","☝️",1.4e10,"click",3,"Condensation manuelle ×3"],["wetwire","Fil humide","🔌",9e10,"rainDuration",12,"Averses +12 secondes"],["overcharge","Surcharge","💥",7e11,"rainPower",2,"Averses +2 multiplicateurs"],["blackcloud","Nuage noir","🌩️",6e12,"all",1.7,"Production totale ×1,7"],["lightningrod","Paratonnerre","📍",5e13,"pressure",-3,"Averse 3 clics plus tôt"],["stormvault","Coffre d’orage","🔋",5e14,"event",2,"Événements de tempête ×2"],["tempest","Tempête parfaite","🌀",7e15,"all",3,"Production totale ×3"]
  ],
  engineer:[
    ["blueprint","Plan directeur","📐",2e9,"cost",.92,"Automates −8 %"],["conveyor","Convoyeur de brume","〰️",1.4e10,"all",1.5,"Production totale ×1,5"],["factory","Usine suspendue","🏭",9e10,"unit",1.5,"Chaque automate ×1,5"],["assembly","Ligne céleste","🧱",7e11,"cost",.88,"Automates −12 %"],["robots","Robots pluviométriques","🤖",6e12,"all",2,"Production totale ×2"],["blueprint2","Plans auto-répliquants","📋",5e13,"unit",2,"Chaque automate ×2"],["supply","Approvisionnement infini","📦",5e14,"contract",1.5,"Contrats +50 % récompense"],["megaline","Mégaligne","🏗️",7e15,"all",3,"Production totale ×3"]
  ],
  chrono:[
    ["second","Seconde pliée","⏱️",2e9,"contract",1.5,"Contrats +50 % récompense"],["archive","Archive vivante","📚",1.4e10,"offline",2,"Gains hors ligne ×2"],["loop","Boucle douce","🔁",9e10,"event",2,"Événements rares ×2"],["hourglass","Sablier d’orage","⌛",7e11,"contractBonus",.03,"Chaque contrat +3 % production"],["tomorrow","Pluie de demain","🌦️",6e12,"offlineHours",12,"+12 h de gains hors ligne"],["rewind","Rembobinage","⏪",5e13,"cost",.9,"Automates −10 %"],["moment","Instant parfait","🕰️",5e14,"event",3,"Événements rares ×3"],["eternity","Éternité météo","♾️",7e15,"all",3,"Production totale ×3"]
  ]
};
const pathProjects = {
  storm:[["coil","Bobine de foudre","🔋",8e12,"La première centrale à éclairs.","rainPower",1],["dam","Barrage de mousson","🌊",7e14,"Retient une saison entière de pluie.","all",1.5],["station","Station d’orage orbitale","🛰️",8e16,"Canalise les tempêtes depuis le ciel.","all",2]],
  engineer:[["shipyard","Chantier céleste","🏗️",8e12,"Assemble les automates à l’échelle des nuages.","cost",.85],["city","Mégacité flottante","🏙️",7e14,"Un bassin industriel au-dessus des océans.","all",1.5],["foundry","Fonderie stratosphérique","🔨",8e16,"Fabrique des climats en continu.","all",2]],
  chrono:[["clock","Horloge de mousson","🕰️",8e12,"Synchronise chaque goutte avec le temps.","offline",3],["library","Bibliothèque des futurs","📖",7e14,"Prévoit toutes les averses possibles.","event",2],["gate","Porte des saisons","🚪",8e16,"Traverse les cycles sans perdre le rythme.","all",2]]
};

const expeditionChapters = [
  {id:"first_drop",icon:"💧",name:"Première goutte",check:s=>s.lifetime>=100},
  {id:"first_machine",icon:"⚙️",name:"Atelier éveillé",check:s=>s.stats.unitsBought>=5},
  {id:"first_contract",icon:"📜",name:"Front signé",check:s=>s.stats.contractsCompleted>=1},
  {id:"first_event",icon:"🌈",name:"Ciel vivant",check:s=>s.stats.eventsCaptured>=1},
  {id:"first_dawn",icon:"◈",name:"Première Aube",check:s=>s.cycles>=1},
  {id:"first_relic",icon:"✦",name:"Relique gardée",check:s=>Object.values(s.relics).reduce((a,b)=>a+b,0)>=1},
  {id:"path_mastery",icon:"✺",name:"Voie maîtrisée",check:s=>s.pathUpgrades.length>=4},
  {id:"storm_boss",icon:"⛈️",name:"Supercellule",boss:true,goal:40,bossType:"clicks"},
  {id:"galaxy",icon:"🌌",name:"Ciel galactique",check:s=>s.lifetime>=1e22},
  {id:"tempest_boss",icon:"🌀",name:"Tempête parfaite",boss:true,goal:90,bossType:"rain"},
  {id:"multiverse",icon:"♾️",name:"Seuil infini",check:s=>s.lifetime>=1e30},
  {id:"final_boss",icon:"☀️",name:"Soleil domestiqué",boss:true,goal:150,bossType:"events"}
];
const bossActions={clicks:{label:"clics concentrés",icon:"☝️",target:25},rain:{label:"averses déclenchées",icon:"🌧️",target:3},events:{label:"phénomènes capturés",icon:"🌈",target:2}};
function normalizeBoss(boss){if(!boss)return null;const chapter=expeditionChapters.find(item=>item.id===boss.id),action=chapter&&bossActions[chapter.bossType];return{phase:1,actionProgress:0,actionTarget:action?.target||1,...boss};}
const achievements = [
  ["clicker","☝️","Main de nuage",s=>s.stats.clicks>=100],["collector","💧","Collecteur",s=>s.lifetime>=1e6],["builder","🏗️","Bâtisseur",s=>s.stats.unitsBought>=100],["researcher","🔬","Chercheur",s=>s.stats.upgradesBought>=20],["contractor","📜","Contractuel",s=>s.stats.contractsCompleted>=10],["chaser","🌈","Chasseur",s=>s.stats.eventsCaptured>=10],["dawn","◈","Aurore",s=>s.cycles>=3],["relic","✦","Conservateur",s=>Object.values(s.relics).reduce((a,b)=>a+b,0)>=3],["storm","⛈️","Orageux",s=>s.currentPath==="storm"],["engineer","⚙️","Industrieux",s=>s.currentPath==="engineer"],["chrono","⌛","Hors du temps",s=>s.currentPath==="chrono"],["infinite","♾️","Infini",s=>s.newGamePlus>=1]
].map(([id,icon,name,check])=>({id,icon,name,check}));

const initialOwned = () => Object.fromEntries(units.map(u=>[u.id,0]));
const initialState = () => ({
  drops:0,runTotal:0,lifetime:0,pressure:0,rainUntil:0,owned:initialOwned(),upgrades:[],cycles:0,dawns:0,dawnSpent:0,dawnUpgrades:[],currentPath:null,pendingPath:null,pathUpgrades:[],projects:[],relics:{storm:0,engineer:0,chrono:0},expedition:[],activeBoss:null,finalBuilt:false,unlockedAchievements:[],newGamePlus:0,settings:{effects:true},
  activeEvent:null,nextEventAt:Date.now()+60000,contract:null,nextContractAt:Date.now()+6000,
  buyMode:"1",sound:true,startedAt:Date.now(),runStartedAt:Date.now(),lastTick:Date.now(),savedAt:Date.now(),
  stats:{clicks:0,unitsBought:0,upgradesBought:0,bestPps:0,offlineEarned:0,contractsCompleted:0,contractsFailed:0,eventsCaptured:0}
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
  totalUnits:$("#totalUnits"),dawns:$("#dawnCount"),boost:$("#permanentBoost"),cloud:$("#cloudButton"),
  pressure:$("#pressureFill"),pressureLabel:$("#pressureLabel"),pressureBar:$(".pressure-bar"),pressureHint:$("#pressureHint"),weather:$(".weather-label"),
  weatherText:$("#weatherText"),weatherTimer:$("#weatherTimer"),rainLayer:$("#rainLayer"),units:$("#unitList"),upgrades:$("#upgradeList"),
  lockedUpgrades:$("#lockedUpgradeList"),upgradeCount:$("#upgradeCount"),upgradeBadge:$("#upgradeBadge"),unlockedBadge:$("#unlockedUnitsBadge"),
  records:$("#recordGrid"),eraTrack:$("#eraTrack"),eraLabel:$("#eraLabel"),toast:$("#toast"),achievement:$("#achievement"),sound:$("#soundButton"),
  help:$("#helpDialog"),prestige:$("#prestigeDialog"),prestigeButton:$("#prestigeButton"),prestigeTitle:$("#prestigeTitle"),prestigeProgress:$("#prestigeProgress"),
  prestigeDescription:$("#prestigeDescription"),prestigeReward:$("#prestigeReward"),nextCycleInfo:$("#nextCycleInfo"),timeStatus:$("#timeStatus"),pathPicker:$("#pathPicker"),pathHeading:$("#pathHeading"),pathTagline:$("#pathTagline"),pathOverview:$("#pathOverview"),pathTechCount:$("#pathTechCount"),pathTechList:$("#pathTechList"),projectList:$("#projectList"),relicCount:$("#relicCount"),relicDescription:$("#relicDescription"),strategyBadge:$("#strategyBadge"),expeditionProgress:$("#expeditionProgress"),expeditionTrack:$("#expeditionTrack"),bossCard:$("#bossCard"),finalProject:$("#finalProject"),achievementCount:$("#achievementCount"),achievementList:$("#achievementList"),finale:$("#finaleDialog"),newGamePlusLevel:$("#newGamePlusLevel")
  ,dawnDialog:$("#dawnDialog"),dawnBalance:$("#dawnBalance"),dawnSpent:$("#dawnSpent"),dawnTree:$("#dawnTree"),eventBanner:$("#eventBanner"),eventIcon:$("#eventIcon"),eventTitle:$("#eventTitle"),eventDescription:$("#eventDescription"),eventTimer:$("#eventTimer"),contractCard:$("#contractCard"),contractTimer:$("#contractTimer"),contractTitle:$("#contractTitle"),contractDescription:$("#contractDescription"),contractFill:$("#contractFill"),contractReward:$("#contractReward")
};

function load(){
  try{
    const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem(LEGACY_SAVE_KEY));
    if(!saved)return initialState();
    const fresh=initialState(),legacyMap={gloves:"soft_gloves",blades:"unit_fan_0",forecast:"silver_cloud",thunder:"storm_bottle"};
    const legacyTotal=Number(saved.total)||0;
    const migratedUpgrades=[...new Set((saved.upgrades||[]).map(id=>legacyMap[id]||id).filter(id=>globalUpgrades.some(u=>u.id===id)||/^unit_[a-z]+_\d+$/.test(id)))];
    const cycles=Number(saved.cycles)||0;
    const buyModes=["1","10","100","max"];
    return {...fresh,...saved,runTotal:saved.runTotal??legacyTotal,lifetime:saved.lifetime??legacyTotal,owned:{...fresh.owned,...saved.owned},upgrades:migratedUpgrades,stats:{...fresh.stats,...saved.stats},cycles,dawns:saved.dawns??cycles,dawnSpent:Number(saved.dawnSpent)||0,dawnUpgrades:Array.isArray(saved.dawnUpgrades)?saved.dawnUpgrades:[],currentPath:paths.some(path=>path.id===saved.currentPath)?saved.currentPath:null,pendingPath:null,pathUpgrades:Array.isArray(saved.pathUpgrades)?saved.pathUpgrades:[],projects:Array.isArray(saved.projects)?saved.projects:[],relics:{...fresh.relics,...saved.relics},expedition:Array.isArray(saved.expedition)?saved.expedition:[],activeBoss:normalizeBoss(saved.activeBoss),unlockedAchievements:Array.isArray(saved.unlockedAchievements)?saved.unlockedAchievements:[],newGamePlus:Number(saved.newGamePlus)||0,settings:{...fresh.settings,...saved.settings},buyMode:buyModes.includes(saved.buyMode)?saved.buyMode:fresh.buyMode};
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
function hasDawn(id){return state.dawnUpgrades.includes(id)}
function dawnNode(id){return dawnNodes.find(node=>node.id===id)}
function dawnBalance(){return Math.max(0,state.dawns-state.dawnSpent)}
function dawnEffect(kind,base,combine=(a,b)=>a*b){return dawnNodes.filter(node=>node.kind===kind&&hasDawn(node.id)).reduce((value,node)=>combine(value,node.value),base)}
function currentPath(){return paths.find(path=>path.id===state.currentPath)||null}
function pathTechList(){return state.currentPath?(pathTechs[state.currentPath]||[]).map(([id,name,icon,cost,kind,value,description],index)=>({id:`path_${state.currentPath}_${id}`,rawId:id,name,icon,cost,kind,value,description,index})):[]}
function pathProjectList(){return state.currentPath?(pathProjects[state.currentPath]||[]).map(([id,name,icon,cost,description,kind,value],index)=>({id:`project_${state.currentPath}_${id}`,rawId:id,name,icon,cost,description,kind,value,index})):[]}
function hasPathUpgrade(id){return state.pathUpgrades.includes(id)}
function pathEffect(kind,base,combine=(a,b)=>a*b){return pathTechList().filter(item=>item.kind===kind&&hasPathUpgrade(item.id)).reduce((value,item)=>combine(value,item.value),base)}
function projectEffect(kind,base,combine=(a,b)=>a*b){return pathProjectList().filter(item=>item.kind===kind&&state.projects.includes(item.id)).reduce((value,item)=>combine(value,item.value),base)}
function relicCount(){return Object.values(state.relics).reduce((sum,count)=>sum+count,0)}
function relicMultiplier(){return 1+relicCount()*.1}
function achievementMultiplier(){return 1+state.unlockedAchievements.length*.01}
function newGamePlusMultiplier(){return 1+state.newGamePlus*.5}
function globalEffect(type,base,combine=(a,b)=>a*b){return globalUpgrades.filter(u=>u.type===type&&hasUpgrade(u.id)).reduce((value,u)=>combine(value,u.value),base)}
function permanentMultiplier(){return (1+state.cycles*.25)*dawnEffect("all",1)*relicMultiplier()*achievementMultiplier()*newGamePlusMultiplier()}
function contractMultiplier(){return 1+state.stats.contractsCompleted*(hasDawn("wide_horizon")?.04:.02)*pathEffect("contractBonus",1,(a,b)=>a*b)}
function allMultiplier(){return globalEffect("all",1)*pathEffect("all",1)*projectEffect("all",1)}
function clickMultiplier(){return globalEffect("click",1)*dawnEffect("click",1)*pathEffect("click",1)}
function offlineMultiplier(){return globalEffect("offline",1)*dawnEffect("offline",1)*pathEffect("offline",1)*projectEffect("offline",1)}
function offlineHours(){return 12+globalEffect("offlineHours",0,(a,b)=>a+b)+pathEffect("offlineHours",0,(a,b)=>a+b)}
function costMultiplier(){return globalEffect("cost",1)*dawnEffect("cost",1)*pathEffect("cost",1)*projectEffect("cost",1)}
function pressureMax(){return Math.max(8,20+globalEffect("pressure",0,(a,b)=>a+b))}
function rainDuration(){return 15+globalEffect("rainDuration",0,(a,b)=>a+b)+pathEffect("rainDuration",0,(a,b)=>a+b)}
function rainPower(){return 2+globalEffect("rainPower",0,(a,b)=>a+b)+dawnEffect("rainPower",0,(a,b)=>a+b)+pathEffect("rainPower",0,(a,b)=>a+b)+projectEffect("rainPower",0,(a,b)=>a+b)+(state.currentPath==="storm"?1:0)}
function isRaining(){return state.rainUntil>now()}
function rainMultiplier(){return isRaining()?rainPower():1}
function activeEvent(){return state.activeEvent&&state.activeEvent.boostUntil>now()?rareEvents.find(event=>event.id===state.activeEvent.id):null}
function eventMultiplier(kind){const event=activeEvent();return event&&event.kind===kind?event.value*dawnEffect("event",1)*pathEffect("event",1)*projectEffect("event",1):1}
function unitUpgradeId(unit,index){return `unit_${unit.id}_${index}`}
function unitMultiplier(unit,s=state){
  return MILESTONES.reduce((mult,_,index)=>s.upgrades.includes(unitUpgradeId(unit,index))?mult*(index>=12?3:2):mult,1);
}
function baseProduction(s=state){
  const production=units.reduce((sum,u)=>sum+(s.owned[u.id]||0)*u.production*unitMultiplier(u,s),0);
  return production*allMultiplier()*permanentMultiplier()*contractMultiplier();
}
function bossProductionMultiplier(){const boss=state.activeBoss;return !boss||boss.phase===1?1:boss.phase===2?.8:.6}
function production(){return baseProduction()*rainMultiplier()*eventMultiplier("production")*bossProductionMultiplier()}
function clickValue(){
  const ppsBonus=globalEffect("clickPps",0,(a,b)=>a+b)*baseProduction();
  return (1*clickMultiplier()*permanentMultiplier()+ppsBonus)*rainMultiplier()*eventMultiplier("click");
}
function addDrops(amount){if(!Number.isFinite(amount)||amount<=0)return;state.drops+=amount;state.runTotal+=amount;state.lifetime+=amount;recordContractProgress("drops",amount);recordBossProgress(amount)}

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
  checkCrossedMilestones(unit,before,state.owned[id]);recordContractProgress("units",quote.count);playTone(275+unit.index*9,.055);burst(event);render(true);save();
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

function contractTarget(template){
  const tier=state.stats.contractsCompleted;
  if(template.metric==="clicks")return Math.min(500,20+tier*3);
  if(template.metric==="units")return 3+Math.floor(tier/2);
  return Math.max(100,baseProduction()*Math.max(25,35+tier*8));
}
function contractDuration(template,target){return template.metric==="clicks"?Math.min(100,Math.max(30,Math.ceil(target/5))):template.time+Math.floor(state.stats.contractsCompleted/6)*15}
function makeContract(){
  const template=contractTemplates[state.stats.contractsCompleted%contractTemplates.length],target=contractTarget(template);
  const duration=contractDuration(template,target);
  state.contract={id:template.id,target,progress:0,startedAt:now(),expiresAt:now()+duration*1000};state.nextContractAt=0;
  toast(`Nouveau contrat : ${template.name}`);render(true);save();
}
function recordContractProgress(metric,amount){
  const contract=state.contract;if(!contract||contract.id!==metric||amount<=0)return;
  contract.progress=Math.min(contract.target,contract.progress+amount);
  if(contract.progress>=contract.target)completeContract();
}
function contractReward(){return Math.max(150,baseProduction()*60*(state.stats.contractsCompleted+1))*dawnEffect("contractReward",1)*pathEffect("contract",1)}
function completeContract(){
  const reward=contractReward();state.contract=null;state.stats.contractsCompleted++;state.nextContractAt=now()+12000;addDrops(reward);achievement(`Contrat réussi : +${format(reward)} gouttes`);playTone(720,.2);save();
}
function updateContract(){
  if(!state.contract&&now()>=state.nextContractAt)makeContract();
  if(state.contract&&state.contract.expiresAt<=now()){
    state.stats.contractsFailed++;state.contract=null;state.nextContractAt=now()+9000;toast("Contrat expiré — le prochain arrive bientôt.");save();
  }
}
function startRareEvent(){
  const event=rareEvents[Math.floor(Math.random()*rareEvents.length)];
  state.activeEvent={id:event.id,spawnedAt:now(),expiresAt:now()+20000,boostUntil:0};state.nextEventAt=now()+(70000+Math.random()*65000);render(true);playTone(590,.12);
}
function claimEvent(){
  const current=state.activeEvent,event=current&&rareEvents.find(item=>item.id===current.id);
  if(!event||current.expiresAt<=now()||current.boostUntil)return;
  const power=dawnEffect("event",1);
  if(event.kind==="instant"){addDrops(baseProduction()*event.value*power);state.activeEvent=null}
  else if(event.kind==="contract"){if(state.contract){state.contract.progress=Math.min(state.contract.target,state.contract.progress+state.contract.target*event.value*power);if(state.contract.progress>=state.contract.target)completeContract()}state.activeEvent=null}
  else current.boostUntil=now()+event.duration*1000;
  state.stats.eventsCaptured++;recordBossAction("events");achievement(`${event.name} capturé !`);playTone(780,.17);render(true);save();
}
function updateEvents(){
  const current=state.activeEvent;
  if(current&&((!current.boostUntil&&current.expiresAt<=now())||(current.boostUntil&&current.boostUntil<=now()))){state.activeEvent=null;render(true)}
  if(!state.activeEvent&&now()>=state.nextEventAt)startRareEvent();
}
function nextChapter(){return expeditionChapters.find(chapter=>!state.expedition.includes(chapter.id))||null}
function completeChapter(chapter){
  if(!chapter||state.expedition.includes(chapter.id))return;state.expedition.push(chapter.id);achievement(`Expédition : ${chapter.name}`);toast(`Jalon accompli : ${chapter.name}`);playTone(735,.16);save();
}
function updateExpedition(){
  const chapter=nextChapter();if(!chapter)return;
  if(!chapter.boss&&chapter.check(state))completeChapter(chapter);
  const boss=state.activeBoss;
  if(boss&&boss.expiresAt<=now()){state.activeBoss=null;toast("La tempête-boss s’est dissipée. Prépare une nouvelle tentative.");save()}
}
function startBoss(){
  const chapter=nextChapter();if(!chapter?.boss||state.activeBoss)return;const action=bossActions[chapter.bossType],target=Math.max(1000,baseProduction()*chapter.goal);state.activeBoss={id:chapter.id,target,progress:0,phase:1,actionProgress:0,actionTarget:action.target,expiresAt:now()+90000};toast(`Tempête-boss : ${chapter.name} ! ${action.icon} ${action.target} ${action.label}.`);playTone(520,.2);render(true);save();
}
function recordBossProgress(amount){
  const boss=state.activeBoss;if(!boss||amount<=0)return;boss.progress=Math.min(boss.target,boss.progress+amount);const phase=boss.progress/boss.target>=.75?3:boss.progress/boss.target>=.4?2:1;if(phase>boss.phase){boss.phase=phase;toast(`Phase ${phase} : la tempête se renforce !`);playTone(440+phase*90,.12)};tryCompleteBoss();
}
function recordBossAction(kind,amount=1){const boss=state.activeBoss,chapter=boss&&expeditionChapters.find(item=>item.id===boss.id);if(!boss||!chapter||chapter.bossType!==kind)return;boss.actionProgress=Math.min(boss.actionTarget,boss.actionProgress+amount);tryCompleteBoss()}
function tryCompleteBoss(){const boss=state.activeBoss;if(!boss||boss.progress<boss.target||boss.actionProgress<boss.actionTarget)return;const chapter=expeditionChapters.find(item=>item.id===boss.id);state.activeBoss=null;completeChapter(chapter);addDrops(Math.max(500,baseProduction()*60));toast(`${chapter.name} vaincue !`);}
function finalCost(){return 1e32*Math.pow(10,state.newGamePlus)}
function canBuildFinal(){return state.expedition.length===expeditionChapters.length&&!state.finalBuilt&&state.drops>=finalCost()}
function buildFinal(){if(!canBuildFinal())return;state.drops-=finalCost();state.finalBuilt=true;els.newGamePlusLevel.textContent=state.newGamePlus+1;els.finale.showModal();achievement("Climatologue du Multivers construit");save();}
function beginNewGamePlus(){
  if(!state.finalBuilt)return;const kept={cycles:state.cycles,dawns:state.dawns,dawnSpent:state.dawnSpent,dawnUpgrades:state.dawnUpgrades,relics:state.relics,lifetime:state.lifetime,startedAt:state.startedAt,sound:state.sound,stats:state.stats,unlockedAchievements:state.unlockedAchievements,newGamePlus:state.newGamePlus+1,settings:state.settings};
  state={...initialState(),...kept};initialized=true;els.finale.close();toast(`Nouvelle Météo+ ${state.newGamePlus} : bonus permanent ×${format(newGamePlusMultiplier())}`);render(true);save();
}
function updateAchievements(){achievements.forEach(item=>{if(!state.unlockedAchievements.includes(item.id)&&item.check(state)){state.unlockedAchievements.push(item.id);achievement(`Succès : ${item.name}`)}})}
function eventDisplay(){
  const current=state.activeEvent,event=current&&rareEvents.find(item=>item.id===current.id);if(!event)return null;
  const boost=Boolean(current.boostUntil),until=boost?current.boostUntil:current.expiresAt;
  return{event,boost,seconds:Math.max(0,(until-now())/1000)};
}

function pressCloud(event){
  if(!initialized)return;const gain=clickValue();addDrops(gain);state.stats.clicks++;recordContractProgress("clicks",1);recordBossAction("clicks");
  if(!isRaining()){
    state.pressure++;
    if(state.pressure>=pressureMax()){state.pressure=0;state.rainUntil=now()+rainDuration()*1000;recordBossAction("rain");toast(`Averse déclenchée : production ×${rainPower()} !`);playTone(650,.2);rainSplash()}
  }
  els.cloud.classList.add("pressed");setTimeout(()=>els.cloud.classList.remove("pressed"),90);floatNumber(event.clientX||innerWidth/2,event.clientY||innerHeight/2,`+${format(gain)}`);playTone(185+state.pressure*7,.025);render();
}

function prestigeRequirement(cycles=state.cycles){return 1e9*Math.pow(1000,cycles)}
function canPrestige(){return state.runTotal>=prestigeRequirement()}
function openPrestige(){
  const requirement=prestigeRequirement(),ready=canPrestige();
  state.pendingPath=state.currentPath||null;renderPathPicker();
  els.prestigeDescription.textContent=ready?`Cette ère a produit ${format(state.runTotal)} gouttes. Une nouvelle Aube sera disponible dans la Constellation, et ta prochaine voie définira le rythme du cycle.`:`Il faut produire ${format(requirement)} gouttes dans cette ère avant de pouvoir recommencer.`;
  els.prestigeReward.textContent=ready?`+1 Aube · bonus de cycle +25 %`:"Aube non disponible";
  els.nextCycleInfo.textContent=`Choisis une voie pour la prochaine ère. Les recherches et projets de voie repartiront à zéro, mais les reliques resteront.`;
  $("#confirmPrestige").disabled=!ready||!state.pendingPath;els.prestige.showModal();
}
function prestige(){
  if(!canPrestige()||!state.pendingPath)return;const kept={cycles:state.cycles+1,dawns:state.dawns+1,dawnSpent:state.dawnSpent,dawnUpgrades:state.dawnUpgrades,currentPath:state.pendingPath,relics:state.relics,lifetime:state.lifetime,startedAt:state.startedAt,sound:state.sound,stats:state.stats,buyMode:state.buyMode};
  state={...initialState(),...kept};const starter=dawnEffect("start",0,(a,b)=>a+b)*state.cycles;state.drops=starter;state.runTotal=starter;state.lifetime+=starter;initialized=true;els.prestige.close();achievement(`Aube ${state.cycles} reçue — ${format(dawnBalance())} disponible${dawnBalance()>1?"s":""}`);render(true);save();
}
function renderPathPicker(){
  els.pathPicker.innerHTML=paths.map(path=>`<button class="path-choice ${state.pendingPath===path.id?"active":""}" type="button" data-path-choice="${path.id}" style="--path-color:${path.color};--path-pale:${path.pale}"><span>${path.icon}</span><strong>${path.name}</strong><small>${path.bonus}</small></button>`).join("");
}
function selectPath(id){if(!paths.some(path=>path.id===id))return;state.pendingPath=id;renderPathPicker();$("#confirmPrestige").disabled=!canPrestige();}
function buyPathTech(id){
  const tech=pathTechList().find(item=>item.id===id);if(!tech||hasPathUpgrade(id)||state.drops<tech.cost)return;state.drops-=tech.cost;state.pathUpgrades.push(id);achievement(`${tech.name} maîtrisée`);playTone(620,.13);render(true);save();
}
function buyProject(id){
  const project=pathProjectList().find(item=>item.id===id);if(!project||state.projects.includes(id)||state.drops<project.cost)return;state.drops-=project.cost;state.projects.push(id);state.relics[state.currentPath]=(state.relics[state.currentPath]||0)+1;achievement(`${project.name} achevé : relique obtenue`);playTone(760,.22);render(true);save();
}
function canBuyDawn(node){return !hasDawn(node.id)&&(!node.requires||hasDawn(node.requires))&&dawnBalance()>=node.cost}
function buyDawn(id){
  const node=dawnNode(id);if(!node||!canBuyDawn(node))return;state.dawnUpgrades.push(id);state.dawnSpent+=node.cost;achievement(`${node.name} inscrite dans la Constellation`);playTone(680,.16);render(true);save();
}

function isUnitUnlocked(unit){return unit.index<4||state.runTotal>=unit.baseCost*.18||(unit.index>0&&state.owned[units[unit.index-1].id]>0)}
function nextMilestone(unit){const owned=state.owned[unit.id];return MILESTONES.find(m=>m>owned)||null}
function render(force=false){
  const raining=isRaining(),pps=production(),pMax=pressureMax();
  els.drops.textContent=format(state.drops);els.perSecond.textContent=format(pps);els.perClick.textContent=format(clickValue());els.run.textContent=format(state.runTotal);els.lifetime.textContent=format(state.lifetime);
  els.time.textContent=formatTime((Date.now()-state.startedAt)/1000);els.totalUnits.textContent=format(Object.values(state.owned).reduce((a,b)=>a+b,0));els.dawns.textContent=dawnBalance();els.boost.textContent=`×${format(permanentMultiplier())}`;
  els.pressure.style.width=`${state.pressure/pMax*100}%`;els.pressureLabel.textContent=`${state.pressure} / ${pMax}`;els.pressureBar.setAttribute("aria-valuemax",pMax);els.pressureBar.setAttribute("aria-valuenow",state.pressure);els.pressureHint.textContent=`À ${pMax} : averse ×${rainPower()} pendant ${rainDuration()} secondes`;
  els.weather.classList.toggle("rain",raining);els.cloud.classList.toggle("rain",raining);els.rainLayer.classList.toggle("active",raining);els.weatherText.textContent=raining?`Averse ×${rainPower()}`:"Ciel calme";els.weatherTimer.textContent=raining?`${Math.max(0,(state.rainUntil-now())/1000).toFixed(1)} s`:"";
  state.stats.bestPps=Math.max(state.stats.bestPps,pps);renderPrestigeTeaser();renderSky();renderEvent();renderContract();
  if(force||Date.now()-lastFullRender>650){lastFullRender=Date.now();renderUnits();renderUpgrades();renderRecords();renderDawnTree();renderStrategy()}
}
function renderPrestigeTeaser(){
  const req=prestigeRequirement(),ready=canPrestige(),percent=Math.min(100,state.runTotal/req*100);
  els.prestigeButton.disabled=!ready;els.prestigeTitle.textContent=ready?"Une Aube t’attend":"Encore inaccessible";els.prestigeProgress.textContent=ready?"Gagner une Aube et choisir une nouvelle voie":`${format(state.runTotal)} / ${format(req)} · ${percent.toFixed(percent<1?2:0)} %`;
}
function renderEvent(){
  const display=eventDisplay();if(!display){els.eventBanner.hidden=true;return}
  const {event,boost,seconds}=display;els.eventBanner.hidden=false;els.eventIcon.textContent=event.icon;els.eventTitle.textContent=event.name;els.eventDescription.textContent=boost?`Bonus actif : ${event.description.replace("Clique pour obtenir ","")}`:event.description;els.eventTimer.textContent=`${seconds.toFixed(0)} s`;els.eventBanner.classList.toggle("boosting",boost);
}
function renderContract(){
  const contract=state.contract;if(!contract){els.contractTitle.textContent="Nouveau front en préparation";els.contractDescription.textContent="Le prochain contrat météo arrive sous peu.";els.contractFill.style.width="0%";els.contractTimer.textContent="—";els.contractReward.textContent=`Réussites : ${state.stats.contractsCompleted} · +${(contractMultiplier()-1)*100|0} % production`;return}
  const template=contractTemplates.find(item=>item.id===contract.id),seconds=Math.max(0,(contract.expiresAt-now())/1000),progress=Math.min(100,contract.progress/contract.target*100);els.contractTitle.textContent=`${template.icon} ${template.name}`;els.contractDescription.textContent=template.description.replace("{target}",template.metric==="drops"?format(contract.target):format(Math.ceil(contract.target)));els.contractFill.style.width=`${progress}%`;els.contractTimer.textContent=`${seconds.toFixed(0)} s`;els.contractReward.textContent=`${format(contract.progress)} / ${format(contract.target)} · +${format(contractReward())} gouttes`;
}
function renderDawnTree(){
  els.dawnBalance.textContent=dawnBalance();els.dawnSpent.textContent=`${state.dawnSpent} dépensée${state.dawnSpent>1?"s":""}`;
  els.dawnTree.innerHTML=dawnNodes.map(node=>{const bought=hasDawn(node.id),blocked=node.requires&&!hasDawn(node.requires);return `<button class="dawn-node ${bought?"purchased":""}" type="button" data-dawn="${node.id}" ${bought||!canBuyDawn(node)?"disabled":""} style="--node-color:${node.color}"><span class="node-head"><span class="node-icon">${bought?"✓":blocked?"🔒":node.icon}</span><strong>${node.name}</strong></span><p>${blocked?`Nécessite ${dawnNode(node.requires).name}`:node.description}</p><b>${bought?"Inscrite":`${node.cost} Aube${node.cost>1?"s":""}`}</b></button>`}).join("");
}
function renderStrategy(){
  const path=currentPath(),techs=pathTechList(),projects=pathProjectList();els.strategyBadge.textContent=path?path.icon:"—";els.relicCount.textContent=relicCount();els.relicDescription.textContent=`+${(relicMultiplier()-1)*100|0} % de production permanente`;
  if(!path){els.pathHeading.textContent="Aucune voie choisie";els.pathTagline.textContent="Déclenche une Aube pour choisir une spécialisation.";els.pathOverview.innerHTML=`<span class="path-symbol">✺</span><span><strong>Les trois voies t’attendent</strong><small>Orages, industrie ou maîtrise du temps.</small></span><b>À l’Aube</b>`;els.pathTechCount.textContent="0 / 8";els.pathTechList.innerHTML=`<p class="empty-upgrades">Les recherches exclusives apparaîtront après le premier cycle.</p>`;els.projectList.innerHTML="";renderExpedition();renderAchievements();return}
  const completeTech=techs.filter(tech=>hasPathUpgrade(tech.id)).length;els.pathHeading.textContent=path.name;els.pathTagline.textContent=path.tagline;els.pathOverview.innerHTML=`<span class="path-symbol" style="--path-color:${path.color}">${path.icon}</span><span><strong>${path.name}</strong><small>${path.tagline}<br>Bonus inné : ${path.bonus}</small></span><b style="color:${path.color}">${completeTech}/8</b>`;els.pathTechCount.textContent=`${completeTech} / 8`;
  els.pathTechList.innerHTML=techs.map(tech=>`<button class="path-tech ${hasPathUpgrade(tech.id)?"done":""}" type="button" data-path-tech="${tech.id}" ${hasPathUpgrade(tech.id)||state.drops<tech.cost?"disabled":""} style="--path-color:${path.color};--path-pale:${path.pale}"><i>${hasPathUpgrade(tech.id)?"✓":tech.icon}</i><strong>${tech.name}</strong><p>${tech.description}</p><b>${hasPathUpgrade(tech.id)?"Maîtrisée":`${format(tech.cost)} ◆`}</b></button>`).join("");
  els.projectList.innerHTML=projects.map(project=>`<button class="project-card ${state.projects.includes(project.id)?"done":""}" type="button" data-project="${project.id}" ${state.projects.includes(project.id)||state.drops<project.cost?"disabled":""} style="--path-color:${path.color};--path-pale:${path.pale}"><i>${state.projects.includes(project.id)?"✦":project.icon}</i><strong>${project.name}</strong><p>${project.description}</p><b>${state.projects.includes(project.id)?"Relique obtenue":`${format(project.cost)} ◆`}</b></button>`).join("");
  renderExpedition();renderAchievements();
}
function renderExpedition(){
  const complete=state.expedition.length,chapter=nextChapter();els.expeditionProgress.textContent=`${complete} / ${expeditionChapters.length}`;els.expeditionTrack.innerHTML=expeditionChapters.map(item=>`<div class="expedition-node ${state.expedition.includes(item.id)?"done":""} ${chapter?.id===item.id?"active":""}"><b>${state.expedition.includes(item.id)?"✓":item.icon}</b><small>${item.name}</small></div>`).join("");
  if(!chapter){els.bossCard.innerHTML=`<strong>✦ Expédition terminée</strong><p>Le Climatologue du Multivers peut maintenant être construit.</p>`}
  else if(chapter.boss){const boss=state.activeBoss,action=bossActions[chapter.bossType];if(boss){const phase=boss.phase||1,phaseHint=phase===1?"La tempête observe tes réserves.":phase===2?"Le front se resserre : la production automatique est réduite à 80 %.":"Œil du cyclone : la production automatique est réduite à 60 %.";els.bossCard.innerHTML=`<strong>${chapter.icon} ${chapter.name} · phase ${phase}/3</strong><p>${format(boss.progress)} / ${format(boss.target)} gouttes · ${Math.max(0,(boss.expiresAt-now())/1000).toFixed(0)} s</p><p>${action.icon} ${format(boss.actionProgress||0)} / ${action.target} ${action.label}</p><small>${phaseHint}</small>`}else els.bossCard.innerHTML=`<strong>${chapter.icon} Tempête-boss : ${chapter.name}</strong><p>Réserve : ${format(Math.max(1000,baseProduction()*chapter.goal))} gouttes · 90 s. Il faudra aussi ${action.target} ${action.label}.</p><button type="button" data-start-boss="${chapter.id}">Affronter la tempête</button>`}
  else els.bossCard.innerHTML=`<strong>Prochain jalon : ${chapter.name}</strong><p>Continue à développer la fabrique pour progresser dans l’Expédition.</p>`;
  if(state.finalBuilt)els.finalProject.innerHTML=`<strong>☀️ Climatologue du Multivers construit</strong><p>Le multivers est stabilisé. Nouvelle Météo+ est disponible dans la conclusion.</p>`;
  else if(!chapter){const cost=finalCost();els.finalProject.innerHTML=`<strong>☀️ Climatologue du Multivers</strong><p>La construction finale de cette météo.</p><button type="button" data-build-final ${state.drops<cost?"disabled":""}>Construire · ${format(cost)} ◆</button>`}else els.finalProject.innerHTML="";
}
function renderAchievements(){els.achievementCount.textContent=`${state.unlockedAchievements.length} / ${achievements.length}`;els.achievementList.innerHTML=achievements.map(item=>`<div class="achievement-chip ${state.unlockedAchievements.includes(item.id)?"done":""}"><span>${state.unlockedAchievements.includes(item.id)?item.icon:"🔒"}</span><small>${item.name}</small></div>`).join("")}
function renderSky(){const highest=units.reduce((max,u)=>state.owned[u.id]>0?Math.max(max,u.index):max,0),stage=Math.min(5,Math.floor(highest/4));document.body.dataset.sky=stage;document.body.dataset.path=state.currentPath||""}
function renderUnits(){
  const unlocked=units.filter(isUnitUnlocked),locked=units.find(u=>!isUnitUnlocked(u));
  $$('[data-mode]').forEach(button=>button.classList.toggle("active",button.dataset.mode===state.buyMode));
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
    ["Innovations installées",format(state.stats.upgradesBought),`${completed} caps d’automates`],["Contrats réussis",format(state.stats.contractsCompleted),`${state.stats.contractsFailed} expiré${state.stats.contractsFailed>1?"s":""}`],["Phénomènes capturés",format(state.stats.eventsCaptured),"Bonus météorologiques"],
    ["Gains hors ligne",format(state.stats.offlineEarned),`Limite ${offlineHours()} h`],["Cycles accomplis",format(state.cycles),`${dawnBalance()} Aube${dawnBalance()>1?"s":""} disponible${dawnBalance()>1?"s":""}`],["Prochain cycle",format(prestigeRequirement()),"Objectif de cette ère"]
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
function applySettings(){document.body.classList.toggle("reduced-effects",!state.settings.effects);$("#effectsButton").textContent=state.settings.effects?"Réduire les animations":"Réactiver les animations"}
function exportSave(){
  save();const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="fabrique-a-nuages-sauvegarde.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importSave(file){
  if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=JSON.parse(reader.result);if(!imported||typeof imported!=="object"||!imported.owned)throw new Error("invalid");localStorage.setItem(SAVE_KEY,JSON.stringify(imported));location.reload()}catch{toast("Fichier de sauvegarde invalide.")}};reader.readAsText(file);
}
let audioContext;
function playTone(frequency,duration){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.frequency.value=frequency;osc.type="sine";gain.gain.setValueAtTime(.03,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration)}catch{}}

els.cloud.addEventListener("click",pressCloud);
els.units.addEventListener("click",event=>{const button=event.target.closest("[data-unit]");if(button)buyUnit(button.dataset.unit,event)});
els.upgrades.addEventListener("click",event=>{const button=event.target.closest("[data-upgrade]");if(button)buyUpgrade(button.dataset.upgrade,event)});
$(".buy-modes").addEventListener("click",event=>{const button=event.target.closest("[data-mode]");if(!button)return;state.buyMode=button.dataset.mode;$$('[data-mode]').forEach(b=>b.classList.toggle("active",b===button));render(true)});
$(".tabs").addEventListener("click",event=>{const button=event.target.closest("[data-tab]");if(!button)return;$$('[data-tab]').forEach(b=>b.classList.toggle("active",b===button));$$('.tab-page').forEach(p=>{const active=p.id===`${button.dataset.tab}Page`;p.classList.toggle("active",active);p.hidden=!active});render(true)});
els.prestigeButton.addEventListener("click",openPrestige);$("#confirmPrestige").addEventListener("click",prestige);
$("#dawnTreeButton").addEventListener("click",()=>{renderDawnTree();els.dawnDialog.showModal()});
els.dawnTree.addEventListener("click",event=>{const button=event.target.closest("[data-dawn]");if(button)buyDawn(button.dataset.dawn)});
els.pathPicker.addEventListener("click",event=>{const button=event.target.closest("[data-path-choice]");if(button)selectPath(button.dataset.pathChoice)});
els.pathTechList.addEventListener("click",event=>{const button=event.target.closest("[data-path-tech]");if(button)buyPathTech(button.dataset.pathTech)});
els.projectList.addEventListener("click",event=>{const button=event.target.closest("[data-project]");if(button)buyProject(button.dataset.project)});
els.bossCard.addEventListener("click",event=>{if(event.target.closest("[data-start-boss]"))startBoss()});
els.finalProject.addEventListener("click",event=>{if(event.target.closest("[data-build-final]"))buildFinal()});
els.eventBanner.addEventListener("click",claimEvent);
$("#newGamePlusButton").addEventListener("click",beginNewGamePlus);
els.sound.addEventListener("click",()=>{state.sound=!state.sound;els.sound.setAttribute("aria-pressed",state.sound);els.sound.textContent=state.sound?"♪":"×";els.sound.setAttribute("aria-label",state.sound?"Désactiver les sons":"Activer les sons");save()});
$("#helpButton").addEventListener("click",()=>els.help.showModal());
$("#exportSave").addEventListener("click",exportSave);$("#importSave").addEventListener("click",()=>$("#importFile").click());$("#importFile").addEventListener("change",event=>importSave(event.target.files?.[0]));
$("#effectsButton").addEventListener("click",()=>{state.settings.effects=!state.settings.effects;applySettings();save()});
$$('[data-close]').forEach(button=>button.addEventListener("click",()=>$("#"+button.dataset.close).close()));
[$("#helpDialog"),$("#prestigeDialog"),$("#dawnDialog")].forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()}));
$("#resetButton").addEventListener("click",()=>{if(confirm("Effacer toute la progression, y compris les Aubes ?")){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(LEGACY_SAVE_KEY);state=initialState();initialized=true;els.help.close();render(true);save()}});

setInterval(()=>{if(!initialized)return;const current=now(),delta=Math.min(1,Math.max(0,(current-state.lastTick)/1000)),gain=production()*delta;addDrops(gain);state.lastTick=current;updateContract();updateEvents();updateExpedition();updateAchievements();render()},250);
setInterval(save,10000);window.addEventListener("beforeunload",save);applySettings();render(true);synchronizeAndRestore();
