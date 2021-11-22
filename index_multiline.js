// console.log(`ESTA PLANTILLA SÍ FUNCIOOOOONAAAAA`);
// import * as THREE from 'https://cdn.skypack.dev/three';
import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './three/examples/jsm/libs/tween.module.min.js';


let scene, camera, renderer, group, groupBckgnd;

let sphere, sphere2, sphere3;

let controls;

let time;

let arrMeshes = [];

let horzSpacer = 11;
let vertSpacer = 8;

let lineMaterial;

const pointer = new THREE.Vector2();
const radius = 100;

let INTERSECTED;
let mouse = new THREE.Vector3();;
let raycaster;

let modal_isOn = false;

init();

function init() {
    raycaster = new THREE.Raycaster();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100000);
    // var camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 2000);
    camera.position.z = 180;
    // camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    controls = new OrbitControls(camera, renderer.domElement);
    // Rotation limits
    controls.minPolarAngle = 0.6;
    controls.maxPolarAngle = 2.3;
    controls.minAzimuthAngle = -1;
    controls.maxAzimuthAngle = 1;
    // Focus target
    controls.target = new THREE.Vector3(40, -30, 0);
    controls.update();

    // console.dir(controls);


    const bckgndLoader = new THREE.TextureLoader();
    scene.background = bckgndLoader.load('/textures/bckgnd_general-100.jpg');

    var axes = new THREE.AxesHelper(50);
    // scene.add(axes);

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
    // initSprites();   // docs aux flotantes
    // drawWords();


    groupBckgnd = group.clone();    // Copia para hacer las grandes que girarían más lento

    // scene.add(group);            
    // scene.add(groupBckgnd);  
    let groupText = new THREE.Group();

    generateText();

    // window.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousemove', onMouseMove, false);

    document.addEventListener('mousedown', onMouseDown, false);

    var modalBg = document.querySelector('.modal-bg');
    var modalClose = document.querySelector('.modal-close');

    modalClose.addEventListener('click', function () {      // Cierra el modal al hacer clic en la X
        modalBg.classList.remove('bg-active');
        modal_isOn = false;
    });

    modalBg.addEventListener('click', function (event) {
        if (event.target.matches(".modal-bg") || !event.target.closest(".modal")) {
            modalBg.classList.remove('bg-active');
            modal_isOn = false;
        }
    });

    requestAnimationFrame(animate);

}   // END init() //////////////////////////////////////////////////////////////////////////


