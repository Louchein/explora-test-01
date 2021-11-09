import * as THREE from 'https://cdn.skypack.dev/three';

import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';


let scene, camera, renderer, group, groupBckgnd, raycaster;

let sphere, sphere2, sphere3;

let time;

let controls;

let arrMeshes = [];

let SimpleText, ContainerText, StrokeText, MultilineText;

let INTERSECTED;
let theta = 0;

const pointer = new THREE.Vector2();
const radius = 100;

init();

function init() {
    // textConstructors();

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true
    });
    // renderer.setClearColor(0x131c28);
    // renderer.setClearColor(0xfff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    const bckgndLoader = new THREE.TextureLoader();
    scene.background = bckgndLoader.load('/textures/bckgnd_general-100.jpg');

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 120;
    camera.position.y = .2;

    controls = new OrbitControls(camera, renderer.domElement);

    lightsOn();

    initSprite();

    const segments = 8 * 3;
    var sphere_geometry = new THREE.SphereGeometry(1, segments, segments);
    var sphere_geometry2 = new THREE.SphereGeometry(1, segments, segments);
    var sphere_geometry3 = new THREE.SphereGeometry(1, segments, segments);

    // var material = new THREE.MeshNormalMaterial({ blending: THREE.SubtractiveBlending });
    var material = new THREE.MeshPhongMaterial({
        color: 0xff0000
    });
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    // material.blending = THREE.MultiplyBlending;
    material.opacity = 0.97;

    var gradientMaterial_redPurple = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#531741")
            },
            color2: {
                value: new THREE.Color("#9F1B26")
                // value: new THREE.Color("purple")
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

    var gradientMaterial_yellOrange = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#FFD618")
            },
            color2: {
                value: new THREE.Color("#F88421")
                // value: new THREE.Color("purple")
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
                // value: new THREE.Color("purple")
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
    // groupBckgnd = JSON.parse(JSON.stringify(group));




    // for (let index = 0; index < groupBckgnd.length; index++) {
    //     // const element = array[index];
    //     groupBckgnd[index].scale(10, 10, 10);
    //     console.dir(groupBckgnd[index]);
    // }

    scene.add(group);            // OJO
    scene.add(groupBckgnd);      // OJO



    requestAnimationFrame(animate);

}

function textConstructors() {
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

// function onPointerMove(event) {

//     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//     pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

// }

var update = function () {

    // change '0.003' for more aggressive animation
    var time = performance.now() * 0.001;
    //console.log(time)

    //go through vertices here and reposition them

    wobbler(time);
    // console.dir(arrMeshes);


}

function lightsOn() {
    const ambLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambLight);

    const ptLight = new THREE.PointLight(0xfff, 10, 100);
    ptLight.position.set(2, 0, 3);
    // scene.add(ptLight);
}

let counter = 0;
let tope = 30;

function wobbler(time) {
    var density = .81;	// Density of spikes
    var amp = .1;       // amplitude/height of spike

    const normals = sphere.geometry.attributes.normal;

    let vertices = [];
    let arrVerts = [];

    // 1. convertir array plano a array de Vector3s
    arrMeshes.forEach(sphere => {
        const positions = sphere.geometry.attributes.position;

        for (let j = 0; j < positions.array.length; j += 3) {
            const vertex = new THREE.Vector3(positions.array[j], positions.array[j + 1], positions.array[j + 2]);
            vertices.push(vertex);
        }

        arrVerts.push(vertices);
        vertices = [];
    });

    // console.dir(arrVerts[0].length);


    // 2. alpicar perlin noise a array de Vector3s

    for (let index = 0; index < arrVerts.length; index++) {
        const sphereVertices = arrVerts[index];

        for (var i = 0; i < sphereVertices.length; i++) {
            var p = sphereVertices[i];
            console.log(`p: `);
            console.dir(p);

            p.normalize().multiplyScalar(1 + amp * noise.perlin3(p.x * density + time, p.y * density, p.z * density)); n,

                console.log(`post: `);
            console.dir(p);
        }
    }


    // 3. convertir array de Vector3s a array plano

    // 4. asignar array plano a geometry

    /*
    var density = .81;	// Density of spikes
    var amp = .1;
    for (let index = 0; index < arrMeshes.length; index++) {
        // const element = array[index];
        const sphere = arrMeshes[index];

        for (var i = 0; i < sphere.geometry.vertices.length; i++) {
            var p = sphere.geometry.vertices[i];
            p.normalize().multiplyScalar(1 + amp * noise.perlin3(p.x * density + time, p.y * density, p.z * density));
        }
        sphere.geometry.computeVertexNormals();			//OJO
        sphere.geometry.normalsNeedUpdate = true;		//OJO
        sphere.geometry.verticesNeedUpdate = true;
    }
    */
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var t = 0;
var delta = 0.0051;
function animate() {
    // if (t >= Math.PI / 2 || t <= 0) {
    // 	console.log(`holi  `);
    // 	delta = -delta;
    // }

    t += delta;
    t %= Math.PI * 2;

    const radius = 1;
    // sphere.position.y += 0.01;

    var aux = 1 * Math.sin(t);
    group.rotation.z += aux / 200;
    group.rotation.x += aux / -2000;

    var x = groupBckgnd.position.x;
    var y = groupBckgnd.position.y;
    // group.position.copy(position);

    // console.dir(groupBckgnd);

    // setTransp(groupBckgnd, false);
    function setTransp(obj, transparent) {
        obj.children.forEach((child) => {
            setTransp(child, transparent);
        });
        if (obj.material) {
            obj.material.transparent = transparent;
        };
    };

    setOpacity(groupBckgnd, 0.05);
    function setOpacity(obj, opacity) {
        obj.children.forEach((child) => {
            setOpacity(child, opacity);
        });
        if (obj.material) {
            obj.material.opacity = opacity;
        };
    };




    groupBckgnd.opacity = .002;
    groupBckgnd.position.x = -25;
    groupBckgnd.position.y = 10;
    groupBckgnd.position.z = -30;
    groupBckgnd.scale.x = 120;
    groupBckgnd.scale.y = 60;
    groupBckgnd.rotation.z = Math.PI * 1.1;
    // console.log(`${groupBckgnd}`);
    // console.dir(groupBckgnd);
    group.scale.x = 20;
    group.scale.y = 20;
    group.scale.z = 20;
    // group.position.y = 10;



    update();

    controls.update();

    /* render scene and camera */
    render();
    requestAnimationFrame(animate);
}

function setRaycaster() {
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }
}

function render() {
    // setRaycaster();

    renderer.render(scene, camera);
}


