import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

//RENDERING DETAILS
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

//Set Renderer Size to "Viewer" Div Size
const viewer = document.getElementById("viewer");

//Store width, height variables for later use
const width = viewer.clientWidth;
const height = viewer.clientHeight;

//Set Render Size
renderer.setSize(width, height);

//Set Camera Details
const camera = new THREE.PerspectiveCamera(
  35,
  width / height,
  0.1,
  1000
);
camera.position.set(2, 0, -1.7);

const floor = new THREE.Mesh(

    new THREE.PlaneGeometry(10,500,1,1),

    new THREE.ShadowMaterial({
        opacity: 0.5
    })

);
//Shadow Catch
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.position.y = -0.49;
scene.add(floor);

viewer.appendChild(renderer.domElement);

//Needed for HDRI / nicer lighting response
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .10;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//*************** LIGHTING ********************//

//Sun Lighting
const sun = new THREE.DirectionalLight(0xffffff, 5);
sun.position.set(0, 20, 0);
sun.castShadow = true;
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
scene.add(sun);

//Far Side Lighting
const fill = new THREE.DirectionalLight(0xffffff, 5);
fill.position.set(-20, 7, -10);
scene.add(fill);

//Near Side Lighting
const fill2 = new THREE.DirectionalLight(0xffffff, 5);
fill2.position.set(20, 7, 10);
scene.add(fill2);


//Controls & Shift Initial Camera Target
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(-0.3, .125, 0);
controls.update();

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

//HDRI Environment Map
new EXRLoader()
  .setPath('/hdri/')
  .load('studiohdri3.exr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.environment = envMap;
    scene.background = new THREE.Color(0x333333);

    texture.dispose();
    pmremGenerator.dispose();
  });

const loader = new GLTFLoader();

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();

//MainModel
loader.load('/models/stock_m109r.glb', function (gltf) {

    scene.add(gltf.scene);

    gltf.scene.traverse((obj) => {

        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }

    });
    const lens8 = part.getObjectByName("Signal_TSW_GLSS");
    lens8.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = 0.25;
        obj.material.roughness = 0.1;
        obj.material.needsUpdate = true;
      }
    });

},
undefined,
function (error) {
    console.error('Error loading model:', error);
});

// Swappable Parts
const parts = {};

function loadPart(name, path, visible = true, onLoad = null) {
  loader.load(path, (gltf) => {
    const part = gltf.scene;
    part.visible = visible;

    scene.add(part);
    parts[name] = part;

    if (onLoad) {
      onLoad(part);
    }
  });
}

//******************* PARTS LOADING *******************//

loadPart('NecelleShroud_CHR', '/models/NecelleShroud_CHR.glb', true);
loadPart('NecelleShroud_BSCLR', '/models/NecelleShroud_BSCLR.glb', false);
loadPart('Tach_OG', '/models/Tach_OG.glb', true);
loadPart('Tach_Necelle', '/models/Tach_Necelle.glb', false);
loadPart('Badges_STOCK', '/models/Badges_STOCK.glb', true);
loadPart('Stickers_Fender', '/models/Stickers_Fender.glb', true);
loadPart('Stickers_Rear', '/models/Stickers_Rear.glb', false);
loadPart('Beaver_STOCK', '/models/Beaver_STOCK.glb', true, (part) => {

    //transparent
    const lens6 = part.getObjectByName("Beaver_GLSS_RED");
    lens6.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = 0.5;
        obj.material.roughness = 0.1;
        obj.material.needsUpdate = true;
      }
    });
    //transparent
    const lens7 = part.getObjectByName("Beaver_TSW_GLSS");
    lens7.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = 0.25;
        obj.material.roughness = 0.1;
        obj.material.needsUpdate = true;
      }
    });
});

