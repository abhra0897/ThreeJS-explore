import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import Stats from 'three/addons/libs/stats.module.js';


const speedMulFac = 3;
const velocityForward = .02 * speedMulFac;
const velocityBackward = .01 * speedMulFac;
const velocityLeft = .005 * speedMulFac;
const velocityRight = .005 * speedMulFac;

const roomL = 20;
const roomW = 6;
const roomH = 4.5;
const roomCenterX = 0;
const roomCenterZ = 0;

let canMoveForward = false;
let canMoveLeft = false;
let canMoveRight = false;
let canMoveBackward = false;


let scene, sceneCss, camera, renderer, cssRenderer, controls;

// Create scene
scene = new THREE.Scene();
sceneCss = new THREE.Scene();
sceneCss.scale.set(0.01, 0.01, 0.01);   // Workaround. Since scale of webgl renderer and css3d renderer are not same

// alert("It may take some time to load the scene. Click \"OK\" and wait until loading is complete. \n\nLoading time depends on computer's capability");

// Create Camera
const fov = 45;
const near = 0.01;
const far = 500.0;
const aspect = window.innerWidth / window.innerHeight;
// camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 2000);
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(roomCenterX, 1.8, roomCenterZ - (roomL / 2) + 2);
camera.lookAt(new THREE.Vector3(0, 1.6, 0));

// Create WebGL Renderer
renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
document.querySelector('.canvas-container').appendChild(renderer.domElement);

// Not using CSS3D renderer since its performance is not good. Rather using canvas texture.
// To use  css3d, uncomment below section, the section inside addExhibits() function, and inside animate() function.
/*
// Create Css3D Renderer
cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.canvas-container-css').appendChild(cssRenderer.domElement);
*/

// Create FPS camera control
controls = new PointerLockControls(camera, renderer.domElement);
controls.connect();

// const stats = createStats();
// document.body.appendChild( stats.domElement );

//movement
document.body.addEventListener('keydown', onKeyDown, false);
document.body.addEventListener('keyup', onKeyUp, false);
//lock cursor
document.body.addEventListener( 'mousedown', onMouseDown, false );