function generateText() {
    // text sprite
    var config1 = {
        // fontFace: 'Ariel',
        fontFace: 'Raleway',
        fontSize: 26,
        textColor: 'rgba(255, 255, 255, 1)',
        // fontBold: true,
        // fontItalic: false,
        textAlign: 'center',
        // borderThickness: 4,
        borderColor: 'rgba(50, 50, 255, 0.8)',
        // borderRadius: 20, //full redondo -> 38
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    };
    // Azules
    let azul_fuerte = {
        fontSize: 50,
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(118, 168, 191, 0.8)'
    }
    let azul_claro = {
        textColor: 'rgba(47, 80, 116, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(222, 231, 240, 0.8)'
    }
    let azul_vacio = {
        textColor: 'rgba(242, 239, 242, 1)',
        borderColor: 'rgba(222, 231, 240, 0.8)',
        backgroundColor: 'rgba(28, 31, 36, 0.6)'
    }

    // Verdes
    let verde_fuerte = {
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(123, 165, 67, 0.8)'
    }
    let verde_claro = {
        textColor: 'rgba(52, 74, 23, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(215, 229, 203, 0.8)'
    }
    let verde_vacio = {
        textColor: 'rgba(215, 229, 203, 1)',
        borderColor: 'rgba(215, 229, 203, 0.8)',
        backgroundColor: 'rgba(28, 31, 36, 0.6)'
    }

    // Rojos
    let rojo_fuerte = {
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(248, 151, 78, 0.8)'
    }
    let rojo_claro = {
        textColor: 'rgba(128, 61, 33, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(232, 205, 189, 0.8)'
    }
    let rojo_vacio = {
        textColor: 'rgba(215, 229, 203, 1)',
        borderColor: 'rgba(232, 205, 189, 0.8)',
        backgroundColor: 'rgba(28, 31, 36, 0.6)'
    }

    // Amarillos
    let amarillo_fuerte = {
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(229, 186, 64, 0.8)'
    }
    let amarillo_claro = {
        textColor: 'rgba(98, 61, 35, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(240, 231, 190, 0.8))'
    }
    let amarillo_vacio = {
        textColor: 'rgba(215, 229, 203, 1)',
        borderColor: 'rgba(240, 231, 190, 0.8)',
        backgroundColor: 'rgba(28, 31, 36, 0.6)'
    }

    // Morados
    let morado_fuerte = {
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(181, 112, 197, 0.8)'
    }
    let morado_claro = {
        textColor: 'rgba(87, 16, 104, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(224, 203, 229, 0.8)'
    }
    let morado_vacio = {
        textColor: 'rgba(215, 229, 203, 1)',
        borderColor: 'rgba(224, 203, 229, 0.8)',
        backgroundColor: 'rgba(28, 31, 36, 0.6)'
    }

    // Conector
    let conector = {
        fontSize: 50,
        textColor: 'rgba(238, 235, 238, 1)',
        borderColor: 'rgba(88, 150, 179, 0.0)',
        backgroundColor: 'rgba(181, 112, 197, 0.0)'
    }
    //------------------------------------------------------------------------------------------
    // x_axis, lvl
    var textSprite =
        makeTextSprite("  Discurso en época  \n  de pandemia  ",
            rojo_fuerte,
            0, 0);
    scene.add(textSprite);

    let textSprite_2 =
        makeTextSprite("  Sí, hay un discurso de resistencia  ",
            rojo_fuerte,
            3.5, 0);
    scene.add(textSprite_2);

    drawSingleLine(textSprite, textSprite_2);
    //       ADD FILE HERE      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    drawPreviewFlotant(textSprite_2, 'textures/Transversales_/Discursos en epoca de pandemia/Ima.1MD.png', "portrait");

    //---------------------------------------------

    textSprite =
        makeTextSprite("  Querer formarse  ",
            rojo_vacio,
            7, 0);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  Querer informarse  ",
            rojo_vacio,
            7, 1);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  Llevar procesos cole  ",
            rojo_vacio,
            7, 2);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);
    //---------------------------------------------

    textSprite_2 =
        makeTextSprite("  Dentro y desde  \n  prácticas artísticas  ",
            rojo_fuerte,
            7, 3.5);
    scene.add(textSprite_2);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  fuera de a  \n  academia  ",
            rojo_vacio,
            9.2, 3.5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  Abre la posibilidad  ",
            verde_fuerte,
            0, 3.5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);
    //---------------------------------------------

    textSprite_2 =
        makeTextSprite("  de  ",
            conector,
            0, 4.3);
    scene.add(textSprite_2);
    drawSingleLine(textSprite, textSprite_2);

    let textSprite_4 =
        makeTextSprite("  Ejercicio de acciones performáticas  ",
            verde_fuerte,
            0, 6.3);
    scene.add(textSprite_4);
    drawSingleLine(textSprite_4, textSprite_2);
    //       ADD FILE HERE      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    drawPreviewFlotant(textSprite_4, 'textures/Transversales_/Discursos en epoca de pandemia/Ima.3MD.png', "landscape");

    textSprite =
        makeTextSprite("  Entrar  ",
            verde_vacio,
            1, 4.5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    let textSprite_3 =
        makeTextSprite("  Crear  ",
            verde_vacio,
            1, 5.3);
    scene.add(textSprite_3);
    drawSingleLine(textSprite_3, textSprite_2);

    textSprite_2 =
        makeTextSprite("  un  ",
            conector,
            2, 5);
    scene.add(textSprite_2);
    drawSingleLine(textSprite, textSprite_2);
    drawSingleLine(textSprite_3, textSprite_2);
    //---------------------------------------------

    textSprite =
        makeTextSprite("  Diálogo  ",
            verde_fuerte,
            3, 5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    textSprite_2 =
        makeTextSprite("  de  ",
            conector,
            4, 5);
    scene.add(textSprite_2);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  Crítica  ",
            verde_vacio,
            5, 4.5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);

    textSprite =
        makeTextSprite("  Autoreflexión  ",
            verde_vacio,
            5.2, 5.5);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_2);
    //---------------------------------------------

    textSprite =
        makeTextSprite('  "imágenes del cuerpo"  ',
            verde_fuerte,
            4, 6.3);
    scene.add(textSprite);
    drawSingleLine(textSprite, textSprite_4);
    //       ADD FILE HERE      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    drawPreviewFlotant(textSprite, 'textures/Transversales_/Discursos en epoca de pandemia/Ima2.MD.png', "landscape");


    textSprite_2 =
        makeTextSprite("  ¿Cuáles otras imágenes?  ",
            verde_fuerte,
            4, 7.5);
    scene.add(textSprite_2);
    drawSingleLine(textSprite, textSprite_2);

    textSprite_3 =
        makeTextSprite("  ¿Cuántas imagenes pueden servir como  \n  resistencia frente a algo?  ",
            verde_vacio,
            8.5, 6.7);
    scene.add(textSprite_3);
    drawSingleLine(textSprite_3, textSprite);

    textSprite_3 =
        makeTextSprite("  Yo el cuerpo como recurso  ",
            verde_vacio,
            8, 7.8);
    scene.add(textSprite_3);
    drawSingleLine(textSprite_3, textSprite);

}