loadPart('Beaver_RAW', '/models/Beaver_RAW.glb', false);
loadPart('SET', '/models/SET.glb', true);
loadPart('chin_STOCK', '/models/chin_STOCK.glb', true);
loadPart('chin_MEANY', '/models/chin_MEANY.glb', false);
loadPart('Exhaust_STOCK_CHR', '/models/Exhaust_STOCK_CHR.glb', true);
loadPart('Exhaust_SCORPION_CHR', '/models/Exhaust_SCORPION_CHR.glb', false);
loadPart('Exhaust_SCORPION_GLOBLK', '/models/Exhaust_SCORPION_GLOBLK.glb', false);
loadPart('Exhaust_SCORPION_MATBLK', '/models/Exhaust_SCORPION_MATBLK.glb', false);
loadPart('Seat_STOCK', '/models/Seat_STOCK.glb', true);
loadPart('Seat_GEL', '/models/Seat_GEL.glb', false);
loadPart('Grips_STOCK', '/models/Grips_STOCK.glb', true);
loadPart('Grips_KURY', '/models/Grips_KURY.glb', false);
loadPart('Mirrors_STOCK', '/models/Mirrors_STOCK.glb', true);
loadPart('Mirrors_KURYMAG', '/models/Mirrors_KURYMAG.glb', false);
loadPart('BrakeLight_RED', '/models/BrakeLight_RED.glb', true);
loadPart('BrakeLight_CLEAR', '/models/BrakeLight_CLEAR.glb', false);
loadPart('FrontFender_STOCK', '/models/FrontFender_STOCK.glb', true);
loadPart('FrontFender_STEALTH', '/models/FrontFender_STEALTH.glb', false);
loadPart('Headlamp_STOCK', '/models/Headlamp_STOCK.glb', true, (part) => {
    //transparent
    const lens1 = part.getObjectByName("Headlamp_STOCK_GLSS");

  lens1.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.transparent = true;
      obj.material.opacity = 0.3;
      obj.material.needsUpdate = true;
    }
  });
    //Emissive
    const lens = part.getObjectByName("Headlamp_STOCK");

lens1.traverse((obj) => {
    if (obj.isMesh) {
        obj.material.emissive.set(0xffffff);
        obj.material.emissiveIntensity = 10;
        obj.material.needsUpdate = true;
    }
  });
});

loadPart('Headlamp_LED', '/models/Headlamp_LED.glb', false, (part) => {
    //transparent
    const lens2 = part.getObjectByName("Headlamp_LED_GLSS");

  lens2.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.transparent = true;
      obj.material.emissive.set(0xffffff);
      obj.material.emissiveIntensity = 10;
      obj.material.opacity = 0.3;
      obj.material.needsUpdate = true;
    }
  });
});

loadPart('Dash_STOCK', '/models/Dash_STOCK.glb', true, (part) => {
    //transparent
    const lens3 = part.getObjectByName("Dash_STOCK_GLSS");

    lens3.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = 0.3;
        obj.material.needsUpdate = true;
      }
    });
});

loadPart('Dash_EXT', '/models/Dash_EXT.glb', false, (part) => {
    //transparent
    const lens4 = part.getObjectByName("Dash_EXT_GLSS");

    lens4.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = 0.3;
        obj.material.needsUpdate = true;
      }
    });
});


function showOnly(group, selectedName) {
  group.forEach((name) => {
    if (!parts[name]) {
      console.warn(`${name} has not loaded yet`);
      return;
    }

    parts[name].visible = name === selectedName;
  });
}

//swap button logic
function activateButton(activeId, buttonIds) {

    buttonIds.forEach(id => {

        document
            .getElementById(id)
            .classList.remove("active");

    });

    document
        .getElementById(activeId)
        .classList.add("active");
}

function registerSwapButton(buttonId, group, selectedName) {
  document.getElementById(buttonId).addEventListener('click', () => {
    showOnly(group, selectedName);
  });
}

//****************  BUTTONS LOGIC  *******************//

//Tachometers
registerSwapButton(
  'showTachOG',
  ['Tach_OG', 'Tach_Necelle'],
  'Tach_OG'
);

document
    .getElementById("showTachOG")
    .addEventListener("click", () => {

        activateButton(
            "showTachOG",
            ["showTachOG", "showTachNecelle"]
        );

    });
    //Default active button
    activateButton(
        "showTachOG",
        ["showTachOG", "showTachNecelle"]
    );

registerSwapButton(
  'showTachNecelle',
  ['Tach_OG', 'Tach_Necelle'],
  'Tach_Necelle'
);

document
    .getElementById("showTachNecelle")
    .addEventListener("click", () => {

        activateButton(
            "showTachNecelle",
            ["showTachOG", "showTachNecelle"]
        );
    });






// Dashes
registerSwapButton(
  'showDashStock',
  ['Dash_STOCK', 'Dash_EXT'],
  'Dash_STOCK'
);

