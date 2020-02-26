import * as THREE from './three.module.js';
import { PointerLockControls } from './PointerLockControls.js';


var scene = new THREE.Scene();
//fog creation
{
	const color = 0xF0F0F0
	const density = 0.007;
	scene.fog = new THREE.FogExp2(color, density);
}

// Create Camera
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000); 
camera.position.set(0, 15, 60);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create WebGL Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//camera control FPS
var controls = new PointerLockControls(camera, document.body);
controls.connect();


document.body.appendChild(renderer.domElement);
//movement
document.body.addEventListener('keydown', onKeyDown, false);
//lock cursor
document.body.addEventListener( 'mousedown', onMouseDown, false );


var geometrySphere = new THREE.SphereGeometry();
var materialSphere = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
var sphere = new THREE.Mesh(geometrySphere, materialSphere);


//no of houses on each side
var house_count = 30;
//Adding a floor
var floor_length = ((10 + 2) * house_count);
var geometryFloor = new THREE.PlaneGeometry(30, floor_length, 20, 40);
var materialFloor = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var floor_plane = new THREE.Mesh(geometryFloor, materialFloor);
var rad_to_deg_factor = 0.01746032;
floor_plane.rotation.x = 90 * rad_to_deg_factor;
floor_plane.position.z = -(floor_length / 2) + 10;

//All houses are packed inside on Object3D
var cubes = new THREE.Object3D();
//Houses on left
draw_houses(house_count, -20);
scene.add(cubes);
//Houses on right
draw_houses(house_count, 20);

scene.add(cubes);
scene.add(floor_plane);



//Is camera reached the maximum Z position?
var is_max_reached = false;
var camera_automove = true;
function animate()
{
	
	if (camera_automove === true)
	{
		if (camera.position.z < -(floor_length))
		{
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
	
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

//house_count: No of houses
//x_pos: position of boxes on x axis
function draw_houses(house_count, x_pos)
{

	var cube_h_min = 20;
	var cube_h_max = 50;
	var cube_h = cube_h_min;
	var cube_w = 15;
	var cube_d = 10;
	var cube_pos_z = 0;
	var cube_pos_y = cube_h / 2;

	//if negarive, left side. Else right side
	var cube_pos_x = x_pos;

	
	for (var cnt = 0; cnt < house_count; cnt++)
	{
		var geometryCube_auto = new THREE.BoxGeometry(cube_w, cube_h, cube_d, 5, 5, 2);
		var color_rand = new THREE.Color(0xffffff);
		color_rand.setHex(Math.random() * 0xffffff);

		var materialCube_rand = new THREE.MeshBasicMaterial({
			color: color_rand,
			wireframe: true
		});

		var cube_auto = new THREE.Mesh(geometryCube_auto, materialCube_rand);
		cube_auto.position.set(cube_pos_x, cube_pos_y, cube_pos_z);
		cubes.add(cube_auto);

		cube_pos_z -= cube_d + 2;   //Place cubes behind
		cube_h = Math.floor(Math.random() * (cube_h_max - cube_h_min)) + cube_h_min;  //range min to max
		cube_pos_y = cube_h / 2;    //all cube's base must be at y = 0 (so, center = h/2)

		
	}
	
}


//Jump
function jump()
{
	//not implemented yet
}

//Lock cursor on click

function onMouseDown(event)
{
	switch ( event.button ) 
	{
		//left click
		case 0: 
			//controls.lock();
			break;
		
		//middle click
		case 1: 
			controls.unlock();
			break;
		
		//right click
		case 2: 
			controls.unlock();
			break;

	}
}


//Forward/backword movement
//esc to unlock cursor

function onKeyDown()
{
	switch (event.keyCode)
	{
		case 83: // S
			controls.lock();
			controls.moveForward(-2);
			break;
		case 87: // W
			controls.lock();
			controls.moveForward(2);
			break;
		case 27: // esc
			controls.unlock();
			break;
		case 27: // space
			jump();
			break;
	}

}


//Finally animate
animate();