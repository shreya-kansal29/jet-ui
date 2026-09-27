import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";


/* =========================================================
   CONTAINER
========================================================= */

const container =
    document.getElementById("three-container");


/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x020812);


/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        40,
        container.clientWidth /
        container.clientHeight,
        0.1,
        200
    );

/*
    Side/front view of aircraft.
    The aircraft itself is built along the X axis.
*/

camera.position.set(
    8.5,
    3.2,
    6.5
);

camera.lookAt(
    0,
    0,
    0
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: true,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    container.clientWidth,
    container.clientHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.5;


container.appendChild(
    renderer.domElement
);


/* =========================================================
   CAMERA CONTROLS
========================================================= */

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.05;


controls.enablePan =
    false;


controls.minDistance =
    5;


controls.maxDistance =
    18;


controls.target.set(
    0,
    0,
    0
);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
    new THREE.AmbientLight(
        0x287ca8,
        2.5
    );

scene.add(
    ambientLight
);


const mainBlueLight =
    new THREE.PointLight(
        0x0066ff,
        18,
        35
    );

mainBlueLight.position.set(
    4,
    5,
    5
);

scene.add(
    mainBlueLight
);


const cyanLight =
    new THREE.PointLight(
        0x00eaff,
        14,
        30
    );

cyanLight.position.set(
    -5,
    2,
    4
);

scene.add(
    cyanLight
);


/* =========================================================
   MATERIALS
========================================================= */

function hologramMaterial(
    color = 0x087cff,
    opacity = 0.94
) {

    return new THREE.MeshStandardMaterial({

        color: color,

        emissive: 0x0066ff,

        emissiveIntensity: 3.5,

        metalness: 0.35,

        roughness: 0.18,

        transparent: true,

        opacity: opacity,

        side: THREE.DoubleSide,

        depthWrite: true

    });

}


function brightMaterial(
    color = 0x00eaff
) {

    return new THREE.MeshBasicMaterial({

        color: color,

        transparent: true,

        opacity: 0.95,

        blending:
            THREE.AdditiveBlending

    });

}


function wireMaterial(
    opacity = 0.65
) {

    return new THREE.LineBasicMaterial({

        color: 0x31d9ff,

        transparent: true,

        opacity: opacity,

        blending:
            THREE.AdditiveBlending

    });

}


/* =========================================================
   AIRCRAFT GROUP
========================================================= */

let aircraft =
    new THREE.Group();


/* =========================================================
   CREATE AIRCRAFT
========================================================= */

function createJet() {

    const jet =
        new THREE.Group();


    /* =====================================================
       MAIN FUSELAGE
    ===================================================== */

    const bodyGeometry =
        new THREE.CapsuleGeometry(
            0.42,
            4.2,
            12,
            32
        );


    const body =
        new THREE.Mesh(
            bodyGeometry,
            hologramMaterial(
                0x087cff,
                0.95
            )
        );


    /*
        Capsule is naturally vertical.
        Rotate so aircraft points along X.
    */

    body.rotation.z =
        Math.PI / 2;


    jet.add(
        body
    );


    /* BODY WIREFRAME */

    const bodyWire =
        new THREE.LineSegments(

            new THREE.WireframeGeometry(
                bodyGeometry
            ),

            wireMaterial(
                0.48
            )

        );


    bodyWire.rotation.z =
        Math.PI / 2;


    jet.add(
        bodyWire
    );


    /* =====================================================
       NOSE
    ===================================================== */

    const noseGeometry =
        new THREE.ConeGeometry(
            0.43,
            1.65,
            32
        );


    const nose =
        new THREE.Mesh(
            noseGeometry,
            hologramMaterial(
                0x0c91ff,
                0.96
            )
        );


    nose.rotation.z =
        -Math.PI / 2;


    nose.position.x =
        2.85;


    jet.add(
        nose
    );


    const noseWire =
        new THREE.LineSegments(

            new THREE.WireframeGeometry(
                noseGeometry
            ),

            wireMaterial(
                0.55
            )

        );


    noseWire.rotation.z =
        -Math.PI / 2;


    noseWire.position.x =
        2.85;


    jet.add(
        noseWire
    );


    /* =====================================================
       MAIN WINGS
    ===================================================== */

    const wingShape =
        new THREE.Shape();


    wingShape.moveTo(
        1.2,
        0
    );


    wingShape.lineTo(
        -1.6,
        -0.15
    );


    wingShape.lineTo(
        -2.65,
        -0.65
    );


    wingShape.lineTo(
        -0.85,
        -0.50
    );


    wingShape.lineTo(
        1.4,
        -0.12
    );


    wingShape.lineTo(
        1.2,
        0
    );


    const wingGeometry =
        new THREE.ExtrudeGeometry(

            wingShape,

            {

                depth: 0.10,

                bevelEnabled: true,

                bevelThickness: 0.02,

                bevelSize: 0.025,

                bevelSegments: 1

            }

        );


    /* LEFT WING */

    const leftWing =
        new THREE.Mesh(

            wingGeometry,

            hologramMaterial(
                0x057cff,
                0.91
            )

        );


    leftWing.position.y =
        0.03;


    jet.add(
        leftWing
    );


    /* RIGHT WING */

    const rightWing =
        leftWing.clone();


    rightWing.scale.y =
        -1;


    jet.add(
        rightWing
    );


    /* WING WIREFRAME */

    const leftWingWire =
        new THREE.LineSegments(

            new THREE.WireframeGeometry(
                wingGeometry
            ),

            wireMaterial(
                0.55
            )

        );


    leftWingWire.position.copy(
        leftWing.position
    );


    jet.add(
        leftWingWire
    );


    const rightWingWire =
        leftWingWire.clone();


    rightWingWire.scale.y =
        -1;


    jet.add(
        rightWingWire
    );


    /* =====================================================
       FRONT CANARDS
    ===================================================== */

    const canardShape =
        new THREE.Shape();


    canardShape.moveTo(
        0.8,
        0
    );


    canardShape.lineTo(
        -0.55,
        -0.10
    );


    canardShape.lineTo(
        -1.10,
        -0.40
    );


    canardShape.lineTo(
        0.55,
        -0.12
    );


    canardShape.lineTo(
        0.8,
        0
    );


    const canardGeometry =
        new THREE.ExtrudeGeometry(

            canardShape,

            {
                depth: 0.08,
                bevelEnabled: false
            }

        );


    const canardLeft =
        new THREE.Mesh(

            canardGeometry,

            hologramMaterial(
                0x0094ff,
                0.88
            )

        );


    canardLeft.position.x =
        0.75;


    canardLeft.position.y =
        0.38;


    jet.add(
        canardLeft
    );


    const canardRight =
        canardLeft.clone();


    canardRight.scale.y =
        -1;


    jet.add(
        canardRight
    );


    /* =====================================================
       VERTICAL TAIL
    ===================================================== */

    const tailShape =
        new THREE.Shape();


    tailShape.moveTo(
        0,
        0
    );


    tailShape.lineTo(
        -1.0,
        0
    );


    tailShape.lineTo(
        -0.48,
        1.30
    );


    tailShape.lineTo(
        0.30,
        0.12
    );


    tailShape.lineTo(
        0,
        0
    );


    const tailGeometry =
        new THREE.ExtrudeGeometry(

            tailShape,

            {

                depth: 0.12,

                bevelEnabled: true,

                bevelThickness: 0.02,

                bevelSize: 0.025,

                bevelSegments: 1

            }

        );


    const verticalTail =
        new THREE.Mesh(

            tailGeometry,

            hologramMaterial(
                0x0577ff,
                0.94
            )

        );


    verticalTail.position.x =
        -1.75;


    jet.add(
        verticalTail
    );


    const tailWire =
        new THREE.LineSegments(

            new THREE.WireframeGeometry(
                tailGeometry
            ),

            wireMaterial(
                0.58
            )

        );


    tailWire.position.copy(
        verticalTail.position
    );


    jet.add(
        tailWire
    );


    /* =====================================================
       COCKPIT
    ===================================================== */

    const cockpitGeometry =
        new THREE.SphereGeometry(
            0.55,
            32,
            20,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );


    const cockpitMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x00d9ff,

            emissive:
                0x0088ff,

            emissiveIntensity:
                5,

            transparent:
                true,

            opacity:
                0.78,

            metalness:
                0.75,

            roughness:
                0.08

        });


    const cockpit =
        new THREE.Mesh(

            cockpitGeometry,

            cockpitMaterial

        );


    cockpit.scale.set(
        1.30,
        0.70,
        1.80
    );


    cockpit.position.set(
        0.72,
        0.40,
        0
    );


    jet.add(
        cockpit
    );


    /* COCKPIT RIM */

    const cockpitRingGeometry =
        new THREE.TorusGeometry(
            0.46,
            0.025,
            8,
            32
        );


    const cockpitRing =
        new THREE.Mesh(

            cockpitRingGeometry,

            brightMaterial(
                0x00eaff
            )

        );


    cockpitRing.rotation.y =
        Math.PI / 2;


    cockpitRing.scale.set(
        1.3,
        0.70,
        1.6
    );


    cockpitRing.position.set(
        0.70,
        0.40,
        0
    );


    jet.add(
        cockpitRing
    );


    /* =====================================================
       ENGINES
    ===================================================== */

    const engineGeometry =
        new THREE.CylinderGeometry(
            0.23,
            0.29,
            0.70,
            24
        );


    const engineMaterial =
        brightMaterial(
            0x00cfff
        );


    const engine1 =
        new THREE.Mesh(
            engineGeometry,
            engineMaterial
        );


    engine1.rotation.z =
        Math.PI / 2;


    engine1.position.set(
        -2.25,
        0.18,
        0
    );


    jet.add(
        engine1
    );


    const engine2 =
        engine1.clone();


    engine2.position.y =
        -0.18;


    jet.add(
        engine2
    );


    /* =====================================================
       ENGINE CORES
    ===================================================== */

    const engineCoreGeometry =
        new THREE.CylinderGeometry(
            0.11,
            0.16,
            0.80,
            20
        );


    const engineCoreMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xbaffff,

            transparent:
                true,

            opacity:
                1

        });


    const engineCore1 =
        new THREE.Mesh(
            engineCoreGeometry,
            engineCoreMaterial
        );


    engineCore1.rotation.z =
        Math.PI / 2;


    engineCore1.position.set(
        -2.48,
        0.18,
        0
    );


    jet.add(
        engineCore1
    );


    const engineCore2 =
        engineCore1.clone();


    engineCore2.position.y =
        -0.18;


    jet.add(
        engineCore2
    );


    /* =====================================================
       EXHAUST
    ===================================================== */

    const exhaustGeometry =
        new THREE.ConeGeometry(
            0.42,
            1.55,
            24,
            1,
            true
        );


    const exhaustMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x0077ff,

            transparent:
                true,

            opacity:
                0.28,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const exhaust1 =
        new THREE.Mesh(
            exhaustGeometry,
            exhaustMaterial
        );


    exhaust1.rotation.z =
        -Math.PI / 2;


    exhaust1.position.set(
        -3.15,
        0.18,
        0
    );


    jet.add(
        exhaust1
    );


    const exhaust2 =
        exhaust1.clone();


    exhaust2.position.y =
        -0.18;


    jet.add(
        exhaust2
    );


    /* =====================================================
       ENGINE GLOW
    ===================================================== */

    const engineGlow =
        new THREE.PointLight(
            0x00d9ff,
            8,
            7
        );


    engineGlow.position.set(
        -3,
        0,
        0
    );


    jet.add(
        engineGlow
    );


    /* =====================================================
       CENTRAL ENERGY LINE
    ===================================================== */

    const energyGeometry =
        new THREE.BoxGeometry(
            3.8,
            0.025,
            0.025
        );


    const energyLine =
        new THREE.Mesh(

            energyGeometry,

            brightMaterial(
                0x00eaff
            )

        );


    energyLine.position.y =
        0.43;


    jet.add(
        energyLine
    );


    /* =====================================================
       AIRCRAFT GLOW
    ===================================================== */

    const aircraftGlow =
        new THREE.PointLight(
            0x0066ff,
            10,
            10
        );


    aircraftGlow.position.set(
        0,
        0,
        0
    );


    jet.add(
        aircraftGlow
    );


    /* =====================================================
       FINAL SIZE
    ===================================================== */

    jet.scale.set(
        2.0,
        2.0,
        2.0
    );


    /*
       Make sure aircraft renders prominently.
    */

    jet.renderOrder = 5;


    return jet;

}