document
    .getElementById("showDashStock")
    .addEventListener("click", () => {

        activateButton(
            "showDashStock",
            ["showDashStock", "showDashEXT"]
        );

    });
    //Default active button
    activateButton(
        "showDashStock",
        ["showDashStock", "showDashEXT"]
    );

registerSwapButton(
  'showDashEXT',
  ['Dash_STOCK', 'Dash_EXT'],
  'Dash_EXT'
);

document
    .getElementById("showDashEXT")
    .addEventListener("click", () => {

        activateButton(
            "showDashEXT",
            ["showDashStock", "showDashEXT"]
        );

    });

    




//DECALS (TOGGLES)
document.getElementById("showBadgesStock").addEventListener("click", () => {

  if (!parts["Badges_STOCK"]) {
    console.warn("Badges_STOCK not loaded yet");
    return;
  }

  parts["Badges_STOCK"].visible = !parts["Badges_STOCK"].visible;
});

document.getElementById("showStickers_Fender").addEventListener("click", () => {

    if (!parts["Stickers_Fender"]) {
      console.warn("Stickers_Fender not loaded yet");
      return;
    }

    parts["Stickers_Fender"].visible = !parts["Stickers_Fender"].visible;

});

document.getElementById("showStickers_Rear").addEventListener("click", () => {

    if (!parts["Stickers_Rear"]) {
      console.warn("Stickers_Rear not loaded yet");
      return;
    }

    parts["Stickers_Rear"].visible = !parts["Stickers_Rear"].visible;

});




//Rear Turnsignals
registerSwapButton(
  'showBeaverStock',
  ['Beaver_STOCK', 'Beaver_RAW'],
  'Beaver_STOCK'
);

document
    .getElementById("showBeaverStock")
    .addEventListener("click", () => {

        activateButton(
            "showBeaverStock",
            ["showBeaverStock", "showBeaverRaw"]
        );

    });
    //Default active button
    activateButton(
        "showBeaverStock",
        ["showBeaverStock", "showBeaverRaw"]
    );

registerSwapButton(
  'showBeaverRaw',
  ['Beaver_STOCK', 'Beaver_RAW'],
  'Beaver_RAW'
);

document
    .getElementById("showBeaverRaw")
    .addEventListener("click", () => {

        activateButton(
            "showBeaverRaw",
            ["showBeaverStock", "showBeaverRaw"]
        );

    });






//Chin Fairings
registerSwapButton(
  'showStockChin',
  ['chin_STOCK', 'chin_MEANY'],
  'chin_STOCK'
);

document
    .getElementById("showStockChin")
    .addEventListener("click", () => {

        activateButton(
            "showStockChin",
            ["showStockChin", "showMeanyChin"]
        );

    });
    //Default active button
    activateButton(
        "showStockChin",
        ["showStockChin", "showMeanyChin"]
    );

registerSwapButton(
  'showMeanyChin',
  ['chin_MEANY', 'chin_STOCK'],
  'chin_MEANY'
);

document
    .getElementById("showMeanyChin")
    .addEventListener("click", () => {

        activateButton(
            "showMeanyChin",
            ["showMeanyChin", "showStockChin"]
        );

    });




//Necelle Shrouds
registerSwapButton(
  'showNecelleShroud_CHR',
  ['NecelleShroud_CHR', 'NecelleShroud_BSCLR'],
  'NecelleShroud_CHR'
);

document
    .getElementById("showNecelleShroud_CHR")
    .addEventListener("click", () => {

        activateButton(
            "showNecelleShroud_CHR",
            ["showNecelleShroud_CHR", "showNecelleShroud_BSCLR"]
        );

    });
    //Default active button
    activateButton(
        "showNecelleShroud_CHR",
        ["showNecelleShroud_CHR", "showNecelleShroud_BSCLR"]
    );

registerSwapButton(
  'showNecelleShroud_BSCLR',
  ['NecelleShroud_CHR', 'NecelleShroud_BSCLR'],
  'NecelleShroud_BSCLR'
);

document
    .getElementById("showNecelleShroud_BSCLR")
    .addEventListener("click", () => {

        activateButton(
            "showNecelleShroud_BSCLR",
            ["showNecelleShroud_BSCLR", "showNecelleShroud_CHR"]
        );

    });






