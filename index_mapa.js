// console.log(`ESTA PLANTILLA SÍ FUNCIOOOOONAAAAA`);
// import * as THREE from 'https://cdn.skypack.dev/three';
import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';



let scene, camera, renderer, group, groupBckgnd, raycaster;

let sphere, sphere2, sphere3;

let controls;

let time;

let arrMeshes = [];

// let levels = {};


// let auxCanvas;

const pointer = new THREE.Vector2();
const radius = 100;

init();

function init() {
    // raycaster = new THREE.Raycaster();
    // initWords();

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    const bckgndLoader = new THREE.TextureLoader();
    scene.background = bckgndLoader.load('/textures/bckgnd_general-100.jpg');

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.z = 180;
    // camera.position.z = 50;

    controls = new OrbitControls(camera, renderer.domElement);

    var axes = new THREE.AxesHelper(50);
    scene.add(axes);

    lightsOn();

    const segments = 8 * 3;     // ¿qué significa o de dónde salen este 8 y este 3?
    var sphere_geometry = new THREE.SphereGeometry(1, segments, segments);
    var sphere_geometry2 = new THREE.SphereGeometry(1, segments, segments);
    var sphere_geometry3 = new THREE.SphereGeometry(1, segments, segments);

    var material = new THREE.MeshPhongMaterial({
        color: 0xff0000
    });
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    material.opacity = 0.97;

    var gradientMaterial_redPurple = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#531741")
            },
            color2: {
                value: new THREE.Color("#9F1B26")
            }
        },
        vertexShader: `
            varying vec2 vUv;
        
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            
            varying vec2 vUv;
            
            void main() {
                
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });

    var gradientMaterial_yellOrange = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#FFD618")
            },
            color2: {
                value: new THREE.Color("#F88421")
            }
        },
        vertexShader: `
            varying vec2 vUv;
        
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            
            varying vec2 vUv;
            
            void main() {
                
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
        // wireframe: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });

    var gradientMaterial_bluGreen = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#123C82")
            },
            color2: {
                value: new THREE.Color("#14B95D")
            }
        },
        vertexShader: `
            varying vec2 vUv;
        
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            
            varying vec2 vUv;
            
            void main() {
                
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
        // wireframe: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });

    group = new THREE.Group();
    groupBckgnd = new THREE.Group();

    function initGeometries() {
        sphere = new THREE.Mesh(sphere_geometry, gradientMaterial_redPurple);
        sphere.position.set(-1, 0, 0);
        sphere.rotation.set(0, 0, 0);
        var arbScale = 0.5;
        sphere.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere);
        arrMeshes.push(sphere);


        sphere2 = new THREE.Mesh(sphere_geometry2, gradientMaterial_yellOrange);
        sphere2.position.set(.2, 1, .5);
        sphere2.rotation.set(0, 0, 0);
        // var arbScale = .5;
        sphere2.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere2);
        arrMeshes.push(sphere2);


        sphere3 = new THREE.Mesh(sphere_geometry3, gradientMaterial_bluGreen);
        sphere3.position.set(.5, -.5, .3);
        sphere3.rotation.set(0, 0, 0);
        // var arbScale = .5;
        sphere3.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere3);
        arrMeshes.push(sphere3);

    }

    initGeometries();
    initSprites();   // docs aux flotantes
    // drawWords();

    groupBckgnd = group.clone();    // Copia para hacer las grandes que girarían más lento

    // scene.add(group);            
    // scene.add(groupBckgnd);  
    let groupText = new THREE.Group();

    /*
    var spriteyA = makeTextSprite(" Hella, ", {
        // fontsize: 24,
        borderColor: { r: 255, g: 0, b: 0, a: 0.8 },
        backgroundColor: { r: 255, g: 100, b: 100, a: 0.8 }
    });
    spriteyA.position.set(-50, -25, 3);
    groupText.add(spriteyA);
    // groupSprites.add(spritey);

    var spriteyB = makeTextSprite(" Manzana! ", {
        // fontsize: 24,
        fontface: "Georgia",
        borderColor: { r: 0, g: 0, b: 255, a: 0.8 }
    });
    spriteyB.position.set(12.3, 0.1, 3);
    groupText.add(spriteyB);
    // groupSprites.add(spritey);

    scene.add(groupText);

    drawSingleLine(spriteyA, spriteyB);
    */

    // mapa object
    const fullMapa = {
        Cows: {
            Leather: {
                Purses: {},
                Couches: {},
                Coats: {
                    laconcha: {},
                    foo: {
                        Purses: {},
                        Couches: {},
                        Coats: {}
                    }
                }
            },
            Milk: {
                Cats: {},
                Humans: {}
            }
        },
        tier_2: "2do objeto"
    };

    const easyArr = [
        "Cows", [
            "Leather", [
                "Purses",
                "Couches",
                "Coats", [
                    "laconcha",
                    "foo", [
                        "Purses",
                        "Couches",
                        "Coats"
                    ]
                ]
            ],
            "Milk", [
                "Cats",
                "Humans"
            ]
        ],
        "tier_2"
    ];

    const person = {
        firstName: "John",
        lastName: {
            doe: "Doe",
            joe: "Joe"
        },
        age: 50,
        eyeColor: "blue"
    };

    const basic = [
        "Manzana biche", [
            "Hello!"
        ]
    ]

    // console.log(`getArrayDepth(easyArr): ${getArrayDepth(basic)}`);


    console.dir(fullMapa);

    // drawMap(fullMapa);  // acá se usa children()
    drawMap(basic);

    // console.dir(getNested(fullMapa));

    function checkNested(obj, level, ...rest) {
        if (obj === undefined) return false
        if (rest.length == 0 && obj.hasOwnProperty(level)) return true
        return checkNested(obj[level], ...rest)
    }
    // console.dir(checkNested(fullMapa, 'Cows'));     //true                  /////////////////
    // console.dir(checkNested(fullMapa.Cows, 'Leather'));     //true          /////////////////

    requestAnimationFrame(animate);

}


// debo restarle 1 a lo que devuelve esta función cuando use los objetos custom
function depthOf(object) {
    var level = 1;
    for (var key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if (typeof object[key] == 'object') {
            var depth = depthOf(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;
}

function getArrayDepth(value) {
    return Array.isArray(value) ?
        1 + Math.max(...value.map(getArrayDepth)) :
        0;
}

function children(parent) {
    for (var propName in parent) {
        if (parent.hasOwnProperty(propName)) {
            if (typeof parent[propName] == 'object') {
                parent[propName].rootName = propName;
                children(parent[propName]);
                // console.log(`${propName}: ${parent[propName]}, child of: ${parent.rootName}`);
            }
        }
    }

}


function drawMap(fullMapa) {
    // console.dir(fullMapa);
    // children(fullMapa);
    const depth = getArrayDepth(fullMapa);
    console.log(`getArrayDepth: ${depth}`);

    let groupText = new THREE.Group();

    let spriteyX;
    if (fullMapa[0].isArray) {
        spriteyX = makeTextSprite(fullMapa[0]);
        spriteyX.position.set(12.3, 0.1, 3);
        groupText.add(spriteyX);
    }

    var spriteyA = makeTextSprite(` Hella, 
    aligazza `);
    spriteyA.position.set(-50, -25, 3);
    groupText.add(spriteyA);
    // groupSprites.add(spritey);

    var spriteyB = makeTextSprite(" Manzanaza de la concha! ");
    spriteyB.position.set(12.3, 0.1, 3);
    groupText.add(spriteyB);
    // groupSprites.add(spritey);

    scene.add(groupText);


    drawSingleLine(spriteyA, spriteyB);
    // drawSingleLine(spriteyA, spriteyX);
}

function drawSingleLine(objA, objB) {
    let posA = objA.position;
    let posB = objB.position;
    const material = new THREE.LineBasicMaterial({
        color: 0xc0c0c0
    });

    const points = [];
    points.push(posA);
    points.push(posB);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 50;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 0, g: 0, b: 255, a: 0.8 };
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement('canvas');      // Tiene que crear otro canvas para poder
    var context = canvas.getContext('2d');              // pedir este context 2D. ¿un canvas por cada palabra???
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    console.dir(metrics);

    var textWidth = metrics.width;
    const roundness = 20;

    //////////         aux comparable rectangle(s)          //////////////////////////////////////////
    testRectangleSize(canvas, context, metrics, fontsize, borderThickness, textWidth, roundness);
    //////////////////////////////////////////////////////////////////////////////////

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, roundness);
    //roundRect(ctx,             x,                   y,                         w,                           h,                    r)

    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    // texture.repeat.set(textWidth / canvas.width, textHeight / canvas.height);
    console.log(`textWidth: ${textWidth}`);
    console.log(`_______texture.width ${texture.width}`);
    console.dir(texture);



    // console.log(`${renderer.capabilities.getMaxAnisotropy()}`); //16

    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        // useScreenCoordinates: false
    });
    var sprite = new THREE.Sprite(spriteMaterial);

    // set the size of the sprite to just a portion
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 1);

    return sprite;
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// acá en drawConexion puede estar una pista para cuando son múltiples líneas las que hay que dibujar
function drawConexion(positionA, positionB) {
    // create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 100,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin: 'round' //ignored by WebGLRenderer 
    });

    // create a blue LineDashedMaterial
    const dashMaterial = new THREE.LineDashedMaterial({
        color: 0x800000,
        linewidth: 1,
        dashSize: 3,
        gapSize: 2,
        // opacity: 0.2
    });

    const lines = [];
    const points = [];

    points.push(positionA, positionB);

    lines.push(positionA, positionB);

    let geometry, line;

    function drawLines(myarray) {
        myarray.forEach(element => {
            if (Array.isArray(element)) { drawLines(element); }
            geometry = new THREE.BufferGeometry().setFromPoints(element);

            // geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(element, 1));
            // console.dir(geometry.position);

            line = new THREE.Line(geometry, dashMaterial);
            line.computeLineDistances();

            scene.add(line);
        });
    }

    drawLines(lines);
}

// Esta función initSprite() sirve para popular los docs adicionales flotantes alrededor de los conceptos
function initSprites() {
    const qtty = 10;
    var coords = new THREE.Vector3();
    // sphere3.getWorldPosition(coords);
    // coords.x = sphere3.position.x;
    const map = new THREE.TextureLoader().load('textures/rectSprite.png');
    const material = new THREE.SpriteMaterial({ map: map });

    let groupSprites = new THREE.Group();

    for (let k = 0; k < 3; k++) {

        for (let i = 0; i < qtty; i++) {
            const sprite = new THREE.Sprite(material);
            if (k == 0) {
                sprite.position.x = -20 * Math.random() + 15;
                sprite.position.y = 40 * Math.random() + 10;
                sprite.position.z = 20 * Math.random() - 20;
            }

            if (k == 1) {
                sprite.position.x = -50 * Math.random() - 20;
                sprite.position.y = -20 * Math.random();
                sprite.position.z = 20 * Math.random() - 20;
            }
            if (k == 2) {
                sprite.position.x = 20 * Math.random() + 20;
                sprite.position.y = 20 * Math.random() + -20;
                sprite.position.z = 20 * Math.random() - 20;
            }
            sprite.scale.set(3, 5, 1);
            groupSprites.add(sprite);
        }
    }

    groupSprites.position.y = -13;
    scene.add(groupSprites);
}

var update = function () {
    // change '0.003' for more aggressive animation
    var time = performance.now() * 0.001;
}


function lightsOn() {
    const ambLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambLight);

    const ptLight = new THREE.PointLight(0xfff, 10, 100);
    ptLight.position.set(2, 0, 3);
}


var t = 0;
var delta = 0.0051;
function animate() {
    t += delta;
    t %= Math.PI * 2;

    const radius = 1;

    var aux = 1 * Math.sin(t);
    group.rotation.z += aux / 200;
    group.rotation.x += aux / -2000;

    var x = groupBckgnd.position.x;
    var y = groupBckgnd.position.y;

    groupBckgnd.opacity = .002;
    groupBckgnd.position.x = -25;
    groupBckgnd.position.y = 10;
    groupBckgnd.position.z = -30;
    groupBckgnd.scale.x = 120;
    groupBckgnd.scale.y = 60;
    groupBckgnd.rotation.z = Math.PI * 1.1;

    group.scale.x = 20;
    group.scale.y = 20;
    group.scale.z = 20;

    update();

    render();
    requestAnimationFrame(animate);
}

function render() {

    renderer.render(scene, camera);
}

function testRectangleSize(canvas, context, metrics, fontsize, borderThickness, textWidth, roundness) {
    var sizeWidth = context.canvas.clientWidth;
    var sizeHeight = context.canvas.clientHeight;

    var auxWidth = textWidth + (roundness) - borderThickness;
    var auxHeight = fontsize * 1.4 + borderThickness + (roundness * 4) + (borderThickness * 2);
    auxWidth /= (0.25 * fontsize);
    auxHeight /= (0.5 * fontsize)
    console.log(`auxWidth: ${auxWidth}`);
    // console.log(`auxWidth / (0.25 * fontsize): ${auxWidth / (0.25 * fontsize)}`);
    console.log(`auxHeight: ${auxHeight}`);
    // console.log(`auxHeight / (0.5 * fontsize): ${auxHeight / (0.5 * fontsize)}`);

    drawRectangle(auxWidth, auxHeight);
}

function drawRectangle(width, height) {
    const material = new THREE.LineBasicMaterial({ color: 0xf0500f });
    const points = [];

    points.push(new THREE.Vector3(0, 0, 0)); /**/
    points.push(new THREE.Vector3(width, 0, 0));
    points.push(new THREE.Vector3(width, height, 0)); /**/
    points.push(new THREE.Vector3(0, height, 0));
    points.push(new THREE.Vector3(0, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);
}
