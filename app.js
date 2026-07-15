"use strict";

const SAVE_KEY = "fabrique-nuages-save-v1";
const TIME_API = "https://gettimeapi.dev/v1/time?timezone=UTC";
const PRESSURE_MAX = 20;
const RAIN_DURATION = 15;
const units = [
  { id:"fan", name:"Ventilateur", icon:"🌀", baseCost:15, production:.2, description:"Pousse les petits cumulus" },
  { id:"kite", name:"Cerf-volant", icon:"🪁", baseCost:90, production:1.2, description:"Attrape l'humidité en altitude" },
  { id:"balloon", name:"Ballon-sonde", icon:"🎈", baseCost:650, production:8, description:"Condense les courants froids" },
  { id:"tower", name:"Tour d'orage", icon:"⚡", baseCost:4200, production:42, description:"Industrialise les averses" }
];
const upgrades = [
  { id:"gloves", name:"Gants moelleux", description:"Les clics produisent ×2", cost:100, unlock:s=>s.total>=40, type:"click" },
  { id:"blades", name:"Pales en argent", description:"Les ventilateurs produisent ×2", cost:350, unlock:s=>s.owned.fan>=5, type:"fan" },
  { id:"forecast", name:"Bulletin précis", description:"Tous les automates produisent ×1,5", cost:1600, unlock:s=>s.total>=700, type:"all" },
  { id:"thunder", name:"Éclair en bouteille", description:"Les averses durent 25 s", cost:6000, unlock:s=>s.owned.tower>=1, type:"rain" }
];

const initialState = () => ({ drops:0, total:0, pressure:0, rainUntil:0, owned:{fan:0,kite:0,balloon:0,tower:0}, upgrades:[], buyMode:"1", sound:true, startedAt:Date.now(), lastTick:Date.now(), savedAt:Date.now() });
let state = load();
let clockOffset = 0;
let initialized = false;
const $ = s => document.querySelector(s);
const els = { drops:$("#dropCount"), perSecond:$("#perSecond"), perClick:$("#perClick"), total:$("#totalDrops"), time:$("#playTime"), cloud:$("#cloudButton"), pressure:$("#pressureFill"), pressureLabel:$("#pressureLabel"), pressureBar:$(".pressure-bar"), weather:$(".weather-label"), weatherText:$("#weatherText"), weatherTimer:$("#weatherTimer"), units:$("#unitList"), upgrades:$("#upgradeList"), upgradeCount:$("#upgradeCount"), toast:$("#toast"), sound:$("#soundButton"), help:$("#helpDialog"), timeStatus:$("#timeStatus") };