//Exhausts
registerSwapButton(
  'showStockExhaust',
  ['Exhaust_STOCK_CHR', 'Exhaust_SCORPION_CHR', 'Exhaust_SCORPION_GLOBLK', 'Exhaust_SCORPION_MATBLK'],
  'Exhaust_STOCK_CHR'
);

document
    .getElementById("showStockExhaust")
    .addEventListener("click", () => {

        activateButton(
            "showStockExhaust",
            ["showStockExhaust", "showScorpionChrome", "showScorpionGloss", "showScorpionMatte"]
        );

    });
    //Default active button
    activateButton(
        "showStockExhaust",
        ["showStockExhaust", "showScorpionChrome", "showScorpionGloss", "showScorpionMatte"]
    );

registerSwapButton(
  'showScorpionChrome',
  ['Exhaust_STOCK_CHR', 'Exhaust_SCORPION_CHR', 'Exhaust_SCORPION_GLOBLK', 'Exhaust_SCORPION_MATBLK'],
  'Exhaust_SCORPION_CHR'
);

document
    .getElementById("showScorpionChrome")
    .addEventListener("click", () => {

        activateButton(
            "showScorpionChrome",
            ["showScorpionChrome", "showStockExhaust", "showScorpionGloss", "showScorpionMatte"]
        );

    });

registerSwapButton(
  'showScorpionGloss',
  ['Exhaust_STOCK_CHR', 'Exhaust_SCORPION_CHR', 'Exhaust_SCORPION_GLOBLK', 'Exhaust_SCORPION_MATBLK'],
  'Exhaust_SCORPION_GLOBLK'
);

document
    .getElementById("showScorpionGloss")
    .addEventListener("click", () => {

        activateButton(
            "showScorpionGloss",
            ["showScorpionGloss", "showStockExhaust", "showScorpionChrome", "showScorpionMatte"]
        );

    });

registerSwapButton(
  'showScorpionMatte',
  ['Exhaust_STOCK_CHR', 'Exhaust_SCORPION_CHR', 'Exhaust_SCORPION_GLOBLK', 'Exhaust_SCORPION_MATBLK'],
  'Exhaust_SCORPION_MATBLK'
);

document
    .getElementById("showScorpionMatte")
    .addEventListener("click", () => {

        activateButton(
            "showScorpionMatte",
            ["showScorpionMatte", "showStockExhaust", "showScorpionChrome", "showScorpionGloss"]
        );

    });





//Seats     
registerSwapButton(
  'showSeatStock',
  ['Seat_STOCK', 'Seat_GEL'],
  'Seat_STOCK'
);

document
    .getElementById("showSeatStock")
    .addEventListener("click", () => {

        activateButton(
            "showSeatStock",
            ["showSeatStock", "showSeatGel"]
        );

    });
    //Default active button
    activateButton(
        "showSeatStock",
        ["showSeatStock", "showSeatGel"]
    );

registerSwapButton(
  'showSeatStock',
  ['Seat_STOCK', 'Seat_GEL'],
  'Seat_STOCK'
);

document
    .getElementById("showSeatStock")
    .addEventListener("click", () => {

        activateButton(
            "showSeatStock",
            ["showSeatStock", "showSeatGel"]
        );

    });

registerSwapButton(
  'showSeatGel',
  ['Seat_STOCK', 'Seat_GEL'],
  'Seat_GEL'
);

document
    .getElementById("showSeatGel")
    .addEventListener("click", () => {

        activateButton(
            "showSeatGel",
            ["showSeatGel", "showSeatStock"]
        );

    });





//Grips     
registerSwapButton(
  'showGripsStock',
  ['Grips_STOCK', 'Grips_KURY'],
  'Grips_STOCK'
);

document
    .getElementById("showGripsStock")
    .addEventListener("click", () => {

        activateButton(
            "showGripsStock",
            ["showGripsStock", "showGripsKury"]
        );

    });
    //Default active button
    activateButton(
        "showGripsStock",
        ["showGripsStock", "showGripsKury"]
    );

registerSwapButton(
  'showGripsKury',
  ['Grips_STOCK', 'Grips_KURY'],
  'Grips_KURY'
);

document
    .getElementById("showGripsKury")
    .addEventListener("click", () => {

        activateButton(
            "showGripsKury",
            ["showGripsKury", "showGripsStock"]
        );

    });