var posX = 0;
var posY = 0;

function goDeep(mapa) {
    for (var key in mapa) {  // Arroja siempre(?) 3 keys -> "texto", "position" y "hijos"
        // "position"
        mapa[key].position.x = posX;
        mapa[key].position.y = posY;
        console.dir(mapa[key].position);

        // "texto"
        var textSprite = makeTextSprite(mapa[key].texto, azul_vacio);

        textSprite.position.set(mapa[key].position.x, mapa[key].position.y, 0);
        scene.add(textSprite);

        // "hijos"
        if (mapa[key].hijos != null) {  // Si hijos no es nulo, entonces...
            posY -= 15;
            drawSingleLine(textSprite, goDeep(mapa[key].hijos));

            console.log(`nopo null $ {}`);
            console.dir(mapa[key].hijos);
            // let aux = goDeep(mapa[key].hijos);
            // drawSingleLine(_sprite Padre_, _sprite Hijo_);
        }

        posX += 30;

        return textSprite;
    }

}


function drawSingleLine(objA, objB) {
    // let posA = JSON.parse(JSON.stringify(objA.position));
    // let posB = JSON.parse(JSON.stringify(objB.position));
    let posA = objA.position;
    let posB = objB.position;
    lineMaterial = new THREE.LineBasicMaterial({
        color: 0xc0c0c0,
        // transparent: true,
        opacity: 0.4
    });

    const points = [];
    points.push(posA, posB);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
}