/* =========================================================
   ADD AIRCRAFT
========================================================= */

aircraft =
    createJet();


scene.add(
    aircraft
);


/* =========================================================
   EXTRA AIRCRAFT LIGHTS
========================================================= */

const aircraftLight =
    new THREE.PointLight(
        0x008cff,
        18,
        14
    );


aircraftLight.position.set(
    3,
    3,
    3
);


scene.add(
    aircraftLight
);


const aircraftLight2 =
    new THREE.PointLight(
        0x00eaff,
        14,
        12
    );


aircraftLight2.position.set(
    -3,
    1,
    3
);


scene.add(
    aircraftLight2
);


/* =========================================================
   HOLOGRAPHIC FLOOR GRID
========================================================= */

const grid =
    new THREE.GridHelper(
        50,
        50,
        0x0088cc,
        0x003050
    );


grid.position.y =
    -3;


grid.material.transparent =
    true;


grid.material.opacity =
    0.22;


scene.add(
    grid
);


/* =========================================================
   RADAR RINGS ON FLOOR
========================================================= */

const rings = [];


for (
    let i = 0;
    i < 7;
    i++
) {

    const geometry =
        new THREE.RingGeometry(
            1.5 + i * 0.85,
            1.52 + i * 0.85,
            96
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0x008cff,

            transparent:
                true,

            opacity:
                0.15,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending

        });


    const ring =
        new THREE.Mesh(
            geometry,
            material
        );


    ring.rotation.x =
        -Math.PI / 2;


    ring.position.y =
        -2.82;


    scene.add(
        ring
    );


    rings.push(
        ring
    );

}