function load(){
  try{
    const saved=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!saved)return initialState();
    const fresh=initialState();return {...fresh,...saved,owned:{...fresh.owned,...saved.owned}};
  }catch{return initialState()}
}
function now(){return Date.now()+clockOffset}
function save(){if(!initialized)return;state.savedAt=now();localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
async function synchronizeAndRestore(){
  let networkNow=Date.now(), source="local";
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),3500), requestStart=Date.now();
  try{
    const response=await fetch(TIME_API,{cache:"no-store",signal:controller.signal});
    if(!response.ok)throw new Error("time service unavailable");
    const data=await response.json(), requestEnd=Date.now();
    networkNow=Number(data.timestamp)*1000+(requestEnd-requestStart)/2;
    if(!Number.isFinite(networkNow))throw new Error("invalid network time");
    clockOffset=networkNow-requestEnd;source="online";
  }catch{clockOffset=0;networkNow=Date.now()}
  finally{clearTimeout(timeout)}
  const elapsed=Math.min(4*3600,Math.max(0,(networkNow-(state.savedAt||networkNow))/1000));
  const offline=productionFor(state)*elapsed;
  state.drops+=offline;state.total+=offline;state.lastTick=networkNow;initialized=true;
  els.timeStatus.className=`time-status ${source}`;els.timeStatus.querySelector("span").textContent=source==="online"?"Heure réseau":"Heure locale";
  els.timeStatus.title=source==="online"?"Gains hors ligne vérifiés par une horloge réseau UTC":"Réseau indisponible : l'horloge de cet appareil est utilisée";
  if(offline>=1)toast(`Pendant ton absence : +${format(offline)} gouttes (${formatTime(elapsed)}).`);
  render();save();
}
function hasUpgrade(id,s=state){return s.upgrades.includes(id)}
function clickValue(){return hasUpgrade("gloves")?2:1}
function rainMultiplier(){return state.rainUntil>Date.now()?2:1}
function productionFor(s=state){
  let total=units.reduce((sum,u)=>sum+s.owned[u.id]*u.production*(u.id==="fan"&&hasUpgrade("blades",s)?2:1),0);
  if(hasUpgrade("forecast",s))total*=1.5;
  return total;
}
function unitCost(unit,count=1,owned=state.owned[unit.id]){let sum=0;for(let i=0;i<count;i++)sum+=unit.baseCost*Math.pow(1.15,owned+i);return Math.ceil(sum)}
function maxAffordable(unit){let count=0,cost=0;while(count<10000){const next=Math.ceil(unit.baseCost*Math.pow(1.15,state.owned[unit.id]+count));if(cost+next>state.drops)break;cost+=next;count++}return{count,cost}}
function purchaseQuote(unit){if(state.buyMode==="max")return maxAffordable(unit);const count=Number(state.buyMode),cost=unitCost(unit,count);return{count,cost}}
function buyUnit(id){const unit=units.find(u=>u.id===id),quote=purchaseQuote(unit);if(!quote.count||state.drops<quote.cost)return;state.drops-=quote.cost;state.owned[id]+=quote.count;playTone(280,.05);render();save()}
function buyUpgrade(id){const u=upgrades.find(x=>x.id===id);if(hasUpgrade(id)||state.drops<u.cost||!u.unlock(state))return;state.drops-=u.cost;state.upgrades.push(id);playTone(520,.12);toast(`${u.name} installée !`);render();save()}
function pressCloud(event){
  if(!initialized)return;
  const gain=clickValue()*rainMultiplier();state.drops+=gain;state.total+=gain;
  if(state.rainUntil<=Date.now()){
    state.pressure++;
    if(state.pressure>=PRESSURE_MAX){state.pressure=0;state.rainUntil=Date.now()+(hasUpgrade("thunder")?25:RAIN_DURATION)*1000;toast("Averse déclenchée : production ×2 !");playTone(620,.18)}
  }
  els.cloud.classList.add("pressed");setTimeout(()=>els.cloud.classList.remove("pressed"),90);
  floatNumber(event.clientX||innerWidth/2,event.clientY||innerHeight/2,`+${format(gain)}`);playTone(190+Math.min(state.pressure,20)*6,.025);render();
}
function render(){
  const raining=state.rainUntil>Date.now(), pps=productionFor()*rainMultiplier();
  els.drops.textContent=format(state.drops);els.perSecond.textContent=format(pps);els.perClick.textContent=format(clickValue()*rainMultiplier());els.total.textContent=format(state.total);
  els.pressure.style.width=`${state.pressure/PRESSURE_MAX*100}%`;els.pressureLabel.textContent=`${state.pressure} / ${PRESSURE_MAX}`;els.pressureBar.setAttribute("aria-valuenow",state.pressure);
  els.weather.classList.toggle("rain",raining);els.cloud.classList.toggle("rain",raining);els.weatherText.textContent=raining?"Averse ×2":"Ciel calme";
  els.weatherTimer.textContent=raining?`${Math.max(0,(state.rainUntil-Date.now())/1000).toFixed(1)} s`:"";
  els.time.textContent=formatTime((Date.now()-state.startedAt)/1000);
  renderUnits();renderUpgrades();
}
function renderUnits(){
  els.units.innerHTML=units.map(u=>{const q=purchaseQuote(u),disabled=!q.count||state.drops<q.cost;return `<button class="unit-card" type="button" data-unit="${u.id}" ${disabled?"disabled":""}><span class="unit-icon">${u.icon}</span><span class="unit-info"><strong>${u.name} <em>×${state.owned[u.id]}</em></strong><small>${u.description} · ${format(u.production)} / s chacun</small></span><span class="unit-buy"><b>${q.count?format(q.cost):"—"} ◆</b><small>${q.count?`Acheter ×${q.count}`:"Trop cher"}</small></span></button>`}).join("");
}
function renderUpgrades(){
  els.upgradeCount.textContent=`${state.upgrades.length} / ${upgrades.length}`;
  els.upgrades.innerHTML=upgrades.map(u=>{const bought=hasUpgrade(u.id),unlocked=u.unlock(state);return `<button class="upgrade-card ${bought?"purchased":""}" type="button" data-upgrade="${u.id}" ${bought||!unlocked||state.drops<u.cost?"disabled":""}><strong>${bought?"✓ ":unlocked?"":"🔒 "}${u.name}</strong><small>${unlocked||bought?u.description:"Continue à développer la fabrique"}</small><b>${bought?"Installée":unlocked?`${format(u.cost)} ◆`:"Verrouillée"}</b></button>`}).join("");
}
function format(n){if(n<1000)return n<10&&n%1? n.toFixed(1):Math.floor(n).toLocaleString("fr-FR");const suffix=["k","M","Md","Bn"];let i=-1;do{n/=1000;i++}while(n>=1000&&i<suffix.length-1);return `${n<10?n.toFixed(2):n<100?n.toFixed(1):Math.floor(n)} ${suffix[i]}`}
function formatTime(seconds){const m=Math.floor(seconds/60);if(m<60)return `${m} min`;return `${Math.floor(m/60)} h ${m%60} min`}
function toast(message){els.toast.textContent=message;els.toast.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>els.toast.hidden=true,3000)}
function floatNumber(x,y,text){const span=document.createElement("span");span.className="float-number";span.textContent=text;span.style.left=`${x}px`;span.style.top=`${y}px`;document.body.append(span);setTimeout(()=>span.remove(),800)}
let audioContext;
function playTone(frequency,duration){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.frequency.value=frequency;osc.type="sine";gain.gain.setValueAtTime(.035,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration)}catch{}}