//Mirrors    
registerSwapButton(
  'showMirrorsStock',
  ['Mirrors_STOCK', 'Mirrors_KURYMAG'],
  'Mirrors_STOCK'
);

document
    .getElementById("showMirrorsStock")
    .addEventListener("click", () => {

        activateButton(
            "showMirrorsStock",
            ["showMirrorsStock", "showMirrorsKuryMag"]
        );

    });
    //Default active button
    activateButton(
        "showMirrorsStock",
        ["showMirrorsStock", "showMirrorsKuryMag"]
    );

registerSwapButton(
  'showMirrorsKuryMag',
  ['Mirrors_STOCK', 'Mirrors_KURYMAG'],
  'Mirrors_KURYMAG'
);

document
    .getElementById("showMirrorsKuryMag")
    .addEventListener("click", () => {

        activateButton(
            "showMirrorsKuryMag",
            ["showMirrorsKuryMag", "showMirrorsStock"]
        );

    });






//Brake Lights
registerSwapButton(
  'showBrakeLightRed',
  ['BrakeLight_RED', 'BrakeLight_CLEAR'],
  'BrakeLight_RED'
);

document
    .getElementById("showBrakeLightRed")
    .addEventListener("click", () => {

        activateButton(
            "showBrakeLightRed",
            ["showBrakeLightRed", "showBrakeLightClear"]
        );

    });
    //Default active button
    activateButton(
        "showBrakeLightRed",
        ["showBrakeLightRed", "showBrakeLightClear"]
    );

registerSwapButton(
  'showBrakeLightClear',
  ['BrakeLight_RED', 'BrakeLight_CLEAR'],
  'BrakeLight_CLEAR'
);

document
    .getElementById("showBrakeLightClear")
    .addEventListener("click", () => {

        activateButton(
            "showBrakeLightClear",
            ["showBrakeLightClear", "showBrakeLightRed"]
        );

    });





//Front Fenders    
registerSwapButton(
  'showFenderStock',
  ['FrontFender_STOCK', 'FrontFender_STEALTH'],
  'FrontFender_STOCK'
);


document
    .getElementById("showFenderStock")
    .addEventListener("click", () => {

        activateButton(
            "showFenderStock",
            ["showFenderStock", "showFenderStealth"]
        );

    });
    //Default active button
    activateButton(
        "showFenderStock",
        ["showFenderStock", "showFenderStealth"]
    );

registerSwapButton(
  'showFenderStealth',
  ['FrontFender_STOCK', 'FrontFender_STEALTH'],
  'FrontFender_STEALTH'
);

document
    .getElementById("showFenderStealth")
    .addEventListener("click", () => {

        activateButton(
            "showFenderStealth",
            ["showFenderStealth", "showFenderStock"]
        );

    });





//Headlamps    
registerSwapButton(
  'showHeadlampStock',
  ['Headlamp_STOCK', 'Headlamp_LED'],
  'Headlamp_STOCK'
);

document
    .getElementById("showHeadlampStock")
    .addEventListener("click", () => {

        activateButton(
            "showHeadlampStock",
            ["showHeadlampStock", "showHeadlampLED"]
        );

    });
    //Default active button
    activateButton(
        "showHeadlampStock",
        ["showHeadlampStock", "showHeadlampLED"]
    );
8
    registerSwapButton(
  'showHeadlampLED',
  ['Headlamp_STOCK', 'Headlamp_LED'],
  'Headlamp_LED'
);

document
    .getElementById("showHeadlampLED")
    .addEventListener("click", () => {

        activateButton(
            "showHeadlampLED",
            ["showHeadlampLED", "showHeadlampStock"]
        );

    });







function setBodyColor(hexColor) {
  scene.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    if (
      child.name.includes("Tank") ||
      child.name.includes("Fender") ||
      child.name.includes("SideCover") ||
      child.name.includes("Cowl") ||
      child.name.includes("Fairing") ||
      child.name.includes("BSCLR") ||
      child.name.includes("Meany")
    ) {
      child.material.color.set(hexColor);
      child.material.needsUpdate = true;
    }
  });
}



const bodyColorPicker = document.getElementById("bodyColorPicker");

bodyColorPicker.addEventListener("input", (event) => {
  setBodyColor(event.target.value);
});