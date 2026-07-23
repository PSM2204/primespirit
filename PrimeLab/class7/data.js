/* ═══════════════════════════════════════════════════════
   PRIMEQUEST — Game Data
   Chapters, Stories, Questions, Creatures, Shop, Achievements

   QUESTIONS PER CHAPTER:
   ─ Rounds 1-3 (Easy):    3 rounds × 4 levels × 6 questions = 72
   ─ Rounds 4-7 (Medium):  4 rounds × 4 levels × 6 questions = 96
   ─ Rounds 8-9 (Hard):    2 rounds × 4 levels × 6 questions = 48
   ─ Boss:                              15 questions
   ─ Total per chapter:               231 questions
   ═══════════════════════════════════════════════════════ */

const PRIMEQUEST_DATA = {

// ══════════════════════════════════════════
//  CHAPTER DEFINITIONS (18 chapters)
// ══════════════════════════════════════════
chapters: [
  { id:'nutrition_plants', name:'The Emerald Forest', icon:'🌿', color:'#22c55e', ncert:'Nutrition in Plants', rounds:9, creature:'leafix',
    boss:{name:'Chlorox the Blight Lord',title:'Guardian of Darkness',hp:150,icon:'🌑',
      phrases:['Without light there is no life!','Photosynthesis is a myth I will prove!','Darkness will consume every leaf!','You cannot restore what I have taken!','The forest falls with me!']},
    roundDefs:[
      {name:'Into the Green',diff:1,levels:4},{name:'Plant Factories',diff:1,levels:4},{name:'Root of the Problem',diff:1,levels:4},
      {name:'Sunlight Hunters',diff:2,levels:4},{name:'Sap & Struggle',diff:2,levels:4},{name:'Parasite Attack',diff:2,levels:4},{name:'The Nitrogen Path',diff:2,levels:4},
      {name:'Advanced Nutrition',diff:3,levels:4},{name:'Guardian Challenge',diff:3,levels:4}
    ]},
  { id:'nutrition_animals', name:'Kingdom of Hunger', icon:'🍽️', color:'#f97316', ncert:'Nutrition in Animals', rounds:9, creature:'digestix',
    boss:{name:'Gastrox',title:'The Indigestible',hp:160,icon:'👾',
      phrases:['Your knowledge will not be digested!','I block every enzyme!','Hunger is the only law!','Try to break down MY defenses!','The gut is MY domain!']},
    roundDefs:[
      {name:'The Hunger Begins',diff:1,levels:4},{name:'Teeth & Taste',diff:1,levels:4},{name:'Inside the Tube',diff:1,levels:4},
      {name:'Digestive Journey',diff:2,levels:4},{name:'Enzyme Warfare',diff:2,levels:4},{name:'Absorption Station',diff:2,levels:4},{name:'Amoeba\'s Meal',diff:2,levels:4},
      {name:'Complex Digestion',diff:3,levels:4},{name:'Master of Digestion',diff:3,levels:4}
    ]},
  { id:'fibre_fabric', name:'The Loom Valley', icon:'🧵', color:'#ec4899', ncert:'Fibre to Fabric', rounds:9, creature:'textilix',
    boss:{name:'Tanglora',title:'The Thread Wraith',hp:140,icon:'🕸️',
      phrases:['I will unravel everything you weave!','No fibre escapes my grasp!','The loom belongs to me!','Silk and cotton will rot!','Your thread is weak!']},
    roundDefs:[
      {name:'Fibre Basics',diff:1,levels:4},{name:'Plant Fibres',diff:1,levels:4},{name:'Animal Fibres',diff:1,levels:4},
      {name:'Spinning Magic',diff:2,levels:4},{name:'Weaving Patterns',diff:2,levels:4},{name:'From Cocoon to Cloth',diff:2,levels:4},{name:'Natural vs Synthetic',diff:2,levels:4},
      {name:'Advanced Textiles',diff:3,levels:4},{name:'Master Weaver',diff:3,levels:4}
    ]},
  { id:'heat', name:'City of Fire and Ice', icon:'🌡️', color:'#ef4444', ncert:'Heat', rounds:9, creature:'thermix',
    boss:{name:'Thermalock',title:'The Temperature Tyrant',hp:170,icon:'🔥',
      phrases:['I control all temperature!','Feel the burn of absolute zero!','Heat flows only where I command!','Conduction, convection — mine!','You will freeze in my fire!']},
    roundDefs:[
      {name:'Hot and Cold',diff:1,levels:4},{name:'Measuring Heat',diff:1,levels:4},{name:'Conduction Basics',diff:1,levels:4},
      {name:'Convection Currents',diff:2,levels:4},{name:'Radiation Waves',diff:2,levels:4},{name:'State Changes',diff:2,levels:4},{name:'Clothing & Climate',diff:2,levels:4},
      {name:'Advanced Thermodynamics',diff:3,levels:4},{name:'Master of Temperature',diff:3,levels:4}
    ]},
  { id:'acids_bases', name:'Crystal Caverns', icon:'🧪', color:'#a855f7', ncert:'Acids, Bases and Salts', rounds:9, creature:'reactix',
    boss:{name:'pHantom',title:'The Neutralizer',hp:155,icon:'☠️',
      phrases:['I dissolve all resistance!','Acid or base — I am both!','Your indicators will show nothing!','Neutral is my domain!','Taste the sting of my chemistry!']},
    roundDefs:[
      {name:'Sour and Bitter',diff:1,levels:4},{name:'Indicators',diff:1,levels:4},{name:'Acids Around Us',diff:1,levels:4},
      {name:'Bases in Daily Life',diff:2,levels:4},{name:'Neutralization',diff:2,levels:4},{name:'Salt Stories',diff:2,levels:4},{name:'Litmus & Turmeric',diff:2,levels:4},
      {name:'Advanced Reactions',diff:3,levels:4},{name:'Chemistry Champion',diff:3,levels:4}
    ]},
  { id:'physical_chemical', name:'Transformation Workshop', icon:'⚗️', color:'#f5c842', ncert:'Physical and Chemical Changes', rounds:9, creature:'transmix',
    boss:{name:'Chaosflux',title:'Lord of Destruction',hp:160,icon:'💥',
      phrases:['All change leads to chaos!','Reversibility is an illusion!','I turn creation to ash!','Chemical bonds break for me!','Nothing stays the same!']},
    roundDefs:[
      {name:'Change All Around',diff:1,levels:4},{name:'Physical Changes',diff:1,levels:4},{name:'Chemical Changes',diff:1,levels:4},
      {name:'Rusting & Burning',diff:2,levels:4},{name:'Crystallisation',diff:2,levels:4},{name:'Reversible & Irreversible',diff:2,levels:4},{name:'Galvanisation',diff:2,levels:4},
      {name:'Advanced Transformations',diff:3,levels:4},{name:'Master Alchemist',diff:3,levels:4}
    ]},
  { id:'weather_climate', name:'Sky Frontier', icon:'🌤️', color:'#38bdf8', ncert:'Weather, Climate and Adaptations', rounds:9, creature:'climatrix',
    boss:{name:'Tempestor',title:'Storm Commander',hp:165,icon:'🌪️',
      phrases:['I command every season!','Climate bows to me!','Adapt or perish!','The weather is my weapon!','No creature survives my storms!']},
    roundDefs:[
      {name:'Weather Basics',diff:1,levels:4},{name:'Temperature & Rain',diff:1,levels:4},{name:'Climate Zones',diff:1,levels:4},
      {name:'Indian Seasons',diff:2,levels:4},{name:'Animal Adaptations',diff:2,levels:4},{name:'Polar & Tropical',diff:2,levels:4},{name:'Desert Survival',diff:2,levels:4},
      {name:'Advanced Climatology',diff:3,levels:4},{name:'Weather Master',diff:3,levels:4}
    ]},
  { id:'winds_storms', name:'Storm Isles', icon:'🌀', color:'#6366f1', ncert:'Winds, Storms and Cyclones', rounds:9, creature:'aerovex',
    boss:{name:'Cyclonis',title:'Eye of the Storm',hp:170,icon:'🌊',
      phrases:['Feel the fury of 200 km/h winds!','I create cyclones at will!','Air pressure is MY domain!','No shelter from my tornadoes!','The atmosphere fears me!']},
    roundDefs:[
      {name:'Moving Air',diff:1,levels:4},{name:'Wind Patterns',diff:1,levels:4},{name:'Air Pressure',diff:1,levels:4},
      {name:'Thunder & Lightning',diff:2,levels:4},{name:'Cyclone Formation',diff:2,levels:4},{name:'Destruction & Safety',diff:2,levels:4},{name:'Monsoon Science',diff:2,levels:4},
      {name:'Advanced Meteorology',diff:3,levels:4},{name:'Storm Chaser',diff:3,levels:4}
    ]},
  { id:'soil', name:'Earth Kingdom', icon:'🪨', color:'#a3744e', ncert:'Soil', rounds:9, creature:'terravox',
    boss:{name:'Erosius',title:'The Barren One',hp:155,icon:'🏜️',
      phrases:['I strip the earth bare!','No crop grows where I reign!','Soil erosion is my art!','The land dies without me!','Fertility is a lie!']},
    roundDefs:[
      {name:'What is Soil?',diff:1,levels:4},{name:'Soil Profile',diff:1,levels:4},{name:'Types of Soil',diff:1,levels:4},
      {name:'Moisture & Percolation',diff:2,levels:4},{name:'Soil & Crops',diff:2,levels:4},{name:'Erosion & Conservation',diff:2,levels:4},{name:'Soil Organisms',diff:2,levels:4},
      {name:'Advanced Soil Science',diff:3,levels:4},{name:'Earth Guardian',diff:3,levels:4}
    ]},
  { id:'respiration', name:'Breath Temple', icon:'🫁', color:'#2dd4bf', ncert:'Respiration in Organisms', rounds:9, creature:'breathix',
    boss:{name:'Asphyxion',title:'The Breath Taker',hp:160,icon:'💀',
      phrases:['I steal your every breath!','Aerobic or anaerobic — you suffocate!','Oxygen is scarce in my domain!','CO₂ is all you will breathe!','The cells die without me!']},
    roundDefs:[
      {name:'Why We Breathe',diff:1,levels:4},{name:'Breathing Mechanism',diff:1,levels:4},{name:'Aerobic vs Anaerobic',diff:1,levels:4},
      {name:'Cellular Respiration',diff:2,levels:4},{name:'In Different Animals',diff:2,levels:4},{name:'Fermentation',diff:2,levels:4},{name:'Decomposition',diff:2,levels:4},
      {name:'Advanced Respiration',diff:3,levels:4},{name:'Breath Master',diff:3,levels:4}
    ]},
  { id:'transportation', name:'River of Life', icon:'🩸', color:'#dc2626', ncert:'Transportation in Animals and Plants', rounds:9, creature:'circulox',
    boss:{name:'Clottrex',title:'The Blockage',hp:165,icon:'🖤',
      phrases:['I block every vessel!','Blood will not flow!','The xylem is mine!','No nutrient reaches its target!','The transport network fails!']},
    roundDefs:[
      {name:'Circulatory System',diff:1,levels:4},{name:'Heart & Blood',diff:1,levels:4},{name:'Blood Vessels',diff:1,levels:4},
      {name:'Excretion',diff:2,levels:4},{name:'Transport in Plants',diff:2,levels:4},{name:'Transpiration',diff:2,levels:4},{name:'Heart Structure',diff:2,levels:4},
      {name:'Advanced Transport',diff:3,levels:4},{name:'Circulation Master',diff:3,levels:4}
    ]},
  { id:'reproduction_plants', name:'Garden of Beginnings', icon:'🌸', color:'#f472b6', ncert:'Reproduction in Plants', rounds:9, creature:'floravex',
    boss:{name:'Sterilus',title:'The Bloom Reaper',hp:155,icon:'🥀',
      phrases:['No seed will sprout!','Pollination ends with me!','I wither every flower!','Reproduction is MY enemy!','The garden dies tonight!']},
    roundDefs:[
      {name:'Modes of Reproduction',diff:1,levels:4},{name:'Asexual Reproduction',diff:1,levels:4},{name:'Sexual Reproduction',diff:1,levels:4},
      {name:'Pollination',diff:2,levels:4},{name:'Fertilisation',diff:2,levels:4},{name:'Seed Dispersal',diff:2,levels:4},{name:'Fruit & Seed Formation',diff:2,levels:4},
      {name:'Advanced Botany',diff:3,levels:4},{name:'Garden Master',diff:3,levels:4}
    ]},
  { id:'motion_time', name:'Clockwork Realm', icon:'⏱️', color:'#f59e0b', ncert:'Motion and Time', rounds:9, creature:'chronovex',
    boss:{name:'Inertia',title:'The Frozen Clock',hp:170,icon:'⏰',
      phrases:['Time stands still in my realm!','Speed is meaningless here!','I stop every pendulum!','Distance and time obey me!','The Great Clock is mine!']},
    roundDefs:[
      {name:'Types of Motion',diff:1,levels:4},{name:'Speed & Distance',diff:1,levels:4},{name:'Measuring Time',diff:1,levels:4},
      {name:'Pendulum',diff:2,levels:4},{name:'Distance-Time Graphs',diff:2,levels:4},{name:'Units of Speed',diff:2,levels:4},{name:'Boat & Train Problems',diff:2,levels:4},
      {name:'Advanced Kinematics',diff:3,levels:4},{name:'Time Lord',diff:3,levels:4}
    ]},
  { id:'electric_current', name:'Thunder Citadel', icon:'⚡', color:'#00c6ff', ncert:'Electric Current and Its Effects', rounds:9, creature:'voltix',
    boss:{name:'Ohmageddon',title:'The Circuit Breaker',hp:175,icon:'⚡',
      phrases:['I short-circuit every plan!','Resistance is not futile — it is MINE!','Electromagnets obey me!','No current flows without my permission!','Feel the shock of defeat!']},
    roundDefs:[
      {name:'Electric Symbols',diff:1,levels:4},{name:'Circuit Components',diff:1,levels:4},{name:'Heating Effect',diff:1,levels:4},
      {name:'Magnetic Effect',diff:2,levels:4},{name:'Electromagnets',diff:2,levels:4},{name:'Fuses & Safety',diff:2,levels:4},{name:'Series & Parallel',diff:2,levels:4},
      {name:'Advanced Circuits',diff:3,levels:4},{name:'Circuit Master',diff:3,levels:4}
    ]},
  { id:'light', name:'Mirror Palace', icon:'🪞', color:'#c084fc', ncert:'Light', rounds:9, creature:'luminox',
    boss:{name:'Umbraxis',title:'The Shadow King',hp:170,icon:'👤',
      phrases:['Light cannot penetrate my darkness!','Every mirror shatters!','Reflections are my puppets!','I bend light to my will!','The image is always inverted!']},
    roundDefs:[
      {name:'Light & Shadow',diff:1,levels:4},{name:'Reflection',diff:1,levels:4},{name:'Plane Mirrors',diff:1,levels:4},
      {name:'Spherical Mirrors',diff:2,levels:4},{name:'Lenses',diff:2,levels:4},{name:'Sunlight Spectrum',diff:2,levels:4},{name:'Pinhole Camera',diff:2,levels:4},
      {name:'Advanced Optics',diff:3,levels:4},{name:'Light Master',diff:3,levels:4}
    ]},
  { id:'water_resource', name:'Forgotten Reservoir', icon:'💧', color:'#0ea5e9', ncert:'Water: A Precious Resource', rounds:9, creature:'aquavex',
    boss:{name:'Droughtex',title:'The Drought Bringer',hp:160,icon:'🏜️',
      phrases:['Every drop belongs to me!','Rivers dry at my command!','Water tables will never rise!','Conservation is futile!','Thirst is your destiny!']},
    roundDefs:[
      {name:'Water Distribution',diff:1,levels:4},{name:'Water Cycle',diff:1,levels:4},{name:'Groundwater',diff:1,levels:4},
      {name:'Water Table',diff:2,levels:4},{name:'Water Management',diff:2,levels:4},{name:'Rainwater Harvesting',diff:2,levels:4},{name:'Water Pollution',diff:2,levels:4},
      {name:'Advanced Conservation',diff:3,levels:4},{name:'Water Guardian',diff:3,levels:4}
    ]},
  { id:'forests', name:'The Living Forest', icon:'🌳', color:'#16a34a', ncert:'Forests: Our Lifeline', rounds:9, creature:'sylvavex',
    boss:{name:'Deforester',title:'The Woodcutter',hp:165,icon:'🪓',
      phrases:['Every tree falls before me!','Forests are lumber, nothing more!','Ecosystems collapse under my axe!','Biodiversity is overrated!','The canopy will burn!']},
    roundDefs:[
      {name:'What is a Forest?',diff:1,levels:4},{name:'Forest Layers',diff:1,levels:4},{name:'Forest Products',diff:1,levels:4},
      {name:'Flora & Fauna',diff:2,levels:4},{name:'Forest Ecosystem',diff:2,levels:4},{name:'Deforestation Effects',diff:2,levels:4},{name:'Conservation',diff:2,levels:4},
      {name:'Advanced Ecology',diff:3,levels:4},{name:'Forest Protector',diff:3,levels:4}
    ]},
  { id:'wastewater', name:'Purification Plant', icon:'🏭', color:'#64748b', ncert:'Wastewater Story', rounds:9, creature:'purovex',
    boss:{name:'Contaminex',title:'The Pollution Spreader',hp:160,icon:'☠️',
      phrases:['I poison every water source!','Sewage is my kingdom!','Clean water is a fantasy!','Treatment plants bow to me!','The river runs dark!']},
    roundDefs:[
      {name:'Water Pollution',diff:1,levels:4},{name:'Sewage & Waste',diff:1,levels:4},{name:'Cleaning Water',diff:1,levels:4},
      {name:'Treatment Process',diff:2,levels:4},{name:'Better Practices',diff:2,levels:4},{name:'Sanitation',diff:2,levels:4},{name:'Alternatives',diff:2,levels:4},
      {name:'Advanced Sanitation',diff:3,levels:4},{name:'Clean Water Hero',diff:3,levels:4}
    ]}
],


// ══════════════════════════════════════════
//  STORIES (keyed by chapterId_roundIdx)
// ══════════════════════════════════════════
stories: {
  "nutrition_plants_r0": [
    {bg:"linear-gradient(180deg,#0a1a0a,#1a3a1a, #0a1a0a)", particles:true, particleColor:'rgba(34,197,94,0.3)',
     character:"🌿", speaker:"Narrator", text:"Deep inside the Emerald Forest, the ancient trees whisper of a darkness spreading through their roots. The plants are slowly losing their ability to make food. Chlorophyll is fading. Leaves are turning grey."},
    {bg:"linear-gradient(180deg,#0a1a0a,#0f2f0f)", character:"👩‍🔬", speaker:"Professor Lumina", text:"Welcome, young explorer. I am Professor Lumina. Something terrible has happened — a dark force called Chlorox has stolen the sunlight from our forest. Without it, plants cannot perform photosynthesis."},
    {bg:"linear-gradient(180deg,#0a1a0a,#1a2a0a)", character:"🤖", speaker:"Spark (Robotic Companion)", text:"BEEP BOOP! I have detected high chlorophyll loss in sector 7. We need to understand how plants make food before we can restore it. Ready to learn, partner?"}
  ],
  "nutrition_plants_r3": [
    {bg:"linear-gradient(180deg,#1a0a0a,#3a1a0a)", particles:true, particleColor:'rgba(255,165,0,0.3)',
     character:"🌿", speaker:"Narrator", text:"The deeper you travel into the forest, the stranger things become. Some plants have stopped making their own food entirely. They have turned to stealing from others."},
    {bg:"linear-gradient(180deg,#1a0a0a,#2a1a0a)", character:"👩‍🔬", speaker:"Professor Lumina", text:"These are parasitic plants — they derive nutrition from other living plants. Cuscuta, for example, wraps around a host and absorbs readymade food. The forest is being attacked from within."}
  ],
  "nutrition_plants_r7": [
    {bg:"linear-gradient(180deg,#0a0a1a,#1a1a3a)", particles:true, particleColor:'rgba(100,100,255,0.3)',
     character:"🌑", speaker:"Narrator", text:"You have reached the heart of the Emerald Forest. The Blight Lord awaits. Chlorox has absorbed all the nitrogen-fixing bacteria from the soil. Without them, plants cannot get the nutrients they need."},
    {bg:"linear-gradient(180deg,#0a0a1a,#1a0a2a)", character:"👩‍🔬", speaker:"Professor Lumina", text:"This is it, explorer. Rhizobium bacteria in root nodules of leguminous plants fix atmospheric nitrogen into the soil. Without them, the entire food chain collapses. You must defeat Chlorox and restore the balance."}
  ],
  "nutrition_animals_r0": [
    {bg:"linear-gradient(180deg,#1a0a00,#3a1a0a, #1a0a00)", particles:true, particleColor:'rgba(249,115,22,0.3)',
     character:"🍽️", speaker:"Narrator", text:"In the Kingdom of Hunger, food is scarce. The great digestive engines of every creature have been sabotaged. No animal can break down its food anymore."},
    {bg:"linear-gradient(180deg,#1a0a00,#2a1a00)", character:"👨‍🚀", speaker:"Captain Nova", text:"I'm Captain Nova, explorer. We need to understand the alimentary canal — the long tube from mouth to anus where food is digested. Each organ has a specific role. Let's learn and restore the system."}
  ],
  "heat_r0": [
    {bg:"linear-gradient(180deg,#1a0505,#3a0a0a, #1a0505)", particles:true, particleColor:'rgba(239,68,68,0.3)',
     character:"🌡️", speaker:"Narrator", text:"The City of Fire and Ice has lost all balance. One half burns at extreme temperatures while the other freezes in eternal frost. The great temperature regulator has been shattered."},
    {bg:"linear-gradient(180deg,#1a0505,#2a0a0a)", character:"👩‍🔬", speaker:"Professor Lumina", text:"Heat flows from hotter objects to colder ones. We measure it with thermometers. The three modes of heat transfer — conduction, convection, and radiation — must all be restored to bring balance back to this city."}
  ],
  "electric_current_r0": [
    {bg:"linear-gradient(180deg,#001020,#002040, #001020)", particles:true, particleColor:'rgba(0,198,255,0.3)',
     character:"⚡", speaker:"Narrator", text:"The Thunder Citadel has gone dark. Once a beacon of light powered by electric current, now all circuits are broken. Electromagnets have lost their power. Fuses have all blown."},
    {bg:"linear-gradient(180deg,#001020,#001830)", character:"👨‍🚀", speaker:"Captain Nova", text:"Electric current flows through a closed circuit. It has a heating effect and a magnetic effect. We need to understand symbols, circuits, and safety devices to restore power to the citadel."}
  ]
},


// ══════════════════════════════════════════
//  QUESTIONS
//  Keyed by chapter_id, then "r{round}_l{level}" or "boss"
//  Each entry is an array of question objects
// ══════════════════════════════════════════
questions: {
  "nutrition_plants": {
    "r0_l0": [
      {type:"mcq",q:"The process by which green plants make their own food is called:",opts:["Respiration","Photosynthesis","Transpiration","Germination"],ans:1,explain:"Photosynthesis is the process where green plants use sunlight, CO₂, and water to make glucose and oxygen."},
      {type:"truefalse",q:"Plants can make food even in complete darkness.",ans:false,explain:"Plants need sunlight for photosynthesis. Without light, they cannot produce glucose."},
      {type:"mcq",q:"Which pigment gives plants their green color?",opts:["Xanthophyll","Carotene","Chlorophyll","Anthocyanin"],ans:2,explain:"Chlorophyll absorbs red and blue light and reflects green light, giving plants their characteristic color."},
      {type:"mcq",q:"Plants absorb carbon dioxide through tiny pores on leaves called:",opts:["Vacuoles","Stomata","Xylem","Phloem"],ans:1,explain:"Stomata are tiny pores mainly on the underside of leaves that allow gas exchange."},
      {type:"truefalse",q:"Oxygen is released during photosynthesis.",ans:true,explain:"During photosynthesis, water molecules are split, releasing oxygen as a byproduct."},
      {type:"mcq",q:"The equation for photosynthesis shows that plants need:",opts:["Oxygen and glucose","Sunlight, CO₂, and water","Only water","Nitrogen and sunlight"],ans:1,explain:"6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂"}
    ],
    "r0_l1": [
      {type:"mcq",q:"The food prepared by plants is stored in the form of:",opts:["Protein","Fat","Starch","Vitamins"],ans:2,explain:"Plants convert glucose into starch for storage, which is a complex carbohydrate."},
      {type:"fill",q:"The site of photosynthesis in a leaf is the ___.",accept:["chloroplast","chloroplasts"],explain:"Chloroplasts contain chlorophyll and are the actual sites where photosynthesis takes place.",tip:"These organelles contain the green pigment."},
      {type:"mcq",q:"Which part of the plant primarily carries out photosynthesis?",opts:["Root","Stem","Leaf","Flower"],ans:2,explain:"Leaves have the maximum number of chloroplasts and are the primary organs for photosynthesis."},
      {type:"truefalse",q:"Roots of a plant can perform photosynthesis.",ans:false,explain:"Roots are underground and lack chlorophyll, so they cannot perform photosynthesis."},
      {type:"mcq",q:"Water required for photosynthesis is absorbed by:",opts:["Leaves","Stems","Roots","Flowers"],ans:2,explain:"Roots absorb water from the soil, which is then transported to the leaves via xylem."},
      {type:"mcq",q:"Carbon dioxide enters the leaf through:",opts:["Xylem","Phloem","Stomata","Epidermis"],ans:2,explain:"Stomata are tiny openings on the leaf surface that allow CO₂ to enter and O₂ to exit."}
    ],
    "r0_l2": [
      {type:"mcq",q:"During photosynthesis, light energy is converted to:",opts:["Heat energy","Chemical energy","Electrical energy","Nuclear energy"],ans:1,explain:"Photosynthesis converts light energy into chemical energy stored in glucose molecules."},
      {type:"fill",q:"The overall equation of photosynthesis involves CO₂, H₂O, sunlight, glucose, and ___.",accept:["oxygen","O2","O₂"],explain:"Photosynthesis produces glucose and oxygen: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"},
      {type:"mcq",q:"Which of these is NOT required for photosynthesis?",opts:["Sunlight","Chlorophyll","Oxygen","Carbon dioxide"],ans:2,explain:"Oxygen is a product of photosynthesis, not a requirement. The inputs are CO₂, water, and light."},
      {type:"sequence",q:"Arrange the steps of photosynthesis in correct order:",items:["CO₂ enters through stomata","Sunlight is absorbed by chlorophyll","Water travels from roots to leaves","Glucose and oxygen are produced"],explain:"First water reaches leaves, then sunlight is absorbed, CO₂ enters, and finally food is made."},
      {type:"mcq",q:"A plant kept in a dark room will:",opts:["Continue photosynthesis","Stop photosynthesis","Grow faster","Produce more oxygen"],ans:1,explain:"Without sunlight, the light reactions of photosynthesis cannot occur, so the process stops."},
      {type:"truefalse",q:"Aquatic plants also perform photosynthesis.",ans:true,explain:"Aquatic plants like Hydrilla have chlorophyll and perform photosynthesis using dissolved CO₂ and sunlight."}
    ],
    "r0_l3": [
      {type:"mcq",q:"In a plant variegated leaf experiment, the region that tests positive for starch is the:",opts:["Green part","Non-green part","Entire leaf","Only the veins"],ans:0,explain:"Only the green part (with chlorophyll) performs photosynthesis and produces starch."},
      {type:"mcq",q:"Why do we boil the leaf in alcohol during the starch test?",opts:["To kill the leaf","To remove chlorophyll","To add starch","To make it transparent"],ans:1,explain:"Boiling in alcohol removes the green chlorophyll so that the iodine test result (blue-black) is visible."},
      {type:"fill",q:"Iodine solution turns ___ in the presence of starch.",accept:["blue-black","blue black","blueblack"],explain:"Iodine reacts with starch to produce a blue-black color, confirming starch presence."},
      {type:"mcq",q:"In the starch test, the leaf is first boiled in water to:",opts:["Dissolve starch","Kill the leaf and stop chemical reactions","Add chlorophyll","Make it soft"],ans:1,explain:"Boiling in water first denatures the leaf tissues and stops all enzymatic activity."},
      {type:"truefalse",q:"Plants that do not have chlorophyll can still perform photosynthesis.",ans:false,explain:"Chlorophyll is essential for absorbing light energy. Without it, photosynthesis cannot occur."},
      {type:"mcq",q:"Which gas is used as raw material in photosynthesis?",opts:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],ans:2,explain:"Carbon dioxide from the atmosphere is fixed into organic molecules during the Calvin cycle."}
    ],
    "r1_l0": [
      {type:"mcq",q:"Which of these is a parasitic plant?",opts:["Mango","Cuscuta (Amarbel)","Grass","Rose"],ans:1,explain:"Cuscuta is a parasitic plant that derives its nutrition from the host plant."},
      {type:"mcq",q:"Insectivorous plants like Venus flytrap grow in:",opts:["Deserts","Sandy soil","Nitrogen-deficient soil","Water"],ans:2,explain:"Insectivorous plants trap insects to supplement nitrogen, which is deficient in their soil."},
      {type:"truefalse",q:"Cuscuta has chlorophyll and makes its own food.",ans:false,explain:"Cuscuta lacks chlorophyll and is a total parasite — it cannot photosynthesize."},
      {type:"mcq",q:"Pitcher plant traps insects because:",opts:["It is carnivorous by nature","The soil lacks sufficient nitrogen","It is a parasite","It has no roots"],ans:1,explain:"Pitcher plants grow in nitrogen-poor soil and supplement nutrition by digesting trapped insects."},
      {type:"fill",q:"Plants that depend on other plants for food are called ___ plants.",accept:["parasitic"],explain:"Parasitic plants like Cuscuta grow on host plants and absorb readymade food from them."},
      {type:"mcq",q:"Saprotrophs obtain food from:",opts:["Living organisms","Dead and decaying matter","Sunlight","Other parasites"],ans:1,explain:"Saprotrophs like fungi secrete enzymes on dead organic matter and absorb the digested nutrients."}
    ],
    "r1_l1": [
      {type:"mcq",q:"Which organism helps in making curd from milk?",opts:["Rhizobium","Lactobacillus","Yeast","Mucor"],ans:1,explain:"Lactobacillus bacteria convert lactose in milk into lactic acid, causing curdling."},
      {type:"mcq",q:"Fungi obtain nutrition by:",opts:["Photosynthesis","Chemosynthesis","Absorbing nutrients from organic matter","Ingesting food particles"],ans:2,explain:"Fungi are saprotrophs — they secrete digestive enzymes externally and absorb the dissolved nutrients."},
      {type:"truefalse",q:"Yeast is used in making bread because it produces CO₂ during respiration.",ans:true,explain:"Yeast ferments sugars producing CO₂ (which makes bread rise) and alcohol."},
      {type:"mcq",q:"Rhizobium bacteria live in root nodules of:",opts:["All plants","Leguminous plants only","Grasses only","Trees only"],ans:1,explain:"Rhizobium specifically associates with leguminous plants (peas, beans) to fix atmospheric nitrogen."},
      {type:"fill",q:"The association between Rhizobium and leguminous plants is an example of ___ism.",accept:["symbiosis","symbiotic"],explain:"Both organisms benefit: the plant gets nitrogen, and the bacteria get shelter and food."},
      {type:"mcq",q:"Lichens are a symbiotic association between:",opts:["Two fungi","Algae and fungi","Bacteria and algae","Moss and fern"],ans:1,explain:"In lichens, the alga provides food through photosynthesis while the fungus provides shelter and moisture."}
    ],
    "r1_l2": [
      {type:"mcq",q:"The mode of nutrition in which organisms make their own food is called:",opts:["Heterotrophic","Autotrophic","Saprotrophic","Parasitic"],ans:1,explain:"Autotrophic nutrition means self-feeding — organisms produce food from inorganic substances."},
      {type:"sequence",q:"Arrange these organisms by their mode of nutrition — autotroph, saprotroph, parasite:",items:["Green plants (autotrophs)","Fungi on dead matter (saprotrophs)","Cuscuta on host (parasite)"],explain:"Green plants make their own food, fungi decompose dead matter, and Cuscuta steals from living hosts."},
      {type:"mcq",q:"What do stomata guard cells do when the plant needs CO₂?",opts:["Close the stomata","Open the stomata","Absorb water","Release starch"],ans:1,explain:"Guard cells become turgid and open the stomata to allow CO₂ in for photosynthesis."},
      {type:"truefalse",q:"Mushrooms are autotrophs.",ans:false,explain:"Mushrooms are fungi — they are saprotrophs that feed on dead organic matter."},
      {type:"mcq",q:"Which of these is an insectivorous plant?",opts:["Rose","Neem","Sundew","Mango"],ans:2,explain:"Sundew (Drosera) traps insects with sticky tentacles to supplement nutrition."},
      {type:"mcq",q:"In a food chain, plants are always:",opts:["Primary consumers","Secondary consumers","Producers","Decomposers"],ans:2,explain:"Plants are producers — they form the base of every food chain through photosynthesis."}
    ],
    "r1_l3": [
      {type:"mcq",q:"In the absence of which factor does photosynthesis NOT occur?",opts:["CO₂","Water","Nitrogen","Sunlight"],ans:3,explain:"Without sunlight, the light-dependent reactions cannot proceed, completely halting photosynthesis."},
      {type:"mcq",q:"Which is the correct path of CO₂ during photosynthesis?",opts:["Stomata → Xylem → Chloroplast","Stomata → Air spaces → Chloroplast","Root → Stem → Leaf","Phloem → Chloroplast → Stomata"],ans:1,explain:"CO₂ enters through stomata, diffuses through air spaces in the mesophyll, and reaches chloroplasts."},
      {type:"truefalse",q:"All plants are autotrophs.",ans:false,explain:"Some plants like Cuscuta are parasites and cannot make their own food. They are heterotrophs."},
      {type:"fill",q:"The process of preparing food from CO₂ and water using sunlight is called ___.",accept:["photosynthesis"],explain:"Photosynthesis literally means 'putting together with light' — making food using light energy."},
      {type:"mcq",q:"If a plant is kept in a completely dark room with adequate water and CO₂, it will:",opts:["Thrive","Survive for some time using stored food","Produce food normally","Grow faster"],ans:1,explain:"The plant will survive temporarily on stored starch but will eventually die without photosynthesis."},
      {type:"mcq",q:"Stomata are usually more abundant on the:",opts:["Upper surface of leaf","Lower surface of leaf","Stem","Root"],ans:1,explain:"More stomata on the lower surface reduces water loss through direct sunlight evaporation."}
    ],
    "r2_l0": [
      {type:"mcq",q:"The tiny pores on the surface of a leaf are surrounded by:",opts:["Xylem vessels","Guard cells","Chloroplasts","Epidermis"],ans:1,explain:"Each stoma is surrounded by a pair of bean-shaped guard cells that control opening and closing."},
      {type:"mcq",q:"Which tissue transports water from roots to leaves?",opts:["Phloem","Xylem","Cambium","Cortex"],ans:1,explain:"Xylem tissue consists of vessels and tracheids that transport water and minerals upward."},
      {type:"truefalse",q:"Phloem transports food from leaves to other parts of the plant.",ans:true,explain:"Phloem transports the glucose (as sucrose) made in leaves to all parts of the plant for use and storage."},
      {type:"mcq",q:"Cross-section of a leaf shows the following layers from top to bottom:",opts:["Lower epidermis → Palisade → Spongy → Upper epidermis","Upper epidermis → Palisade → Spongy → Lower epidermis","Palisade → Epidermis → Spongy → Vascular","Spongy → Palisade → Epidermis → Vascular"],ans:1,explain:"The correct order is: upper epidermis, palisade mesophyll, spongy mesophyll, lower epidermis."},
      {type:"fill",q:"The cell organelle that contains chlorophyll is called the ___.",accept:["chloroplast","chloroplasts"],explain:"Chloroplasts are the green plastids found in leaf cells where photosynthesis occurs."},
      {type:"mcq",q:"The function of veins in a leaf is to:",opts:["Provide colour","Transport water and food","Absorb sunlight","Produce chlorophyll"],ans:1,explain:"Veins contain both xylem (water transport) and phloem (food transport) vascular tissues."}
    ],
    "r2_l1": [
      {type:"mcq",q:"What is the role of sunlight in photosynthesis?",opts:["It provides CO₂","It splits water molecules to release energy","It produces chlorophyll","It absorbs oxygen"],ans:1,explain:"Light energy splits water molecules (photolysis), providing electrons and energy for the Calvin cycle."},
      {type:"mcq",q:"Plants appear green because chlorophyll:",opts:["Absorbs green light","Reflects green light","Produces green light","Transmits green light"],ans:1,explain:"Chlorophyll absorbs red and blue wavelengths and reflects green light back to our eyes."},
      {type:"truefalse",q:"Photosynthesis occurs only during daytime.",ans:true,explain:"The light-dependent reactions require sunlight, so photosynthesis occurs during the day. The Calvin cycle also operates during the day."},
      {type:"mcq",q:"Which of the following is a product of photosynthesis?",opts:["Carbon dioxide","Water","Glucose","Nitrogen"],ans:2,explain:"Glucose (C₆H₁₂O₆) is the primary product. Oxygen is the byproduct."},
      {type:"fill",q:"In photosynthesis, CO₂ is reduced to ___.",accept:["glucose","sugar","C6H12O6","C₆H₁₂O₆"],explain:"Carbon dioxide molecules are fixed and reduced to form glucose through the Calvin cycle."},
      {type:"mcq",q:"What happens to the oxygen produced during photosynthesis?",opts:["Used by the plant immediately","Released into the atmosphere through stomata","Stored in roots","Converted to CO₂"],ans:1,explain:"Oxygen is released as a byproduct through the stomata into the atmosphere."}
    ],
    "r2_l2": [
      {type:"mcq",q:"If the upper epidermis of a leaf is peeled off, what is exposed?",opts:["Spongy mesophyll","Palisade mesophyll","Lower epidermis","Vascular bundles"],ans:1,explain:"Palisade mesophyll lies just below the upper epidermis and contains the most chloroplasts."},
      {type:"mcq",q:"In a destarched plant experiment, 'destarching' means:",opts:["Adding starch","Removing starch by keeping in dark","Dying the leaf","Heating the leaf"],ans:1,explain:"A plant is kept in the dark for 48 hours so it uses up all stored starch, ensuring reliable test results."},
      {type:"sequence",q:"Correct order for the starch test procedure:",items:["Destarch the plant for 48 hours","Expose the leaf to sunlight for 6 hours","Boil the leaf in water","Boil the leaf in alcohol","Wash with water and add iodine solution"],explain:"Destarch → Sunlight → Kill in water → Remove chlorophyll in alcohol → Wash → Iodine test."},
      {type:"truefalse",q:"A white-coloured leaf can perform photosynthesis.",ans:false,explain:"White leaves lack chlorophyll entirely. Without chlorophyll, photosynthesis cannot take place."},
      {type:"mcq",q:"Which leaf structure allows exchange of gases?",opts:["Cuticle","Waxy layer","Stomata with guard cells","Epidermal cells"],ans:2,explain:"Stomata controlled by guard cells are the gas exchange portals of the leaf."},
      {type:"mcq",q:"The food synthesised by plants is transported to other parts through:",opts:["Xylem","Phloem","Cambium","Parenchyma"],ans:1,explain:"Phloem translocates the products of photosynthesis (mainly sucrose) from leaves to all plant parts."}
    ],
    "r2_l3": [
      {type:"mcq",q:"In the variegated leaf starch test, the leaf is tested after:",opts:["Keeping it in the dark","Boiling in alcohol","Soaking in iodine","Exposing to sunlight for several hours"],ans:3,explain:"After destarching, the leaf is exposed to sunlight so photosynthesis can occur in green parts, then tested for starch."},
      {type:"mcq",q:"A leaf covered with black paper on one side will:",opts:["Photosynthesize everywhere","Only photosynthesize in uncovered areas","Not photosynthesize at all","Photosynthesize more in covered areas"],ans:1,explain:"The covered area lacks light, so photosynthesis occurs only in the uncovered, light-exposed regions."},
      {type:"truefalse",q:"Potted plants should be destarched before starting any photosynthesis experiment.",ans:true,explain:"Destarching ensures that any starch found after the experiment was produced during the experiment, not stored earlier."},
      {type:"mcq",q:"The green pigment is primarily found in:",opts:["All cells equally","Palisade mesophyll cells mainly","Only guard cells","Root cells"],ans:1,explain:"Palisade mesophyll cells near the upper surface contain the highest concentration of chloroplasts."},
      {type:"fill",q:"Guard cells become ___ when they absorb water, opening the stomata.",accept:["turgid","swollen","turgid/swollen"],explain:"When guard cells absorb water, they swell and become turgid, causing the stomatal pore to open."},
      {type:"mcq",q:"Which gas concentration affects the opening and closing of stomata?",opts:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],ans:2,explain:"High CO₂ concentration causes stomata to open for photosynthesis; low CO₂ causes them to close."}
    ],
    "r3_l0": [
      {type:"mcq",q:"Cuscuta is classified as a parasite because it:",opts:["Has roots in soil","Has chlorophyll","Derives food from a living host plant","Grows on dead trees"],ans:2,explain:"A parasite lives on or in a host organism and derives nutrition from it, harming the host."},
      {type:"mcq",q:"Which of these plants does NOT have chlorophyll?",opts:["Grass","Cuscuta","Mango tree","Rose"],ans:1,explain:"Cuscuta (amarbel) is a yellow-coloured plant completely devoid of chlorophyll."},
      {type:"truefalse",q:"Dodder (Cuscuta) can photosynthesize to some extent.",ans:false,explain:"Cuscuta has no chlorophyll at all — it is an obligate parasite entirely dependent on its host."},
      {type:"mcq",q:"Penicillin is obtained from a:",opts:["Bacteria","Virus","Fungus","Alga"],ans:2,explain:"Penicillin is extracted from the fungus Penicillium notatum."},
      {type:"fill",q:"Organisms that feed on dead and decaying matter are called ___.",accept:["saprotrophs","saprophytes"],explain:"Saprotrophs (or saprophytes) secrete enzymes onto dead matter and absorb the digested nutrients."},
      {type:"mcq",q:"Which of these is NOT a saprotroph?",opts:["Bread mould","Mushroom","Yeast","Sunflower"],ans:3,explain:"Sunflower is an autotroph — it makes its own food through photosynthesis."}
    ],
    "r3_l1": [
      {type:"mcq",q:"Nepenthes (pitcher plant) is found in areas where soil lacks:",opts:["Potassium","Nitrogen compounds","Calcium","Iron"],ans:1,explain:"Pitcher plants supplement nitrogen deficiency by trapping and digesting insects."},
      {type:"mcq",q:"Which of the following shows symbiotic nutrition?",opts:["Cuscuta on mango","Tick on dog","Lichen","Mosquito biting human"],ans:2,explain:"Lichens are a mutualistic symbiosis between algae (provides food) and fungi (provides shelter)."},
      {type:"truefalse",q:"All bacteria are harmful to humans.",ans:false,explain:"Many bacteria are beneficial — Lactobacillus makes curd, Rhizobium fixes nitrogen, and gut bacteria aid digestion."},
      {type:"mcq",q:"Fungi reproduce by means of:",opts:["Seeds","Spores","Cuttings","Budding only"],ans:1,explain:"Most fungi reproduce through spores, which are light and can be dispersed by wind."},
      {type:"fill",q:"Plants like Venus flytrap and pitcher plant are called ___ plants.",accept:["insectivorous"],explain:"Insectivorous plants trap and digest insects to supplement their nutrition, especially nitrogen."},
      {type:"mcq",q:"In the fungi-bread mould relationship, the bread is:",opts:["A living host","A dead organic substrate","A parasite","An autotroph"],ans:1,explain:"Bread mould (Rhizopus) grows on bread, which is dead organic matter, making it a saprotroph."}
    ],
    "r3_l2": [
      {type:"mcq",q:"Rhizobium bacteria fix atmospheric nitrogen into:",opts:["Nitrates","Ammonia compounds","Nitrogen dioxide","Pure nitrogen"],ans:1,explain:"Rhizobium converts atmospheric N₂ into ammonia and ammonium compounds that plants can absorb."},
      {type:"mcq",q:"In a leguminous plant, the root nodules contain:",opts:["Fungi","Rhizobium bacteria","Viruses","Algae"],ans:1,explain:"Root nodules are swellings on legume roots that house nitrogen-fixing Rhizobium bacteria."},
      {type:"truefalse",q:"Nitrogen fixation is important for plant growth.",ans:true,explain:"Plants need nitrogen to make proteins and nucleic acids. They cannot use atmospheric N₂ directly — it must be fixed first."},
      {type:"mcq",q:"Bread mould grows best in:",opts:["Dry, cold conditions","Warm, moist, dark conditions","Bright sunlight","Frozen conditions"],ans:1,explain:"Fungi like bread mould thrive in warm, moist, dark environments where they can decompose organic matter."},
      {type:"fill",q:"The association between a legume and Rhizobium is called a ___ relationship.",accept:["symbiotic","mutualistic","symbiosis"],explain:"Both organisms benefit — the plant gets fixed nitrogen, and the bacteria get food and shelter."},
      {type:"mcq",q:"Which of the following can fix atmospheric nitrogen?",opts:["All plants","Rhizobium bacteria","All fungi","Only animals"],ans:1,explain:"Rhizobium bacteria in root nodules of legumes are the primary nitrogen fixers in this context."}
    ],
    "r3_l3": [
      {type:"mcq",q:"If stomata are absent from a leaf, which process will be most directly affected?",opts:["Transpiration only","Photosynthesis only","Both photosynthesis and transpiration","Neither"],ans:2,explain:"Stomata facilitate entry of CO₂ for photosynthesis and loss of water vapour in transpiration."},
      {type:"mcq",q:"Which organism does NOT belong with the others?",opts:["Bread mould","Mushroom","Yeast","Sunflower"],ans:3,explain:"Sunflower is an autotroph (plant). Bread mould, mushroom, and yeast are all fungi (saprotrophs)."},
      {type:"truefalse",q:"A plant without roots can never survive.",ans:false,explain:"Some parasitic plants like Cuscuta have no true roots and survive by absorbing food from host plants."},
      {type:"mcq",q:"In which part of the leaf is most starch stored after photosynthesis?",opts:["Upper epidermis","Palisade mesophyll","Spongy mesophyll","Lower epidermis"],ans:1,explain:"Palisade mesophyll has the most chloroplasts, so it produces and stores the most starch."},
      {type:"fill",q:"The waxy covering on the upper epidermis is called the ___.",accept:["cuticle","waxy layer"],explain:"The cuticle prevents water loss from the leaf surface while allowing light to pass through."},
      {type:"mcq",q:"If a leaf is boiled in alcohol and then tested with iodine, a negative result means:",opts:["Starch is present","No starch is present","The test failed","Chlorophyll is present"],ans:1,explain:"A negative iodine test (no blue-black colour) confirms the absence of starch in that leaf region."}
    ],
    "r4_l0": [
      {type:"mcq",q:"In the equation 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, the energy source is:",opts:["CO₂","Water","Sunlight","Chlorophyll"],ans:2,explain:"Sunlight provides the energy needed to drive the endothermic photosynthesis reaction."},
      {type:"mcq",q:"Phloem is made up of:",opts:["Dead cells","Living cells with thin walls","Hollow tubes","Sclerenchyma"],ans:1,explain:"Phloem consists of living sieve tubes and companion cells that transport food."},
      {type:"truefalse",q:"Xylem and phloem are together called vascular tissue.",ans:true,explain:"Vascular tissue (xylem + phloem) forms the transport system in plants."},
      {type:"mcq",q:"A plant cell differs from an animal cell by having:",opts:["Mitochondria","Cell wall and chloroplasts","Ribosomes","Nucleus"],ans:1,explain:"Plant cells uniquely have a cell wall (for structure), chloroplasts (for photosynthesis), and a large vacuole."},
      {type:"fill",q:"The glucose produced in photosynthesis is converted to ___ for storage.",accept:["starch"],explain:"Since starch is insoluble, it does not affect osmotic balance and is ideal for storage."},
      {type:"mcq",q:"Which of the following stores food in a plant cell?",opts:["Chloroplast","Mitochondria","Vacuole","Golgi body"],ans:2,explain:"The large central vacuole stores food, water, waste products, and other substances."}
    ],
    "r4_l1": [
      {type:"mcq",q:"Transpiration is the process of:",opts:["Food transport","Water absorption","Water loss from leaves","CO₂ absorption"],ans:2,explain:"Transpiration is the loss of water vapour from plant surfaces, mainly through stomata."},
      {type:"mcq",q:"When guard cells lose water, the stomata:",opts:["Open wide","Close","Remain the same","Absorb CO₂"],ans:1,explain:"When guard cells become flaccid (lose turgor), they collapse together and close the stomatal pore."},
      {type:"truefalse",q:"Transpiration helps in the upward movement of water in plants.",ans:true,explain:"Transpiration creates a suction force (transpiration pull) that helps draw water up through the xylem."},
      {type:"mcq",q:"The highest concentration of chloroplasts is found in:",opts:["Root cells","Stem cells","Palisade mesophyll","Epidermis"],ans:2,explain:"Palisade mesophyll cells are packed with chloroplasts to maximise light absorption for photosynthesis."},
      {type:"fill",q:"The process of loss of water in the form of water vapour from aerial parts of the plant is called ___.",accept:["transpiration"],explain:"Transpiration occurs mainly through stomata, but also through the cuticle and lenticels."},
      {type:"mcq",q:"What would happen if all stomata on a leaf were blocked?",opts:["The plant would grow faster","Photosynthesis and transpiration would decrease","Only transpiration would stop","No effect"],ans:1,explain:"Blocked stomata would prevent both CO₂ entry (reducing photosynthesis) and water vapour exit (reducing transpiration)."}
    ],
    "r4_l2": [
      {type:"mcq",q:"Which of these is a leguminous plant?",opts:["Wheat","Rice","Pea (matar)","Mango"],ans:2,explain:"Pea (Pisum sativum) is a legume that harbours nitrogen-fixing Rhizobium in root nodules."},
      {type:"mcq",q:"What advantage does the host plant get from Rhizobium?",opts:["Food","Shelter","Nitrogen compounds for growth","Water"],ans:2,explain:"Rhizobium fixes atmospheric nitrogen into usable nitrogen compounds, benefiting the host plant."},
      {type:"sequence",q:"Arrange the nitrogen cycle steps in order:",items:["Atmospheric N₂","Nitrogen fixation by bacteria","Absorption by plant roots","Used to make proteins"],explain:"N₂ → fixed to ammonia → absorbed by roots → used in protein synthesis."},
      {type:"truefalse",q:"Decomposers play an important role in the nitrogen cycle.",ans:true,explain:"Decomposers break down dead organisms, releasing nitrogen compounds back into the soil."},
      {type:"mcq",q:"Which farming practice naturally adds nitrogen to the soil?",opts:["Using chemical fertilizers only","Growing leguminous crops","Excessive irrigation","Burning crop residue"],ans:1,explain:"Leguminous crops (pulses) host Rhizobium bacteria that naturally fix nitrogen into the soil."},
      {type:"mcq",q:"A farmer grows only wheat year after year. The soil will become deficient in:",opts:["All nutrients equally","Specific nutrients used by wheat","Only carbon","Only oxygen"],ans:1,explain:"Growing the same crop repeatedly depletes specific nutrients, reducing soil fertility."}
    ],
    "r4_l3": [
      {type:"mcq",q:"An experiment tests a variegated leaf for starch. The green areas turn blue-black with iodine while the white areas remain yellow-brown. This proves:",opts:["All leaves have starch","Only areas with chlorophyll perform photosynthesis","Iodine reacts with chlorophyll","White areas are dead"],ans:1,explain:"Only green areas (with chlorophyll) produced starch through photosynthesis, confirmed by the iodine test."},
      {type:"mcq",q:"A plant is destarched, then one leaf is covered with aluminium foil and exposed to light. After 6 hours, the leaf is tested. The uncovered portion turns blue-black because:",opts:["The foil prevented iodine from reaching covered part","Photosynthesis occurred only in the uncovered part","The covered part was dead","Starch migrated to uncovered part"],ans:1,explain:"The uncovered portion received sunlight and performed photosynthesis, producing starch. The covered part could not."},
      {type:"truefalse",q:"The alcohol used in the starch test should be heated directly over a flame.",ans:false,explain:"Alcohol is highly flammable. It must be heated using a water bath (beaker of water on flame with test tube of alcohol inside)."},
      {type:"mcq",q:"After boiling in alcohol, the leaf becomes:",opts:["Green","Blue-black","Pale/colourless","Brown"],ans:2,explain:"Alcohol dissolves the chlorophyll, making the leaf pale/colourless so the iodine colour change is visible."},
      {type:"fill",q:"Before testing a leaf for starch, the plant must be ___ for 48 hours.",accept:["destarched","kept in dark","kept in darkness"],explain:"Destarching (keeping in dark for 48h) ensures the plant uses up all stored starch, giving reliable results."},
      {type:"mcq",q:"What control is used in the variegated leaf experiment?",opts:["A green leaf with no treatment","The white part of the same leaf","An artificial leaf","A leaf from another plant"],ans:1,explain:"The white (non-green) part serves as a control — it has no chlorophyll so should not produce starch."}
    ],
    "r5_l0": [
      {type:"mcq",q:"Mushrooms grow on decaying organic matter. Their mode of nutrition is:",opts:["Autotrophic","Parasitic","Saprotrophic","Insectivorous"],ans:2,explain:"Mushrooms are saprotrophs — they secrete enzymes on dead matter and absorb the nutrients."},
      {type:"mcq",q:"Which statement about Cuscuta is correct?",opts:["It has well-developed roots and leaves","It has chlorophyll","It sends haustoria into the host plant","It grows in water"],ans:2,explain:"Cuscuta sends specialised roots called haustoria into the host plant's vascular tissue to absorb food."},
      {type:"truefalse",q:"Fungi can make their own food using sunlight.",ans:false,explain:"Fungi lack chlorophyll and cannot photosynthesize. They depend on organic matter for nutrition."},
      {type:"mcq",q:"What is the role of decomposers in an ecosystem?",opts:["Produce food","Break down dead matter and recycle nutrients","Eat living plants","Trap insects"],ans:1,explain:"Decomposers (fungi, bacteria) break down dead organisms and return nutrients to the soil."},
      {type:"fill",q:"The thread-like structures of fungi are called ___.",accept:["hyphae","hypha"],explain:"Hyphae are the branching filaments that make up the body (mycelium) of a fungus."},
      {type:"mcq",q:"Which of these is a heterotroph?",opts:["Rose plant","Grass","Mushroom","Tulsi"],ans:2,explain:"Mushroom is a fungus — a heterotroph that cannot make its own food. The others are autotrophic plants."}
    ],
    "r5_l1": [
      {type:"mcq",q:"When we add iodine to a leaf that has been exposed to sunlight, the result is:",opts:["No colour change","Blue-black colour in green areas","Red colour everywhere","Green colour deepens"],ans:1,explain:"Green areas produced starch via photosynthesis. Iodine + starch = blue-black colour."},
      {type:"mcq",q:"A plant is kept in a completely dark room for a week. It will:",opts:["Continue growing normally","Survive using stored food then wilt","Produce more starch","Become greener"],ans:1,explain:"Without light, photosynthesis stops. The plant uses stored starch for respiration, eventually exhausting reserves."},
      {type:"truefalse",q:"Starch is the final product of photosynthesis that gets stored.",ans:true,explain:"Glucose is the immediate product but is quickly converted to starch for storage."},
      {type:"mcq",q:"The oxygen released during photosynthesis comes from:",opts:["Carbon dioxide","Chlorophyll","Water","Glucose"],ans:2,explain:"During photolysis, water molecules are split, releasing oxygen. This was proved by van Niel and confirmed with isotopic tracers."},
      {type:"fill",q:"A leaf becomes colourless after being boiled in ___ to remove chlorophyll.",accept:["alcohol","ethanol"],explain:"Alcohol (ethanol) dissolves chlorophyll, making the leaf pale so iodine colour changes are visible."},
      {type:"mcq",q:"Photosynthesis is an example of:",opts:["Catabolic reaction","Anabolic reaction","Decomposition","Fermentation"],ans:1,explain:"Photosynthesis builds complex glucose from simple CO₂ and H₂O — an anabolic (building up) process."}
    ],
    "r5_l2": [
      {type:"mcq",q:"Which experiment proves that sunlight is necessary for photosynthesis?",opts:["Iodine test on normal leaf","Black paper strip test on variegated leaf","Adding CO₂ to a plant","Removing roots from a plant"],ans:1,explain:"Covering parts of a leaf with black paper blocks light, proving only illuminated areas produce starch."},
      {type:"mcq",q:"What is the correct sequence for testing starch in a leaf?",opts:["Iodine → Alcohol → Water → Sunlight","Dark (48h) → Sunlight → Boil in water → Boil in alcohol → Iodine","Alcohol → Water → Iodine → Sunlight","Sunlight → Iodine → Alcohol → Water"],ans:1,explain:"Destarch → Expose to light → Kill in water → Remove chlorophyll in alcohol → Wash → Apply iodine."},
      {type:"truefalse",q:"CO₂ is necessary for photosynthesis.",ans:true,explain:"CO₂ provides the carbon atoms that are fixed into glucose during the Calvin cycle."},
      {type:"mcq",q:"The large vacuole in a plant cell is used for:",opts:["Photosynthesis","Storage of water, food, and waste","Respiration","Division"],ans:1,explain:"The central vacuole stores water, nutrients, waste products, and helps maintain cell turgor."},
      {type:"mcq",q:"Why is it important to wash the leaf in water after boiling in alcohol?",opts:["To add colour","To soften the leaf","To remove alcohol and rehydrate for iodine test","To test for protein"],ans:2,explain:"Washing removes residual alcohol (which could interfere with the iodine test) and softens the leaf."},
      {type:"mcq",q:"If we keep a potted plant in a bell jar with soda lime (which absorbs CO₂), what happens?",opts:["Plant grows faster","Photosynthesis stops","More oxygen is produced","No effect"],ans:1,explain:"Soda lime removes CO₂ from the air inside the jar. Without CO₂, the plant cannot photosynthesise."}
    ],
    "r5_l3": [
      {type:"mcq",q:"A scientist covers one half of a leaf with black paper, exposes the plant to sunlight, then tests the leaf for starch. The uncovered half turns blue-black. This proves:",opts:["CO₂ is needed","Water is needed","Sunlight is necessary for photosynthesis","Chlorophyll is needed"],ans:2,explain:"The controlled variable is light. Only the light-exposed half produced starch, proving light is essential."},
      {type:"mcq",q:"A plant with only green-and-white leaves is destarched, exposed to sunlight, then tested. The green areas turn blue-black but white areas do not. What does this prove?",opts:["Light is needed","CO₂ is needed","Chlorophyll is necessary for photosynthesis","Water is needed"],ans:2,explain:"Both areas received light and CO₂, but only the green part (with chlorophyll) produced starch."},
      {type:"truefalse",q:"A variegated leaf experiment can simultaneously prove that both chlorophyll and sunlight are needed.",ans:false,explain:"It proves chlorophyll is needed (comparing green vs white). To prove sunlight is needed, a separate black paper experiment is required."},
      {type:"mcq",q:"In the starch test, why do we boil the leaf in water first and then in alcohol?",opts:["Both steps are interchangeable","Water kills the leaf; alcohol removes chlorophyll","Water removes chlorophyll; alcohol kills it","Both remove chlorophyll"],ans:1,explain:"Boiling in water denatures enzymes and kills the leaf. Boiling in alcohol dissolves and removes the green chlorophyll."},
      {type:"fill",q:"Soda lime is used in experiments to absorb ___.",accept:["carbon dioxide","CO2","CO₂"],explain:"Soda lime absorbs CO₂ from the air, used to prove that carbon dioxide is necessary for photosynthesis."},
      {type:"mcq",q:"After the starch test, a leaf treated with iodine shows some parts as yellow-brown. These parts:",opts:["Have too much starch","Have no starch","Are damaged","Have excess chlorophyll"],ans:1,explain:"Yellow-brown is the natural colour of iodine on non-starchy tissue, indicating no starch was produced there."}
    ],
    "r6_l0": [
      {type:"mcq",q:"Nitrogen fixation is the conversion of:",opts:["Ammonia to nitrate","N₂ to usable nitrogen compounds","Nitrate to N₂","Proteins to amino acids"],ans:1,explain:"Nitrogen fixation converts atmospheric N₂ into ammonia or related compounds that plants can absorb."},
      {type:"mcq",q:"Farmers grow leguminous crops like pulses between wheat crops. This is called:",opts:["Mixed cropping","Crop rotation","Intercropping","Harvesting"],ans:1,explain:"Crop rotation with legumes naturally replenishes soil nitrogen, reducing need for chemical fertilizers."},
      {type:"truefalse",q:"Animals depend directly on plants for food.",ans:true,explain:"All food chains begin with plants (producers). Herbivores eat plants directly; carnivores eat herbivores."},
      {type:"mcq",q:"In a food chain: Grass → Grasshopper → Frog → Snake → Eagle. The primary consumers are:",opts:["Grass","Grasshopper","Frog","Snake"],ans:1,explain:"Primary consumers are herbivores that eat producers directly. Grasshopper eats grass."},
      {type:"fill",q:"The base of every food chain consists of green plants called ___.",accept:["producers","autotrophs"],explain:"Green plants are producers — they form the first trophic level by making food through photosynthesis."},
      {type:"mcq",q:"What would happen if all decomposers were removed from an ecosystem?",opts:["Nothing changes","Dead matter would accumulate and nutrients would not be recycled","Plants would grow faster","Animals would thrive"],ans:1,explain:"Without decomposers, dead organisms would pile up and nutrients would remain locked, halting the nutrient cycle."}
    ],
    "r6_l1": [
      {type:"mcq",q:"The raw materials for photosynthesis are:",opts:["Glucose and O₂","CO₂ and O₂","CO₂ and H₂O","Glucose and water"],ans:2,explain:"Carbon dioxide and water are the raw materials. Sunlight provides energy. Products are glucose and oxygen."},
      {type:"mcq",q:"Which of the following organisms can prepare their own food?",opts:["Amoeba","Mushroom","Spirogyra","Yeast"],ans:2,explain:"Spirogyra is a green alga containing chlorophyll, so it performs photosynthesis."},
      {type:"truefalse",q:"All green plants are autotrophs.",ans:false,explain:"Some green-coloured organisms are not autotrophs, and some plants like Cuscuta lack chlorophyll entirely."},
      {type:"mcq",q:"The process of converting nitrates back to N₂ is called:",opts:["Nitrogen fixation","Nitrification","Denitrification","Ammonification"],ans:2,explain:"Denitrification is the conversion of nitrates back to N₂ by denitrifying bacteria, completing the nitrogen cycle."},
      {type:"fill",q:"Rhizobium bacteria live in the root ___ of leguminous plants.",accept:["nodules","nodule"],explain:"Root nodules are small growths on legume roots where Rhizobium bacteria reside and fix nitrogen."},
      {type:"mcq",q:"A balanced ecosystem requires:",opts:["Only producers","Only consumers","Producers, consumers, and decomposers","Only decomposers"],ans:2,explain:"All three groups are essential: producers make food, consumers transfer energy, decomposers recycle nutrients."}
    ],
    "r6_l2": [
      {type:"mcq",q:"The diagram of a leaf cross-section shows palisade cells near the upper surface. This arrangement:",opts:["Reduces photosynthesis","Maximises light absorption for photosynthesis","Protects from herbivores","Stores excess water"],ans:1,explain:"Palisade cells are positioned to receive maximum sunlight, optimising photosynthesis."},
      {type:"mcq",q:"Which of these is an endothermic process?",opts:["Photosynthesis","Combustion of fuel","Both A and B","Neither"],ans:2,explain:"Both photosynthesis and combustion involve energy absorption or transformation. Photosynthesis absorbs light energy."},
      {type:"sequence",q:"Arrange the levels of a food chain in order:",items:["Producers (plants)","Primary consumers (herbivores)","Secondary consumers (carnivores)","Tertiary consumers (top predators)","Decomposers"],explain:"Energy flows from producers → primary → secondary → tertiary consumers. Decomposers break down all levels."},
      {type:"truefalse",q:"100% of the sun's energy is used by plants for photosynthesis.",ans:false,explain:"Only about 1-2% of total sunlight energy falling on a leaf is used for photosynthesis. Most is reflected or lost as heat."},
      {type:"mcq",q:"If a plant is kept in a dark room with a sodium vapour lamp (yellow light), it will:",opts:["Photosynthesise normally","Photosynthesise less efficiently","Not photosynthesise at all","Photosynthesise better than in sunlight"],ans:1,explain:"Chlorophyll absorbs mainly red and blue light. Yellow light is less efficiently absorbed, so photosynthesis decreases."},
      {type:"mcq",q:"Heterotrophs that eat only plants are called:",opts:["Carnivores","Herbivores","Omnivores","Decomposers"],ans:1,explain:"Herbivores are primary consumers that feed exclusively on plants."}
    ],
    "r6_l3": [
      {type:"mcq",q:"In an ecosystem, the energy flow is:",opts:["Bidirectional","Unidirectional","Circular","Random"],ans:1,explain:"Energy flows in one direction: from sun → producers → consumers. It cannot flow backwards."},
      {type:"mcq",q:"If the deer population decreases in a forest, what happens to the tiger population?",opts:["Increases","Decreases","Remains the same","First increases then decreases"],ans:1,explain:"Tigers prey on deer. Fewer deer means less food for tigers, causing their population to decline."},
      {type:"truefalse",q:"A food web is formed by interconnected food chains.",ans:true,explain:"A food web shows multiple overlapping food chains in an ecosystem, showing complex feeding relationships."},
      {type:"mcq",q:"Which level of a food chain has the most energy?",opts:["Top predators","Secondary consumers","Primary consumers","Producers"],ans:3,explain:"Producers capture the most energy from sunlight. Energy decreases at each successive trophic level."},
      {type:"fill",q:"The green pigment in plants that absorbs light energy is ___.",accept:["chlorophyll"],explain:"Chlorophyll is the primary photosynthetic pigment, absorbing red and blue light while reflecting green."},
      {type:"mcq",q:"Bacteria that convert ammonia to nitrates are called:",opts:["Decomposers","Nitrifying bacteria","Denitrifying bacteria","Nitrogen-fixing bacteria"],ans:1,explain:"Nitrifying bacteria (like Nitrosomonas and Nitrobacter) convert ammonia → nitrites → nitrates in soil."}
    ],
    "r7_l0": [
      {type:"mcq",q:"In C₃ plants, the first stable product of CO₂ fixation is a:",opts:["4-carbon compound","3-carbon compound","5-carbon compound","6-carbon compound"],ans:1,explain:"In C₃ plants, CO₂ is fixed by RuBisCO into a 3-carbon compound (3-phosphoglyceric acid)."},
      {type:"mcq",q:"Which organisms are called the 'lungs of the Earth'?",opts:["Deserts","Oceans","Forests","Mountains"],ans:2,explain:"Forests are called the lungs of the Earth because they absorb CO₂ and release O₂ through photosynthesis."},
      {type:"truefalse",q:"CAM plants open their stomata during the day.",ans:false,explain:"CAM plants (like cacti) open stomata at night to reduce water loss, storing CO₂ for daytime photosynthesis."},
      {type:"mcq",q:"The rate of photosynthesis can be increased by:",opts:["Decreasing light intensity","Increasing CO₂ concentration and light","Removing water from soil","Lowering temperature to 0°C"],ans:1,explain:"CO₂ concentration, light intensity, and temperature are limiting factors. Increasing them (within limits) boosts the rate."},
      {type:"fill",q:"The enzyme that fixes CO₂ in the Calvin cycle is called ___.",accept:["RuBisCO","rubisco","RuBisCo"],explain:"RuBisCO (Ribulose bisphosphate carboxylase) is the most abundant enzyme on Earth, catalysing CO₂ fixation."},
      {type:"mcq",q:"Why do C₄ plants (like sugarcane) have an advantage in hot climates?",opts:["They have more chlorophyll","They can fix CO₂ efficiently even when stomata are partly closed","They need less water","They grow faster"],ans:1,explain:"C₄ plants have a CO₂ concentrating mechanism that allows efficient photosynthesis even with partially closed stomata, reducing water loss."}
    ],
    "r7_l1": [
      {type:"mcq",q:"During the light reactions of photosynthesis, which molecule is split?",opts:["CO₂","Glucose","Water","Oxygen"],ans:2,explain:"Water molecules are split (photolysis) during the light reactions, providing electrons, H⁺ ions, and O₂."},
      {type:"mcq",q:"ATP and NADPH produced in the light reactions are used in:",opts:["The Calvin cycle","The citric acid cycle","Glycolysis","Fermentation"],ans:0,explain:"ATP provides energy and NADPH provides reducing power for CO₂ fixation in the Calvin cycle."},
      {type:"truefalse",q:"Photosynthesis occurs in the mitochondria of plant cells.",ans:false,explain:"Photosynthesis occurs in chloroplasts. Cellular respiration occurs in mitochondria."},
      {type:"mcq",q:"The concentration of CO₂ in the atmosphere is approximately:",opts:["0.04%","0.4%","4%","40%"],ans:0,explain:"The current atmospheric CO₂ concentration is approximately 0.04% (about 420 ppm and rising)."},
      {type:"fill",q:"The green colour of leaves is due to the reflection of ___ light by chlorophyll.",accept:["green"],explain:"Chlorophyll absorbs red and blue wavelengths of light and reflects green light, making leaves appear green."},
      {type:"mcq",q:"Which of the following is an effect of deforestation on photosynthesis globally?",opts:["More CO₂ absorbed","CO₂ levels increase in atmosphere","Oxygen levels increase","No significant effect"],ans:1,explain:"Fewer trees mean less photosynthesis, so less CO₂ is absorbed and more remains in the atmosphere, contributing to global warming."}
    ],
    "r7_l2": [
      {type:"mcq",q:"In the experiment where a hydrilla plant is kept in water and inverted funnel with test tube is placed over it, the gas collected is:",opts:["CO₂","N₂","O₂","H₂"],ans:2,explain:"Hydrilla performs photosynthesis underwater, releasing oxygen bubbles that collect in the inverted test tube."},
      {type:"mcq",q:"When a glowing splinter is brought near the gas collected from the hydrilla experiment, it:",opts:["Gets extinguished","Burns brighter / relights","No effect","Produces smoke"],ans:1,explain:"The gas is oxygen, which supports combustion, so the glowing splinter relights."},
      {type:"truefalse",q:"Sodium bicarbonate added to water in the hydrilla experiment provides CO₂.",ans:true,explain:"NaHCO₃ dissolves to release CO₂ into the water, increasing the rate of photosynthesis."},
      {type:"mcq",q:"The rate of photosynthesis is measured by:",opts:["Counting leaves","Measuring the number of oxygen bubbles released per minute","Weighing the plant","Measuring leaf colour"],ans:1,explain:"In the hydrilla experiment, the rate is estimated by counting oxygen bubbles per unit time."},
      {type:"fill",q:"When white light passes through a prism, it splits into seven colours. This is called ___.",accept:["dispersion","spectrum"],explain:"Dispersion of light by a prism reveals the visible spectrum — VIBGYOR (Violet, Indigo, Blue, Green, Yellow, Orange, Red)."},
      {type:"mcq",q:"In the absorption spectrum of chlorophyll, the maximum absorption occurs in:",opts:["Green region","Blue and red regions","Yellow region","UV region"],ans:1,explain:"Chlorophyll absorbs light most efficiently in the blue (~430 nm) and red (~662 nm) regions of the spectrum."}
    ],
    "r7_l3": [
      {type:"mcq",q:"If a plant is kept in an atmosphere of only O₂ and N₂ (no CO₂), it will:",opts:["Photosynthesise normally","Not photosynthesise at all","Photosynthesise slowly","Die immediately"],ans:1,explain:"CO₂ is an essential raw material for photosynthesis. Without it, no glucose can be synthesised."},
      {type:"mcq",q:"Which of the following best explains why leaves are thin and flat?",opts:["To store more water","To maximise surface area for light absorption","To reduce weight","To prevent herbivores"],ans:1,explain:"The flat, thin shape of leaves maximises the surface area exposed to sunlight for photosynthesis."},
      {type:"truefalse",q:"Plants perform photosynthesis only in their leaves.",ans:false,explain:"While leaves are the primary site, any green part of a plant (green stems, sepals) containing chlorophyll can photosynthesise."},
      {type:"mcq",q:"A plant that grows in a desert will likely have:",opts:["Large, broad leaves","Thorns instead of leaves, and green stems","No stomata","No chlorophyll"],ans:1,explain:"Desert plants (like cacti) have reduced leaves (thorns) to minimise water loss and green stems for photosynthesis."},
      {type:"fill",q:"Plants that grow in water are called ___ plants.",accept:["aquatic"],explain:"Aquatic plants like Hydrilla and Vallisneria perform photosynthesis using dissolved CO₂ and light that penetrates water."},
      {type:"mcq",q:"Global warming is partly caused by:",opts:["Too much photosynthesis","Deforestation reducing CO₂ absorption","Excess oxygen in atmosphere","Too many decomposers"],ans:1,explain:"Deforestation means fewer trees to absorb CO₂ via photosynthesis, leading to increased atmospheric CO₂ and global warming."}
    ],
    "r8_l0": [
      {type:"mcq",q:"A potted plant is kept in dark for 48 hours. One leaf is covered with black paper on both sides. The plant is then kept in sunlight for 6 hours. The covered leaf is tested for starch. The result will be:",opts:["Blue-black everywhere","No colour change (yellow-brown)","Partial blue-black","Red colour"],ans:1,explain:"Since both sides were covered, no light reached the leaf. No photosynthesis, no starch, so iodine remains yellow-brown."},
      {type:"mcq",q:"If a plant is placed in a sealed jar with a burning candle, the candle eventually goes out because:",opts:["The jar gets too hot","O₂ is used up and CO₂ increases","The wick burns out","Water vapour extinguishes it"],ans:1,explain:"The candle consumes O₂ and produces CO₂. Eventually O₂ drops below the level needed for combustion."},
      {type:"sequence",q:"Arrange these experiments to prove photosynthesis requirements:",items:["Black paper test → proves light needed","Soda lime test → proves CO₂ needed","Alcohol-iodine test → detects starch","Destarching → removes stored starch"],explain:"First destarch, then perform the variable tests (light, CO₂), finally use iodine to detect starch production."},
      {type:"truefalse",q:"A plant can survive indefinitely in a sealed, airtight container with only artificial light.",ans:false,explain:"CO₂ will eventually be depleted (or O₂ will accumulate to inhibitory levels), and the balance of gases will fail."},
      {type:"mcq",q:"The rate of photosynthesis increases with temperature up to about 35°C and then decreases because:",opts:["CO₂ escapes","Enzymes are denatured above optimal temperature","Light becomes weaker","Water evaporates"],ans:1,explain:"Photosynthetic enzymes (like RuBisCO) have an optimal temperature range. Above ~35-40°C, they denature and activity drops."},
      {type:"mcq",q:"Cyanobacteria are important because they:",opts:["Cause diseases","Can fix atmospheric nitrogen and also photosynthesise","Are decomposers","Are parasites"],ans:1,explain:"Cyanobacteria (blue-green algae) are autotrophic AND some species fix nitrogen, contributing to both oxygen production and soil fertility."}
    ],
    "r8_l1": [
      {type:"mcq",q:"A destarched plant is kept in sunlight. One leaf is painted with petroleum jelly on its lower surface. After 6 hours, this leaf will:",opts:["Show starch everywhere","Show no starch","Show starch only on lower surface","Have more starch than normal"],ans:1,explain:"Petroleum jelly blocks the stomata on the lower surface, preventing CO₂ from entering. Without CO₂, no photosynthesis and no starch."},
      {type:"mcq",q:"The difference between photosynthesis and respiration is:",opts:["They are the same process","Photosynthesis stores energy; respiration releases energy","Both release CO₂","Both need sunlight"],ans:1,explain:"Photosynthesis stores light energy as chemical energy (glucose). Respiration releases that stored energy for cellular work."},
      {type:"truefalse",q:"Photosynthesis and respiration are opposite processes.",ans:true,explain:"In many ways they are reverse: Photosynthesis: CO₂+H₂O→glucose+O₂. Respiration: glucose+O₂→CO₂+H₂O+energy."},
      {type:"mcq",q:"If all green plants suddenly disappeared, which gas would increase in the atmosphere?",opts:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],ans:2,explain:"Without photosynthesis to absorb CO₂, its concentration would steadily increase from respiration and combustion."},
      {type:"fill",q:"The conversion of light energy into chemical energy occurs in the ___.",accept:["chloroplast","chloroplasts"],explain:"Chloroplasts are the organelles where photosynthesis takes place, converting light energy to glucose."},
      {type:"mcq",q:"Chemosynthesis differs from photosynthesis in that:",opts:["It uses chemical energy instead of light energy","It uses CO₂","It produces glucose","It occurs in plants"],ans:0,explain:"Chemosynthesis uses energy from chemical reactions (e.g., oxidation of inorganic compounds) instead of sunlight."}
    ],
    "r8_l2": [
      {type:"mcq",q:"A diagram shows a leaf with: upper epidermis, palisade, spongy mesophyll, air spaces, stomata, guard cells, xylem, phloem. The CO₂ path from atmosphere to chloroplast is:",opts:["Stomata → air spaces → spongy mesophyll → palisade → chloroplast","Stomata → xylem → phloem → chloroplast","Upper epidermis → palisade → stomata","Roots → xylem → leaf → chloroplast"],ans:0,explain:"CO₂ enters through stomata, diffuses through air spaces, passes through spongy mesophyll cells, and reaches palisade chloroplasts."},
      {type:"mcq",q:"An experiment shows that a leaf kept in a bell jar with KOH (potassium hydroxide) does not produce starch. KOH:",opts:["Kills the leaf","Absorbs CO₂ from the air","Produces toxic fumes","Blocks light"],ans:1,explain:"KOH absorbs CO₂ from the enclosed air, proving that CO₂ is essential for photosynthesis."},
      {type:"sequence",q:"Order the events in the Calvin cycle:",items:["CO₂ combines with RuBP","Reduction to G3P (PGAL)","Regeneration of RuBP","Glucose is formed from G3P"],explain:"CO₂ fixation → reduction → RuBP regeneration. Two G3P molecules combine to form one glucose."},
      {type:"truefalse",q:"The light reactions of photosynthesis occur in the thylakoid membranes.",ans:true,explain:"Thylakoid membranes within chloroplasts contain the photosystems and electron carriers for light reactions."},
      {type:"mcq",q:"If we double the light intensity (while keeping CO₂ and temperature constant), the rate of photosynthesis will:",opts:["Double immediately","Increase then plateau","Stay the same","Decrease"],ans:1,explain:"Rate increases with light but eventually plateaus when another factor (CO₂ or temperature) becomes limiting."},
      {type:"mcq",q:"The phenomenon where green plants release O₂ only in light and release CO₂ in both light and dark is explained by:",opts:["Photosynthesis occurs in light; respiration occurs always","O₂ is stored at night","CO₂ is absorbed at night","Stomata close at night"],ans:0,explain:"Photosynthesis (O₂ release) occurs only in light, while respiration (CO₂ release) occurs 24/7."}
    ],
    "r8_l3": [
      {type:"mcq",q:"In a plant cell, if photosynthesis exceeds respiration, the net gas exchange is:",opts:["O₂ uptake and CO₂ release","CO₂ uptake and O₂ release","No gas exchange","Both O₂ and CO₂ release"],ans:1,explain:"If photosynthesis is faster, the plant absorbs more CO₂ than it releases and releases more O₂ than it consumes."},
      {type:"mcq",q:"A scientist measures gas exchange of a leaf at different light intensities. At very high light, the rate plateaus because:",opts:["The leaf dies","Light destroys chlorophyll","CO₂ or temperature becomes the limiting factor","O₂ inhibits photosynthesis"],ans:2,explain:"At high light intensity, other factors like CO₂ concentration or temperature limit the maximum rate."},
      {type:"truefalse",q:"Photosynthesis is the ultimate source of all food on Earth.",ans:true,explain:"Nearly all food chains trace back to plants that convert solar energy into chemical energy through photosynthesis."},
      {type:"mcq",q:"A plant placed in a room with only green light will:",opts:["Photosynthesise at normal rate","Photosynthesise very poorly","Not photosynthesise at all","Photosynthesise better"],ans:1,explain:"Chlorophyll reflects green light (that's why plants look green), so green light is poorly absorbed for photosynthesis."},
      {type:"fill",q:"The visible spectrum of light that is most effective for photosynthesis is ___ and ___ light.",accept:["red and blue","blue and red"],explain:"Chlorophyll absorbs red and blue light most efficiently for driving photosynthesis. Green light is mostly reflected."},
      {type:"mcq",q:"Why are most plants green and not black (which would absorb all light)?",opts:["Black pigments don't exist in nature","Evolution found green pigment sufficient; absorbing all wavelengths could cause overheating","Chlorophyll absorbs green light","Plants don't need all wavelengths"],ans:1,explain:"Evolutionary optimization — chlorophyll efficiently uses red and blue light. Absorbing all wavelengths could overheat tissues."}
    ],
    "boss": [
      {type:"mcq",q:"Photosynthesis is represented by the equation:",opts:["C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O","6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂","6O₂ + C₆H₁₂O₆ → 6CO₂ + 6H₂O","N₂ + 3H₂ → 2NH₃"],ans:1,explain:"The correct photosynthesis equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂."},
      {type:"mcq",q:"Which of the following is BOTH an autotroph AND a nitrogen fixer?",opts:["Rhizobium","Cuscuta","Nostoc (cyanobacteria)","Yeast"],ans:2,explain:"Nostoc (a cyanobacterium) can photosynthesise AND fix atmospheric nitrogen."},
      {type:"truefalse",q:"The products of photosynthesis are the reactants of respiration, and vice versa.",ans:true,explain:"Photosynthesis: CO₂ + H₂O → glucose + O₂. Respiration: glucose + O₂ → CO₂ + H₂O + energy."},
      {type:"mcq",q:"If a leaf is tested with iodine after being kept in the dark for 48 hours, the result will be:",opts:["Blue-black","No colour change","Green","Red"],ans:1,explain:"After 48 hours in dark, all stored starch is used up in respiration. Iodine remains yellow-brown."},
      {type:"fill",q:"The tiny pores on leaf surface surrounded by guard cells are called ___.",accept:["stomata","stoma"],explain:"Stomata are the gateways for gas exchange — CO₂ in, O₂ and water vapour out."},
      {type:"mcq",q:"In a food chain Grass → Deer → Tiger, if all producers are removed:",opts:["Deer and tiger both survive","Deer die first, then tigers","Tigers die first","Nothing happens"],ans:1,explain:"Without grass (producers), deer (primary consumers) starve. Without deer, tigers (secondary consumers) also starve."},
      {type:"sequence",q:"Arrange from simplest to most complex level of organisation in nutrition:",items:["Single cell (Amoeba)","Tissue (hydra)","Organ (stomach)","Organ system (human digestive system)"],explain:"Amoeba uses pseudopodia → hydra has tissue-level digestion → stomach is a specialised organ → humans have a complete organ system."},
      {type:"mcq",q:"Lichens indicate air quality because:",opts:["They grow faster in polluted air","They are sensitive to SO₂ pollution and die in polluted areas","They absorb all pollutants","They produce oxygen in pollution"],ans:1,explain:"Lichens are bioindicators — they are extremely sensitive to sulfur dioxide and cannot survive in polluted air."},
      {type:"mcq",q:"Which gas would accumulate in the atmosphere if all photosynthesis stopped?",opts:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],ans:2,explain:"Without photosynthesis to absorb CO₂ (from respiration and combustion), atmospheric CO₂ would steadily increase."},
      {type:"truefalse",q:"Saprophytes are harmful organisms that should be eliminated.",ans:false,explain:"Saprophytes (decomposers like fungi) are essential for recycling nutrients back into the soil."},
      {type:"mcq",q:"A plant cell placed in a hypertonic solution loses water. The organelle most affected is:",opts:["Chloroplast","Mitochondria","Central vacuole","Nucleus"],ans:2,explain:"The central vacuole loses water and shrinks, causing the cell to become flaccid (plasmolysis)."},
      {type:"mcq",q:"Crop rotation with legumes is practised because:",opts:["Legumes grow faster","Legume roots have Rhizobium that adds nitrogen to soil","Legumes need less water","Legumes taste better"],ans:1,explain:"Rhizobium bacteria in legume root nodules fix atmospheric nitrogen, naturally replenishing soil fertility."},
      {type:"fill",q:"The elongated cells just below the upper epidermis, packed with chloroplasts, are called ___ mesophyll.",accept:["palisade"],explain:"Palisade mesophyll cells are column-shaped and positioned for maximum light capture."},
      {type:"mcq",q:"What happens to the rate of photosynthesis if CO₂ concentration is increased while keeping light and temperature constant?",opts:["Rate decreases","Rate increases then reaches a plateau","Rate stays the same","Rate becomes zero"],ans:1,explain:"More CO₂ increases the rate (more raw material for Calvin cycle), but it plateaus when light or temperature becomes limiting."},
      {type:"mcq",q:"Which of the following correctly describes the role of chlorophyll in photosynthesis?",opts:["It provides CO₂","It absorbs light energy to drive the reaction","It stores glucose","It releases oxygen directly"],ans:1,explain:"Chlorophyll absorbs photons of light and transfers that energy to the photosynthetic electron transport chain."}
    ]
  }
},


