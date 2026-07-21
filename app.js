"use strict";

const GameI18N=globalThis.GameI18N??{locale:"fr",setLocale:()=>{},translate:value=>value,localize:()=>{}};
const SAVE_KEY = "fabrique-nuages-save-v2";
const LEGACY_SAVE_KEY = "fabrique-nuages-save-v1";
const TIME_API = "https://gettimeapi.dev/v1/time?timezone=UTC";
const COST_GROWTH = 1.15;
const ECONOMY_VERSION = 7;
const COLOSSUS_CAP_TAX = 850;
const PIONEER_SUPER_POWER = 7777777;
const BOSS_DURATION = 90;
const BOSS_ACTION_BUFFER = 15;
const EARTH_MILESTONES = [1,5,10,25,50,75,100,150,200,300,400,500,750,1000,1500,2500];
const EARTH_MILESTONE_NAMES = ["Premier souffle","Équipe complète","Rythme de croisière","Quart de cent","Essaim coordonné","Haute cadence","Cap du cent","Mécanique céleste","Double centaine","Production orbitale","Climat industriel","Grand cycle","Maîtrise des flux","Cap du millier","Horizon absolu","Transcendance"];
const MARS_MILESTONES = [1,5,10,25,50,75,100,150,200,300,400,500,750,1000,1500,2500,5000,10000,25000,50000];
const MARS_MILESTONE_NAMES = ["Premier grain","Escouade rouge","Dôme autonome","Quart de colonie","Cadence d’Arès","Convoi complet","Centurie mécanique","Orbites couplées","Double cohorte","Forge profonde","Réseau cramoisi","Réveil du cinq-centième","Essaim polaire","Millier rouge","Horizon de Phobos","Transmutation","Marée de régolithe","Dix mille soleils","Empire souterrain","Mars absolue"];
const VENUS_MILESTONES = [1,5,10,25,50,100,200,350,500,750,1000,1500,2500,5000,10000,25000,50000,100000,250000,500000];
const VENUS_MILESTONE_NAMES = ["Premier éclat","Nacelle formée","Escadrille d’or","Quartier flottant","Couronne acide","Centurie d’aérostats","Double voile","Ciel habité","Cap des cinq cents","Flotte crépusculaire","Premier millier","Strate conquise","Archipel suspendu","Cinq mille soleils","Dix mille cités","Océan de ballons","Voûte vivante","Cent mille arches","Empire des nuages","Vénus transcendée"];
let MILESTONES=EARTH_MILESTONES,MILESTONE_NAMES=EARTH_MILESTONE_NAMES;

const earthUnits = [
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

const marsPowerPatterns={
  pioneer:[3,3,4,3,5,4,6,3,8,10,4,1,3,4,10,25,4,10,50,100],
  decade:[4,5,10,4,10,5,10,6,10,10,25,10,10,50,10,100,10,100,1000,10],
  volatile:[2,4,3,7,2,12,3,25,4,50,3,100,4,250,5,1000,3,10000,7,100000],
  colossus:[1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000],
  spiral:[3,4,5,6,7,8,9,10,12,15,20,25,30,40,50,75,100,250,1000,10000]
};
const marsUnits = [
  ["dust_scoop","Pelle à régolithe","🥄",20,.25,"Ramasse les premiers grains rouges","pioneer",1.18],
  ["solar_tick","Tique solaire","🪲",140,1.8,"Boit la lumière au bord du dôme","decade",1.19],
  ["crawler","Chenillette d’Arès","🚜",1100,14,"Laboure les plaines ferrugineuses","volatile",1.2],
  ["ice_drill","Foreuse polaire","🛠️",9500,110,"Extrait la glace enfouie","spiral",1.21],
  ["oxygen_moss","Mousse à oxygène","🌿",9e4,900,"Respire sous verre blindé","pioneer",1.2],
  ["dome_printer","Imprimante de dômes","🏗️",1.1e6,8e3,"Imprime des quartiers pressurisés","decade",1.22],
  ["phobos_net","Filet de Phobos","🕸️",1.5e7,8e4,"Capture les poussières orbitales","volatile",1.21],
  ["brine_pump","Pompe à saumure","🧯",2.4e8,9e5,"Réveille les mers fossiles","spiral",1.23],
  ["red_foundry","Fonderie cramoisie","🏭",4e9,1.2e7,"Coule le fer de la planète","decade",1.22],
  ["canyon_train","Train de Valles","🚄",8e10,1.8e8,"Traverse les canyons sans fin","pioneer",1.24],
  ["storm_sail","Voile de poussière","⛵",1.8e12,3e9,"Transforme les tempêtes en poussée","volatile",1.23],
  ["crater_farm","Ferme de cratère","🌾",5e13,6e10,"Cultive sous un ciel couleur cuivre","spiral",1.24],
  ["lava_tap","Robinet magmatique","🌋",1.7e15,1.4e12,"Soutire la chaleur du manteau","decade",1.25],
  ["orbital_mirror","Miroir orbital","🪞",7e16,4e13,"Réveille une vallée à la fois","pioneer",1.24],
  ["phobos_mill","Moulin de Phobos","🌑",3.5e18,1.4e15,"Moud une lune en énergie","volatile",1.26],
  ["deimos_lift","Ascenseur de Déimos","🛗",2e20,5e16,"Relie le sol au vide","spiral",1.25],
  ["terraform_seed","Graine de terraformation","🌱",1.4e22,2e18,"Programme une atmosphère future","decade",1.27],
  ["canyon_mind","Esprit de canyon","🧠",1.2e24,9e19,"Calcule dans les falaises","pioneer",1.26],
  ["aurora_battery","Batterie aurorale","🔋",1.2e26,5e21,"Stocke les nuits électriques","volatile",1.28],
  ["core_elevator","Ascenseur du noyau","🧲",1.5e28,3e23,"Remonte le métal liquide","spiral",1.27],
  ["planet_engine","Moteur planétaire","⚙️",2.4e30,2e25,"Déplace Mars sur son orbite","decade",1.29],
  ["sun_tether","Laisse solaire","☀️",5e32,1.8e27,"Attache la colonie au Soleil","pioneer",1.28],
  ["reality_kiln","Four à réalités","🔥",1.4e35,2e29,"Cuit des futurs habitables","volatile",1.3],
  ["time_quarry","Carrière temporelle","⏳",5e37,3e31,"Extrait les secondes fossiles","spiral",1.29],
  ["quantum_oasis","Oasis quantique","🏝️",2.2e40,5e33,"Irrigue plusieurs Mars à la fois","decade",1.31],
  ["red_singularity","Singularité rouge","🔴",1.2e43,1e36,"Compacte une planète jumelle","pioneer",1.3],
  ["cosmic_greenhouse","Serre cosmique","🪐",8e45,2.5e38,"Fait pousser des systèmes solaires","volatile",1.32],
  ["ares_colossus","Colosse d’Arès","🗿",1e52,1e43,"Très rare : chaque cap vaut mille mondes, et réclame une nouvelle ère de ressources","colossus",1.4],
  ["universe_reactor","Réacteur d’univers","♾️",1e60,1e51,"Alimente toutes les colonies possibles","colossus",1.42],
  ["mars_heart","Cœur de Mars","❤️",1e70,1e61,"Réveille enfin la planète entière","colossus",1.45]
].map(([id,name,icon,baseCost,production,description,pattern,growth],index)=>({id,name,icon,baseCost,production,description,powers:marsPowerPatterns[pattern],growth,index}));

const venusPowerPatterns={
  ascent:[5,3,8,4,10,5,15,6,25,10,40,20,75,25,150,50,500,100,5000,1000],
  sulfur:[3,7,3,12,4,25,5,50,6,100,8,250,10,1000,15,5000,25,25000,50,250000],
  solar:[10,5,10,10,25,10,50,20,100,50,250,100,1000,250,5000,1000,25000,5000,100000,25000],
  titan:[100,100,250,100,500,250,1000,500,2500,1000,5000,2500,10000,5000,25000,10000,100000,50000,1000000,250000]
};
const venusUnits = [
  ["acid_scoop","Écope à acide","🧪",20,.3,"Récolte les premières perles sulfurées","ascent",1.17],
  ["sun_mite","Mite solaire","🦋",180,2.5,"Boit la lumière dans les nuages jaunes","sulfur",1.18],
  ["pressure_kite","Cerf-volant barométrique","🪁",2e3,30,"Plane dans une atmosphère écrasante","solar",1.19],
  ["aerostat","Aérostat d’Aphrodite","🎈",2.5e4,420,"Porte un atelier au-dessus de l’acide","ascent",1.2],
  ["sulfur_garden","Jardin de soufre","🌼",4e5,7e3,"Fleurit sous un ciel sans bleu","sulfur",1.2],
  ["lightning_jar","Bocal à éclairs","⚡",7e6,1.3e5,"Embouteille les orages vénusiens","solar",1.21],
  ["cloud_skiff","Esquif des nuages","⛵",1.4e8,2.8e6,"Traverse les courants corrosifs","ascent",1.21],
  ["acid_refinery","Raffinerie acide","🏭",3e9,6.5e7,"Transforme les pluies mortelles en énergie","sulfur",1.22],
  ["twilight_orchard","Verger du crépuscule","🌳",7e10,1.6e9,"Cultive dans la bande habitable","solar",1.22],
  ["ishtar_lift","Ascenseur d’Ishtar","🛗",2e12,4.2e10,"Relie deux strates atmosphériques","ascent",1.23],
  ["corrosion_forge","Forge anticorrosion","🔨",7e13,1.3e12,"Fabrique des alliages qui défient Vénus","sulfur",1.23],
  ["solar_sail","Voile héliostatique","☀️",3e15,4e13,"Oriente une aube entière vers la cité","solar",1.24],
  ["storm_palace","Palais des tempêtes","🏛️",1e17,1.5e15,"Gouverne les vents super-rotatifs","ascent",1.24],
  ["sulfur_whale","Baleine de soufre","🐋",5e18,6e16,"Nage lentement dans les nuages d’or","sulfur",1.25],
  ["venus_mirror","Miroir de Lakshmi","🪞",3e20,2.8e18,"Réfléchit le Soleil sous les continents","solar",1.25],
  ["floating_borough","Arrondissement flottant","🏙️",2e22,1.4e20,"Une ville complète dérive au crépuscule","ascent",1.26],
  ["acid_ocean","Océan suspendu","🌊",1.5e24,8e21,"Retient une mer au-dessus d’une planète sèche","sulfur",1.26],
  ["daybreak_engine","Moteur d’aurore","🌅",1.4e26,5e23,"Fait lever le jour sur commande","solar",1.27],
  ["maxwell_array","Réseau de Maxwell","📡",1.6e28,3.5e25,"Cartographie chaque éclair de la planète","ascent",1.27],
  ["mantle_tap","Siphon mantellique","🌋",2e30,2.8e27,"Puise sous les plaines brûlantes","sulfur",1.28],
  ["sun_crown","Couronne solaire","👑",3e32,2.5e29,"Coiffe Vénus d’un anneau de lumière","solar",1.28],
  ["atmosphere_mind","Esprit atmosphérique","🧠",5e34,2.6e31,"Pense à la vitesse des vents","ascent",1.29],
  ["sulfur_singularity","Singularité sulfurée","🟡",1e37,3e33,"Compacte les nuages en mondes minuscules","sulfur",1.29],
  ["helios_bridge","Pont d’Hélios","🌉",3e39,4e35,"Relie directement Vénus au Soleil","solar",1.3],
  ["celestial_archipelago","Archipel céleste","🏝️",1e42,6e37,"Des milliers de cités forment un continent","ascent",1.3],
  ["acid_star","Étoile acide","⭐",5e44,1e40,"Allume un astre dans la haute atmosphère","sulfur",1.31],
  ["photon_foundry","Fonderie photonique","✨",1e48,2e43,"Coule la lumière comme un métal","solar",1.31],
  ["ishtar_titan","Titan d’Ishtar","🗿",3e52,5e46,"Porte une strate entière sur ses épaules","titan",1.34],
  ["world_balloon","Ballon-monde","🪐",1e57,1e51,"Une biosphère entière flotte sous sa coque","titan",1.35],
  ["lucifer_engine","Moteur de Lucifer","💠",1e63,2e57,"Déplace les cités entre les aurores","titan",1.36],
  ["venus_brain","Conscience de Vénus","🧿",1e70,5e64,"Éveille la planète derrière ses nuages","titan",1.38],
  ["empire_of_dawn","Empire de l’Aube","♾️",1e80,1e74,"Règne sur toutes les Vénus possibles","titan",1.4]
].map(([id,name,icon,baseCost,production,description,pattern,growth],index)=>({id,name,icon,baseCost,production,description,powers:venusPowerPatterns[pattern],growth,index}));
let units=earthUnits;

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
  {id:"born_ready",icon:"🧰",name:"Né prêt",cost:4,color:"#e7e5ff",description:"Chaque Aube commence avec 5 M gouttes",kind:"start",value:5e6,requires:"lean_air"},
  {id:"eternal_weather",icon:"♾️",name:"Météo éternelle",cost:5,color:"#e6f8ff",description:"Toute la production permanente ×2",kind:"all",value:2,requires:"wide_horizon"},
  {id:"dawnflare",icon:"🌠",name:"Éclair d’aube",cost:4,color:"#ffe3a8",description:"Débloque un phénomène ultra-rare : production ×100 000 pendant 7 s",kind:"eventUnlock",value:1}
];