/* =========================================================
   VERTICAL RADAR RINGS
========================================================= */

const verticalRings = [];


for (
    let i = 0;
    i < 3;
    i++
) {

    const geometry =
        new THREE.RingGeometry(
            1.7 + i * 0.9,
            1.72 + i * 0.9,
            80
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0x00cfff,

            transparent:
                true,

            opacity:
                0.10,

            side:
                THREE.DoubleSide

        });


    const ring =
        new THREE.Mesh(
            geometry,
            material
        );


    ring.rotation.y =
        Math.PI / 2;


    scene.add(
        ring
    );


    verticalRings.push(
        ring
    );

}


/* =========================================================
   PARTICLES / STARS
========================================================= */

const particleCount =
    1000;


const particlePositions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    particlePositions[
        i * 3
    ] =
        (
            Math.random() - 0.5
        ) * 45;


    particlePositions[
        i * 3 + 1
    ] =
        (
            Math.random() - 0.5
        ) * 24;


    particlePositions[
        i * 3 + 2
    ] =
        (
            Math.random() - 0.5
        ) * 45;

}


const particleGeometry =
    new THREE.BufferGeometry();


particleGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
        particlePositions,
        3
    )

);


const particleMaterial =
    new THREE.PointsMaterial({

        color:
            0x009dff,

        size:
            0.035,

        transparent:
            true,

        opacity:
            0.7,

        blending:
            THREE.AdditiveBlending

    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );


scene.add(
    particles
);


/* =========================================================
   FLIGHT TRAJECTORY
========================================================= */

const trajectoryPoints = [];


for (
    let i = 0;
    i < 120;
    i++
) {

    const x =
        (
            i - 60
        ) * 0.13;


    const y =
        Math.sin(
            i * 0.22
        ) * 0.12;


    const z =
        Math.sin(
            i * 0.11
        ) * 0.45;


    trajectoryPoints.push(

        new THREE.Vector3(
            x,
            y - 2.7,
            z
        )

    );

}


const trajectoryGeometry =
    new THREE.BufferGeometry()
        .setFromPoints(
            trajectoryPoints
        );


const trajectoryMaterial =
    new THREE.LineBasicMaterial({

        color:
            0x00d9ff,

        transparent:
            true,

        opacity:
            0.28

    });


const trajectory =
    new THREE.Line(
        trajectoryGeometry,
        trajectoryMaterial
    );


scene.add(
    trajectory
);


/* =========================================================
   SCANNING BEAM
========================================================= */

const scanGeometry =
    new THREE.PlaneGeometry(
        14,
        5
    );


const scanMaterial =
    new THREE.MeshBasicMaterial({

        color:
            0x00bfff,

        transparent:
            true,

        opacity:
            0.045,

        side:
            THREE.DoubleSide,

        blending:
            THREE.AdditiveBlending,

        depthWrite:
            false

    });


const scanPlane =
    new THREE.Mesh(
        scanGeometry,
        scanMaterial
    );


scanPlane.position.set(
    0,
    0,
    -3
);


scanPlane.rotation.x =
    Math.PI / 2;


scene.add(
    scanPlane
);


/* =========================================================
   FLIGHT DATA
========================================================= */

const flight = {

    altitude: 8632,

    velocity: 742,

    heading: 274,

    pitch: 0,

    roll: 0,

    engine: 98.4,

    fuel: 88,

    stability: 96,

    pressure: 64

};


/* =========================================================
   ANIMATION
========================================================= */

let elapsed =
    0;


/* =========================================================
   AIRCRAFT MOVEMENT
========================================================= */

function updateAircraft() {

    elapsed +=
        0.012;


    /*
       X MOVEMENT
    */

    const targetX =
        Math.sin(
            elapsed * 0.55
        ) * 1.8;


    /*
       Y MOVEMENT
    */

    const targetY =
        Math.sin(
            elapsed * 1.1
        ) * 0.55;


    /*
       Z MOVEMENT
    */

    const targetZ =
        Math.cos(
            elapsed * 0.45
        ) * 0.8;


    aircraft.position.x +=
        (
            targetX -
            aircraft.position.x
        ) * 0.025;


    aircraft.position.y +=
        (
            targetY -
            aircraft.position.y
        ) * 0.025;


    aircraft.position.z +=
        (
            targetZ -
            aircraft.position.z
        ) * 0.025;


    /*
       AIRCRAFT BANK
    */

    const targetRoll =
        Math.sin(
            elapsed * 0.70
        ) * 0.22;


    aircraft.rotation.z +=
        (
            targetRoll -
            aircraft.rotation.z
        ) * 0.04;


    /*
       AIRCRAFT PITCH
    */

    const targetPitch =
        Math.sin(
            elapsed * 0.45
        ) * 0.08;


    aircraft.rotation.y +=
        (
            targetPitch -
            aircraft.rotation.y
        ) * 0.04;


    /*
       SLIGHT YAW
    */

    aircraft.rotation.x +=
        0.001;


    /*
       TELEMETRY
    */

    flight.pitch =
        targetPitch *
        57.2958;


    flight.roll =
        targetRoll *
        57.2958;


    flight.heading =
        274 +
        Math.sin(
            elapsed * 0.2
        ) * 12;


    /*
       ENGINE PULSE
    */

    const pulse =
        1 +
        Math.sin(
            elapsed * 12
        ) * 0.18;


    /*
       Find lights attached
       to aircraft.
    */

    aircraft.traverse(
        child => {

            if (
                child.isPointLight
            ) {

                child.intensity =
                    7 * pulse;

            }

        }
    );


    updateHUD();

}


/* =========================================================
   HUD UPDATE
========================================================= */

function updateHUD() {

    const altitude =
        Math.round(

            flight.altitude +

            Math.sin(
                elapsed
            ) * 120

        );


    const velocity =
        Math.round(

            flight.velocity +

            Math.sin(
                elapsed * 1.3
            ) * 25

        );


    const heading =
        Math.round(
            flight.heading
        );


    const altitudeElement =
        document.getElementById(
            "altitude"
        );


    const velocityElement =
        document.getElementById(
            "velocity"
        );


    const headingElement =
        document.getElementById(
            "heading"
        );


    if (altitudeElement) {

        altitudeElement.textContent =
            String(
                altitude
            ).padStart(
                5,
                "0"
            );

    }


    if (velocityElement) {

        velocityElement.textContent =
            velocity;

    }


    if (headingElement) {

        headingElement.textContent =
            heading + "°";

    }


    const engineElement =
        document.getElementById(
            "engineValue"
        );


    if (engineElement) {

        engineElement.textContent =
            flight.engine.toFixed(
                1
            ) + "%";

    }


    const pressureElement =
        document.getElementById(
            "pressure"
        );


    if (pressureElement) {

        pressureElement.textContent =
            String(
                Math.round(
                    flight.pressure +
                    Math.sin(
                        elapsed * 1.2
                    ) * 3
                )
            ).padStart(
                3,
                "0"
            );

    }


    const stabilityElement =
        document.getElementById(
            "stability"
        );


    if (stabilityElement) {

        stabilityElement.textContent =
            flight.stability +
            "%";

    }


    const pitchElement =
        document.getElementById(
            "pitch"
        );


    if (pitchElement) {

        pitchElement.textContent =
            flight.pitch.toFixed(
                1
            ) + "°";

    }


    const rollElement =
        document.getElementById(
            "roll"
        );


    if (rollElement) {

        rollElement.textContent =
            flight.roll.toFixed(
                1
            ) + "°";

    }


    /*
       BOTTOM DATA
    */

    const bottomAltitude =
        document.getElementById(
            "bottomAltitude"
        );


    if (bottomAltitude) {

        bottomAltitude.textContent =
            String(
                altitude
            ).padStart(
                5,
                "0"
            );

    }


    const bottomVelocity =
        document.getElementById(
            "bottomVelocity"
        );


    if (bottomVelocity) {

        bottomVelocity.textContent =
            velocity;

    }


    const bottomHeading =
        document.getElementById(
            "bottomHeading"
        );


    if (bottomHeading) {

        bottomHeading.textContent =
            heading + "°";

    }


    /*
       COORDINATES
    */

    const coordX =
        document.getElementById(
            "coordX"
        );


    const coordY =
        document.getElementById(
            "coordY"
        );


    const coordZ =
        document.getElementById(
            "coordZ"
        );


    if (coordX) {

        coordX.textContent =
            Math.round(
                43615478 +
                aircraft.position.x *
                10000
            );

    }


    if (coordY) {

        coordY.textContent =
            Math.round(
                75794297 +
                aircraft.position.y *
                10000
            );

    }


    if (coordZ) {

        coordZ.textContent =
            Math.round(
                84695165 +
                aircraft.position.z *
                10000
            );

    }

}


/* =========================================================
   SYSTEM DATA
========================================================= */

function updateSystemData() {

    const values = {

        core:
            95 +
            Math.floor(
                Math.random() * 5
            ),

        engine:
            91 +
            Math.floor(
                Math.random() * 8
            ),

        fuel:
            85 +
            Math.floor(
                Math.random() * 6
            ),

        system:
            40 +
            Math.floor(
                Math.random() * 10
            ),

        altBox:
            60 +
            Math.floor(
                Math.random() * 8
            ),

        speedBox:
            74 +
            Math.floor(
                Math.random() * 10
            ),

        temp:
            64 +
            Math.floor(
                Math.random() * 8
            ),

        ai:
            94 +
            Math.floor(
                Math.random() * 6
            )

    };


    Object.entries(
        values
    ).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    value;

            }

        }
    );

}