// ══════════════════════════════════════════
//  CREATURES
// ══════════════════════════════════════════
creatures: [
  {id:'leafix',   name:'Leafix',   icon:'🌿', desc:'A tiny forest spirit that thrives on sunlight.', rarity:'common'},
  {id:'digestix', name:'Digestix', icon:'🫁', desc:'A belly-dwelling creature that breaks down nutrients.', rarity:'common'},
  {id:'textilix', name:'Textilix', icon:'🧵', desc:'Woven from the finest natural fibres.', rarity:'common'},
  {id:'thermix',  name:'Thermix',  icon:'🌡️', desc:'Controls temperature around it with ease.', rarity:'rare'},
  {id:'reactix',  name:'Reactix',  icon:'⚗️', desc:'Bubbles and fizzes with chemical energy.', rarity:'rare'},
  {id:'transmix', name:'Transmix', icon:'🔄', desc:'Shapeshifts between physical and chemical states.', rarity:'rare'},
  {id:'climatrix',name:'Climatrix',icon:'🌤️', desc:'Adapts to any weather condition instantly.', rarity:'epic'},
  {id:'aerovex',  name:'Aerovex',  icon:'🌪️', desc:'Rides the wind at incredible speeds.', rarity:'epic'},
  {id:'terravox', name:'Terravox', icon:'🪨', desc:'Deep earth guardian that nurtures the soil.', rarity:'rare'},
  {id:'breathix', name:'Breathix', icon:'💨', desc:'Inhales CO₂ and exhales pure oxygen.', rarity:'epic'},
  {id:'circulox', name:'Circulox', icon:'❤️', desc:'Pumps life force through everything it touches.', rarity:'rare'},
  {id:'floravex', name:'Floravex', icon:'🌸', desc:'Blooms wherever it walks, spreading life.', rarity:'epic'},
  {id:'chronovex', name:'Chronovex',icon:'⏱️', desc:'Bends time itself to measure the immeasurable.', rarity:'legendary'},
  {id:'voltix',   name:'Voltix',   icon:'⚡', desc:'Pure electric energy in a tiny body.', rarity:'legendary'},
  {id:'luminox',  name:'Luminox',  icon:'💡', desc:'Radiates with every colour of the spectrum.', rarity:'epic'},
  {id:'aquavex',  name:'Aquavex',  icon:'💧', desc:'Guardian of every water droplet on Earth.', rarity:'rare'},
  {id:'sylvavex', name:'Sylvavex', icon:'🌳', desc:'The ancient spirit of the forest.', rarity:'legendary'},
  {id:'purovex',  name:'Purovex',  icon:'✨', desc:'Cleanses everything it touches.', rarity:'epic'}
],


