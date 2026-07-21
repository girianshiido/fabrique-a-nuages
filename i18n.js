"use strict";

window.GameI18N=(()=>{
  let locale="fr";
  const pairs=source=>Object.fromEntries(source.trim().split("\n").map(line=>line.split("|")));
  const en=pairs(`
La Fabrique à Nuages|The Cloudworks
L’empire météo|The weather empire
La Colonie Rouge|The Red Colony
L’éveil de Mars|Mars awakened
Les Cités du Crépuscule|The Twilight Cities
L’ascension de Vénus|The ascent of Venus
gouttes|drops
grains|grains
lumens|lumens
Bonus permanent|Permanent bonus
Phénomène rare|Rare phenomenon
Production manuelle|Manual production
Ciel calme|Clear skies
Crépuscule stable|Stable twilight
Pression atmosphérique|Atmospheric pressure
Charge électrostatique|Electrostatic charge
Charge héliostatique|Heliostatic charge
Condensation manuelle|Manual condensation
Extraction manuelle|Manual extraction
Captation manuelle|Manual capture
Système vénusien|Venus system
Surcadence ×25|Overdrive ×25
Corrosion|Corrosion
Grands chantiers|Great works
Cette ère|This era
Depuis l’origine|All time
Temps de jeu|Play time
Automates|Machines
☷ Contrat météo|☷ Weather contract
☷ Mission coloniale|☷ Colonial mission
☷ Traversée atmosphérique|☷ Atmospheric crossing
Cycle de l’Aube|Dawn cycle
Cycle du Sol|Sol cycle
Cycle d’Élévation|Elevation cycle
Encore inaccessible|Not yet reachable
Gestion de la fabrique|Factory management
Innovations|Innovations
Protocoles|Protocols
Alchimies|Alchemy
Stratégie|Strategy
Doctrine|Doctrine
Strates|Strata
Archives|Archives
Mémoire|Memory
Chroniques|Chronicles
Chaîne de production|Production line
Complexe de terraformation|Terraforming complex
Archipel atmosphérique|Atmospheric archipelago
Automates météo|Weather machines
Automates martiens|Martian machines
Machines flottantes|Floating machines
Quantité d’achat|Purchase quantity
Max|Max
Laboratoire|Laboratory
Innovations disponibles|Available innovations
Protocoles disponibles|Available protocols
Alchimies disponibles|Available alchemy
Achetées = remplacées|Bought = replaced
Tout acheter|Buy all
innovations installées|innovations installed
paliers d’automates|machine milestones
Prochaines recherches|Upcoming research
Observatoire|Observatory
Observatoire de Maxwell|Maxwell Observatory
Archives célestes|Celestial archives
Archives martiennes|Martian archives
Chroniques vénusiennes|Venus chronicles
Ascension de la fabrique|Factory ascent
Choix d’ère|Era choice
Doctrine de colonie|Colony doctrine
Architecture atmosphérique|Atmospheric architecture
Aucune voie choisie|No path selected
Une Aube débloque la première spécialisation.|A Dawn unlocks your first specialization.
Recherches de voie|Path research
Protocoles de doctrine|Doctrine protocols
Disciplines de strate|Strata disciplines
Projets monumentaux|Monumental projects
Mégastructures|Megastructures
Monuments flottants|Floating monuments
Une relique par projet|One relic per project
✦ Reliques conservées|✦ Preserved relics
🔶 Artéfacts conservés|🔶 Preserved artefacts
💠 Sceaux atmosphériques|💠 Atmospheric seals
Expédition du Multivers|Multiverse expedition
Conquête de Mars|Mars conquest
Ascension de Vénus|Venus ascent
Succès|Achievements
Nouveau cycle|New cycle
Nouvelle Élévation|New Elevation
Nouveau Sol|New Sol
Déclencher l’Aube ?|Trigger the Dawn?
Achever ce Sol ?|Complete this Sol?
Élever les cités ?|Raise the cities?
Tu perds|You lose
Tu conserves|You keep
Gouttes, automates<br>et innovations|Drops, machines<br>and innovations
Commencer le nouveau cycle|Start the new cycle
Commencer le nouveau Sol|Start the new Sol
Atteindre la strate suivante|Reach the next stratum
Héritage permanent|Permanent legacy
Mémoire de la colonie|Colony memory
Mémoire des aérostats|Aerostat memory
Constellation des Aubes|Dawn constellation
Constellation des Sols|Sol constellation
Constellation des Élévations|Elevation constellation
Aubes disponibles|Available Dawns
Sols disponibles|Available Sols
Élévations disponibles|Available Elevations
Expédition accomplie|Expedition complete
Nouvelle Météo+|New Weather+
Ouvrir un nouveau multivers|Open a new multiverse
Continuer cette météo|Continue this weather
Guide de l’observateur|Observer’s guide
Une météo sans limite|Weather without limits
Une planète à réveiller|A planet to awaken
Des cités au-dessus de l’enfer|Cities above hell
Exporter la sauvegarde|Export save
Importer une sauvegarde|Import save
Réduire les animations|Reduce animations
Réactiver les animations|Restore animations
Effacer définitivement la sauvegarde|Permanently erase save
Fermer|Close
Activer|Activate
Couper|Stop
Construit|Built
Construction|Construction
Strate précédente requise|Previous stratum required
Surcadence suspendue — refroidissement des aérostats.|Overdrive paused — aerostats are cooling.
SURCADENCE ×25 — surveille la corrosion !|OVERDRIVE ×25 — watch the corrosion!
Corrosion critique — surcadence verrouillée 45 secondes !|Critical corrosion — overdrive locked for 45 seconds!
Surcadence active : production ×25, corrosion +8 %/s.|Overdrive active: ×25 production, corrosion +8%/s.
Alerte : la corrosion approche de la zone critique.|Warning: corrosion is approaching the critical zone.
Danger critique : coupe la surcadence avant le verrouillage !|Critical danger: stop overdrive before lockout!
Refroidissement forcé des structures flottantes.|Forced cooling of the floating structures.
Produit 25× plus vite pendant environ 12 secondes.|Produces 25× faster for about 12 seconds.
Nouvelle traversée en préparation|New crossing being prepared
Nouvelle mission en préparation|New mission being prepared
Nouveau front en préparation|New front being prepared
La prochaine mission atmosphérique arrive sous peu.|The next atmospheric mission is coming soon.
La prochaine mission coloniale arrive sous peu.|The next colonial mission is coming soon.
Le prochain contrat météo arrive sous peu.|The next weather contract is coming soon.
Première lueur|First light
Main rapide|Quick hand
Sommeil profond|Deep sleep
Âme d’orage|Storm soul
Air léger|Light air
Prisme céleste|Celestial prism
Maître des contrats|Contract master
Horizon large|Wide horizon
Né prêt|Born ready
Météo éternelle|Eternal weather
Éclair d’aube|Dawn flare
Arc-en-ciel prismatique|Prismatic rainbow
Supercellule captive|Captured supercell
Front doré|Golden front
Aurore contractuelle|Contract aurora
Prisme de Phobos|Phobos prism
Diable de poussière|Dust devil
Filon d’orichalque|Orichalcum vein
Aurore de Déimos|Deimos aurora
Éruption d’Olympus|Olympus eruption
Halo d’Aphrodite|Aphrodite halo
Cyclone sulfurique|Sulfur cyclone
Trouée solaire|Solar opening
Messager d’Ishtar|Ishtar messenger
Flash de Lucifer|Lucifer flash
Impulsion manuelle|Manual impulse
Réserve d’humidité|Moisture reserve
Montée en cadence|Ramp-up
Maître des orages|Storm master
Ingénieur des nuages|Cloud engineer
Chronomancien climatique|Weather chronomancer
Dominateur des poussières|Dust dominator
Bâtisseur de dômes|Dome builder
Navigateur de Phobos|Phobos navigator
Maître de la corrosion|Corrosion master
Architecte des strates|Strata architect
Navigateur du crépuscule|Twilight navigator
Havre d’Ishtar|Ishtar Haven
Ancrage d’Aphrodite|Aphrodite Anchor
Voile d’Hélios|Helios Veil
Couronne de Lucifer|Lucifer Crown
Ventilateur|Fan
Cerf-volant|Kite
Ballon-sonde|Weather balloon
Tour d’orage|Storm tower
Serre à brume|Mist greenhouse
Phare à halos|Halo lighthouse
Zeppelin-citerne|Tanker zeppelin
Glacier portatif|Portable glacier
Moulin de mousson|Monsoon mill
Forge-foudre|Lightning forge
Satellite pluviomètre|Rain gauge satellite
Accélérateur de jet-stream|Jet stream accelerator
Réacteur cyclonique|Cyclone reactor
Collecteur d’aurores|Aurora collector
Puits lunaire|Lunar well
Cité-nuage|Cloud city
Terraformeur planétaire|Planetary terraformer
Comète irrigatrice|Irrigating comet
Condenseur stellaire|Stellar condenser
Nébuleuse-usine|Factory nebula
Pulsar hydraulique|Hydraulic pulsar
Spirale galactique|Galactic spiral
Singularité humide|Wet singularity
Météore du multivers|Multiverse meteor
Pelle à régolithe|Regolith scoop
Tique solaire|Solar tick
Chenillette d’Arès|Ares crawler
Foreuse polaire|Polar drill
Mousse à oxygène|Oxygen moss
Imprimante de dômes|Dome printer
Filet de Phobos|Phobos net
Pompe à saumure|Brine pump
Fonderie cramoisie|Crimson foundry
Train de Valles|Valles train
Voile de poussière|Dust sail
Ferme de cratère|Crater farm
Robinet magmatique|Magma tap
Miroir orbital|Orbital mirror
Moulin de Phobos|Phobos mill
Ascenseur de Déimos|Deimos lift
Graine de terraformation|Terraforming seed
Esprit de canyon|Canyon mind
Batterie aurorale|Aurora battery
Ascenseur du noyau|Core elevator
Moteur planétaire|Planet engine
Laisse solaire|Solar tether
Four à réalités|Reality kiln
Carrière temporelle|Time quarry
Oasis quantique|Quantum oasis
Singularité rouge|Red singularity
Serre cosmique|Cosmic greenhouse
Colosse d’Arès|Ares colossus
Réacteur d’univers|Universe reactor
Cœur de Mars|Heart of Mars
Écope à acide|Acid scoop
Mite solaire|Solar moth
Cerf-volant barométrique|Barometric kite
Aérostat d’Aphrodite|Aphrodite aerostat
Jardin de soufre|Sulfur garden
Bocal à éclairs|Lightning jar
Esquif des nuages|Cloud skiff
Raffinerie acide|Acid refinery
Verger du crépuscule|Twilight orchard
Ascenseur d’Ishtar|Ishtar lift
Forge anticorrosion|Anti-corrosion forge
Voile héliostatique|Heliostatic sail
Palais des tempêtes|Storm palace
Baleine de soufre|Sulfur whale
Miroir de Lakshmi|Lakshmi mirror
Arrondissement flottant|Floating borough
Océan suspendu|Suspended ocean
Moteur d’aurore|Dawn engine
Réseau de Maxwell|Maxwell array
Siphon mantellique|Mantle tap
Couronne solaire|Solar crown
Esprit atmosphérique|Atmospheric mind
Singularité sulfurée|Sulfur singularity
Pont d’Hélios|Helios bridge
Archipel céleste|Celestial archipelago
Étoile acide|Acid star
Fonderie photonique|Photon foundry
Titan d’Ishtar|Ishtar titan
Ballon-monde|World balloon
Moteur de Lucifer|Lucifer engine
Conscience de Vénus|Venus consciousness
Empire de l’Aube|Empire of Dawn
Pousse les premiers cumulus|Pushes the first cumulus clouds
Capture les filaments d’humidité|Captures strands of moisture
Condense les courants froids|Condenses cold currents
Domestique les averses électriques|Tames electrical showers
Fait pousser des nappes de brouillard|Grows sheets of mist
Tisse la lumière dans la vapeur|Weaves light into vapour
Récolte des océans suspendus|Harvests suspended oceans
Refroidit des vallées entières|Cools entire valleys
Fait tourner les saisons humides|Turns the wet seasons
Martèle des éclairs liquides|Hammers liquid lightning
Cartographie chaque goutte du globe|Maps every drop on the globe
Plie les rivières du ciel|Bends the rivers of the sky
Compacte les tempêtes en énergie|Compacts storms into energy
Distille le vent solaire|Distils the solar wind
Pompe les marées atmosphériques|Pumps atmospheric tides
Une métropole dédiée à la pluie|A metropolis devoted to rain
Réécrit le climat d’un monde|Rewrites a world’s climate
Sème de la glace entre les planètes|Sows ice between planets
Essore la couronne des étoiles|Wringes the crowns of stars
Assemble des nuages interstellaires|Assembles interstellar clouds
Pulse des déluges relativistes|Pulses relativistic deluges
Fait tourner des milliards de climats|Turns billions of climates
Condense au-delà des lois physiques|Condenses beyond physical laws
Fait pleuvoir sur toutes les réalités|Makes it rain across all realities
Ramasse les premiers grains rouges|Gathers the first red grains
Boit la lumière au bord du dôme|Drinks light at the edge of the dome
Laboure les plaines ferrugineuses|Ploughs the iron plains
Extrait la glace enfouie|Extracts buried ice
Respire sous verre blindé|Breathes under armoured glass
Imprime des quartiers pressurisés|Prints pressurised districts
Capture les poussières orbitales|Captures orbital dust
Réveille les mers fossiles|Awakens fossil seas
Coule le fer de la planète|Casts the planet’s iron
Traverse les canyons sans fin|Crosses endless canyons
Transforme les tempêtes en poussée|Turns storms into thrust
Cultive sous un ciel couleur cuivre|Cultivates beneath a copper sky
Soutire la chaleur du manteau|Draws heat from the mantle
Réveille une vallée à la fois|Awakens one valley at a time
Moud une lune en énergie|Grinds a moon into energy
Relie le sol au vide|Connects the ground to the void
Programme une atmosphère future|Programs a future atmosphere
Calcule dans les falaises|Computes in the cliffs
Stocke les nuits électriques|Stores electric nights
Remonte le métal liquide|Brings up liquid metal
Déplace Mars sur son orbite|Moves Mars along its orbit
Attache la colonie au Soleil|Tethers the colony to the Sun
Cuit des futurs habitables|Bakes habitable futures
Extrait les secondes fossiles|Extracts fossil seconds
Irrigue plusieurs Mars à la fois|Irrigates several Mars at once
Compacte une planète jumelle|Compacts a twin planet
Fait pousser des systèmes solaires|Grows solar systems
Très rare : chaque cap vaut mille mondes, et réclame une nouvelle ère de ressources|Very rare: each milestone is worth a thousand worlds and demands a new era of resources
Alimente toutes les colonies possibles|Powers every possible colony
Réveille enfin la planète entière|Finally awakens the whole planet
Récolte les premières perles sulfurées|Harvests the first sulfur pearls
Boit la lumière dans les nuages jaunes|Drinks light in yellow clouds
Plane dans une atmosphère écrasante|Glides through a crushing atmosphere
Porte un atelier au-dessus de l’acide|Carries a workshop above the acid
Fleurit sous un ciel sans bleu|Blooms beneath a sky without blue
Embouteille les orages vénusiens|Bottles Venusian storms
Traverse les courants corrosifs|Crosses corrosive currents
Transforme les pluies mortelles en énergie|Turns lethal rain into energy
Cultive dans la bande habitable|Cultivates in the habitable band
Relie deux strates atmosphériques|Links two atmospheric strata
Fabrique des alliages qui défient Vénus|Makes alloys that defy Venus
Oriente une aube entière vers la cité|Turns an entire dawn toward the city
Gouverne les vents super-rotatifs|Rules the super-rotating winds
Nage lentement dans les nuages d’or|Swims slowly through golden clouds
Réfléchit le Soleil sous les continents|Reflects the Sun beneath continents
Une ville complète dérive au crépuscule|A complete city drifts at twilight
Retient une mer au-dessus d’une planète sèche|Holds a sea above a dry planet
Fait lever le jour sur commande|Makes daylight rise on command
Cartographie chaque éclair de la planète|Maps every lightning bolt on the planet
Puise sous les plaines brûlantes|Draws from beneath the burning plains
Coiffe Vénus d’un anneau de lumière|Crowns Venus with a ring of light
Pense à la vitesse des vents|Thinks at the speed of wind
Compacte les nuages en mondes minuscules|Compacts clouds into tiny worlds
Relie directement Vénus au Soleil|Links Venus directly to the Sun
Des milliers de cités forment un continent|Thousands of cities form a continent
Allume un astre dans la haute atmosphère|Lights a star in the upper atmosphere
Coule la lumière comme un métal|Casts light like metal
Porte une strate entière sur ses épaules|Carries an entire stratum on its shoulders
Une biosphère entière flotte sous sa coque|A whole biosphere floats beneath its hull
Déplace les cités entre les aurores|Moves cities between dawns
Éveille la planète derrière ses nuages|Awakens the planet behind its clouds
Règne sur toutes les Vénus possibles|Rules every possible Venus
Gants en vapeur|Vapour gloves
Doublure argentée|Silver lining
Baromètre sensible|Sensitive barometer
Courant ascendant|Updraft
Équipe de nuit|Night shift
Danse de la pluie|Rain dance
Engrenages précis|Precision gears
Prévision parfaite|Perfect forecast
Orage en bouteille|Storm in a bottle
Doigts électrostatiques|Electrostatic fingers
Capsule temporelle|Time capsule
Union des nuages|Cloud union
Goutte quantique|Quantum drop
Pluie persistante|Lasting rain
Matière légère|Light matter
Oracle climatique|Weather oracle
Œil du cyclone|Eye of the cyclone
Pluie dorée|Golden rain
Relève cosmique|Cosmic shift
Ciel sans bord|Boundless sky
Gants de régolithe|Regolith gloves
Plaque de titane|Titanium plate
Sismographe rouge|Red seismograph
Bras pressurisé|Pressurised arm
Équipe du sol nocturne|Night Sol crew
Danse des poussières|Dust dance
Rouages martiens|Martian gears
Oracle de Phobos|Phobos oracle
Tempête en capsule|Storm capsule
Doigts ionisés|Ionised fingers
Archive cryogénique|Cryogenic archive
Union des dômes|Dome union
Grain quantique|Quantum grain
Tourbillon persistant|Lasting vortex
Alliage léger|Light alloy
IA d’Arès|Ares AI
Œil du cratère|Eye of the crater
Poussière dorée|Golden dust
Relève de Déimos|Deimos shift
Mars sans limite|Boundless Mars
Gants vitrifiés|Vitrified gloves
Doublure d’or|Golden lining
Baromètre d’Ishtar|Ishtar barometer
Bras héliostatique|Heliostatic arm
Équipe du crépuscule|Twilight crew
Danse sulfurique|Sulfur dance
Rouages anticorrosion|Anti-corrosion gears
Oracle de Maxwell|Maxwell oracle
Foudre en ampoule|Lightning in a bulb
Doigts photoniques|Photon fingers
Capsule d’aérostat|Aerostat capsule
Union des strates|Strata union
Lumen quantique|Quantum lumen
Cyclone persistant|Lasting cyclone
Matière flottante|Floating matter
IA d’Aphrodite|Aphrodite AI
Œil de Lucifer|Eye of Lucifer
Pluie d’or|Golden rain
Relève solaire|Solar shift
Vénus sans limite|Boundless Venus
Premier souffle|First breath
Équipe complète|Full crew
Rythme de croisière|Cruising rhythm
Quart de cent|Quarter hundred
Essaim coordonné|Coordinated swarm
Haute cadence|High cadence
Cap du cent|Hundred mark
Mécanique céleste|Celestial mechanics
Double centaine|Double hundred
Production orbitale|Orbital production
Climat industriel|Industrial climate
Grand cycle|Great cycle
Maîtrise des flux|Flow mastery
Cap du millier|Thousand mark
Horizon absolu|Absolute horizon
Transcendance|Transcendence
Premier grain|First grain
Escouade rouge|Red squad
Dôme autonome|Autonomous dome
Quart de colonie|Colony quarter
Cadence d’Arès|Ares cadence
Convoi complet|Full convoy
Centurie mécanique|Mechanical century
Orbites couplées|Coupled orbits
Double cohorte|Double cohort
Forge profonde|Deep forge
Réseau cramoisi|Crimson network
Réveil du cinq-centième|Five-hundredth awakening
Essaim polaire|Polar swarm
Millier rouge|Red thousand
Horizon de Phobos|Phobos horizon
Transmutation|Transmutation
Marée de régolithe|Regolith tide
Dix mille soleils|Ten thousand suns
Empire souterrain|Underground empire
Mars absolue|Absolute Mars
Premier éclat|First gleam
Nacelle formée|Gondola formed
Escadrille d’or|Golden squadron
Quartier flottant|Floating district
Couronne acide|Acid crown
Centurie d’aérostats|Aerostat century
Double voile|Double veil
Ciel habité|Inhabited sky
Cap des cinq cents|Five-hundred mark
Flotte crépusculaire|Twilight fleet
Premier millier|First thousand
Strate conquise|Stratum conquered
Archipel suspendu|Suspended archipelago
Cinq mille soleils|Five thousand suns
Dix mille cités|Ten thousand cities
Océan de ballons|Ocean of balloons
Voûte vivante|Living vault
Cent mille arches|One hundred thousand arches
Empire des nuages|Empire of clouds
Vénus transcendée|Venus transcended
Première goutte|First drop
Atelier éveillé|Workshop awakened
Front signé|Front signed
Ciel vivant|Living sky
Première Aube|First Dawn
Relique gardée|Relic preserved
Voie maîtrisée|Path mastered
Supercellule|Supercell
Ciel galactique|Galactic sky
Tempête parfaite|Perfect storm
Seuil infini|Infinite threshold
Soleil domestiqué|Tamed sun
Premier million rouge|First red million
Avant-poste autonome|Autonomous outpost
Science du régolithe|Regolith science
Premier sol accompli|First Sol completed
Mur de poussière|Dust wall
Phobos asservie|Phobos subdued
Cent mille machines|One hundred thousand machines
Relique d’Arès|Ares relic
Atmosphère naissante|Emerging atmosphere
Révolte de Phobos|Phobos revolt
Colosse éveillé|Colossus awakened
Secret du cinq-centième|Five-hundredth secret
Orbite déplacée|Orbit moved
Cœur localisé|Heart located
Conscience martienne|Martian consciousness
Premier million de lumens|First million lumens
Première escadrille|First squadron
Première Élévation|First Elevation
Machine en surcadence|Machine in overdrive
Déluge sulfurique|Sulfur deluge
Bande du crépuscule|Twilight band
Ancrage planétaire|Planetary anchor
Super-rotation|Super-rotation
Haute atmosphère|Upper atmosphere
Soleil apprivoisé|Tamed sun
Cent mille aérostats|One hundred thousand aerostats
Titan d’Ishtar éveillé|Ishtar titan awakened
Empire atmosphérique|Atmospheric empire
Œil de Vénus|Eye of Venus
clics concentrés|focused clicks
averses déclenchées|showers triggered
phénomènes capturés|phenomena captured
surcadences activées|overdrives activated
Main de nuage|Cloud hand
Collecteur|Collector
Bâtisseur|Builder
Chercheur|Researcher
Contractuel|Contractor
Chasseur|Hunter
Aurore|Dawn
Conservateur|Keeper
Orageux|Stormy
Industrieux|Industrious
Hors du temps|Beyond time
Infini|Infinite
Écho des pionniers|Pioneer echo
Révolte des ateliers|Workshop revolt
Marée des colosses|Colossus tide
Percée solaire|Solar breakthrough
Surcharge rouge|Red surge
Averse|Shower
Surcadence corrosive|Corrosive overdrive
Presse le nuage et construis tes premiers automates.|Press the cloud and build your first machines.
Chaque automate possède 16 paliers, de 1 à 2 500 exemplaires.|Each machine has 16 milestones, from 1 to 2,500 copies.
Les innovations apparaissent lorsque leurs conditions sont remplies, puis disparaissent après achat.|Innovations appear when their conditions are met, then disappear after purchase.
Les contrats météo donnent des objectifs temporaires ; chaque réussite augmente durablement la production.|Weather contracts give temporary objectives; every success permanently raises production.
Capture les phénomènes rares pour profiter de leur bonus temporaire.|Capture rare phenomena for their temporary bonus.
Une fois l’objectif d’ère atteint, redémarre pour gagner une Aube et améliorer la Constellation.|Once the era target is reached, restart to earn a Dawn and improve the Constellation.
Presse le noyau de poussière et déploie les premières machines.|Press the dust core and deploy the first machines.
Les 30 automates possèdent 20 caps très différents, jusqu’à 50 000 exemplaires.|The 30 machines have 20 highly varied milestones, up to 50,000 copies.
Observe la résonance orbitale : les anciennes machines peuvent redevenir dominantes.|Watch orbital resonance: older machines can become dominant again.
Les missions coloniales et anomalies accélèrent la terraformation.|Colonial missions and anomalies accelerate terraforming.
Chaque Sol permet de choisir une doctrine et d’inscrire de nouveaux héritages.|Each Sol lets you choose a doctrine and record new legacies.
Le Cœur de Mars exige une conquête complète et une quantité extrême de grains.|The Heart of Mars requires a complete conquest and an extreme quantity of grains.
Presse le noyau solaire et déploie les premiers aérostats.|Press the solar core and deploy the first aerostats.
Active la surcadence pour produire ×25, mais coupe-la avant 100 % de corrosion.|Activate overdrive for ×25 production, but stop it before 100% corrosion.
Les 32 machines possèdent 20 caps jusqu’à 500 000 exemplaires.|The 32 machines have 20 milestones up to 500,000 copies.
Lance quatre grands chantiers : ils progressent même lorsque le jeu est fermé.|Launch four great works: they progress even while the game is closed.
Chaque Élévation ouvre une nouvelle strate et renforce durablement l’archipel.|Each Elevation opens a new stratum and permanently strengthens the archipelago.
Unis les cités sous la Couronne de Lucifer pour achever l’Ascension.|Unite the cities beneath Lucifer Crown to complete the Ascent.
La sauvegarde est automatique. L’heure réseau restitue jusqu’à 12 heures de production hors ligne.|Saving is automatic. Network time restores up to 12 hours of offline production.
Meilleure production|Best production
Clics sur le nuage|Cloud clicks
Record tous cycles|All-cycle record
Depuis l’origine|All time
Automates achetés|Machines bought
Tous cycles|All cycles
Aérostats vénusiens déployés|Venus aerostats deployed
Tous les niveaux atmosphériques|All atmospheric levels
Machines martiennes déployées|Martian machines deployed
Objectif colonial : 100 k|Colonial objective: 100k
Innovations installées|Innovations installed
Protocoles installés|Protocols installed
Alchimies installées|Alchemy installed
Contrats réussis|Contracts completed
Phénomènes capturés|Phenomena captured
Bonus météorologiques|Weather bonuses
Gains hors ligne|Offline gains
Objectif de cette ère|This era’s target
Strate|Stratum
Âge|Age
Ère|Era
Acide|Acid
Aérostats|Aerostats
Crépuscule|Twilight
Éternité|Eternity
Avant-poste|Outpost
Troposphère|Troposphere
Mousson|Monsoon
Tempête|Storm
Cosmos|Cosmos
Galaxie|Galaxy
Déclenche|Trigger
une Aube|a Dawn
un Sol|a Sol
une Élévation|an Elevation
pour choisir une spécialisation.|to choose a specialization.
Les trois voies t’attendent|The three paths await you
Orages, industrie ou maîtrise du temps.|Storms, industry, or mastery of time.
Poussières, dômes ou maîtrise des lunes.|Dust, domes, or mastery of the moons.
Corrosion, cités flottantes ou maîtrise du Soleil.|Corrosion, floating cities, or mastery of the Sun.
À l’Aube|At the Dawn
Au prochain Sol|At the next Sol
À la prochaine Élévation|At the next Elevation
Les recherches exclusives apparaîtront après le premier cycle.|Exclusive research appears after the first cycle.
Maîtrisée|Mastered
Ascension terminée|Ascent complete
Conquête terminée|Conquest complete
Expédition terminée|Expedition complete
Le Trône du Crépuscule peut maintenant unir toutes les strates.|The Twilight Throne can now unite every stratum.
Le Réacteur d’Éden peut maintenant éveiller Mars.|The Eden Reactor can now awaken Mars.
Le Climatologue du Multivers peut maintenant être construit.|The Multiverse Climatologist can now be built.
Cataclysme atmosphérique|Atmospheric cataclysm
Anomalie majeure|Major anomaly
Tempête-boss|Storm boss
Affronter le cataclysme|Face the cataclysm
Affronter l’anomalie|Face the anomaly
Affronter la tempête|Face the storm
Prochain jalon :|Next milestone:
Élève les cités et stabilise de nouvelles strates.|Raise the cities and stabilise new strata.
Développe la colonie pour poursuivre la conquête.|Develop the colony to continue the conquest.
Continue à développer la fabrique pour progresser dans l’Expédition.|Keep developing the factory to advance in the Expedition.
Empire du Crépuscule achevé|Twilight Empire complete
Cœur de Mars éveillé|Heart of Mars awakened
Climatologue du Multivers construit|Multiverse Climatologist built
Toutes les strates de Vénus brillent ensemble.|All Venus strata shine together.
La planète rouge respire enfin.|The red planet finally breathes.
Une transmission inconnue attend d’être déchiffrée.|An unknown transmission awaits decoding.
Voir l’apothéose|See the apotheosis
Voir la conclusion|See the conclusion
Ouvrir la transmission|Open the transmission
Trône du Crépuscule|Twilight Throne
Réacteur d’Éden martien|Martian Eden Reactor
Constellation incomplète :|Incomplete Constellation:
Prépare la Constellation|Prepare the Constellation
La construction ultime au cœur du crépuscule.|The ultimate construction at the heart of twilight.
La construction ultime, enfouie sous Olympus Mons.|The ultimate construction, buried beneath Olympus Mons.
La construction finale de cette météo.|The final construction of this weather.
Construire|Build
Main rouge|Red hand
Extracteur|Extractor
Colonisateur|Colonist
Protocoliste|Protocolist
Missionnaire|Mission runner
Chasseur d’anomalies|Anomaly hunter
Premier Sol|First Sol
Gardien d’Arès|Keeper of Ares
Poussiéreux|Dusty
Navigateur|Navigator
Mars infinie|Infinite Mars
Main d’or|Golden hand
Capteur|Collector
Aérostier|Aeronaut
Alchimiste|Alchemist
Chasseur de halos|Halo hunter
Gardien d’Ishtar|Keeper of Ishtar
Corrosif|Corrosive
Héliostatique|Heliostatic
Vénus infinie|Infinite Venus
`);
  const exact={...en};
  const embedded=new RegExp(Object.keys(exact).sort((a,b)=>b.length-a.length).map(value=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),"g");
  const replacements=[
    [/^À (\d+) : (.+) pendant (.+) secondes$/,"At $1: $2 for $3 seconds"],
    [/^prochain cap (.+)$/,"next milestone $1"],[/^tous les caps franchis$/,"all milestones reached"],
    [/^Acheter ×(.+)$/,"Buy ×$1"],[/^Pas encore abordable$/,"Not affordable yet"],
    [/^Prochain automate : (.+)$/,"Next machine: $1"],[/^Se révèle à (.+) ou avec (.+)$/,"Unlocks at $1 or with $2"],
    [/^\+ (.+) technologies encore inconnues$/,"+ $1 technologies still unknown"],
    [/^Réussites : (.+) · \+(.+) % production$/,"Successes: $1 · +$2% production"],
    [/^Bonus actif : (.+)$/,"Active bonus: $1"],[/^Limite (.+) h$/,"Limit $1 h"],
    [/^(.+) accomplis$/,"$1 completed"],[/^Prochaine Élévation$/,"Next Elevation"],[/^Prochain Sol$/,"Next Sol"],[/^Prochain cycle$/,"Next cycle"],
    [/^(.+) disponible(s?)$/,"$1 available$2"],[/^(.+) dépensée(s?)$/,"$1 spent"],
    [/^Construction · (.+)$/,"Construction · $1"],[/^Nécessite (.+)$/,"Requires $1"],
    [/^(.+) /,match=>match]
  ];
  const dynamic=value=>{
    if(exact[value])return exact[value];
    let out=value;
    const rules=[
      [/À (\d+) :/g,"At $1:"],[/pendant (\d+) secondes/g,"for $1 seconds"],[/prochain cap/g,"next milestone"],[/tous les caps franchis/g,"all milestones reached"],[/Acheter/g,"Buy"],[/Pas encore abordable/g,"Not affordable yet"],[/Prochain automate :/g,"Next machine:"],[/Se révèle à/g,"Unlocks at"],[/ou avec/g,"or with"],[/technologies encore inconnues/g,"technologies still unknown"],[/Réussites :/g,"Successes:"],[/production permanente/g,"permanent production"],[/production totale/g,"total production"],[/Gains hors ligne/g,"Offline gains"],[/Averses/g,"Showers"],[/Automates/g,"Machines"],[/automates/g,"machines"],[/contrat/g,"contract"],[/Contrats/g,"Contracts"],[/phénomènes rares/g,"rare events"],[/Événements rares/g,"Rare events"],[/production/g,"production"],[/clics/g,"clicks"],[/clic/g,"click"],[/avant la fin/g,"before time runs out"],[/chaque/g,"each"],[/Chaque/g,"Each"],[/toutes/g,"all"],[/Toute/g,"All"],[/moins chers/g,"cheaper"],[/plus tôt/g,"earlier"],[/secondes/g,"seconds"],[/seconde/g,"second"],[/achevé/g,"completed"],[/achevée/g,"completed"],[/construite/g,"built"],[/inscrite/g,"recorded"],[/maîtrisée/g,"mastered"],[/débloqué/g,"unlocked"],[/débloquée/g,"unlocked"]
    ];
    rules.forEach(([pattern,replacement])=>out=out.replace(pattern,replacement));
    return out.replace(embedded,match=>exact[match]);
  };
  function english(value){
    if(typeof value!=="string")return value;
    const before=value.match(/^\s*/)?.[0]||"",after=value.match(/\s*$/)?.[0]||"",core=value.slice(before.length,value.length-after.length);
    return before+dynamic(core)+after;
  }
  function translate(value){return locale==="en"?english(value):value}
  function localize(){
    document.documentElement.lang=locale;document.body.dataset.language=locale;
    if(locale==="en"){if(!localize.titleFr||document.title!==english(localize.titleFr))localize.titleFr=document.title;document.title=english(localize.titleFr)}else if(localize.titleFr){if(document.title===english(localize.titleFr))document.title=localize.titleFr;else localize.titleFr=document.title}
    const description=document.querySelector("meta[name='description']");if(description){if(locale==="en"){if(!description.dataset.i18nFr||description.content!==english(description.dataset.i18nFr))description.dataset.i18nFr=description.content;description.content=english(description.dataset.i18nFr)}else if(description.dataset.i18nFr){if(description.content===english(description.dataset.i18nFr))description.content=description.dataset.i18nFr;else description.dataset.i18nFr=description.content}}
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:node=>["SCRIPT","STYLE"].includes(node.parentElement?.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{if(locale==="en"){if(node.nodeValue!==node.i18nEn){node.i18nFr=node.nodeValue;node.i18nEn=english(node.i18nFr);node.nodeValue=node.i18nEn}}else if(node.i18nFr!=null){if(node.nodeValue===node.i18nEn)node.nodeValue=node.i18nFr;else{node.i18nFr=node.nodeValue;node.i18nEn=english(node.i18nFr)}}});
    document.querySelectorAll("[aria-label],[title]").forEach(element=>{
      const stored=element.__i18nAttributes??={};
      ["aria-label","title"].forEach(attribute=>{
        if(!element.hasAttribute(attribute))return;
        const current=element.getAttribute(attribute),entry=stored[attribute];
        if(locale==="en"){
          if(current!==entry?.english){stored[attribute]={french:current,english:english(current)};element.setAttribute(attribute,stored[attribute].english)}
        }else if(entry){
          if(current===entry.english)element.setAttribute(attribute,entry.french);
          else stored[attribute]={french:current,english:english(current)};
        }
      });
    });
  }
  return {get locale(){return locale},setLocale(next){locale=next==="en"?"en":"fr";localize()},translate,localize};
})();