setInterval(
    updateSystemData,
    1200
);


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock =
        document.getElementById(
            "clock"
        );


    if (!clock) {
        return;
    }


    const now =
        new Date();


    clock.textContent =
        now.toLocaleTimeString(
            "en-GB",
            {
                hour12: false
            }
        );

}


setInterval(
    updateClock,
    1000
);


updateClock();


/* =========================================================
   LOADING SCREEN
========================================================= */

window.addEventListener(
    "load",
    () => {

        const loading =
            document.getElementById(
                "loading"
            );


        const progress =
            document.getElementById(
                "loading-progress"
            );


        const loadingText =
            document.getElementById(
                "loading-text"
            );


        if (
            !loading ||
            !progress ||
            !loadingText
        ) {

            return;

        }


        let value = 0;


        const interval =
            setInterval(
                () => {

                    value += 5;


                    progress.style.width =
                        value + "%";


                    loadingText.textContent =
                        value + "%";


                    if (
                        value >= 100
                    ) {

                        clearInterval(
                            interval
                        );


                        setTimeout(
                            () => {

                                loading.classList.add(
                                    "hidden"
                                );

                            },
                            350
                        );

                    }

                },
                30
            );

    }
);


/* =========================================================
   MAIN ANIMATION LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    /*
       Aircraft
    */

    updateAircraft();


    /*
       Particle rotation
    */

    particles.rotation.y +=
        0.00025;


    particles.rotation.x +=
        0.00004;


    /*
       Floor radar
    */

    rings.forEach(
        (
            ring,
            index
        ) => {

            ring.rotation.z +=
                0.00035 *
                (index + 1);

        }
    );


    /*
       Vertical radar
    */

    verticalRings.forEach(
        (
            ring,
            index
        ) => {

            ring.rotation.z +=
                0.0005 *
                (index + 1);

        }
    );


    /*
       Scanning beam
    */

    scanPlane.position.z =
        Math.sin(
            elapsed * 0.5
        ) * 5;


    /*
       Camera
    */

    controls.update();


    /*
       Render
    */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   START
========================================================= */

animate();


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }
);


/* =========================================================
   TELEMETRY FUNCTION
========================================================= */

/*
    Later, when your actual project
    has real aircraft data, you can use:

    applyTelemetry({
        altitude: 9120,
        velocity: 758,
        heading: 281,
        engine: 97.8,
        fuel: 84,
        stability: 95
    });
*/


function applyTelemetry(data) {

    if (
        data.altitude !== undefined
    ) {

        flight.altitude =
            data.altitude;

    }


    if (
        data.velocity !== undefined
    ) {

        flight.velocity =
            data.velocity;

    }


    if (
        data.heading !== undefined
    ) {

        flight.heading =
            data.heading;

    }


    if (
        data.engine !== undefined
    ) {

        flight.engine =
            data.engine;

    }


    if (
        data.fuel !== undefined
    ) {

        flight.fuel =
            data.fuel;

    }


    if (
        data.stability !== undefined
    ) {

        flight.stability =
            data.stability;

    }

}


window.applyTelemetry =
    applyTelemetry;