// ══════════════════════════════════════════
//  SHOP ITEMS
// ══════════════════════════════════════════
shop: [
  {id:'hint',       name:'Hint Lens',       icon:'🔍', desc:'Reveals a hint for the current question.', cost:20},
  {id:'eliminate',  name:'Remove Two',       icon:'❌', desc:'Eliminates two wrong options in MCQ.', cost:30},
  {id:'shield',     name:'Shield',           icon:'🛡️', desc:'Blocks the next boss attack completely.', cost:50},
  {id:'double_xp',  name:'Double XP',        icon:'⚡', desc:'Doubles XP earned for the next level.', cost:40},
  {id:'revive',     name:'Revive Potion',    icon:'💖', desc:'Restores 30 HP during boss battle.', cost:45},
  {id:'skip',       name:'Question Skip',    icon:'⏭️', desc:'Skip one question (counts as correct).', cost:35},
  {id:'freeze',     name:'Freeze Timer',     icon:'❄️', desc:'Freezes the timer for 30 seconds.', cost:25},
  {id:'treasure',   name:'Treasure Compass', icon:'🧭', desc:'Reveals hidden bonus rewards.', cost:60},
  {id:'lucky',      name:'Lucky Ticket',     icon:'🎫', desc:'50% chance of 2x coins on next level.', cost:15}
],