const rareEvents = [
  {id:"rainbow",icon:"🌈",name:"Arc-en-ciel prismatique",description:"Clique pour obtenir ×12 condensation pendant 35 s",kind:"click",value:12,duration:35},
  {id:"supercell",icon:"⛈️",name:"Supercellule captive",description:"Clique pour obtenir ×5 production pendant 30 s",kind:"production",value:5,duration:30},
  {id:"golden",icon:"✨",name:"Front doré",description:"Clique pour gagner 90 secondes de production",kind:"instant",value:90,duration:0},
  {id:"aurora",icon:"🌌",name:"Aurore contractuelle",description:"Clique pour accélérer le contrat actif de 35 %",kind:"contract",value:.35,duration:0},
  {id:"dawnflare",icon:"🌠",name:"Éclair d’aube",description:"Clique pour obtenir ×100 000 production pendant 7 s",kind:"production",value:100000,duration:7,requiresDawn:"dawnflare",weight:.35}
];
const marsRareEventCopy={rainbow:{icon:"🌈",name:"Prisme de Phobos",description:"Clique pour obtenir ×12 extraction pendant 35 s"},supercell:{icon:"🌪️",name:"Diable de poussière",description:"Clique pour obtenir ×5 production pendant 30 s"},golden:{icon:"🔶",name:"Filon d’orichalque",description:"Clique pour gagner 90 secondes de production"},aurora:{icon:"🌌",name:"Aurore de Déimos",description:"Clique pour accélérer la mission active de 35 %"},dawnflare:{icon:"☄️",name:"Éruption d’Olympus",description:"Clique pour obtenir ×100 000 extraction pendant 7 s"}};
const venusRareEventCopy={rainbow:{icon:"🟣",name:"Halo d’Aphrodite",description:"Clique pour obtenir ×12 captation pendant 35 s"},supercell:{icon:"🌪️",name:"Cyclone sulfurique",description:"Clique pour obtenir ×5 production pendant 30 s"},golden:{icon:"☀️",name:"Trouée solaire",description:"Clique pour gagner 90 secondes de production"},aurora:{icon:"🪽",name:"Messager d’Ishtar",description:"Clique pour accélérer la mission active de 35 %"},dawnflare:{icon:"💥",name:"Flash de Lucifer",description:"Clique pour obtenir ×100 000 captation pendant 7 s"}};
function displayRareEvent(event){return isVenus()?{...event,...venusRareEventCopy[event.id]}:isMars()?{...event,...marsRareEventCopy[event.id]}:event}
function unlockedRareEvents(s=state){return rareEvents.filter(event=>!event.requiresDawn||s.dawnUpgrades.includes(event.requiresDawn))}
function drawRareEvent(s=state){
  const events=unlockedRareEvents(s),total=events.reduce((sum,event)=>sum+(event.weight||1),0);let draw=Math.random()*total;
  return events.find(event=>(draw-=event.weight||1)<=0)||events.at(-1);
}

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
const marsPathCopy={
  storm:{icon:"🌪️",name:"Dominateur des poussières",tagline:"Surcharges manuelles et tempêtes rouges",bonus:"Surcharges +1 multiplicateur"},
  engineer:{icon:"🏗️",name:"Bâtisseur de dômes",tagline:"Colonies massives et coûts comprimés",bonus:"Automates −8 %"},
  chrono:{icon:"🌑",name:"Navigateur de Phobos",tagline:"Orbites, contrats et anomalies",bonus:"Contrats +50 % de récompense"}
};
const venusPathCopy={
  storm:{icon:"⚡",name:"Maître de la corrosion",tagline:"Surcadence brutale et orages acides",bonus:"Percées solaires +1 multiplicateur"},
  engineer:{icon:"🎈",name:"Architecte des strates",tagline:"Aérostats massifs et chantiers accélérés",bonus:"Automates −8 %"},
  chrono:{icon:"☀️",name:"Navigateur du crépuscule",tagline:"Lumière, missions et temps suspendu",bonus:"Missions +50 % de récompense"}
};
const marsUpgradeNames=["Gants de régolithe","Plaque de titane","Sismographe rouge","Bras pressurisé","Équipe du sol nocturne","Danse des poussières","Rouages martiens","Oracle de Phobos","Tempête en capsule","Doigts ionisés","Archive cryogénique","Union des dômes","Grain quantique","Tourbillon persistant","Alliage léger","IA d’Arès","Œil du cratère","Poussière dorée","Relève de Déimos","Mars sans limite"];
const venusUpgradeNames=["Gants vitrifiés","Doublure d’or","Baromètre d’Ishtar","Bras héliostatique","Équipe du crépuscule","Danse sulfurique","Rouages anticorrosion","Oracle de Maxwell","Foudre en ampoule","Doigts photoniques","Capsule d’aérostat","Union des strates","Lumen quantique","Cyclone persistant","Matière flottante","IA d’Aphrodite","Œil de Lucifer","Pluie d’or","Relève solaire","Vénus sans limite"];
const marsPathTechNames={
  storm:["Étincelle de régolithe","Main d’Arès","Câble sous sable","Surcharge rouge","Ciel d’oxyde","Paratonnerre de dôme","Coffre ionique","Tempête de Mars"],
  engineer:["Plan du premier dôme","Convoyeur souterrain","Usine de cratère","Chaîne pressurisée","Robots de Valles","Plans auto-imprimés","Convoi orbital","Mégacolonie"],
  chrono:["Seconde martienne","Archive cryogénique","Boucle de Phobos","Sablier rouge","Sol de demain","Rembobinage orbital","Instant des deux lunes","Éternité d’Arès"]
};
const marsProjectNames={storm:["Bobine d’Arès","Barrage de régolithe","Station de tempête polaire"],engineer:["Chantier de Valles","Noctis City","Fonderie d’Olympus"],chrono:["Horloge de Phobos","Bibliothèque des sols futurs","Porte de Déimos"]};
const venusPathTechNames={
  storm:["Étincelle sulfurique","Main de Lucifer","Fil vitrifié","Surcharge dorée","Nuage d’acide","Paratonnerre flottant","Coffre de corrosion","Ouragan de Vénus"],
  engineer:["Plan du premier aérostat","Convoyeur de nuages","Usine d’Ishtar","Chaîne suspendue","Robots anticorrosion","Plans auto-gonflants","Convoi des strates","Mégacité d’Aphrodite"],
  chrono:["Seconde vénusienne","Archive du crépuscule","Boucle de Maxwell","Sablier solaire","Aube de demain","Rembobinage atmosphérique","Instant de Lucifer","Éternité d’Ishtar"]
};
const venusProjectNames={storm:["Bobine de Lucifer","Barrage sulfurique","Station du grand cyclone"],engineer:["Chantier d’Aphrodite","Ishtar City","Fonderie des strates"],chrono:["Horloge du crépuscule","Bibliothèque des aubes futures","Porte d’Hélios"]};
function displayPath(path){return isVenus()?{...path,...venusPathCopy[path.id]}:isMars()?{...path,...marsPathCopy[path.id]}:path}

