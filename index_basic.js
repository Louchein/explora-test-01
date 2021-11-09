// console.log(`ESTA PLANTILLA SÍ FUNCIOOOOONAAAAA`);
import * as THREE from 'https://cdn.skypack.dev/three';

let scene, camera, renderer, group, groupBckgnd, raycaster;

let sphere, sphere2, sphere3;

let time;

let arrMeshes = [];

const pointer = new THREE.Vector2();
const radius = 100;

init();

function init() {
    raycaster = new THREE.Raycaster();

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
    camera.position.z = 120;
    camera.position.y = .2;

    lightsOn();

    initSprite();

    const segments = 8 * 3;
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

    groupBckgnd = group.clone();

    scene.add(group);            // OJO
    scene.add(groupBckgnd);      // OJO


    requestAnimationFrame(animate);

}


function initSprite() {
    const qtty = 10;
    var coords = new THREE.Vector3();
    // sphere3.getWorldPosition(coords);
    // coords.x = sphere3.position.x;
    const map = new THREE.TextureLoader().load('textures/rectSprite.png');
    const material = new THREE.SpriteMaterial({ map: map });


    for (let i = 0; i < qtty; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.x = -5 * Math.random() + 5;
        sprite.position.y = 20 * Math.random() + 5;
        sprite.position.z = 10 * Math.random() - 10;
        scene.add(sprite);
    }
    for (let i = 0; i < qtty; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.x = -25 * Math.random() - 10;
        sprite.position.y = -10 * Math.random();
        sprite.position.z = 10 * Math.random() - 10;
        scene.add(sprite);
    }
    for (let i = 0; i < qtty; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.x = 10 * Math.random() + 10;
        sprite.position.y = 10 * Math.random() + -10;
        sprite.position.z = 10 * Math.random() - 10;
        scene.add(sprite);
    }
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