window.addEventListener('resize', function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

document.querySelector("#close").addEventListener("click", function() {
    document.querySelector(".popup").style.display = "none";
});


// Create the frames to display the images

const images = [
    'images/sh_im1.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/pexels-sven-huls-3801347.jpg',          'By: pexels',               'pexels.com',
    'images/mb_im1.jpg',                            'By: Manisha Biswas',       'ig: N/A',
    'images/mb_im3a.jpg',                           'By: Manisha Biswas',       'ig: N/A',
    'images/sh_im2.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/pexels-oliver-sjöström-1020016.jpg',    'By: pexels',               'pexels.com',
    'images/sh_im6.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/mb_im5.jpg',                            'By: Manisha Biswas',       'ig: N/A',
    'images/mb_im2a.jpg',                           'By: Manisha Biswas',       'ig: N/A',
    'images/sh_im4.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/sh_im7.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/pexels-rok-romih-3848197.jpg',          'by: pexels',               'pexels.com',
    'images/pexels-david-pinheiro-4768936.jpg',     'By: pexels',               'pexels.com',
    'images/sh_im5.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
    'images/pexels-oleksandr-pidvalnyi-1172064.jpg','By: pexels',               'pexels.com',
    'images/sh_im8.jpg',                            'By: Shreya Khandelwal',    'ig: @paperdiaries_',
];

// Add room at x=0, z=0. Dimension: w=10, l=10, h=4.5 meters
addRoom(roomCenterX, roomCenterZ, roomW, roomL, roomH, scene);

// Add some exhibits
addExhibits(roomCenterX, 1.8, roomCenterZ, roomW, roomL, 8, images, scene);

// Add lights
addLightGrid(roomCenterX, 4, roomCenterZ, roomW, roomL, 1, 4, 0xfaf5e6, 1, 10, scene);
let light = new THREE.AmbientLight(0x101010, 4);
scene.add(light);

// Add a door
addGLTF('models/door.glb', roomCenterX, 1.3, roomCenterZ + roomL/2 - 0.05, Math.PI / 2, 0.012, scene);

// Add some plants
addGLTF('models/house_plant.glb', roomCenterX, 0, roomCenterZ - roomL/2 + .5, 0, .3, scene);
addGLTF('models/potted_money_plant.glb', roomCenterX - 2, 0, roomCenterZ + roomL/2 - .5, 0, 1, scene);
addGLTF('models/potted_money_plant.glb', roomCenterX + 2, 0, roomCenterZ + roomL/2 - .5, Math.PI/2, 1, scene);

// Add a sign
let meshSign = createCanvasText('Virtual Gallery v0.1b', .2, .6, 2, 0xffffff, 0x0295b3);
meshSign.position.set(0, roomH/2 + 1.2, roomCenterZ + roomL / 2 - 0.01);
meshSign.rotation.y = Math.PI;
scene.add(meshSign);

let meshSign2 = meshSign.clone();
meshSign2.position.set(0, roomH/2 + 1.2, roomCenterZ - roomL / 2 + 0.01);
meshSign2.rotation.y = Math.PI;
scene.add(meshSign2);

function addLightGrid(centerX, centerY, centerZ, w, l, wCount, lCount, color, intensity, distance, parent) {
    const lampR = 0.3;
    const lampT = 0.1;

    let gapW = w / wCount;
    let gapL = l / lCount;
    let startW = centerX - (w / 2) + (gapW / 2);
    let startL = centerZ - (l / 2) + (gapL / 2);
    let x = startW, y = centerY, z = startL;

    const groupLight = new THREE.Group();

    for (let iw = 0; iw < wCount; iw++) {
        for (let il = 0; il < lCount; il++) {
            const light = new THREE.PointLight(color, intensity, distance);
            light.position.set(x, y, z);
            light.castShadow = true;
//             light.target.position.set(x, 0, z);    // for spotlight
//             scene.add(light.target);   // for spotlight

            //Set up shadow properties for the light
            light.shadow.mapSize.width = 512; // default
            light.shadow.mapSize.height = 512; // default
            light.shadow.camera.near = 0.5; // default
            light.shadow.camera.far = 500; // default

            const geoLamp = new THREE.CylinderBufferGeometry(lampR, lampR, lampT, 32);
            const matLamp = new THREE.MeshBasicMaterial({color: color});
            const lamp = new THREE.Mesh(geoLamp, matLamp);
            lamp.position.set(x, y+.4, z);

            const geoLampOuter = new THREE.CylinderBufferGeometry(lampR+0.02, lampR+0.02, lampT/2, 32);
            const matLampOuter = new THREE.MeshStandardMaterial({color: 0x808080});
            const lampOuter = new THREE.Mesh(geoLampOuter, matLampOuter);
            lampOuter.position.set(x, y+.4, z);

            groupLight.add(light);
            groupLight.add(lamp);
            groupLight.add(lampOuter);
            z = z + gapL;
        }
        x = x + gapW;
        z = startL;
    }

    parent.add(groupLight);
    return groupLight;
}


function addExhibits(centerX, centerY, centerZ, w, l, count, images, parent) {
    const frameW = 1.2;
    const frameH = 1.6;
    const frameT = 0.2;

    let gapW = w;
    let gapL = l / count;
    let startW = centerX - (w / 2);
    let startL = centerZ - (l / 2) + (gapL / 2);
    let x = startW, y = centerY, z = startL;
    let imageIndex = 0;

    const groupObjs = new THREE.Group();
    let flipFrame = false;
    const frameColor = 0x505050;
    for (let iw = 0; iw < 2; iw++) {
        for (let il = 0; il < count; il++) {
            const textureFrame = new THREE.TextureLoader().load(images[imageIndex * 3]);
            const geoFrame = new THREE.BoxBufferGeometry(frameW, frameH, frameT);
//             const matFrame = new THREE.MeshStandardMaterial({
//                 color: 0xffffff,
//                 roughness: 0.5
//             });

            const matFrame2 = [
                new THREE.MeshStandardMaterial({
                    color: frameColor //left
                }),
                new THREE.MeshStandardMaterial({
                    color: frameColor //right
                }),
                new THREE.MeshBasicMaterial({
                    color: frameColor // top
                }),
                new THREE.MeshBasicMaterial({
                    color: frameColor // bottom
                }),
                new THREE.MeshBasicMaterial({
                    map: textureFrame, // front
                }),
                new THREE.MeshBasicMaterial({
                    color: frameColor //back
                })
            ];
            matFrame2[4].map.anisotropy = maxAnisotropy;
            const frame = new THREE.Mesh(geoFrame, matFrame2);
            frame.position.set(x, y, z);
            frame.castShadow = true;


            // Add credits

            // Commenting out css3d based approcah due to performance hit. but it works
            /*
            const element = document.createElement('div');
            element.className = 'credit-container';
            element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
            const para = document.createElement('p');
            para.innerHTML = "Hello";
            element.appendChild(para);
            const objectCSS = new CSS3DObject( element );
            objectCSS.position.set(x*100, y*100, z*100);
            */

            let creditTxt = images[imageIndex *3 + 1] + '\n\n' + images[imageIndex *3 + 2]
            const textmesh = createCanvasText(creditTxt, 0.08, 0.4, 1, 0xffffff, 0x202020); // text #1, Hello, world
            textmesh.position.set(x, y+frameH/2+0.4, z);


            if (flipFrame == false) {
                frame.rotation.y = Math.PI / 2;
                textmesh.rotation.y = Math.PI / 2;
                textmesh.position.x = (x + 0.01);

                /*
                objectCSS.rotation.y = Math.PI / 2;
                objectCSS.position.x = (x + .1) * 100;
                */

            }
            else {
                frame.rotation.y = 3 * Math.PI / 2;
                textmesh.rotation.y = 3 * Math.PI / 2;
                textmesh.position.x = (x - 0.01);
                /*
                objectCSS.rotation.y = 3* Math.PI / 2;
                objectCSS.position.x = (x - .1) * 100;
                */

            }

            groupObjs.add(frame);
            /*sceneCss.add(objectCSS); // Performance is not good.*/
            groupObjs.add(textmesh);
            z = z + gapL;
            imageIndex++;

        }
        flipFrame = true;
        x = x + gapW;
        z = startL;
    }

    parent.add(groupObjs);
    return groupObjs;
}


function addRoom(posX, posZ, width, length, height, parent) {

    const groupRoomElements = new THREE.Group();

    // Create a floor
    const tfFloor = 5;    // Floor texture tiling factor
    const textureFloor = new THREE.TextureLoader().load('WoodFloor034_2K-JPG/WoodFloor034_2K_Color.jpg');
    const normalFloor = new THREE.TextureLoader().load('WoodFloor034_2K-JPG/WoodFloor034_2K_NormalGL.jpg');
    const roughnessFloor = new THREE.TextureLoader().load('WoodFloor034_2K-JPG/WoodFloor034_2K_Roughness.jpg');
    const aoFloor = new THREE.TextureLoader().load('WoodFloor034_2K-JPG/WoodFloor034_2K_AmbientOcclusion.jpg');

    textureFloor.wrapS = THREE.RepeatWrapping;
    textureFloor.wrapT = THREE.RepeatWrapping;
    textureFloor.repeat.set(width/tfFloor, length/tfFloor);
    normalFloor.wrapS = THREE.RepeatWrapping;
    normalFloor.wrapT = THREE.RepeatWrapping;
    normalFloor.repeat.set(width/tfFloor, length/tfFloor);
    roughnessFloor.wrapS = THREE.RepeatWrapping;
    roughnessFloor.wrapT = THREE.RepeatWrapping;
    roughnessFloor.repeat.set(width/tfFloor, length/tfFloor);
    aoFloor.wrapS = THREE.RepeatWrapping;
    aoFloor.wrapT = THREE.RepeatWrapping;
    aoFloor.repeat.set(width/tfFloor, length/tfFloor);

    const geoFloor = new THREE.PlaneBufferGeometry(width, length, 10, 10);
    const matFloor = new THREE.MeshStandardMaterial({
        map: textureFloor,
        normalMap: normalFloor,
        roughnessMap: roughnessFloor,
        aoMap: aoFloor,
        roughness: .5
    });
    const floor = new THREE.Mesh( geoFloor, matFloor );
    floor.position.set(posX, 0, posZ)
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;

    // Create ceiling
    const tfCeiling = 12;    // Ceiling texture tiling factor
    const textureCeiling = new THREE.TextureLoader().load('OfficeCeiling001_2K-JPG/OfficeCeiling001_2K_Color.jpg');
    const normalCeiling = new THREE.TextureLoader().load('OfficeCeiling001_2K-JPG/OfficeCeiling001_2K_NormalGL.jpg');
    const roughnessCeiling = new THREE.TextureLoader().load('OfficeCeiling001_2K-JPG/OfficeCeiling001_2K_Roughness.jpg');
    const aoCeiling = new THREE.TextureLoader().load('OfficeCeiling001_2K-JPG/OfficeCeiling001_2K_AmbientOcclusion.jpg');

    textureCeiling.wrapS = THREE.RepeatWrapping;
    textureCeiling.wrapT = THREE.RepeatWrapping;
    textureCeiling.repeat.set(width/tfCeiling, length/tfCeiling);
    normalCeiling.wrapS = THREE.RepeatWrapping;
    normalCeiling.wrapT = THREE.RepeatWrapping;
    normalCeiling.repeat.set(width/tfCeiling, length/tfCeiling);
    roughnessCeiling.wrapS = THREE.RepeatWrapping;
    roughnessCeiling.wrapT = THREE.RepeatWrapping;
    roughnessCeiling.repeat.set(width/tfCeiling, length/tfCeiling);
    aoCeiling.wrapS = THREE.RepeatWrapping;
    aoCeiling.wrapT = THREE.RepeatWrapping;
    aoCeiling.repeat.set(width/tfCeiling, length/tfCeiling);

    const matCeiling = new THREE.MeshStandardMaterial({
        map: textureCeiling,
        normalMap: normalCeiling,
        roughnessMap: roughnessCeiling,
        aoMap: aoCeiling
    });
    const ceiling = floor.clone();
    ceiling.material.dispose();
    ceiling.material = matCeiling;
    ceiling.position.y = height;
    ceiling.rotation.y = Math.PI;

    // Create 4 walls
    const tfWall = 2;   // Wall texture tiling factor
    // Create the base wall
    // NOTE: use async loader if any error is observed. See: https://discourse.threejs.org/t/cloning-texture/14969/2
    const textureWall = new THREE.TextureLoader().load('Fabric030_1K-JPG/Fabric030_1K_Color.jpg');
    const normalWall = new THREE.TextureLoader().load('Fabric030_1K-JPG/Fabric030_1K_NormalGL.jpg');
    const roughnessWall = new THREE.TextureLoader().load('Fabric030_1K-JPG/Fabric030_1K_Roughness.jpg');
    const aoWall = new THREE.TextureLoader().load('Fabric030_1K-JPG/Fabric030_1K_AmbientOcclusion.jpg');

//     textureWall.anisotropy = 16;
    textureWall.wrapS = THREE.RepeatWrapping;
    textureWall.wrapT = THREE.RepeatWrapping;
    textureWall.repeat.set(width/tfWall, height/tfWall);
    normalWall.wrapS = THREE.RepeatWrapping;
    normalWall.wrapT = THREE.RepeatWrapping;
    normalWall.repeat.set(width/tfWall, height/tfWall);
    roughnessWall.wrapS = THREE.RepeatWrapping;
    roughnessWall.wrapT = THREE.RepeatWrapping;
    roughnessWall.repeat.set(width/tfWall, height/tfWall);
    aoWall.wrapS = THREE.RepeatWrapping;
    aoWall.wrapT = THREE.RepeatWrapping;
    aoWall.repeat.set(width/tfWall, height/tfWall);

    const geoWall1 = new THREE.PlaneBufferGeometry(width, height, 10, 10);
    const matWall1 = new THREE.MeshStandardMaterial({
        map: textureWall,
        normalMap: normalWall,
        roughnessMap: roughnessWall,
        aoMap: aoWall
    });
    const wall1 = new THREE.Mesh( geoWall1, matWall1 );
    wall1.position.set(posX, height/2, posZ - length/2)
    wall1.castShadow = false;
    wall1.receiveShadow = true;

    // Copy the base wall and put it to the opposite side of the room
    const wall2 = wall1.clone()
    wall2.rotation.y = Math.PI;
    wall2.position.set(posX, height/2, posZ + length/2)

    // Copy the base wall but dispose the geometry, texture, material and create new ones.
    // Put it to 90 degree w.r.t base wall
    const newTextureWall = textureWall.clone(); // Cloning existing material is recommended than loading it again
    const newNormalWall = normalWall.clone();
    const newRoughnessWall = roughnessWall.clone();
    const newAoWall = aoWall.clone();

    newTextureWall.repeat.set(length/tfWall, height/tfWall);
    newNormalWall.repeat.set(length/tfWall, height/tfWall);
    newRoughnessWall.repeat.set(length/tfWall, height/tfWall);
    newAoWall.repeat.set(length/tfWall, height/tfWall);

    const newMatWall = new THREE.MeshStandardMaterial({
        map: newTextureWall,
        normalMap: newNormalWall,
        roughnessMap: newRoughnessWall,
        aoMap: newAoWall
    });

    const newGeoWall = new THREE.PlaneBufferGeometry(length, height, 10, 10);
    const wall3 = wall1.clone()
    wall3.geometry.dispose();
    wall3.geometry = newGeoWall;
    wall3.material.dispose();
    wall3.material = newMatWall;
    wall3.rotation.y = 3 * Math.PI / 2; // To make sure correct normals are facing
    wall3.position.set(posX + width/2, height/2, posZ)

    // Copy the previous wall and put it to the opposite side of the room
    const wall4 = wall3.clone()
    wall4.rotation.y = Math.PI / 2; // To make sure correct normals are facing
    wall4.position.set(posX - width/2, height/2, posZ)


    // Add all elements of the room into a group
    groupRoomElements.add(floor);
    groupRoomElements.add(ceiling);
    groupRoomElements.add(wall1);
    groupRoomElements.add(wall2);
    groupRoomElements.add(wall3);
    groupRoomElements.add(wall4);
    // Now add the group into our parent (can be scene)
    parent.add(groupRoomElements);


    // Now create doors
//     loadDoorFromModel(centerX, centerY, centerZ, rotY)

    return groupRoomElements;
}

function addGLTF(gltfPath, centerX, centerY, centerZ, rotY, scale, parent) {
    // Instantiate a loader
    const loader = new GLTFLoader();
    let mesh;
    loader.load(
        gltfPath,
        function (gltf) {
            mesh = gltf.scene;
            mesh.position.set(centerX, centerY, centerZ);
            mesh.rotation.y = rotY;
            mesh.scale.set(scale, scale, scale);
            parent.add(mesh);
        },
        undefined,
        function (error) {console.error( error );}
    );
}



//Jump not implemented yet
//Lock cursor on click
function onMouseDown(event) {
    switch ( event.button )
    {
        //left click
//         case 0:
//             controls.lock();
//             break;

        //right click
        case 2:
            controls.unlock();
            break;
    }
}


//Forward/backword movement
//esc to unlock cursor
//enter to lock cursor
function onKeyDown() {
	switch (event.keyCode)
	{
		case 83: // S
			canMoveBackward = true;
			break;
		case 87: // W
			canMoveForward = true;
			break;
        case 65: // A
			canMoveLeft = true;
			break;
		case 68: // D
			canMoveRight = true;
            break;
        case 70: // F
			controls.lock();
            break
		case 27: // space
			canJump = true;
		case 27: // esc
			controls.unlock();
			break;
		case 13: // Enter
			controls.lock();
			break;
	}
}


function onKeyUp() {
	switch (event.keyCode)
	{
		case 83: // S
			canMoveBackward = false;
			break;
		case 87: // W
			canMoveForward = false;
			break;
        case 65: // A
			canMoveLeft = false;
			break;
		case 68: // D
			canMoveRight = false;
			break;
		case 27: // space
			canJump = false;
            break;
	}
}


function handleMovement() {
	if (canMoveForward)
		controls.moveForward(velocityForward);
	if (canMoveBackward)
		controls.moveForward(-velocityBackward);
	if (canMoveRight)
		controls.moveRight(velocityRight);
	if (canMoveLeft)
		controls.moveRight(-velocityLeft);
}

function drawBoxesRandom(box_cnt) {
    for (let x = -5; x < 5; x=x+2) {
        for (let y = -5; y < 5; y=y+2) {
            const box = new THREE.Mesh(
                new THREE.BoxBufferGeometry(.3, 1.6, 0.3),
                new THREE.MeshStandardMaterial({
                    color: 0x808080,
                }));
            box.position.set(x, 1.6/2, y);
            box.castShadow = true;
            box.receiveShadow = true;
            scene.add(box);
        }
    }

}

// Taken from: https://discourse.threejs.org/t/an-example-of-text-to-canvas-to-texture-to-material-to-mesh-not-too-difficult/13757.
// Modified to add nulti-line support.
// May be not the best solution
function createCanvasText(txt, lineH, bboxH, bboxW, fgColor, bgColor) {
    // txt is the text.
    // lineH is world height of a single text line.
    // bboxH is world height of whole rectangle containing the text.
    // bboxHW is world width of whole rectangle containing the text.

    const txtPxH = 50;
    const kPxToWorld = lineH/txtPxH;                // Px to World multplication factor
    // lineH, bboxH, and txtPxH are given; get hPxAll
    const hPxAll = Math.ceil(bboxH/kPxToWorld);     // hPxAll: height of the whole texture canvas
    const wPxAll = Math.ceil(bboxW/kPxToWorld);    // wPxAll: width of the whole texture canvas

    // Break the line as per newlines and find the start y pos in canvas
    let lines = txt.split('\n');
    const totPxLineH = (lines.length * lineH) / kPxToWorld;
    if (totPxLineH > hPxAll)
        return;
    const startPxY = (hPxAll - totPxLineH) / 2;

    // create the canvas for the texture
    var txtcanvas = document.createElement("canvas"); // create the canvas for the texture
    const ctx = txtcanvas.getContext("2d");
    ctx.font = txtPxH + "px sans-serif";

    // next, resize the texture canvas and fill the text
    txtcanvas.width =  wPxAll;
    txtcanvas.height = hPxAll;
    if (bgColor != undefined) { // fill background if desired (transparent if none)
        ctx.fillStyle = "#" + bgColor.toString(16).padStart(6, '0');
        ctx.fillRect( 0,0, wPxAll,hPxAll);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#" + fgColor.toString(16).padStart(6, '0'); // fgcolor
    ctx.font = txtPxH + "px sans-serif";   // needed after resize

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], wPxAll/2, startPxY + (i * (lineH/kPxToWorld)));  // when working inside canvas, must use canvas coordinates
//         console.log(startPxY + (i * (lineH/kPxToWorld)));
    }
