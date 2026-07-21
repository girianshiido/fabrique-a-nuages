import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const file = fs.readFileSync(new URL("../i18n.js", import.meta.url), "utf8");
const exposed = file.replace(
  'return {get locale(){return locale},setLocale(next){locale=next==="en"?"en":"fr";localize()},translate,localize};',
  'return {get locale(){return locale},setLocale(next){locale=next==="en"?"en":"fr";localize()},translate,localize,dynamic};'
);
const context = {window:{},document:{},NodeFilter:{}};
vm.createContext(context);
vm.runInContext(exposed, context);
const translate = context.window.GameI18N.dynamic;

const cases = [
  ["Réserve : 1.00 M gouttes · 90 s. Il faudra aussi 3 averses déclenchées.", "Reserve: 1.00 M drops · 90 s. You must also complete 3 triggered showers."],
  ["Réserve : 1.00 Qa grains · 90 s. Il faudra aussi 2 phénomènes capturés.", "Reserve: 1.00 Qa grains · 90 s. You must also complete 2 captured phenomena."],
  ["Réserve : 2.43 Sp lumens · 90 s. Il faudra aussi 25 clics concentrés.", "Reserve: 2.43 Sp lumens · 90 s. You must also complete 25 focused clicks."],
  ["Tempête-boss : Tempête parfaite ! 🌧️ 3 averses déclenchées.", "Storm boss: Perfect storm! 🌧️ 3 triggered showers."],
  ["Phénomène-boss : Déluge sulfurique ! ☝️ 25 clics concentrés.", "Boss phenomenon: Sulfur deluge! ☝️ 25 focused clicks."],
  ["Le phénomène-boss s’est dissipé. Prépare une nouvelle tentative.", "The boss phenomenon has dissipated. Prepare a new attempt."],
  ["Phase 2 : la tempête se renforce !", "Phase 2: the storm intensifies!"],
  ["Déluge sulfurique vaincue !", "Sulfur deluge defeated!"],
  ["Percée solaire déclenchée : production ×25 !", "Solar breakthrough triggered: ×25 production!"],
  ["Cette ère a produit 1.00 B lumens. Une nouvelle Élévation sera disponible, et ta prochaine voie définira le rythme du cycle.", "This era produced 1.00 B lumens. A new Elevation will be available, and your next path will set the cycle's pace."],
  ["Il faut produire 1.00 B lumens dans cette ère avant de pouvoir recommencer.", "You need to produce 1.00 B lumens this era before restarting."],
  ["Élévation 4 reçue — +1 · 4 disponibles", "Elevation 4 received — +1 · 4 available"],
  ["Contrat réussi : +1.00 B lumens", "Contract completed: +1.00 B lumens"],
  ["Porte d’Hélios achevé : relique obtenue", "Helios gate completed: relic acquired"],
  ["Première lueur d’or inscrite dans la Constellation", "First golden gleam recorded in the Constellation"],
  ["Écope à acide : cap des 500", "Acid scoop: milestone 500"],
  ["Retour à la fabrique : +1.00 B gouttes en 5 min.", "Back at the Cloudworks: +1.00 B drops in 5 min."],
  ["Havre d’Ishtar achevé dans les nuages", "Ishtar Haven completed among the clouds"],
  ["Nouvelle strate stabilisée : Havre d’Ishtar", "New stratum stabilized: Ishtar Haven"],
  ["Chantier lancé : Couronne de Lucifer", "Construction started: Lucifer Crown"],
  ["Gants vitrifiés installée !", "Vitrified gloves installed!"],
  ["4 Protocoles installés !", "4 Protocols installed!"],
  ["Nouveau contrat : Impulsion héliostatique", "New contract: Heliostatic impulse"],
  ["Expédition : Déluge sulfurique", "Expedition: Sulfur deluge"],
  ["Succès : Gardien d’Ishtar", "Achievement: Keeper of Ishtar"],
  ["Écope à acide découvert", "Acid scoop discovered"],
  ["+30 % de production permanente", "+30% permanent production"],
  ["Surcadence active : production ×25, corrosion +8 %/s.", "Overdrive active: ×25 production, corrosion +8%/s."],
  ["Refroidissement forcé des structures flottantes.", "Forced cooling of the floating structures."]
];

for (const [source, expected] of cases) {
  assert.equal(translate(source), expected, `Traduction incorrecte : ${source}`);
}

console.log("✓ Traductions dynamiques Terre, Mars et Vénus validées");