els.cloud.addEventListener("click",pressCloud);
els.units.addEventListener("click",e=>{const button=e.target.closest("[data-unit]");if(button)buyUnit(button.dataset.unit)});
els.upgrades.addEventListener("click",e=>{const button=e.target.closest("[data-upgrade]");if(button)buyUpgrade(button.dataset.upgrade)});
document.querySelector(".buy-modes").addEventListener("click",e=>{const button=e.target.closest("[data-mode]");if(!button)return;state.buyMode=button.dataset.mode;document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b===button));renderUnits()});
els.sound.addEventListener("click",()=>{state.sound=!state.sound;els.sound.setAttribute("aria-pressed",state.sound);els.sound.textContent=state.sound?"♪":"×";els.sound.setAttribute("aria-label",state.sound?"Désactiver les sons":"Activer les sons");save()});
$("#helpButton").addEventListener("click",()=>els.help.showModal());$("#closeHelp").addEventListener("click",()=>els.help.close());
$("#resetButton").addEventListener("click",()=>{if(confirm("Effacer toute la progression et recommencer ?")){localStorage.removeItem(SAVE_KEY);state=initialState();els.help.close();render()}});
els.help.addEventListener("click",e=>{if(e.target===els.help)els.help.close()});

setInterval(()=>{if(!initialized)return;const current=now(),delta=Math.min(1,Math.max(0,(current-state.lastTick)/1000)),gain=productionFor()*rainMultiplier()*delta;state.drops+=gain;state.total+=gain;state.lastTick=current;render()},250);
setInterval(save,10000);window.addEventListener("beforeunload",save);render();
synchronizeAndRestore();