const venusMegaprojects=[
  {id:"ishtar_haven",icon:"🎈",name:"Havre d’Ishtar",cost:1e12,duration:120,kind:"all",value:3,description:"Une cité flottante autonome dans la première strate."},
  {id:"aphrodite_anchor",icon:"⚓",name:"Ancrage d’Aphrodite",cost:1e35,duration:300,kind:"cost",value:.75,description:"Stabilise les chantiers malgré les vents supersoniques."},
  {id:"helios_veil",icon:"☀️",name:"Voile d’Hélios",cost:1e72,duration:600,kind:"all",value:25,description:"Module l’ensoleillement de la planète entière."},
  {id:"lucifer_crown",icon:"👑",name:"Couronne de Lucifer",cost:1e115,duration:1200,kind:"all",value:250,description:"Unit toutes les cités du crépuscule en un seul empire."}
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

const earthExpeditionChapters = [
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
const marsExpeditionChapters = [
  {id:"mars_grain",icon:"🔻",name:"Premier million rouge",check:s=>s.planetTotal>=1e6},
  {id:"mars_workshop",icon:"🚜",name:"Avant-poste autonome",check:s=>s.marsUnitsBuilt>=50},
  {id:"mars_research",icon:"🧪",name:"Science du régolithe",check:s=>s.stats.upgradesBought>=20},
  {id:"mars_dawn",icon:"🌅",name:"Premier sol accompli",check:s=>s.cycles>=1},
  {id:"mars_boss_dust",icon:"🌪️",name:"Mur de poussière",boss:true,goal:75,bossType:"clicks"},
  {id:"mars_orbit",icon:"🌑",name:"Phobos asservie",check:s=>s.planetTotal>=1e22},
  {id:"mars_colony",icon:"🏙️",name:"Cent mille machines",check:s=>s.marsUnitsBuilt>=1e5},
  {id:"mars_relic",icon:"🔶",name:"Relique d’Arès",check:s=>Object.values(s.relics).reduce((a,b)=>a+b,0)>=2},
  {id:"mars_terraform",icon:"🌱",name:"Atmosphère naissante",check:s=>s.planetTotal>=1e48},
  {id:"mars_boss_phobos",icon:"🌑",name:"Révolte de Phobos",boss:true,goal:180,bossType:"rain"},
  {id:"mars_colossus",icon:"🗿",name:"Colosse éveillé",check:s=>(s.owned.ares_colossus||0)>=1},
  {id:"mars_500",icon:"7️⃣",name:"Secret du cinq-centième",check:s=>(s.owned.dust_scoop||0)>=500},
  {id:"mars_engine",icon:"⚙️",name:"Orbite déplacée",check:s=>s.planetTotal>=1e78},
  {id:"mars_heart",icon:"❤️",name:"Cœur localisé",check:s=>(s.owned.mars_heart||0)>=1},
  {id:"mars_boss_core",icon:"🔴",name:"Conscience martienne",boss:true,goal:420,bossType:"events"}
];
const venusExpeditionChapters = [
  {id:"venus_light",icon:"✨",name:"Premier million de lumens",check:s=>s.planetTotal>=1e6},
  {id:"venus_fleet",icon:"🎈",name:"Première escadrille",check:s=>s.venusUnitsBuilt>=100},
  {id:"venus_elevation",icon:"🪽",name:"Première Élévation",check:s=>s.cycles>=1},
  {id:"venus_overdrive",icon:"💥",name:"Machine en surcadence",check:s=>s.stats.overdrives>=3},
  {id:"venus_haven",icon:"🏙️",name:"Havre d’Ishtar",check:s=>s.venusConstructions.includes("ishtar_haven")},
  {id:"venus_boss_acid",icon:"🧪",name:"Déluge sulfurique",boss:true,goal:100,bossType:"clicks"},
  {id:"venus_twilight",icon:"🌇",name:"Bande du crépuscule",check:s=>s.planetTotal>=1e36},
  {id:"venus_anchor",icon:"⚓",name:"Ancrage planétaire",check:s=>s.venusConstructions.includes("aphrodite_anchor")},
  {id:"venus_boss_wind",icon:"🌪️",name:"Super-rotation",boss:true,goal:240,bossType:"rain"},
  {id:"venus_upper",icon:"☀️",name:"Haute atmosphère",check:s=>s.planetTotal>=1e72},
  {id:"venus_veil",icon:"🌞",name:"Soleil apprivoisé",check:s=>s.venusConstructions.includes("helios_veil")},
  {id:"venus_armada",icon:"♾️",name:"Cent mille aérostats",check:s=>s.venusUnitsBuilt>=1e5},
  {id:"venus_titan",icon:"🗿",name:"Titan d’Ishtar éveillé",check:s=>(s.owned.ishtar_titan||0)>=1},
  {id:"venus_crown",icon:"👑",name:"Couronne de Lucifer",check:s=>s.venusConstructions.includes("lucifer_crown")},
  {id:"venus_empire",icon:"🪐",name:"Empire atmosphérique",check:s=>s.planetTotal>=1e125},
  {id:"venus_boss_final",icon:"🧿",name:"Œil de Vénus",boss:true,goal:600,bossType:"overdrive"}
];
let expeditionChapters=earthExpeditionChapters;
const bossActions={clicks:{label:"clics concentrés",icon:"☝️",target:25},rain:{label:"averses déclenchées",icon:"🌧️",target:3},events:{label:"phénomènes capturés",icon:"🌈",target:2},overdrive:{label:"surcadences activées",icon:"💥",target:2}};
function normalizeBoss(boss){if(!boss)return null;const chapter=expeditionChapters.find(item=>item.id===boss.id),action=chapter&&bossActions[chapter.bossType];return{phase:1,actionProgress:0,actionTarget:action?.target||1,...boss};}
const achievements = [
  ["clicker","☝️","Main de nuage",s=>s.stats.clicks>=100],["collector","💧","Collecteur",s=>s.lifetime>=1e6],["builder","🏗️","Bâtisseur",s=>s.stats.unitsBought>=100],["researcher","🔬","Chercheur",s=>s.stats.upgradesBought>=20],["contractor","📜","Contractuel",s=>s.stats.contractsCompleted>=10],["chaser","🌈","Chasseur",s=>s.stats.eventsCaptured>=10],["dawn","◈","Aurore",s=>s.cycles>=3],["relic","✦","Conservateur",s=>Object.values(s.relics).reduce((a,b)=>a+b,0)>=3],["storm","⛈️","Orageux",s=>s.currentPath==="storm"],["engineer","⚙️","Industrieux",s=>s.currentPath==="engineer"],["chrono","⌛","Hors du temps",s=>s.currentPath==="chrono"],["infinite","♾️","Infini",s=>s.newGamePlus>=1]
].map(([id,icon,name,check])=>({id,icon,name,check}));

function configurePlanet(planet){const venus=planet==="venus",mars=planet==="mars";units=venus?venusUnits:mars?marsUnits:earthUnits;MILESTONES=venus?VENUS_MILESTONES:mars?MARS_MILESTONES:EARTH_MILESTONES;MILESTONE_NAMES=venus?VENUS_MILESTONE_NAMES:mars?MARS_MILESTONE_NAMES:EARTH_MILESTONE_NAMES;expeditionChapters=venus?venusExpeditionChapters:mars?marsExpeditionChapters:earthExpeditionChapters}
const initialOwned = (planet="earth") => Object.fromEntries((planet==="venus"?venusUnits:planet==="mars"?marsUnits:earthUnits).map(u=>[u.id,0]));
const initialState = (planet="earth") => ({
  planet,marsUnlocked:planet!=="earth",venusUnlocked:planet==="venus",earthLegacy:null,marsLegacy:null,economyVersion:ECONOMY_VERSION,marsUnitsBuilt:0,venusUnitsBuilt:0,venusOverdrive:false,venusCorrosion:0,venusCooldownUntil:0,venusConstructions:[],venusBuild:null,drops:0,runTotal:0,planetTotal:0,lifetime:0,pressure:0,rainUntil:0,owned:initialOwned(planet),upgrades:[],cycles:0,dawns:0,dawnSpent:0,dawnUpgrades:[],currentPath:null,pendingPath:null,pathUpgrades:[],projects:[],relics:{storm:0,engineer:0,chrono:0},expedition:[],activeBoss:null,finalBuilt:false,unlockedAchievements:[],newGamePlus:0,settings:{effects:true,language:"fr"},
  activeEvent:null,nextEventAt:Date.now()+60000,contract:null,nextContractAt:Date.now()+6000,
  buyMode:"1",sound:true,startedAt:Date.now(),runStartedAt:Date.now(),lastTick:Date.now(),savedAt:Date.now(),
  stats:{clicks:0,unitsBought:0,upgradesBought:0,bestPps:0,offlineEarned:0,contractsCompleted:0,contractsFailed:0,eventsCaptured:0,overdrives:0}
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
  lockedUpgrades:$("#lockedUpgradeList"),upgradeCount:$("#upgradeCount"),upgradeBadge:$("#upgradeBadge"),buyAllUpgrades:$("#buyAllUpgrades"),unlockedBadge:$("#unlockedUnitsBadge"),
  records:$("#recordGrid"),eraTrack:$("#eraTrack"),eraLabel:$("#eraLabel"),toast:$("#toast"),achievement:$("#achievement"),sound:$("#soundButton"),
  help:$("#helpDialog"),prestige:$("#prestigeDialog"),prestigeButton:$("#prestigeButton"),prestigeTitle:$("#prestigeTitle"),prestigeProgress:$("#prestigeProgress"),
  prestigeDescription:$("#prestigeDescription"),prestigeReward:$("#prestigeReward"),nextCycleInfo:$("#nextCycleInfo"),timeStatus:$("#timeStatus"),pathPicker:$("#pathPicker"),pathHeading:$("#pathHeading"),pathTagline:$("#pathTagline"),pathOverview:$("#pathOverview"),pathTechCount:$("#pathTechCount"),pathTechList:$("#pathTechList"),projectList:$("#projectList"),relicCount:$("#relicCount"),relicDescription:$("#relicDescription"),strategyBadge:$("#strategyBadge"),expeditionProgress:$("#expeditionProgress"),expeditionTrack:$("#expeditionTrack"),bossCard:$("#bossCard"),finalProject:$("#finalProject"),achievementCount:$("#achievementCount"),achievementList:$("#achievementList"),finale:$("#finaleDialog"),newGamePlusLevel:$("#newGamePlusLevel")
  ,dawnDialog:$("#dawnDialog"),dawnBalance:$("#dawnBalance"),dawnSpent:$("#dawnSpent"),dawnTree:$("#dawnTree"),eventBanner:$("#eventBanner"),eventIcon:$("#eventIcon"),eventTitle:$("#eventTitle"),eventDescription:$("#eventDescription"),eventTimer:$("#eventTimer"),contractCard:$("#contractCard"),contractTimer:$("#contractTimer"),contractTitle:$("#contractTitle"),contractDescription:$("#contractDescription"),contractFill:$("#contractFill"),contractReward:$("#contractReward")
  ,venusSystems:$("#venusSystems"),overdriveButton:$("#overdriveButton"),corrosionLabel:$("#corrosionLabel"),corrosionBar:$("#corrosionBar"),corrosionFill:$("#corrosionFill"),overdriveHint:$("#overdriveHint"),venusConstructionProgress:$("#venusConstructionProgress"),venusConstructionList:$("#venusConstructionList"),languageButton:$("#languageButton"),languageMenu:$("#languageMenu")
};

function load(){
  try{
    const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem(LEGACY_SAVE_KEY));
    if(!saved){configurePlanet("earth");return initialState()}
    const planet=["earth","mars","venus"].includes(saved.planet)?saved.planet:"earth";configurePlanet(planet);
    const fresh=initialState(planet),legacyMap={gloves:"soft_gloves",blades:"unit_fan_0",forecast:"silver_cloud",thunder:"storm_bottle"};
    const legacyTotal=Number(saved.total)||0;
    const migratedUpgrades=[...new Set((saved.upgrades||[]).map(id=>legacyMap[id]||id).filter(id=>globalUpgrades.some(u=>u.id===id)||/^unit_[a-z_]+_\d+$/.test(id)||/^pioneer_[a-z_]+_\d+$/.test(id)))];
    const cycles=Number(saved.cycles)||0;
    const buyModes=["1","10","100","max"];
    const legacyMarsUnits=planet==="mars"?Object.values({...fresh.owned,...saved.owned}).reduce((sum,count)=>sum+(Number(count)||0),0):0;
    const legacyVenusUnits=planet==="venus"?Object.values({...fresh.owned,...saved.owned}).reduce((sum,count)=>sum+(Number(count)||0),0):0;
    return {...fresh,...saved,planet,economyVersion:Number(saved.economyVersion)||1,marsUnitsBuilt:Number(saved.marsUnitsBuilt)||legacyMarsUnits,venusUnitsBuilt:Number(saved.venusUnitsBuilt)||legacyVenusUnits,venusCorrosion:Math.max(0,Math.min(100,Number(saved.venusCorrosion)||0)),venusConstructions:Array.isArray(saved.venusConstructions)?saved.venusConstructions:[],venusBuild:saved.venusBuild&&typeof saved.venusBuild==="object"?saved.venusBuild:null,planetTotal:saved.planetTotal??(planet==="earth"?(saved.lifetime??legacyTotal):saved.runTotal??0),runTotal:saved.runTotal??legacyTotal,lifetime:saved.lifetime??legacyTotal,owned:{...fresh.owned,...saved.owned},upgrades:migratedUpgrades,stats:{...fresh.stats,...saved.stats},cycles,dawns:saved.dawns??cycles,dawnSpent:Number(saved.dawnSpent)||0,dawnUpgrades:Array.isArray(saved.dawnUpgrades)?saved.dawnUpgrades:[],currentPath:paths.some(path=>path.id===saved.currentPath)?saved.currentPath:null,pendingPath:null,pathUpgrades:Array.isArray(saved.pathUpgrades)?saved.pathUpgrades:[],projects:Array.isArray(saved.projects)?saved.projects:[],relics:{...fresh.relics,...saved.relics},expedition:Array.isArray(saved.expedition)?saved.expedition:[],activeBoss:normalizeBoss(saved.activeBoss),unlockedAchievements:Array.isArray(saved.unlockedAchievements)?saved.unlockedAchievements:[],newGamePlus:Number(saved.newGamePlus)||0,settings:{...fresh.settings,...saved.settings},buyMode:buyModes.includes(saved.buyMode)?saved.buyMode:fresh.buyMode};
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
  rebalanceLegacyEconomy();
  const elapsed=Math.min(offlineHours()*3600,Math.max(0,(networkNow-(state.savedAt||networkNow))/1000));
  if(isVenus()){state.venusOverdrive=false;state.venusCorrosion=Math.max(0,state.venusCorrosion-elapsed*4);finishVenusConstruction(networkNow)}
  const earned=baseProduction()*offlineMultiplier()*elapsed;
  addDrops(earned);state.stats.offlineEarned+=earned;state.lastTick=networkNow;initialized=true;
  els.timeStatus.className=`time-status ${source}`;els.timeStatus.querySelector("span").textContent=source==="online"?"Heure réseau":"Heure locale";
  els.timeStatus.title=source==="online"?"Production hors ligne vérifiée en UTC":"Réseau indisponible : heure de l’appareil utilisée";
  if(earned>=1)toast(`Retour à la fabrique : +${format(earned)} ${resourceName()} en ${formatTime(elapsed)}.`);
  render(true);save();
}

function hasUpgrade(id,s=state){return s.upgrades.includes(id)}
function hasDawn(id){return state.dawnUpgrades.includes(id)}
function dawnNode(id){return dawnNodes.find(node=>node.id===id)}
function dawnBalance(){return Math.max(0,state.dawns-state.dawnSpent)}
function dawnEffect(kind,base,combine=(a,b)=>a*b){return dawnNodes.filter(node=>node.kind===kind&&hasDawn(node.id)).reduce((value,node)=>combine(value,node.value),base)}
function starterGrant(){return dawnEffect("start",0,(a,b)=>a+b)*(isVenus()?1e6:isMars()?1000:1)}
function currentPath(){const path=paths.find(path=>path.id===state.currentPath);return path?displayPath(path):null}
function pathTechList(){return state.currentPath?(pathTechs[state.currentPath]||[]).map(([id,name,icon,cost,kind,value,description],index)=>({id:`path_${state.currentPath}_${id}`,rawId:id,name:isVenus()?venusPathTechNames[state.currentPath][index]:isMars()?marsPathTechNames[state.currentPath][index]:name,icon,cost:isVenus()?cost*1e12:isMars()?cost*1e6:cost,kind,value,description,index})):[]}
function pathProjectList(){return state.currentPath?(pathProjects[state.currentPath]||[]).map(([id,name,icon,cost,description,kind,value],index)=>({id:`project_${state.currentPath}_${id}`,rawId:id,name:isVenus()?venusProjectNames[state.currentPath][index]:isMars()?marsProjectNames[state.currentPath][index]:name,icon,cost:isVenus()?cost*1e16:isMars()?cost*1e8:cost,description,kind,value,index})):[]}
function hasPathUpgrade(id){return state.pathUpgrades.includes(id)}
function pathEffect(kind,base,combine=(a,b)=>a*b){return pathTechList().filter(item=>item.kind===kind&&hasPathUpgrade(item.id)).reduce((value,item)=>combine(value,item.value),base)}
function projectEffect(kind,base,combine=(a,b)=>a*b){return pathProjectList().filter(item=>item.kind===kind&&state.projects.includes(item.id)).reduce((value,item)=>combine(value,item.value),base)}
function venusConstructionEffect(kind,base,combine=(a,b)=>a*b){return venusMegaprojects.filter(item=>item.kind===kind&&state.venusConstructions.includes(item.id)).reduce((value,item)=>combine(value,item.value),base)}
function relicCount(){return Object.values(state.relics).reduce((sum,count)=>sum+count,0)}
function relicMultiplier(){return 1+relicCount()*.1}
function achievementMultiplier(){return 1+state.unlockedAchievements.length*.01}
function newGamePlusMultiplier(){return 1+state.newGamePlus*.5}
function isMars(){return state.planet==="mars"}
function isVenus(){return state.planet==="venus"}
function resourceName(){return isVenus()?"lumens":isMars()?"grains":"gouttes"}
function cycleName(plural=false){const name=isVenus()?"Élévation":isMars()?"Sol":"Aube";return plural?`${name}s`:name}
function globalEffect(type,base,combine=(a,b)=>a*b){return globalUpgrades.filter(u=>u.type===type&&hasUpgrade(u.id)).reduce((value,u)=>combine(value,u.value),base)}
function permanentMultiplier(){return Math.pow(1.35,state.cycles)*dawnEffect("all",1)*relicMultiplier()*achievementMultiplier()*newGamePlusMultiplier()}
function contractMultiplier(){return 1+state.stats.contractsCompleted*(hasDawn("wide_horizon")?.04:.02)*pathEffect("contractBonus",1,(a,b)=>a*b)}
function allMultiplier(){return globalEffect("all",1)*pathEffect("all",1)*projectEffect("all",1)*venusConstructionEffect("all",1)}
function clickMultiplier(){return globalEffect("click",1)*dawnEffect("click",1)*pathEffect("click",1)}
function offlineMultiplier(){return globalEffect("offline",1)*dawnEffect("offline",1)*pathEffect("offline",1)*projectEffect("offline",1)}
function offlineHours(){return 12+globalEffect("offlineHours",0,(a,b)=>a+b)+pathEffect("offlineHours",0,(a,b)=>a+b)}
function costMultiplier(){return globalEffect("cost",1)*dawnEffect("cost",1)*pathEffect("cost",1)*projectEffect("cost",1)*venusConstructionEffect("cost",1)}
function pressureMax(){return Math.max(8,20+globalEffect("pressure",0,(a,b)=>a+b))}
function rainDuration(){return 15+globalEffect("rainDuration",0,(a,b)=>a+b)+pathEffect("rainDuration",0,(a,b)=>a+b)}
function bossActionTarget(type){
  const base=bossActions[type]?.target||1;
  if(type!=="rain")return base;
  const possible=Math.floor((BOSS_DURATION-BOSS_ACTION_BUFFER)/rainDuration())+1;
  return Math.max(1,Math.min(base,possible));
}
function rainPower(){return 2+globalEffect("rainPower",0,(a,b)=>a+b)+dawnEffect("rainPower",0,(a,b)=>a+b)+pathEffect("rainPower",0,(a,b)=>a+b)+projectEffect("rainPower",0,(a,b)=>a+b)+(state.currentPath==="storm"?1:0)}
function isRaining(){return state.rainUntil>now()}
function rainMultiplier(){return isRaining()?rainPower():1}
function activeEvent(){return state.activeEvent&&state.activeEvent.boostUntil>now()?rareEvents.find(event=>event.id===state.activeEvent.id):null}
function eventMultiplier(kind){const event=activeEvent();return event&&event.kind===kind?event.value*dawnEffect("event",1)*pathEffect("event",1)*projectEffect("event",1):1}
function unitUpgradeId(unit,index){return `unit_${unit.id}_${index}`}
function isPioneer(unit){return isMars()&&unit.powers===marsPowerPatterns.pioneer}
function pioneerSuperUpgradeId(unit,cap){return `pioneer_${unit.id}_${cap}`}
function unitMilestonePower(unit,index){return unit.powers?.[index]??(index>=12?3:2)}
function unitMultiplier(unit,s=state){
  const regular=MILESTONES.reduce((mult,_,index)=>s.upgrades.includes(unitUpgradeId(unit,index))?mult*unitMilestonePower(unit,index):mult,1);
  if(!isPioneer(unit))return regular;
  const superCaps=Math.floor((s.owned[unit.id]||0)/500);
  return Array.from({length:superCaps},(_,index)=>(index+1)*500).reduce((mult,cap)=>s.upgrades.includes(pioneerSuperUpgradeId(unit,cap))?mult*PIONEER_SUPER_POWER:mult,regular);
}
function marsResonancePhase(){return Math.floor(now()/120000)%3}
function marsResonanceName(){return ["Écho des pionniers","Révolte des ateliers","Marée des colosses"][marsResonancePhase()]}
function rawUnitProduction(unit,s=state){return (s.owned[unit.id]||0)*unit.production*unitMultiplier(unit,s)}
function marsResonanceMultiplier(unit,s=state){
  if(s.planet!=="mars")return 1;
  const phase=marsResonancePhase(),selected=phase===0?unit.index<5:phase===1?unit.index>=5&&unit.index<15:unit.index>=15;
  const current=rawUnitProduction(unit,s);if(!selected||current<=0)return 1;
  const strongest=units.reduce((max,item)=>Math.max(max,rawUnitProduction(item,s)),0);
  const activeInBand=units.filter(item=>{
    const inBand=phase===0?item.index<5:phase===1?item.index>=5&&item.index<15:item.index>=15;
    return inBand&&rawUnitProduction(item,s)>0;
  }).length;
  // La réserve de résonance est partagée entre les automates actifs du groupe :
  // un ancien automate peut briller, sans que cinq cartes additionnent cinq fois le meilleur rendement.
  return 1+strongest*1.6/(Math.sqrt(activeInBand)*current);
}
function baseProduction(s=state,withResonance=true){
  const production=units.reduce((sum,u)=>sum+rawUnitProduction(u,s)*(withResonance?marsResonanceMultiplier(u,s):1),0);
  return production*allMultiplier()*permanentMultiplier()*contractMultiplier();
}
function stableProduction(s=state){return baseProduction(s,false)}
function bossProductionMultiplier(){const boss=state.activeBoss;return !boss||boss.phase===1?1:boss.phase===2?.8:.6}
function venusOverdriveMultiplier(){return isVenus()&&state.venusOverdrive&&state.venusCorrosion<100?25:1}
function production(){return baseProduction()*rainMultiplier()*eventMultiplier("production")*bossProductionMultiplier()*venusOverdriveMultiplier()}
function clickValue(){
  const ppsBonus=globalEffect("clickPps",0,(a,b)=>a+b)*baseProduction();
  return (1*clickMultiplier()*permanentMultiplier()+ppsBonus)*rainMultiplier()*eventMultiplier("click");
}
function addDrops(amount){if(!Number.isFinite(amount)||amount<=0)return;state.drops+=amount;state.runTotal+=amount;state.planetTotal+=amount;state.lifetime+=amount;recordContractProgress("drops",amount);recordBossProgress(amount)}

function finishVenusConstruction(at=now()){
  if(!isVenus()||!state.venusBuild||state.venusBuild.completesAt>at)return false;
  const project=venusMegaprojects.find(item=>item.id===state.venusBuild.id);if(!project){state.venusBuild=null;return false}
  if(!state.venusConstructions.includes(project.id))state.venusConstructions.push(project.id);state.venusBuild=null;
  if(initialized){achievement(`${project.name} achevé dans les nuages`);toast(`Nouvelle strate stabilisée : ${project.name}`);playTone(820,.24)}
  return true;
}
function startVenusConstruction(id){
  if(!initialized||!isVenus()||state.venusBuild)return;const project=venusMegaprojects.find(item=>item.id===id),index=venusMegaprojects.findIndex(item=>item.id===id);
  if(!project||state.venusConstructions.includes(id)||index!==state.venusConstructions.length||state.drops<project.cost)return;
  state.drops-=project.cost;state.venusBuild={id,startedAt:now(),completesAt:now()+project.duration*1000};achievement(`Chantier lancé : ${project.name}`);render(true);save();
}
function toggleVenusOverdrive(){
  if(!initialized||!isVenus())return;const cooling=state.venusCooldownUntil>now();if(cooling&&!state.venusOverdrive)return;
  if(state.venusOverdrive){state.venusOverdrive=false;toast("Surcadence suspendue — refroidissement des aérostats.")}
  else{state.venusOverdrive=true;state.stats.overdrives++;recordBossAction("overdrive");toast("SURCADENCE ×25 — surveille la corrosion !");playTone(920,.18)}
  render(true);save();
}
function updateVenusSystems(delta){
  if(!isVenus())return;finishVenusConstruction();
  if(state.venusOverdrive){state.venusCorrosion=Math.min(100,state.venusCorrosion+8*delta);if(state.venusCorrosion>=100){state.venusOverdrive=false;state.venusCooldownUntil=now()+45000;toast("Corrosion critique — surcadence verrouillée 45 secondes !");playTone(180,.3)}}
  else state.venusCorrosion=Math.max(0,state.venusCorrosion-4*delta);
}

function isColossus(unit){return isMars()&&unit.powers===marsPowerPatterns.colossus}
function colossusCapTax(owned){return Math.pow(COLOSSUS_CAP_TAX,MILESTONES.filter(milestone=>owned>=milestone).length)}
function unitCost(unit,count=1,owned=state.owned[unit.id]){
  const growth=unit.growth||COST_GROWTH;
  if(isColossus(unit)){
    let total=0;
    for(let offset=0;offset<count;offset++)total+=unit.baseCost*Math.pow(growth,owned+offset)*colossusCapTax(owned+offset)*costMultiplier();
    return Math.ceil(total);
  }
  const first=unit.baseCost*Math.pow(growth,owned)*costMultiplier();
  const total=first*(Math.pow(growth,count)-1)/(growth-1);
  return Math.ceil(total);
}
function maxAffordable(unit){
  if(isColossus(unit)){
    let count=0,cost=0;
    while(count<100000){const next=unitCost(unit,1,state.owned[unit.id]+count);if(state.drops<cost+next)break;cost+=next;count++}
    return{count,cost:count?Math.ceil(cost):unitCost(unit,1)};
  }
  const growth=unit.growth||COST_GROWTH,first=unit.baseCost*Math.pow(growth,state.owned[unit.id])*costMultiplier();
  if(state.drops<first)return{count:0,cost:Math.ceil(first)};
  const count=Math.min(100000,Math.floor(Math.log(1+state.drops*(growth-1)/first)/Math.log(growth)));
  return{count,cost:unitCost(unit,count)};
}
function purchaseQuote(unit){if(state.buyMode==="max")return maxAffordable(unit);const count=Number(state.buyMode);return{count,cost:unitCost(unit,count)}}
function buyUnit(id,event){
  if(!initialized)return;const unit=units.find(u=>u.id===id),quote=purchaseQuote(unit);
  if(!quote.count||state.drops<quote.cost)return;const before=state.owned[id];state.drops-=quote.cost;state.owned[id]+=quote.count;state.stats.unitsBought+=quote.count;if(isMars())state.marsUnitsBuilt+=quote.count;if(isVenus())state.venusUnitsBuilt+=quote.count;
  checkCrossedMilestones(unit,before,state.owned[id]);recordContractProgress("units",quote.count);playTone(275+unit.index*9,.055);burst(event);render(true);save();
}
function milestoneUpgrade(unit,index){
  const milestone=MILESTONES[index],power=unitMilestonePower(unit,index);
  return{id:unitUpgradeId(unit,index),unit,index,icon:unit.icon,name:`${unit.name} — ${MILESTONE_NAMES[index]}`,description:`Production de ${unit.name} ×${power}`,cost:Math.ceil(unit.baseCost*(milestone+2)*Math.pow(1.9,index+1)),condition:`Posséder ${format(milestone)} ${unit.name.toLowerCase()}${milestone>1?"s":""}`,unlocked:state.owned[unit.id]>=milestone,color:index>=12?"#eee4ff":"#e4f5ff"};
}
function pioneerSuperUpgrade(unit,cap){
  const tier=cap/500;
  return{id:pioneerSuperUpgradeId(unit,cap),unit,milestone:cap,icon:"✹",name:`${unit.name} — Résonance ${format(cap)}`,description:`Production de ${unit.name} ×${format(PIONEER_SUPER_POWER)}`,cost:Math.ceil(unit.baseCost*(cap+2)*Math.pow(100000,tier)),condition:`Posséder ${format(cap)} ${unit.name.toLowerCase()}${cap>1?"s":""}`,unlocked:state.owned[unit.id]>=cap,color:"#ffe2a8",super:true};
}
function nextPioneerSuperUpgrade(unit){
  const owned=state.owned[unit.id]||0,earned=Math.floor(owned/500);
  for(let tier=1;tier<=earned;tier++){const cap=tier*500;if(!hasUpgrade(pioneerSuperUpgradeId(unit,cap)))return pioneerSuperUpgrade(unit,cap)}
  return pioneerSuperUpgrade(unit,(earned+1)*500);
}
function nextUnitUpgrade(unit){
  const regular=Array.from({length:MILESTONES.length},(_,index)=>index).map(index=>!hasUpgrade(unitUpgradeId(unit,index))?milestoneUpgrade(unit,index):null).find(Boolean);
  const superUpgrade=isPioneer(unit)?nextPioneerSuperUpgrade(unit):null;
  return [regular,superUpgrade].filter(Boolean).sort((a,b)=>a.milestone-(b.milestone)||(a.super?-1:1))[0]||null;
}
function effectiveGlobalUpgrade(upgrade){const scale=isVenus()?1e8:isMars()?1e4:1;return scale===1?upgrade:{...upgrade,cost:upgrade.cost*scale,unlock:upgrade.unlock*scale}}
function availableUpgrades(){
  const unitOnes=units.map(nextUnitUpgrade).filter(u=>u&&u.unlocked);
  const globals=globalUpgrades.map(effectiveGlobalUpgrade).filter(u=>!hasUpgrade(u.id)&&state.runTotal>=u.unlock).map(u=>({...u,condition:`Produire ${format(u.unlock)} ${resourceName()} dans cette ère`,unlocked:true,color:"#fff0ca"}));
  return [...unitOnes,...globals].sort((a,b)=>a.cost-b.cost);
}
function lockedUpgradeHints(){
  const unitHints=units.map(nextUnitUpgrade).filter(u=>u&&!u.unlocked);
  const globalHints=globalUpgrades.map(effectiveGlobalUpgrade).filter(u=>!hasUpgrade(u.id)&&state.runTotal<u.unlock).map(u=>({...u,condition:`À ${format(u.unlock)} ${resourceName()}`}));
  return [...unitHints,...globalHints].sort((a,b)=>(a.unit?(a.milestone??MILESTONES[a.index]):a.unlock)-(b.unit?(b.milestone??MILESTONES[b.index]):b.unlock)).slice(0,6);
}
function buyUpgrade(id,event){
  if(!initialized||hasUpgrade(id))return;
  let upgrade=globalUpgrades.find(u=>u.id===id);if(upgrade)upgrade=effectiveGlobalUpgrade(upgrade);
  if(!upgrade){
    const regularMatch=id.match(/^unit_(.+)_(\d+)$/),regularUnit=regularMatch&&units.find(u=>u.id===regularMatch[1]);
    const superMatch=id.match(/^pioneer_(.+)_(\d+)$/),superUnit=superMatch&&units.find(u=>u.id===superMatch[1]);
    if(regularUnit)upgrade=milestoneUpgrade(regularUnit,Number(regularMatch[2]));
    else if(superUnit&&isPioneer(superUnit))upgrade=pioneerSuperUpgrade(superUnit,Number(superMatch[2]));
  }
  if(!upgrade||state.drops<upgrade.cost)return;
  const unlocked=upgrade.unit?upgrade.unlocked:state.runTotal>=upgrade.unlock;if(!unlocked)return;
  state.drops-=upgrade.cost;state.upgrades.push(id);state.stats.upgradesBought++;playTone(520,.13);burst(event,true);toast(`${upgrade.name} installée !`);render(true);save();
}
function buyAllAvailableUpgrades(event){
  if(!initialized||state.cycles<2)return;
  let bought=0;
  while(true){
    const upgrade=availableUpgrades().find(item=>state.drops>=item.cost);
    if(!upgrade)break;
    state.drops-=upgrade.cost;state.upgrades.push(upgrade.id);state.stats.upgradesBought++;bought++;
  }
  if(!bought)return;
  const label=isVenus()?"alchimies":isMars()?"protocoles":"innovations";
  playTone(660,.16);burst(event,true);toast(`${bought} ${label} installé${bought>1?"s":""} !`);render(true);save();
}
function checkCrossedMilestones(unit,before,after){MILESTONES.forEach(m=>{if(before<m&&after>=m)achievement(`${unit.name} : cap des ${format(m)}`)})}

function contractTarget(template){
  const tier=state.stats.contractsCompleted;
  if(template.metric==="clicks")return Math.min(500,20+tier*3);
  if(template.metric==="units")return 3+Math.floor(tier/2);
  return Math.max(100,stableProduction()*Math.max(25,35+tier*8));
}
function contractDuration(template,target){return template.metric==="clicks"?Math.min(100,Math.max(30,Math.ceil(target/5))):template.time}
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
function contractReward(){return Math.max(150,stableProduction()*60*(state.stats.contractsCompleted+1))*dawnEffect("contractReward",1)*pathEffect("contract",1)}
function rebalanceLegacyEconomy(){
  if(state.economyVersion>=ECONOMY_VERSION)return;
  if(state.economyVersion<2&&isMars()&&state.contract?.id==="drops"){
    const oldTarget=Number(state.contract.target)||0,oldProgress=Number(state.contract.progress)||0;
    const progressRatio=oldTarget>0?Math.min(1,oldProgress/oldTarget):0;
    state.contract.target=contractTarget(contractTemplates.find(template=>template.id==="drops"));
    state.contract.progress=state.contract.target*progressRatio;
  }
  if(state.economyVersion<3&&state.activeBoss){
    const chapter=expeditionChapters.find(item=>item.id===state.activeBoss.id);
    if(chapter?.bossType==="rain")state.activeBoss.actionTarget=Math.min(state.activeBoss.actionTarget||bossActions.rain.target,bossActionTarget("rain"));
  }
  if(state.economyVersion<6&&isMars()){
    // Les anciens paliers 500 des pionniers deviennent la première résonance,
    // afin de préserver exactement leur puissance pour les sauvegardes existantes.
    units.filter(isPioneer).forEach(unit=>{if(state.upgrades.includes(unitUpgradeId(unit,11))&&!state.upgrades.includes(pioneerSuperUpgradeId(unit,500)))state.upgrades.push(pioneerSuperUpgradeId(unit,500))});
  }
  state.economyVersion=ECONOMY_VERSION;
}
function completeContract(){
  const reward=contractReward();state.contract=null;state.stats.contractsCompleted++;state.nextContractAt=now()+12000;addDrops(reward);achievement(`Contrat réussi : +${format(reward)} ${resourceName()}`);playTone(720,.2);save();
}
function updateContract(){
  if(!state.contract&&now()>=state.nextContractAt)makeContract();
  if(state.contract&&state.contract.expiresAt<=now()){
    state.stats.contractsFailed++;state.contract=null;state.nextContractAt=now()+9000;toast("Contrat expiré — le prochain arrive bientôt.");save();
  }
}
function startRareEvent(){
  const event=drawRareEvent();
  state.activeEvent={id:event.id,spawnedAt:now(),expiresAt:now()+20000,boostUntil:0};state.nextEventAt=now()+(70000+Math.random()*65000);render(true);playTone(590,.12);
}
function claimEvent(){
  const current=state.activeEvent,event=current&&rareEvents.find(item=>item.id===current.id);
  if(!event||current.expiresAt<=now()||current.boostUntil)return;
  const power=dawnEffect("event",1);
  if(event.kind==="instant"){addDrops(baseProduction()*event.value*power);state.activeEvent=null}
  else if(event.kind==="contract"){if(state.contract){state.contract.progress=Math.min(state.contract.target,state.contract.progress+state.contract.target*event.value*power);if(state.contract.progress>=state.contract.target)completeContract()}state.activeEvent=null}
  else current.boostUntil=now()+event.duration*1000;
  state.stats.eventsCaptured++;recordBossAction("events");achievement(`${displayRareEvent(event).name} capturé !`);playTone(780,.17);render(true);save();
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
  if(boss&&boss.expiresAt<=now()){state.activeBoss=null;toast(`${isVenus()?"Le phénomène-boss":"La tempête-boss"} s’est dissipé${isVenus()?"":"e"}. Prépare une nouvelle tentative.`);save()}
}
function startBoss(){
  const chapter=nextChapter();if(!chapter?.boss||state.activeBoss)return;const action=bossActions[chapter.bossType],actionTarget=bossActionTarget(chapter.bossType),target=Math.max(1000,baseProduction()*chapter.goal);state.activeBoss={id:chapter.id,target,progress:0,phase:1,actionProgress:0,actionTarget,expiresAt:now()+BOSS_DURATION*1000};toast(`${isVenus()?"Phénomène-boss":"Tempête-boss"} : ${chapter.name} ! ${action.icon} ${actionTarget} ${action.label}.`);playTone(520,.2);render(true);save();
}
function recordBossProgress(amount){
  const boss=state.activeBoss;if(!boss||amount<=0)return;boss.progress=Math.min(boss.target,boss.progress+amount);const phase=boss.progress/boss.target>=.75?3:boss.progress/boss.target>=.4?2:1;if(phase>boss.phase){boss.phase=phase;toast(`Phase ${phase} : la tempête se renforce !`);playTone(440+phase*90,.12)};tryCompleteBoss();
}
function recordBossAction(kind,amount=1){const boss=state.activeBoss,chapter=boss&&expeditionChapters.find(item=>item.id===boss.id);if(!boss||!chapter||chapter.bossType!==kind)return;boss.actionProgress=Math.min(boss.actionTarget,boss.actionProgress+amount);tryCompleteBoss()}
function tryCompleteBoss(){const boss=state.activeBoss;if(!boss||boss.progress<boss.target||boss.actionProgress<boss.actionTarget)return;const chapter=expeditionChapters.find(item=>item.id===boss.id);state.activeBoss=null;completeChapter(chapter);addDrops(Math.max(500,baseProduction()*60));toast(`${chapter.name} vaincue !`);}
function finalCost(){const base=isVenus()?1e140:isMars()?1e86:1e32;return base*Math.pow(isVenus()?1000:isMars()?100:10,state.newGamePlus)}
function finaleMastery(){const requiredCycles=isVenus()?5:isMars()?4:3,requiredNodes=isVenus()?5:isMars()?4:3;return{requiredCycles,requiredNodes,ready:state.cycles>=requiredCycles&&state.dawnUpgrades.length>=requiredNodes}}
function canBuildFinal(){return state.expedition.length===expeditionChapters.length&&!state.finalBuilt&&finaleMastery().ready&&state.drops>=finalCost()}
function prepareFinale(){
  if(isVenus()){$("#finaleEyebrow").textContent="Crépuscule éternel";$("#finaleTitle").textContent="Les Cités de Vénus illuminent le système solaire.";$("#finaleText").textContent="La Couronne de Lucifer s’ouvre comme une fleur d’or. Sous les nuages acides, une planète entière apprend à respirer et toutes les strates chantent à l’unisson.";$("#finaleReward").childNodes[0].textContent="Nouvelle Vénus+ ";$("#newGamePlusButton").textContent="Élever un nouvel empire";}
  else if(isMars()){$("#finaleEyebrow").textContent="Mars respire";$("#finaleTitle").textContent="Le Cœur de Mars s’est éveillé.";$("#finaleText").textContent="Les océans rouges renvoient soudain un signal aveuglant. Il ne vient pas de Mars : derrière les nuages de Vénus, des milliers de lumières dessinent une cité qui attend d’être fondée.";$("#finaleReward").childNodes[0].textContent="Destination inconnue ";$("#newGamePlusButton").textContent="Traverser les nuages de Vénus";}
  else{$("#finaleEyebrow").textContent="Transmission inconnue";$("#finaleTitle").textContent="Le Climatologue vient de détecter… autre chose.";$("#finaleText").textContent="Le signal ne provient d’aucun ciel terrestre. Deux petites lunes apparaissent sur l’écran, puis une coordonnée : 18.4° N, 77.5° E.";$("#finaleReward").childNodes[0].textContent="Destination verrouillée ";$("#newGamePlusButton").textContent="Déchiffrer le signal";}
  els.newGamePlusLevel.textContent=state.newGamePlus+1;
}
function buildFinal(){if(!canBuildFinal())return;state.drops-=finalCost();state.finalBuilt=true;prepareFinale();els.finale.showModal();achievement(isVenus()?"Empire de Vénus achevé":isMars()?"Cœur de Mars éveillé":"Climatologue du Multivers construit");save();}
function landOnMars(){
  const old=state,earthLegacy={cycles:old.cycles,dawns:old.dawns,dawnSpent:old.dawnSpent,dawnUpgrades:old.dawnUpgrades,relics:old.relics,planetTotal:old.planetTotal,finalBuilt:true};configurePlanet("mars");
  state={...initialState("mars"),marsUnlocked:true,earthLegacy,lifetime:old.lifetime,startedAt:old.startedAt,sound:old.sound,buyMode:old.buyMode,settings:old.settings,unlockedAchievements:old.unlockedAchievements};initialized=true;els.finale.close();applyPlanetTheme();applySettings();document.body.classList.add("mars-arrival");setTimeout(()=>document.body.classList.remove("mars-arrival"),3400);toast("MARS — SOL 1 : la colonie s’éveille.");achievement("Nouvelle planète découverte : Mars");lastUnlockedCount=0;render(true);save();
}
function landOnVenus(){
  const old=state,marsLegacy={cycles:old.cycles,dawns:old.dawns,dawnSpent:old.dawnSpent,dawnUpgrades:old.dawnUpgrades,relics:old.relics,planetTotal:old.planetTotal,marsUnitsBuilt:old.marsUnitsBuilt,finalBuilt:true};configurePlanet("venus");
  state={...initialState("venus"),marsUnlocked:true,venusUnlocked:true,earthLegacy:old.earthLegacy,marsLegacy,lifetime:old.lifetime,startedAt:old.startedAt,sound:old.sound,buyMode:old.buyMode,settings:old.settings,unlockedAchievements:old.unlockedAchievements};initialized=true;els.finale.close();applyPlanetTheme();applySettings();document.body.classList.add("venus-arrival");setTimeout(()=>document.body.classList.remove("venus-arrival"),3800);toast("VÉNUS — STRATE 1 : les premiers aérostats s’élèvent.");achievement("Nouvelle planète découverte : Vénus");lastUnlockedCount=0;render(true);save();
}
function beginNewGamePlus(){
  if(!state.finalBuilt)return;if(state.planet==="earth"){landOnMars();return}if(isMars()){landOnVenus();return}const kept={planet:"venus",marsUnlocked:true,venusUnlocked:true,earthLegacy:state.earthLegacy,marsLegacy:state.marsLegacy,cycles:state.cycles,dawns:state.dawns,dawnSpent:state.dawnSpent,dawnUpgrades:state.dawnUpgrades,relics:state.relics,venusUnitsBuilt:state.venusUnitsBuilt,venusConstructions:state.venusConstructions,lifetime:state.lifetime,startedAt:state.startedAt,sound:state.sound,buyMode:state.buyMode,stats:state.stats,unlockedAchievements:state.unlockedAchievements,newGamePlus:state.newGamePlus+1,settings:state.settings};
  configurePlanet("venus");state={...initialState("venus"),...kept};initialized=true;els.finale.close();applyPlanetTheme();toast(`Nouvelle Vénus+ ${state.newGamePlus} : bonus permanent ×${format(newGamePlusMultiplier())}`);render(true);save();
}
function updateAchievements(){achievements.forEach(item=>{if(!state.unlockedAchievements.includes(item.id)&&item.check(state)){state.unlockedAchievements.push(item.id);achievement(`Succès : ${item.name}`)}})}
function eventDisplay(){
  const current=state.activeEvent,event=current&&rareEvents.find(item=>item.id===current.id);if(!event)return null;
  const boost=Boolean(current.boostUntil),until=boost?current.boostUntil:current.expiresAt;
  return{event:displayRareEvent(event),boost,seconds:Math.max(0,(until-now())/1000)};
}

function pressCloud(event){
  if(!initialized)return;const gain=clickValue();addDrops(gain);state.stats.clicks++;recordContractProgress("clicks",1);recordBossAction("clicks");
  if(!isRaining()){
    state.pressure++;
    if(state.pressure>=pressureMax()){state.pressure=0;state.rainUntil=now()+rainDuration()*1000;recordBossAction("rain");toast(`${isVenus()?"Percée solaire":isMars()?"Surcharge de poussière":"Averse"} déclenchée : production ×${rainPower()} !`);playTone(650,.2);rainSplash()}
  }
  els.cloud.classList.add("pressed");setTimeout(()=>els.cloud.classList.remove("pressed"),90);floatNumber(event.clientX||innerWidth/2,event.clientY||innerHeight/2,`+${format(gain)}`);playTone(185+state.pressure*7,.025);render();
}

function prestigeRequirement(cycles=state.cycles){const base=isVenus()?1e18:isMars()?1e12:1e9,growth=isVenus()?1e8:isMars()?1e6:1000;return base*Math.pow(growth,cycles)}
function prestigeReward(){const ratio=Math.max(1,state.runTotal/prestigeRequirement()),step=isVenus()?8:isMars()?6:3;return 1+Math.min(3,Math.floor(Math.log10(ratio)/step))}
function canPrestige(){return state.runTotal>=prestigeRequirement()}
function openPrestige(){
  const requirement=prestigeRequirement(),ready=canPrestige();
  state.pendingPath=state.currentPath||null;renderPathPicker();
  const currentCycle=cycleName(),reward=prestigeReward(),article=isMars()?"Un nouveau":"Une nouvelle";els.prestigeDescription.textContent=ready?`Cette ère a produit ${format(state.runTotal)} ${resourceName()}. ${article} ${currentCycle} sera disponible, et ta prochaine voie définira le rythme du cycle.`:`Il faut produire ${format(requirement)} ${resourceName()} dans cette ère avant de pouvoir recommencer.`;
  els.prestigeReward.textContent=ready?`+${reward} ${currentCycle}${reward>1?"s":""} · bonus permanent ×1,35`:`${currentCycle} non disponible`;
  els.nextCycleInfo.textContent=`Choisis une voie pour la prochaine ère. Les recherches et projets de voie repartiront à zéro, mais les reliques resteront.`;
  $("#confirmPrestige").disabled=!ready||!state.pendingPath;els.prestige.showModal();
}
function prestige(){
  if(!canPrestige()||!state.pendingPath)return;const reward=prestigeReward(),planet=state.planet,kept={planet,marsUnlocked:state.marsUnlocked,venusUnlocked:state.venusUnlocked,earthLegacy:state.earthLegacy,marsLegacy:state.marsLegacy,marsUnitsBuilt:state.marsUnitsBuilt,venusUnitsBuilt:state.venusUnitsBuilt,venusConstructions:state.venusConstructions,venusBuild:state.venusBuild,cycles:state.cycles+1,dawns:state.dawns+reward,dawnSpent:state.dawnSpent,dawnUpgrades:state.dawnUpgrades,currentPath:state.pendingPath,relics:state.relics,lifetime:state.lifetime,planetTotal:state.planetTotal,startedAt:state.startedAt,sound:state.sound,stats:state.stats,buyMode:state.buyMode,newGamePlus:state.newGamePlus,unlockedAchievements:state.unlockedAchievements,settings:state.settings};
  configurePlanet(planet);state={...initialState(planet),...kept};const starter=starterGrant();state.drops=starter;state.runTotal=starter;state.planetTotal+=starter;state.lifetime+=starter;initialized=true;els.prestige.close();const currentCycle=cycleName();achievement(`${currentCycle} ${state.cycles} ${isMars()?"reçu":"reçue"} — +${reward} · ${format(dawnBalance())} disponible${dawnBalance()>1?"s":""}`);render(true);save();
}
function renderPathPicker(){
  els.pathPicker.innerHTML=paths.map(raw=>{const path=displayPath(raw);return `<button class="path-choice ${state.pendingPath===path.id?"active":""}" type="button" data-path-choice="${path.id}" style="--path-color:${path.color};--path-pale:${path.pale}"><span>${path.icon}</span><strong>${path.name}</strong><small>${path.bonus}</small></button>`}).join("");
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
  const surgeName=isVenus()?"percée solaire":isMars()?"surcharge rouge":"averse";els.pressure.style.width=`${state.pressure/pMax*100}%`;els.pressureLabel.textContent=`${state.pressure} / ${pMax}`;els.pressureBar.setAttribute("aria-valuemax",pMax);els.pressureBar.setAttribute("aria-valuenow",state.pressure);els.pressureHint.textContent=`À ${pMax} : ${surgeName} ×${rainPower()} pendant ${rainDuration()} secondes`;
  els.weather.classList.toggle("rain",raining);els.cloud.classList.toggle("rain",raining);els.rainLayer.classList.toggle("active",raining);els.weatherText.textContent=raining?`${isVenus()?"Percée solaire":isMars()?"Surcharge rouge":"Averse"} ×${rainPower()}`:isVenus()?state.venusOverdrive?"Surcadence corrosive":"Crépuscule stable":isMars()?marsResonanceName():"Ciel calme";els.weatherTimer.textContent=raining?`${Math.max(0,(state.rainUntil-now())/1000).toFixed(1)} s`:isMars()?`${120-Math.floor(now()/1000)%120} s`:"";
  state.stats.bestPps=Math.max(state.stats.bestPps,pps);renderPrestigeTeaser();renderSky();renderEvent();renderContract();renderVenusSystems();
  if(force||Date.now()-lastFullRender>650){lastFullRender=Date.now();renderUnits();renderUpgrades();renderRecords();renderDawnTree();renderStrategy()}
  GameI18N.localize();
}
function renderVenusSystems(){
  els.venusSystems.hidden=!isVenus();if(!isVenus())return;
  const cooling=Math.max(0,(state.venusCooldownUntil-now())/1000),level=state.venusCorrosion>=95?"critical":state.venusCorrosion>=80?"warning":"normal";els.venusSystems.dataset.corrosion=level;els.corrosionLabel.textContent=`${state.venusCorrosion.toFixed(0)} %`;els.corrosionFill.style.width=`${state.venusCorrosion}%`;els.corrosionBar.setAttribute("aria-valuenow",state.venusCorrosion.toFixed(0));
  els.overdriveButton.disabled=cooling>0;els.overdriveButton.classList.toggle("active",state.venusOverdrive);els.overdriveButton.textContent=state.venusOverdrive?"Couper":cooling>0?`${cooling.toFixed(0)} s`:"Activer";
  els.overdriveHint.textContent=state.venusOverdrive?state.venusCorrosion>=95?"Danger critique : coupe la surcadence avant le verrouillage !":state.venusCorrosion>=80?"Alerte : la corrosion approche de la zone critique.":"Surcadence active : production ×25, corrosion +8 %/s.":cooling>0?"Refroidissement forcé des structures flottantes.":"Produit 25× plus vite pendant environ 12 secondes.";
  els.venusConstructionProgress.textContent=`${state.venusConstructions.length} / ${venusMegaprojects.length}`;
  els.venusConstructionList.innerHTML=venusMegaprojects.map((project,index)=>{const done=state.venusConstructions.includes(project.id),building=state.venusBuild?.id===project.id,unlocked=index<=state.venusConstructions.length,seconds=building?Math.max(0,(state.venusBuild.completesAt-now())/1000):0;return `<button type="button" class="venus-construction ${done?"done":""} ${building?"building":""}" data-venus-project="${project.id}" ${done||building||!unlocked||state.venusBuild||state.drops<project.cost?"disabled":""}><span>${done?"✓":project.icon}</span><span><strong>${project.name}</strong><small>${done?project.description:building?`Construction · ${formatTime(seconds)}`:!unlocked?"Strate précédente requise":`${format(project.cost)} lumens · ${formatTime(project.duration)}`}</small></span></button>`}).join("");
}
function renderPrestigeTeaser(){
  const req=prestigeRequirement(),ready=canPrestige(),percent=Math.min(100,state.runTotal/req*100);
  const currentCycle=cycleName(),article=isMars()?"Un":"Une";els.prestigeButton.disabled=!ready;els.prestigeTitle.textContent=ready?`${article} ${currentCycle} t’attend`:"Encore inaccessible";els.prestigeProgress.textContent=ready?`Gagner ${article.toLowerCase()} ${currentCycle} et choisir une nouvelle voie`:`${format(state.runTotal)} / ${format(req)} · ${percent.toFixed(percent<1?2:0)} %`;
}
function renderEvent(){
  const display=eventDisplay();if(!display){els.eventBanner.hidden=true;return}
  const {event,boost,seconds}=display;els.eventBanner.hidden=false;els.eventIcon.textContent=event.icon;els.eventTitle.textContent=event.name;els.eventDescription.textContent=boost?`Bonus actif : ${event.description.replace("Clique pour obtenir ","")}`:event.description;els.eventTimer.textContent=`${seconds.toFixed(0)} s`;els.eventBanner.classList.toggle("boosting",boost);
}
function renderContract(){
  const contract=state.contract;if(!contract){els.contractTitle.textContent=isVenus()?"Nouvelle traversée en préparation":isMars()?"Nouvelle mission en préparation":"Nouveau front en préparation";els.contractDescription.textContent=isVenus()?"La prochaine mission atmosphérique arrive sous peu.":isMars()?"La prochaine mission coloniale arrive sous peu.":"Le prochain contrat météo arrive sous peu.";els.contractFill.style.width="0%";els.contractTimer.textContent="—";els.contractReward.textContent=`Réussites : ${state.stats.contractsCompleted} · +${(contractMultiplier()-1)*100|0} % production`;return}
  const template=contractTemplates.find(item=>item.id===contract.id),seconds=Math.max(0,(contract.expiresAt-now())/1000),progress=Math.min(100,contract.progress/contract.target*100),marsNames={clicks:"Pulsation manuelle",drops:"Réserve de régolithe",units:"Déploiement colonial"},marsDescriptions={clicks:"Effectue {target} extractions manuelles avant la fin",drops:"Extrais {target} grains avant la fin",units:"Déploie {target} machines avant la fin"},venusNames={clicks:"Impulsion héliostatique",drops:"Réserve lumineuse",units:"Lancement d’aérostats"},venusDescriptions={clicks:"Effectue {target} captations manuelles avant la fin",drops:"Capture {target} lumens avant la fin",units:"Déploie {target} machines flottantes avant la fin"},names=isVenus()?venusNames:isMars()?marsNames:null,descriptions=isVenus()?venusDescriptions:isMars()?marsDescriptions:null;els.contractTitle.textContent=`${template.icon} ${names?names[template.id]:template.name}`;els.contractDescription.textContent=(descriptions?descriptions[template.id]:template.description).replace("{target}",template.metric==="drops"?format(contract.target):format(Math.ceil(contract.target)));els.contractFill.style.width=`${progress}%`;els.contractTimer.textContent=`${seconds.toFixed(0)} s`;els.contractReward.textContent=`${format(contract.progress)} / ${format(contract.target)} · +${format(contractReward())} ${resourceName()}`;
}
function renderDawnTree(){
  els.dawnBalance.textContent=dawnBalance();els.dawnSpent.textContent=`${state.dawnSpent} dépensée${state.dawnSpent>1?"s":""}`;
  const marsNames=["Premier lever rouge","Main pressurisée","Cryosommeil","Âme de poussière","Titane léger","Prisme de Phobos","Maître des missions","Horizon d’Olympus","Colonie équipée","Mars éternelle","Éruption d’Olympus"];
  const venusNames=["Première lueur d’or","Main vitrifiée","Sommeil suspendu","Âme solaire","Coque légère","Prisme d’Aphrodite","Maître des traversées","Horizon d’Ishtar","Cité équipée","Vénus éternelle","Flash de Lucifer"];
  const planetNames=isVenus()?venusNames:isMars()?marsNames:null,currentCycle=cycleName();
  els.dawnTree.innerHTML=dawnNodes.map((node,index)=>{const bought=hasDawn(node.id),blocked=node.requires&&!hasDawn(node.requires),name=planetNames?planetNames[index]:node.name,description=isVenus()&&node.id==="dawnflare"?"Débloque le Flash de Lucifer : captation ×100 000 pendant 7 s":isVenus()&&node.id==="born_ready"?"Chaque Élévation commence avec 5 Bn lumens":isMars()&&node.id==="dawnflare"?"Débloque un phénomène ultra-rare : extraction ×100 000 pendant 7 s":isMars()&&node.id==="born_ready"?"Chaque Sol commence avec 5 Md grains":node.description,required=node.requires?dawnNodes.findIndex(item=>item.id===node.requires):-1,requiredName=planetNames?planetNames[required]:node.requires&&dawnNode(node.requires).name;return `<button class="dawn-node ${bought?"purchased":""}" type="button" data-dawn="${node.id}" ${bought||!canBuyDawn(node)?"disabled":""} style="--node-color:${node.color}"><span class="node-head"><span class="node-icon">${bought?"✓":blocked?"🔒":node.icon}</span><strong>${name}</strong></span><p>${blocked?`Nécessite ${requiredName}`:description}</p><b>${bought?"Inscrite":`${node.cost} ${currentCycle}${node.cost>1?"s":""}`}</b></button>`}).join("");
}
function renderStrategy(){
  const path=currentPath(),techs=pathTechList(),projects=pathProjectList();els.strategyBadge.textContent=path?path.icon:"—";els.relicCount.textContent=relicCount();els.relicDescription.textContent=`+${(relicMultiplier()-1)*100|0} % de production permanente`;
  if(!path){els.pathHeading.textContent="Aucune voie choisie";els.pathTagline.textContent=`Déclenche ${isMars()?"un Sol":isVenus()?"une Élévation":"une Aube"} pour choisir une spécialisation.`;els.pathOverview.innerHTML=`<span class="path-symbol">✺</span><span><strong>Les trois voies t’attendent</strong><small>${isVenus()?"Corrosion, cités flottantes ou maîtrise du Soleil.":isMars()?"Poussières, dômes ou maîtrise des lunes.":"Orages, industrie ou maîtrise du temps."}</small></span><b>${isVenus()?"À la prochaine Élévation":isMars()?"Au prochain Sol":"À l’Aube"}</b>`;els.pathTechCount.textContent="0 / 8";els.pathTechList.innerHTML=`<p class="empty-upgrades">Les recherches exclusives apparaîtront après le premier cycle.</p>`;els.projectList.innerHTML="";renderExpedition();renderAchievements();return}
  const completeTech=techs.filter(tech=>hasPathUpgrade(tech.id)).length;els.pathHeading.textContent=path.name;els.pathTagline.textContent=path.tagline;els.pathOverview.innerHTML=`<span class="path-symbol" style="--path-color:${path.color}">${path.icon}</span><span><strong>${path.name}</strong><small>${path.tagline}<br>Bonus inné : ${path.bonus}</small></span><b style="color:${path.color}">${completeTech}/8</b>`;els.pathTechCount.textContent=`${completeTech} / 8`;
  els.pathTechList.innerHTML=techs.map(tech=>`<button class="path-tech ${hasPathUpgrade(tech.id)?"done":""}" type="button" data-path-tech="${tech.id}" ${hasPathUpgrade(tech.id)||state.drops<tech.cost?"disabled":""} style="--path-color:${path.color};--path-pale:${path.pale}"><i>${hasPathUpgrade(tech.id)?"✓":tech.icon}</i><strong>${tech.name}</strong><p>${tech.description}</p><b>${hasPathUpgrade(tech.id)?"Maîtrisée":`${format(tech.cost)} ◆`}</b></button>`).join("");
  els.projectList.innerHTML=projects.map(project=>`<button class="project-card ${state.projects.includes(project.id)?"done":""}" type="button" data-project="${project.id}" ${state.projects.includes(project.id)||state.drops<project.cost?"disabled":""} style="--path-color:${path.color};--path-pale:${path.pale}"><i>${state.projects.includes(project.id)?"✦":project.icon}</i><strong>${project.name}</strong><p>${project.description}</p><b>${state.projects.includes(project.id)?"Relique obtenue":`${format(project.cost)} ◆`}</b></button>`).join("");
  renderExpedition();renderAchievements();
}
function renderExpedition(){
  const complete=state.expedition.length,chapter=nextChapter();els.expeditionProgress.textContent=`${complete} / ${expeditionChapters.length}`;els.expeditionTrack.innerHTML=expeditionChapters.map(item=>`<div class="expedition-node ${state.expedition.includes(item.id)?"done":""} ${chapter?.id===item.id?"active":""}"><b>${state.expedition.includes(item.id)?"✓":item.icon}</b><small>${item.name}</small></div>`).join("");
  if(!chapter){els.bossCard.innerHTML=`<strong>✦ ${isVenus()?"Ascension terminée":isMars()?"Conquête terminée":"Expédition terminée"}</strong><p>${isVenus()?"Le Trône du Crépuscule peut maintenant unir toutes les strates.":isMars()?"Le Réacteur d’Éden peut maintenant éveiller Mars.":"Le Climatologue du Multivers peut maintenant être construit."}</p>`}
  else if(chapter.boss){const boss=state.activeBoss,action=bossActions[chapter.bossType],actionTarget=bossActionTarget(chapter.bossType);if(boss){const phase=boss.phase||1,phaseHint=phase===1?"La tempête observe tes réserves.":phase===2?"Le front se resserre : la production automatique est réduite à 80 %.":"Œil du cyclone : la production automatique est réduite à 60 %.";els.bossCard.innerHTML=`<strong>${chapter.icon} ${chapter.name} · phase ${phase}/3</strong><p>${format(boss.progress)} / ${format(boss.target)} ${resourceName()} · ${Math.max(0,(boss.expiresAt-now())/1000).toFixed(0)} s</p><p>${action.icon} ${format(boss.actionProgress||0)} / ${format(boss.actionTarget)} ${action.label}</p><small>${phaseHint}</small>`}else els.bossCard.innerHTML=`<strong>${chapter.icon} ${isVenus()?"Cataclysme atmosphérique":isMars()?"Anomalie majeure":"Tempête-boss"} : ${chapter.name}</strong><p>Réserve : ${format(Math.max(1000,baseProduction()*chapter.goal))} ${resourceName()} · ${BOSS_DURATION} s. Il faudra aussi ${actionTarget} ${action.label}.</p><button type="button" data-start-boss="${chapter.id}">Affronter ${isVenus()?"le cataclysme":isMars()?"l’anomalie":"la tempête"}</button>`}
  else if(chapter.id==="mars_colony")els.bossCard.innerHTML=`<strong>Prochain jalon : ${chapter.name}</strong><p>${format(state.marsUnitsBuilt)} / 100 k machines martiennes déployées sur l’ensemble des Sols.</p>`;
  else els.bossCard.innerHTML=`<strong>Prochain jalon : ${chapter.name}</strong><p>${isVenus()?"Élève les cités et stabilise de nouvelles strates.":isMars()?"Développe la colonie pour poursuivre la conquête.":"Continue à développer la fabrique pour progresser dans l’Expédition."}</p>`;
  if(state.finalBuilt)els.finalProject.innerHTML=`<strong>${isVenus()?"👑 Empire du Crépuscule achevé":isMars()?"❤️ Cœur de Mars éveillé":"☀️ Climatologue du Multivers construit"}</strong><p>${isVenus()?"Toutes les strates de Vénus brillent ensemble.":isMars()?"La planète rouge respire enfin.":"Une transmission inconnue attend d’être déchiffrée."}</p><button type="button" data-open-finale>${isVenus()?"Voir l’apothéose":isMars()?"Voir la conclusion":"Ouvrir la transmission"}</button>`;
  else if(!chapter){const cost=finalCost(),mastery=finaleMastery(),title=isVenus()?"👑 Trône du Crépuscule":isMars()?"❤️ Réacteur d’Éden martien":"☀️ Climatologue du Multivers";if(!mastery.ready)els.finalProject.innerHTML=`<strong>${title}</strong><p>Constellation incomplète : ${state.cycles} / ${mastery.requiredCycles} ${cycleName(true)} et ${state.dawnUpgrades.length} / ${mastery.requiredNodes} héritages inscrits.</p><button type="button" disabled>Prépare la Constellation</button>`;else els.finalProject.innerHTML=`<strong>${title}</strong><p>${isVenus()?"La construction ultime au cœur du crépuscule.":isMars()?"La construction ultime, enfouie sous Olympus Mons.":"La construction finale de cette météo."}</p><button type="button" data-build-final ${state.drops<cost?"disabled":""}>Construire · ${format(cost)} ◆</button>`}else els.finalProject.innerHTML="";
}
function renderAchievements(){const marsNames=["Main rouge","Extracteur","Colonisateur","Protocoliste","Missionnaire","Chasseur d’anomalies","Premier Sol","Gardien d’Arès","Poussiéreux","Bâtisseur","Navigateur","Mars infinie"],venusNames=["Main d’or","Capteur","Aérostier","Alchimiste","Navigateur","Chasseur de halos","Première Élévation","Gardien d’Ishtar","Corrosif","Architecte","Héliostatique","Vénus infinie"],names=isVenus()?venusNames:isMars()?marsNames:null;els.achievementCount.textContent=`${state.unlockedAchievements.length} / ${achievements.length}`;els.achievementList.innerHTML=achievements.map((item,index)=>`<div class="achievement-chip ${state.unlockedAchievements.includes(item.id)?"done":""}"><span>${state.unlockedAchievements.includes(item.id)?item.icon:"🔒"}</span><small>${names?names[index]:item.name}</small></div>`).join("")}
function renderSky(){const highest=units.reduce((max,u)=>state.owned[u.id]>0?Math.max(max,u.index):max,0),stage=Math.min(5,Math.floor(highest/4));document.body.dataset.sky=stage;document.body.dataset.path=state.currentPath||""}
function renderUnits(){
  const unlocked=units.filter(isUnitUnlocked),locked=units.find(u=>!isUnitUnlocked(u));
  $$('[data-mode]').forEach(button=>button.classList.toggle("active",button.dataset.mode===state.buyMode));
  els.unlockedBadge.textContent=`${unlocked.length} / ${units.length}`;
  const cards=unlocked.map(u=>{
    const quote=purchaseQuote(u),owned=state.owned[u.id],next=nextMilestone(u),previous=[0,...MILESTONES].filter(m=>m<=owned).pop()||0,progress=next?Math.min(100,(owned-previous)/(next-previous)*100):100,affordable=quote.count&&state.drops>=quote.cost,resonance=marsResonanceMultiplier(u),resonant=isMars()&&resonance>1;
    return `<button class="unit-card ${affordable?"affordable":""} ${resonant?"resonant":""}" type="button" data-unit="${u.id}" ${!affordable?"disabled":""}><span class="unit-icon">${u.icon}</span><span class="unit-info"><span class="unit-title"><strong>${u.name}</strong><em>×${format(owned)}</em></span><small>${u.description} · ${format(u.production*unitMultiplier(u)*resonance*allMultiplier()*permanentMultiplier()*contractMultiplier())}/s chacun ${resonant?"· RÉSONANCE":""}</small><span class="unit-progress"><i style="--progress:${progress}%"></i><small>${next?`prochain cap ${format(next)}`:"tous les caps franchis"}</small></span></span><span class="unit-buy"><b class="unit-price">${format(quote.cost)} ◆</b><small>${quote.count?`Acheter ×${format(quote.count)}`:"Pas encore abordable"}</small></span></button>`;
  });
  if(locked)cards.push(`<div class="locked-unit"><span class="unit-icon">${locked.icon}</span><span><strong>Prochain automate : ${locked.name}</strong><small>Se révèle à ${format(locked.baseCost*.18)} ${resourceName()} ou avec ${units[locked.index-1].name}</small></span></div>`);
  if(unlocked.length<units.length-1)cards.push(`<p class="more-units">+ ${units.length-unlocked.length-1} technologies encore inconnues</p>`);
  if(unlocked.length>lastUnlockedCount&&lastUnlockedCount>0)achievement(`${unlocked[unlocked.length-1].name} découvert`);lastUnlockedCount=unlocked.length;els.units.innerHTML=cards.join("");
}
function renderUpgrades(){
  const available=availableUpgrades(),visible=available.slice(0,12);els.upgradeBadge.textContent=available.length;els.upgradeCount.textContent=state.upgrades.length;
  els.buyAllUpgrades.hidden=state.cycles<2;els.buyAllUpgrades.disabled=state.cycles<2||!available.some(upgrade=>state.drops>=upgrade.cost);
  const upgradeName=u=>!u.unit?(isVenus()?venusUpgradeNames[globalUpgrades.findIndex(item=>item.id===u.id)]:isMars()?marsUpgradeNames[globalUpgrades.findIndex(item=>item.id===u.id)]:null)||u.name:u.name;
  els.upgrades.innerHTML=visible.length?visible.map(u=>`<button class="upgrade-card" type="button" data-upgrade="${u.id}" ${state.drops<u.cost?"disabled":""} style="--upgrade-color:${u.color||"#fff0ca"}"><span class="upgrade-top"><span class="upgrade-icon">${u.icon||u.unit.icon}</span><strong>${upgradeName(u)}</strong></span><p>${u.description}</p><span class="upgrade-bottom"><small>${u.condition}</small><b>${format(u.cost)} ◆</b></span></button>`).join(""):`<div class="empty-upgrades">Aucune recherche disponible pour le moment.<br>Achète des automates et franchis de nouveaux caps.</div>`;
  els.lockedUpgrades.innerHTML=lockedUpgradeHints().map(u=>`<span class="research-hint">🔒 ${upgradeName(u)} · ${u.condition}</span>`).join("");
}
function renderRecords(){
  const unlocked=units.filter(isUnitUnlocked).length,completed=MILESTONES.reduce((n,_,i)=>n+units.filter(u=>hasUpgrade(unitUpgradeId(u,i))).length,0);
  const cycleRecordName=isVenus()?"Élévations":isMars()?"Sols":"Cycles";
  const machineRecord=isVenus()?["Aérostats vénusiens déployés",format(state.venusUnitsBuilt),"Tous les niveaux atmosphériques"]:isMars()?["Machines martiennes déployées",format(state.marsUnitsBuilt),"Objectif colonial : 100 k"]:["Automates achetés",format(state.stats.unitsBought),"Tous cycles"];
  const records=[
    ["Meilleure production",`${format(state.stats.bestPps)} /s`,"Record tous cycles"],["Clics sur le nuage",format(state.stats.clicks),"Depuis l’origine"],machineRecord,
    [isVenus()?"Alchimies installées":isMars()?"Protocoles installés":"Innovations installées",format(state.stats.upgradesBought),`${completed} caps de machines`],["Contrats réussis",format(state.stats.contractsCompleted),`${state.stats.contractsFailed} expiré${state.stats.contractsFailed>1?"s":""}`],["Phénomènes capturés",format(state.stats.eventsCaptured),"Bonus météorologiques"],
    ["Gains hors ligne",format(state.stats.offlineEarned),`Limite ${offlineHours()} h`],[`${cycleRecordName} accomplis`,format(state.cycles),`${dawnBalance()} ${cycleName()}${dawnBalance()>1?"s":""} disponible${dawnBalance()>1?"s":""}`],[isVenus()?"Prochaine Élévation":isMars()?"Prochain Sol":"Prochain cycle",format(prestigeRequirement()),"Objectif de cette ère"]
  ];
  els.records.innerHTML=records.map(r=>`<div class="record-card"><span>${r[0]}</span><b>${r[1]}</b><small>${r[2]}</small></div>`).join("");
  const era=Math.min(6,Math.ceil(unlocked/(isVenus()?6:isMars()?5:4))),icons=isVenus()?["🧪","🎈","🌇","☀️","👑","♾️"]:isMars()?["🔻","🏜️","🌑","🌋","🪐","❤️"]:["🌤️","🌧️","⚡","🌌","🪐","♾️"],names=isVenus()?["Acide","Aérostats","Crépuscule","Hélios","Lucifer","Éternité"]:isMars()?["Avant-poste","Valles","Phobos","Olympus","Arès","Éden"]:["Troposphère","Mousson","Tempête","Cosmos","Galaxie","Infini"];els.eraLabel.textContent=`${isVenus()?"Strate":isMars()?"Âge":"Ère"} ${era}`;els.eraTrack.innerHTML=Array.from({length:6},(_,i)=>`<div class="era-node ${i<era?"reached":""}"><b>${icons[i]}</b><small>${names[i]}</small></div>`).join("");
}

function format(number){
  if(!Number.isFinite(number))return "∞";if(number<0)return `−${format(-number)}`;if(number<1000)return number<10&&number%1?number.toFixed(1):Math.floor(number).toLocaleString(GameI18N.locale==="en"?"en-US":"fr-FR");
  const suffixes=GameI18N.locale==="en"
    ?["k","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc","Ud","Dd","Td","Qad","Qid","Sxd","Spd","Ocd","Nod","Vg","Uvg","Dvg","Tvg","Qavg","Qivg","Sxvg","Spvg","Ocv","Novg","Tg","Utg","Dtg","Ttg","Qatg","Qitg","Sxtg","Sptg","Octg","Notg"]
    :["k","M","Md","Bn","Qa","Qi","Sx","Sp","Oc","No","Dc","Ud","Dd","Td","Qad","Qid","Sxd","Spd","Ocd","Nod","Vg","Uvg","Dvg","Tvg","Qavg","Qivg","Sxvg","Spvg","Ocv","Novg","Tg","Utg","Dtg","Ttg","Qatg","Qitg","Sxtg","Sptg","Octg","Notg"];
  const tier=Math.floor(Math.log10(number)/3);if(tier<=suffixes.length){const value=number/Math.pow(1000,tier);return `${value<10?value.toFixed(2):value<100?value.toFixed(1):Math.floor(value)} ${suffixes[tier-1]}`}
  return number.toExponential(2).replace("e+","e");
}
function formatTime(seconds){const s=Math.max(0,Math.floor(seconds)),m=Math.floor(s/60),english=GameI18N.locale==="en";if(m<1)return `${s} s`;if(m<60)return `${m} min`;const h=Math.floor(m/60);if(h<24)return `${h} h ${m%60} min`;return `${Math.floor(h/24)} ${english?"d":"j"} ${h%24} h`}
function toast(message){els.toast.textContent=GameI18N.translate(message);els.toast.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>els.toast.hidden=true,3300)}
function achievement(message){els.achievement.querySelector("b").textContent=GameI18N.translate(message);els.achievement.hidden=false;clearTimeout(achievement.timer);achievement.timer=setTimeout(()=>els.achievement.hidden=true,3500)}
function floatNumber(x,y,text){const span=document.createElement("span");span.className="float-number";span.textContent=text;span.style.left=`${x}px`;span.style.top=`${y}px`;document.body.append(span);setTimeout(()=>span.remove(),850)}
function burst(event,gold=false){if(!event)return;for(let i=0;i<7;i++){const dot=document.createElement("i"),angle=Math.PI*2*i/7,distance=28+Math.random()*25;dot.className="purchase-burst";dot.style.left=`${event.clientX}px`;dot.style.top=`${event.clientY}px`;dot.style.background=gold?"#ffbf48":"#62cfff";dot.style.setProperty("--x",`${Math.cos(angle)*distance}px`);dot.style.setProperty("--y",`${Math.sin(angle)*distance}px`);document.body.append(dot);setTimeout(()=>dot.remove(),600)}}
function rainSplash(){els.cloud.animate?.([{transform:"scale(1)"},{transform:"scale(1.12)"},{transform:"scale(1)"}],{duration:500})}
function applyPlanetTheme(){
  const venus=isVenus(),mars=isMars();document.body.dataset.planet=venus?"venus":mars?"mars":"earth";document.title=venus?"Les Cités du Crépuscule — Vénus":mars?"La Colonie Rouge — Mars":"La Fabrique à Nuages";$("meta[name='theme-color']").content=venus?"#8a5a15":mars?"#8f291f":"#bdeaff";
  $("#brandMark").textContent=venus?"◉":mars?"●":"☁";$("#brandTitle").textContent=venus?"Les Cités du Crépuscule":mars?"La Colonie Rouge":"La Fabrique à Nuages";$("#brandSubtitle").textContent=venus?"L’ascension de Vénus":mars?"L’éveil de Mars":"L’empire météo";$("#resourceName").textContent=resourceName();$("#clickActionName").textContent=venus?"Captation manuelle":mars?"Extraction manuelle":"Condensation manuelle";$("#productionEyebrow").textContent=venus?"Archipel atmosphérique":mars?"Complexe de terraformation":"Chaîne de production";$("#automatesHeading").textContent=venus?"Machines flottantes":mars?"Automates martiens":"Automates météo";$("#upgradesHeading").textContent=venus?"Alchimies disponibles":mars?"Protocoles disponibles":"Innovations disponibles";$("#milestoneTotal").textContent=units.length*MILESTONES.length;$("#expeditionHeading").textContent=venus?"Ascension de Vénus":mars?"Conquête de Mars":"Expédition du Multivers";
  els.cloud.setAttribute("aria-label",venus?"Presser le noyau solaire pour capter des lumens":mars?"Presser le noyau de poussière pour extraire des grains":"Presser le nuage pour récolter des gouttes");$("#dawnTreeButton").setAttribute("aria-label",venus?"Ouvrir l’arbre des Élévations":mars?"Ouvrir l’arbre des Sols":"Ouvrir l’arbre des Aubes");$("#dawnTreeButton").querySelector("small").textContent=venus?"Élévations disponibles":mars?"Sols disponibles":"Aubes disponibles";$("#prestigeButton").querySelector("small").textContent=venus?"Cycle d’Élévation":mars?"Cycle du Sol":"Cycle de l’Aube";$(".contract-top span").textContent=venus?"☷ Traversée atmosphérique":mars?"☷ Mission coloniale":"☷ Contrat météo";$(".pressure-copy span").textContent=venus?"Charge héliostatique":mars?"Charge électrostatique":"Pression atmosphérique";
  const tabButtons=$$(".tabs button");if(tabButtons[0])tabButtons[0].childNodes[1].textContent=venus?" Aérostats ":mars?" Machines ":" Automates ";if(tabButtons[1])tabButtons[1].childNodes[1].textContent=venus?" Alchimies ":mars?" Protocoles ":" Innovations ";if(tabButtons[2])tabButtons[2].childNodes[1].textContent=venus?" Strates ":mars?" Doctrine ":" Stratégie ";if(tabButtons[3])tabButtons[3].childNodes[1].textContent=venus?" Chroniques ":mars?" Mémoire ":" Archives";
  const strategyPage=$("#strategyPage");strategyPage.querySelector(".panel-head .eyebrow").textContent=venus?"Architecture atmosphérique":mars?"Doctrine de colonie":"Choix d’ère";const sectionHeadings=$$("#strategyPage .path-section h2");if(sectionHeadings[0])sectionHeadings[0].textContent=venus?"Disciplines de strate":mars?"Protocoles de doctrine":"Recherches de voie";if(sectionHeadings[1])sectionHeadings[1].textContent=venus?"Monuments flottants":mars?"Mégastructures":"Projets monumentaux";$(".relic-section span").textContent=venus?"💠 Sceaux atmosphériques":mars?"🔶 Artéfacts conservés":"✦ Reliques conservées";$("#recordsPage .eyebrow").textContent=venus?"Observatoire de Maxwell":mars?"Mémoire centrale":"Observatoire";$("#recordsPage h1").textContent=venus?"Chroniques vénusiennes":mars?"Archives martiennes":"Archives célestes";
  $("#prestigeDialog .eyebrow").textContent=venus?"Nouvelle Élévation":mars?"Nouveau Sol":"Nouveau cycle";$("#prestigeDialog h2").textContent=venus?"Élever les cités ?":mars?"Achever ce Sol ?":"Déclencher l’Aube ?";$("#confirmPrestige").textContent=venus?"Atteindre la strate suivante":mars?"Commencer le nouveau Sol":"Commencer le nouveau cycle";$("#dawnDialog .eyebrow").textContent=venus?"Mémoire des aérostats":mars?"Mémoire de la colonie":"Héritage permanent";$("#dawnDialog h2").textContent=venus?"Constellation des Élévations":mars?"Constellation des Sols":"Constellation des Aubes";$("#dawnDialog>p:not(.eyebrow)").textContent=venus?"Chaque Élévation fait monter les cités dans l’atmosphère. Dépense-les pour modifier tous tes futurs archipels.":mars?"Chaque Sol provient d’un redémarrage de la colonie. Dépense-les pour modifier toutes tes implantations futures.":"Chaque Aube provient d’un redémarrage. Dépense-les pour modifier toutes tes ères futures.";$(".dawn-balance span").textContent=venus?"Élévations disponibles":mars?"Sols disponibles":"Aubes disponibles";$("#helpDialog h2").textContent=venus?"Des cités au-dessus de l’enfer":mars?"Une planète à réveiller":"Une météo sans limite";$("#helpDialog ol").innerHTML=venus?"<li>Presse le noyau solaire et déploie les premiers aérostats.</li><li>Active la surcadence pour produire ×25, mais coupe-la avant 100 % de corrosion.</li><li>Les 32 machines possèdent 20 caps jusqu’à 500 000 exemplaires.</li><li>Lance quatre grands chantiers : ils progressent même lorsque le jeu est fermé.</li><li>Chaque Élévation ouvre une nouvelle strate et renforce durablement l’archipel.</li><li>Unis les cités sous la Couronne de Lucifer pour achever l’Ascension.</li>":mars?"<li>Presse le noyau de poussière et déploie les premières machines.</li><li>Les 30 automates possèdent 20 caps très différents, jusqu’à 50 000 exemplaires.</li><li>Observe la résonance orbitale : les anciennes machines peuvent redevenir dominantes.</li><li>Les missions coloniales et anomalies accélèrent la terraformation.</li><li>Chaque Sol permet de choisir une doctrine et d’inscrire de nouveaux héritages.</li><li>Le Cœur de Mars exige une conquête complète et une quantité extrême de grains.</li>":"<li>Presse le nuage et construis tes premiers automates.</li><li>Chaque automate possède 16 paliers, de 1 à 2 500 exemplaires.</li><li>Les innovations apparaissent lorsque leurs conditions sont remplies, puis disparaissent après achat.</li><li>Les contrats météo donnent des objectifs temporaires ; chaque réussite augmente durablement la production.</li><li>Capture les phénomènes rares pour profiter de leur bonus temporaire.</li><li>Une fois l’objectif d’ère atteint, redémarre pour gagner une Aube et améliorer la Constellation.</li>";
}
function refreshLanguagePicker(){if(!els.languageButton||!els.languageMenu)return;const english=state.settings.language==="en";els.languageButton.textContent=english?"🇬🇧":"🇫🇷";els.languageButton.setAttribute("aria-label",english?"Choose language":"Choisir la langue");els.languageButton.setAttribute("aria-expanded",String(!els.languageMenu.hidden));els.languageMenu.querySelectorAll?.("[data-language]").forEach(button=>button.classList.toggle("active",button.dataset.language===state.settings.language))}
function setLanguage(language){state.settings.language=language==="en"?"en":"fr";GameI18N.setLocale(state.settings.language);refreshLanguagePicker();applyPlanetTheme();render(true);save()}
function applySettings(){document.body.classList.toggle("reduced-effects",!state.settings.effects);GameI18N.setLocale(state.settings.language);$("#effectsButton").textContent=state.settings.effects?"Réduire les animations":"Réactiver les animations";refreshLanguagePicker()}
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
els.buyAllUpgrades.addEventListener("click",buyAllAvailableUpgrades);
$(".buy-modes").addEventListener("click",event=>{const button=event.target.closest("[data-mode]");if(!button)return;state.buyMode=button.dataset.mode;$$('[data-mode]').forEach(b=>b.classList.toggle("active",b===button));render(true)});
$(".tabs").addEventListener("click",event=>{const button=event.target.closest("[data-tab]");if(!button)return;$$('[data-tab]').forEach(b=>b.classList.toggle("active",b===button));$$('.tab-page').forEach(p=>{const active=p.id===`${button.dataset.tab}Page`;p.classList.toggle("active",active);p.hidden=!active});render(true)});
els.prestigeButton.addEventListener("click",openPrestige);$("#confirmPrestige").addEventListener("click",prestige);
$("#dawnTreeButton").addEventListener("click",()=>{renderDawnTree();els.dawnDialog.showModal()});
els.dawnTree.addEventListener("click",event=>{const button=event.target.closest("[data-dawn]");if(button)buyDawn(button.dataset.dawn)});
els.pathPicker.addEventListener("click",event=>{const button=event.target.closest("[data-path-choice]");if(button)selectPath(button.dataset.pathChoice)});
els.pathTechList.addEventListener("click",event=>{const button=event.target.closest("[data-path-tech]");if(button)buyPathTech(button.dataset.pathTech)});
els.projectList.addEventListener("click",event=>{const button=event.target.closest("[data-project]");if(button)buyProject(button.dataset.project)});
els.bossCard.addEventListener("click",event=>{if(event.target.closest("[data-start-boss]"))startBoss()});
els.finalProject.addEventListener("click",event=>{if(event.target.closest("[data-build-final]"))buildFinal();if(event.target.closest("[data-open-finale]")){prepareFinale();els.finale.showModal()}});
els.eventBanner.addEventListener("click",claimEvent);
els.overdriveButton.addEventListener("click",toggleVenusOverdrive);
els.venusConstructionList.addEventListener("click",event=>{const button=event.target.closest("[data-venus-project]");if(button)startVenusConstruction(button.dataset.venusProject)});
els.languageButton.addEventListener("click",()=>{els.languageMenu.hidden=!els.languageMenu.hidden;refreshLanguagePicker()});
els.languageMenu.addEventListener("click",event=>{const button=event.target.closest("[data-language]");if(!button)return;els.languageMenu.hidden=true;setLanguage(button.dataset.language)});
document.addEventListener("click",event=>{if(!event.target.closest(".language-picker")&&!els.languageMenu.hidden){els.languageMenu.hidden=true;refreshLanguagePicker()}});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!els.languageMenu.hidden){els.languageMenu.hidden=true;refreshLanguagePicker()}});
$("#newGamePlusButton").addEventListener("click",beginNewGamePlus);
els.sound.addEventListener("click",()=>{state.sound=!state.sound;els.sound.setAttribute("aria-pressed",state.sound);els.sound.textContent=state.sound?"♪":"×";els.sound.setAttribute("aria-label",state.sound?"Désactiver les sons":"Activer les sons");save()});
$("#helpButton").addEventListener("click",()=>els.help.showModal());
$("#exportSave").addEventListener("click",exportSave);$("#importSave").addEventListener("click",()=>$("#importFile").click());$("#importFile").addEventListener("change",event=>importSave(event.target.files?.[0]));
$("#effectsButton").addEventListener("click",()=>{state.settings.effects=!state.settings.effects;applySettings();save()});
$$('[data-close]').forEach(button=>button.addEventListener("click",()=>$("#"+button.dataset.close).close()));
[$("#helpDialog"),$("#prestigeDialog"),$("#dawnDialog")].forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()}));
$("#resetButton").addEventListener("click",()=>{if(confirm("Effacer toute la progression, y compris les planètes et les Aubes ?")){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(LEGACY_SAVE_KEY);configurePlanet("earth");state=initialState("earth");initialized=true;els.help.close();applyPlanetTheme();render(true);save()}});

setInterval(()=>{if(!initialized)return;const current=now(),delta=Math.min(1,Math.max(0,(current-state.lastTick)/1000));updateVenusSystems(delta);const gain=production()*delta;addDrops(gain);state.lastTick=current;updateContract();updateEvents();updateExpedition();updateAchievements();render()},250);
setInterval(save,10000);window.addEventListener("beforeunload",save);applyPlanetTheme();applySettings();render(true);synchronizeAndRestore();