// ══════════════════════════════════════════
//  ACHIEVEMENTS
// ══════════════════════════════════════════
achievements: [
  {id:'first_correct', name:'First Light',       icon:'💡', desc:'Answer your first question correctly'},
  {id:'streak_5',      name:'Hot Streak',         icon:'🔥', desc:'Get 5 correct answers in a row'},
  {id:'correct_50',    name:'Half Century',        icon:'🎯', desc:'50 correct answers total'},
  {id:'boss_1',        name:'Guardian Slayer',     icon:'⚔️', desc:'Defeat your first Guardian Boss'},
  {id:'creature_3',    name:'Collector',           icon:'🧪', desc:'Collect 3 Science Spirits'},
  {id:'level_5',       name:'Rising Star',         icon:'⭐', desc:'Reach Player Level 5'},
  {id:'chapter_1',     name:'Chapter Champion',    icon:'📖', desc:'Complete your first chapter'},
  {id:'perfect_level', name:'Flawless',            icon:'💎', desc:'Complete a level with 100% accuracy'},
  {id:'combo_5',       name:'Combo Master',        icon:'🔥', desc:'Reach a 5x combo in a boss battle'},
  {id:'all_bosses',    name:'Guardian Conqueror',   icon:'👑', desc:'Defeat all 18 Guardian Bosses'}
]

};

// ═══════════════════════════════════════════════════════
//  TEMPLATE — Add more chapters following this pattern:
//
//  1. Add chapter definition in PRIMEQUEST_DATA.chapters[]
//  2. Add story scenes in PRIMEQUEST_DATA.stories["chapter_id_r0"], etc.
//  3. Add questions in PRIMEQUEST_DATA.questions["chapter_id"]
//     with keys: "r0_l0" through "r8_l3" and "boss"
//     (9 rounds × 4 levels × 6 questions + 15 boss questions = 231 questions)
//  4. Add creature in PRIMEQUEST_DATA.creatures[]
//
//  Question types: mcq, truefalse, fill, sequence
//  Difficulty: 1=easy, 2=medium, 3=hard
// ═══════════════════════════════════════════════════════