function makeTextSprite(message, parameters, x_axis, lvl) {
    parameters || (parameters = {});

    // var fontFace = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Helvetica";
    var fontFace = parameters.hasOwnProperty("fontFace") ? parameters["fontFace"] : "Raleway";
    var fontSize = parameters.hasOwnProperty("fontSize") ? parameters["fontSize"] : 50;
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var fontBold = parameters.hasOwnProperty('fontBold') ? parameters['fontBold'] : false;
    var fontItalic = parameters.hasOwnProperty('fontItalic') ? parameters['fontItalic'] : false;
    var textAlign = parameters.hasOwnProperty('textAlign') ? parameters['textAlign'] : 'center';
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 6;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 0.8 };
    var borderRadius = parameters.hasOwnProperty('borderRadius') ? parameters['borderRadius'] : 38;
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 0, g: 0, b: 255, a: 0.8 };

    var ruler = document.createElement('canvas').getContext('2d');
    ruler.font = (fontBold ? 'Bold ' : '') + (fontItalic ? 'Italic ' : '') + fontSize + 'px ' + fontFace;

    var textLines = message.split('\n');

    var textWidth = 0;

    // canvas width shall be based on the longest width of text lines
    var metrics;
    textLines.forEach(function (line) {
        metrics = ruler.measureText(line);
        textWidth = metrics.width > textWidth ? metrics.width : textWidth;
    });
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    var textHeight = fontSize * 1.4 * textLines.length;

    var canvas = document.createElement('canvas');      // Tiene que crear otro canvas para poder...
    // canvas.width = _ceilPow2(textWidth);
    canvas.width = textWidth + 20;
    // canvas.height = _ceilPow2(textHeight);
    canvas.height = textHeight + 20;
    var context = canvas.getContext('2d');              // ...pedir este context 2D. ¿un canvas por cada palabra? Sí.

    context.font = ruler.font;
    context.fillStyle = backgroundColor;
    context.strokeStyle = borderColor;
    context.lineWidth = borderThickness;

    _roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, textHeight + borderThickness, borderRadius);
    //roundRect(ctx,             x,                   y,                         w,                           h,                    r)

    context.fillStyle = textColor;
    context.textAlign = textAlign;
    var fillTextX = {
        left: borderThickness,
        start: borderThickness,
        center: textWidth / 2 + borderThickness,
        right: textWidth + borderThickness,
        end: textWidth + borderThickness
    };
    var curY = fontSize + borderThickness
    textLines.forEach(function (line) {
        context.fillText(line, fillTextX[textAlign], curY);
        curY += fontSize * 1.4;
    })

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = "texto";

    // set the size of the sprite to just a portion
    // sprite.scale.set(0.5 * fontSize, 0.25 * fontSize, 1);
    var auxScale = 20.5;
    sprite.scale.set(canvas.width / auxScale, canvas.height / auxScale, 1);

    var auxWidth = (textWidth) / (0.4 * fontSize);
    var auxHeight = (textHeight + borderThickness) / (0.4 * fontSize);
    // testRectangleSize(canvas, context, metrics, fontSize, borderThickness, textWidth, textHeight, borderRadius)

    sprite.width = auxWidth;
    sprite.height = auxHeight;
    sprite.numOfLines = textLines.length;

    // sprite.position.set(x_axis * horzSpacer, -lvl * vertSpacer, Math.random() * 5);
    sprite.position.set(x_axis * horzSpacer, -lvl * vertSpacer, 0);

    return sprite;

    // ceil the input number to the nearest powers of 2
    function _ceilPow2(num) {
        var i = 0;
        while (num > Math.pow(2, i)) {
            i++;
        }
        return Math.pow(2, i);
    }
}

