// console.log(`ESTA PLANTILLA SÍ FUNCIOOOOONAAAAA`);
import * as THREE from 'https://cdn.skypack.dev/three';

import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';



let scene, camera, renderer, group, groupBckgnd, raycaster;

let sphere, sphere2, sphere3;

let controls;

let time;

let arrMeshes = [];

let auxCanvas;

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

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 180;
    // camera.lookAt(0, 1000, 0);

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
        var arbScale = .5;
        sphere.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere);
        arrMeshes.push(sphere);


        sphere2 = new THREE.Mesh(sphere_geometry2, gradientMaterial_yellOrange);
        sphere2.position.set(.2, 1, .5);
        sphere2.rotation.set(0, 0, 0);
        var arbScale = .5;
        sphere2.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere2);
        arrMeshes.push(sphere2);


        sphere3 = new THREE.Mesh(sphere_geometry3, gradientMaterial_bluGreen);
        sphere3.position.set(.5, -.5, .3);
        sphere3.rotation.set(0, 0, 0);
        var arbScale = .5;
        sphere3.scale.set(arbScale, arbScale, arbScale);
        group.add(sphere3);
        arrMeshes.push(sphere3);

    }

    initGeometries();
    initSprite();   // docs aux flotantes
    // drawWords();

    groupBckgnd = group.clone();    // Copia para hacer las grandes que girarían más lento

    // scene.add(group);            
    // scene.add(groupBckgnd);  
    let groupText = new THREE.Group();


    var spritey = makeTextSprite(" Hello, ", {
        // fontsize: 24,
        borderColor: { r: 255, g: 0, b: 0, a: 1.0 },
        backgroundColor: { r: 255, g: 100, b: 100, a: 0.8 }
    });
    spritey.position.set(-50, -25, 3);
    groupText.add(spritey);
    // groupSprites.add(spritey);

    var spritey = makeTextSprite(" Manzana! ", {
        // fontsize: 24,
        fontface: "Georgia",
        borderColor: { r: 0, g: 0, b: 255, a: 1.0 }
    });
    spritey.position.set(5, 20, 3);
    groupText.add(spritey);
    // groupSprites.add(spritey);

    scene.add(groupText);



    requestAnimationFrame(animate);

}

function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 50;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 0, g: 0, b: 255, a: 1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 20);

    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        // useScreenCoordinates: false 
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
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

function initWords() {
    // **Constructor**
    // SpriteText ([text, textHeight, color])
    SimpleText = new SpriteText('Basic text', .010);
    SimpleText.color = 'orange';
    SimpleText.position.x = -4.5;
    SimpleText.position.y = 1.5;

    ContainerText = new SpriteText('Boxed text', .08);
    ContainerText.color = 'orange';
    ContainerText.backgroundColor = 'rgba(0,0,190,0.6)';
    ContainerText.borderColor = 'lightgrey';
    ContainerText.borderWidth = 0.5;
    ContainerText.borderRadius = 3;
    ContainerText.padding = [6, 2];
    ContainerText.position.x = 4.5;
    ContainerText.position.y = 1.5;

    StrokeText = new SpriteText('Stroke text', .08);
    StrokeText.color = 'blue';
    StrokeText.strokeWidth = 1;
    StrokeText.strokeColor = 'lightgray';
    StrokeText.padding = 4;
    StrokeText.position.x = 4.5;
    StrokeText.position.y = -4.0;

    MultilineText = new SpriteText('This is\nsome multi-line\ntext', .05);
    MultilineText.color = 'blue';
    MultilineText.borderWidth = 0.4;
    MultilineText.padding = 8;
    MultilineText.position.x = -4.5;
    MultilineText.position.y = -2.0;
}

function drawWords() {
    scene.add(SimpleText);
    scene.add(ContainerText);
    scene.add(StrokeText);
    scene.add(MultilineText);

    // create a blue LineBasicMaterial
    // const material = new THREE.LineBasicMaterial({
    //   color: 0x0000ff,
    //   linewidth: 100,
    //   linecap: 'round', //ignored by WebGLRenderer
    //   linejoin: 'round' //ignored by WebGLRenderer 
    // });

    const dashMaterial = new THREE.LineDashedMaterial({
        color: 0x800000,
        linewidth: 1,
        dashSize: 3,
        gapSize: 2,
        // opacity: 0.2
    });


    const lines = [];
    const points = [];

    // points.push(new THREE.Vector3(10, 0, 0));
    points.push(MultilineText.position, ContainerText.position, StrokeText.position);
    lines.push(points, [ContainerText.position, SimpleText.position]);
    // lines.push([ContainerText.position, SimpleText.position]);

    let geometry, line;

    function drawLines(myarray) {
        myarray.forEach(element => {
            if (Array.isArray(element)) { drawLines(element); }
            // geometry = new THREE.BufferGeometry().setFromPoints(element);
            geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(element, 1));
            line = new THREE.Line(geometry, dashMaterial);
            line.computeLineDistances();

            scene.add(line);
        });
    }

    // drawLines(lines);
}

// Esta función initSprite() sirve para popular los docs adicionales flotantes alrededor de los conceptos
function initSprite() {
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
                sprite.position.x = -10 * Math.random() + 10;
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