//     ctx.fillText(txt, wPxAll/2, hPxAll/2); // the deed is done
    // next, make the texture
    const texture = new THREE.Texture(txtcanvas); // now make texture
    texture.needsUpdate = true;                 // Important!
    // and make the world plane with the texture
    const geometry = new THREE.PlaneGeometry(bboxW, bboxH);
    const material = new THREE.MeshBasicMaterial ({
        map:texture,
        opacity:1.0
    });
    material.map.anisotropy = maxAnisotropy;
    // and finally, the mesh
    const mesh = new THREE.Mesh(geometry, material);

//     console.log(hPxAll, totPxLineH, startPxY)

    return mesh;
}

function createStats() {
    const stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0';
    stats.domElement.style.top = '0';

    return stats;
}

//Is camera reached the maximum Z position?
var is_max_reached = false;
var camera_automove = false;
function animate() {

	if (camera_automove === true) {
		if (camera.position.z < -(floor_length)) {
			is_max_reached = true;
		}

		if (camera.position.z >= 60) {
			is_max_reached = false;
		}

		if (is_max_reached == true)
			camera.position.z += 0.2;
		else
			camera.position.z -= 0.2;
	}
	handleMovement();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
    // Uncomment below line if using CSS texts. Commenting out cause this tanks Performance
    // cssRenderer.render(sceneCss, camera);
//     stats.update();
}

//Finally animate
animate();