// function for drawing rounded rectangles
function _roundRect(ctx, x, y, w, h, r) {
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

// Esta función drawPreviewFlotant(parentSprite, path) sirve para agregar una preview flotante de un doc alrededor de un concepto específico
// parentSprite es el concepto alrededor del cual debe flotar
//
function drawPreviewFlotant(parentSprite, path, orientation) {
    const map = new THREE.TextureLoader().load(path);
    const material = new THREE.SpriteMaterial({
        map: map,
        transparent: true,
        opacity: 0.6,
        color: Math.random() * 0xffffff
    });

    const sprite = new THREE.Sprite(material);
    sprite.name = "doc";

    let range = 7;
    range = Math.floor(Math.random() * 2) == 0 ? -range : range;
    sprite.position.x = -range * Math.random() + parentSprite.position.x;

    range = Math.floor(Math.random() * 2) == 0 ? -range : range;
    sprite.position.y = range * Math.random() + parentSprite.position.y;

    range = Math.floor(Math.random() * 2) == 0 ? -range : range;
    sprite.position.z = range * Math.random() - parentSprite.position.z - 10;

    const auxScale = 1;
    // sprite.scale.set(3, 5, 1);
    orientation == "portrait" ? sprite.scale.set(9 * auxScale, 16 * auxScale, 1 * auxScale) : sprite.scale.set(16 * auxScale, 9 * auxScale, 1 * auxScale);

    scene.add(sprite);
}

// Esta función initSprite() sirve para popular los docs adicionales flotantes alrededor de los conceptos
function initSprites() {
    const qtty = 3;
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

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    let rangoX = 20;      // mayor número, mayor apertura, mayor rango de movimiento 
    rangoX = 1 / rangoX;

    let rangoY = 10;      // mayor número, mayor apertura, mayor rango de movimiento 
    rangoY = 1 / rangoY;

    // controls.target = new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z);
    // controls.update();
    // Tweening 
    //  > permet de créer des images intermédiaires successives de telle sorte qu'une image s'enchaîne agréablement et de façon fluide avec la suivante.
    controls.target = new THREE.Vector3((mouse.x * Math.PI) / rangoX, (mouse.y * Math.PI) / rangoY, 0);

    // controls.target.x = THREE.MathUtils.lerp(controls.target.x, (mouse.x * Math.PI) / 10, 0.1);
    // controls.update();

    // controls.target.y = THREE.MathUtils.lerp(controls.target.y, (mouse.y * Math.PI) / 10, 0.1);
    controls.update();

}

function onMouseDown(event) {

    event.preventDefault();

    // var modalBg = document.querySelector('.modal-bg');
    // var modalClose = document.querySelector('.modal-close');

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    mouse.unproject(camera);    // camera to use in the projection.
    // console.dir(mouse);     // Devuelve el vector al que apunta el mouse

    // check if interesected > 0
    var auxInfo = checkIntersects();
    if (auxInfo) {
        showInfo(mouse, auxInfo);
    }

}

function showInfo(coords, sprite) {
    // console.log("--- yep.");
    let currentImgSrc = sprite.material.map.image.currentSrc;   // typeof string
    // console.dir(currentImgSrc);  // retorna source path de la imagen clicada
    currentImgSrc = currentImgSrc.substring(currentImgSrc.indexOf("texture"));

    document.querySelector('.modal-bg').classList.add('bg-active');
    modal_isOn = true;
    // Aquí es que debo mostrar o agregar al div la info que quiero
    document.getElementById("main-image").src = currentImgSrc;
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
var delta = 0.01;
var maxThreshold = 1;

function animate() {
    // console.log(`lineMaterial.opacity: ${lineMaterial.opacity}`);

    // if (lineMaterial.opacity >= 1 || lineMaterial.opacity <= 0) {
    //     delta = -delta;
    // }
    // lineMaterial.opacity += delta;

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

    // update();

    TWEEN.update();

    render();
    requestAnimationFrame(animate);
}

function checkIntersects() {
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects[0] != undefined) {
        // console.dir(intersects[0]);     // >Object
        // console.dir(intersects[0].object);      // >Sprite
    }

    if (intersects.length > 0 && intersects[0].object.name == "doc") {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) {
                INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
                INTERSECTED.material.color = INTERSECTED.currentColor;
                INTERSECTED.scale.set(INTERSECTED.currentScale.x, INTERSECTED.currentScale.y, INTERSECTED.currentScale.z);
                document.body.style.cursor = "auto";
            }

            if (intersects[0] != undefined) {
                INTERSECTED = intersects[0].object;

                INTERSECTED.currentOpacity = INTERSECTED.material.opacity;
                INTERSECTED.currentColor = INTERSECTED.material.color;
                INTERSECTED.currentScale = INTERSECTED.scale.clone();

                INTERSECTED.material.opacity = 1;
                INTERSECTED.material.color = new THREE.Color("rgb(255, 255, 255)");
                const multiplier = 1.4;
                INTERSECTED.scale.set(INTERSECTED.currentScale.x * multiplier, INTERSECTED.currentScale.y * multiplier, INTERSECTED.currentScale.z * multiplier);
                !modal_isOn ? document.body.style.cursor = "pointer" : document.body.style.cursor = "auto";
            }
        }
        return intersects[0].object;

    } else {
        if (INTERSECTED) {
            INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
            INTERSECTED.material.color = INTERSECTED.currentColor;
            INTERSECTED.scale.set(INTERSECTED.currentScale.x, INTERSECTED.currentScale.y, INTERSECTED.currentScale.z);
            document.body.style.cursor = "auto";
        }

        INTERSECTED = null;
    }
}

function render() {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    checkIntersects();

    renderer.render(scene, camera);
}

function testRectangleSize(canvas, context, metrics, fontsize, borderThickness, textWidth, textHeight, borderRadius) {
    var sizeWidth = context.canvas.clientWidth;
    var sizeHeight = context.canvas.clientHeight;

    // var auxWidth = textWidth + (borderRadius) - borderThickness;
    // var auxHeight = fontsize * 1.4 + borderThickness + (borderRadius * 4) + (borderThickness * 2);
    // var auxWidth = (textWidth + borderRadius - borderThickness) / (0.25 * fontsize);
    var auxWidth = (textWidth) / (0.4 * fontsize);
    // var auxHeight = (fontsize * 1.4 + borderThickness + (borderRadius * 4) + (borderThickness * 2)) / (0.5 * fontsize);
    var auxHeight = (textHeight + borderThickness) / (0.4 * fontsize);
    // auxWidth /= (0.25 * fontsize);
    // auxHeight /= (0.5 * fontsize);
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
