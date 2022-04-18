import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from  'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/RGBELoader.js';
import { Sky } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/objects/Sky.js';
// import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/DRACOLoader.js';
import { TransformControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/TransformControls.js';

const webgl = document.querySelector('#webgl');
const preloader = document.querySelector('.preloader-wrapper');
const circle = document.querySelector('.joystick-area');
const percentage = document.querySelector('#percentage');
const width = webgl.offsetWidth;
const height = webgl.offsetHeight;

CameraControls.install( { THREE: THREE } );
let gallery,glasswindow,rabbit;
let sky,sun;
let projector;

let prevTime = performance.now();

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
var swt;
var swe;
var arrsw=Array();
swww();
function swww(){


	if($(webgl).width()<=600){
	swt="touchstart"
	swe="touchend"
	arrsw.push(swt);
	arrsw.push(swe);
	
	}else{
	swt="mousemove";
	swe="dblclick";
	arrsw.push(swt);
	arrsw.push(swe);
	}
	
	
	return arrsw
	
	}
	var touchstartt=0;
console.log($(webgl).width());
function onPointerMove( event ) {
	touchstartt=0
	if($(webgl).width()<600){
		
		pointer.x = (  event.touches[0].clientX/ renderer.domElement.clientWidth ) * 2 - 1;
		pointer.y = - ( event.touches[0].clientY / renderer.domElement.clientHeight ) * 2 + 1;
		//console.log(pointer.x)
	
		  }else{
		
			pointer.x = (  event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
		pointer.y = - ( event.offsetY / renderer.domElement.clientHeight ) * 2 + 1;
		
		
		  }

	//pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	//pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};

window.addEventListener( arrsw[0], onPointerMove );

window.requestAnimationFrame(render);



//-- Scene
    		const scene = new THREE.Scene();

//-- Camera
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100 );
            scene.add( camera );
//			camera.position.set(5.3,9,3.9);


//--Renderer
			const renderer = new THREE.WebGLRenderer({
				 antialias: true,
				 canvas: webgl,
				});
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.setPixelRatio(window.devicePixelRatio / 1.2);
			renderer.outputEncoding = THREE.sRGBEncoding;
		    renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.2;
		
			

		const EPS = 1e-5;
			camera.position.set( 0, 0,- EPS );
			const cameraControls = new CameraControls( camera, renderer.domElement );
 cameraControls.azimuthRotateSpeed = - 0.2; // negative value to invert rotation direction
 cameraControls.polarRotateSpeed   = - 0.2; // negative value to invert rotation direction
 cameraControls.truckSpeed = 0;
 cameraControls.polarRotateSpeed = 0.5;
 cameraControls.azimuthRotateSpeed = 1.5;
cameraControls.minDistance = cameraControls.maxDistance = 0.1;


 cameraControls.saveState();

 cameraControls.addEventListener( 'sleep', letstart );

 function letstart(event){
//	console.log(event);
 }

//--Post Processing

		/*	const composer = new EffectComposer( renderer );
			composer.addPass( new RenderPass( scene, camera ) );

			const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
			composer.addPass( pass ); */


//-- Scene Background

const pmremGenerator = new THREE.PMREMGenerator( renderer );
new RGBELoader().load( 'Studio1.hdr', function ( texture ) {

	texture.mapping = THREE.EquirectangularReflectionMapping;

	scene.environment = texture;
    scene.background = texture;
	console.log(scene);
});

// scene.environment = pmremGenerator.fromScene( new RoomEnvironment() ).texture;


//-- Screen Resize
window.addEventListener('resize', () =>{
	onWindowResize()
});
			function onWindowResize() {

	     		camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setPixelRatio(window.devicePixelRatio / 1.2);
			};

//-- Texture Loader

const textureloader = new THREE.TextureLoader();
let mactexture = textureloader.load('model/textures/macscreen.jpg');
let ceiling_diffuse = textureloader.load('model/textures/ceiling_color whitenew.jpg');


//-- camera-Controls


const glassgeometry = new THREE.BoxGeometry( 5.1,7,9 );

//-- Materials

const glassmaterial = new THREE.MeshPhysicalMaterial( {
	color: '#D4EFFF',
	opacity: 0.55,
	transparent: true,
    
} );

const macmaterial = new THREE.MeshStandardMaterial({
	map: mactexture,
	metalness: 0.8,
})

const boxshape = new THREE.BoxGeometry(0.2,0.2,0.2);
const boxmaterial = new THREE.MeshStandardMaterial({
	 color: 'red',
	 visible: false,
})

const box = new THREE.Mesh(boxshape,boxmaterial);
//scene.add(box);




//-- Animation 

//-- Environment 


                 sky = new Sky();
				sky.scale.setScalar( 450000 );
				scene.add( sky );

				sun = new THREE.Vector3();

				/// GUI

				const effectController = {
					turbidity: 16.3,
					rayleigh: 0.253,
					mieCoefficient: 0.032,
					mieDirectionalG: 0.875,
					elevation: 56.6,
					azimuth: 99.5,
					exposure: renderer.toneMappingExposure
				};

				const uniforms = sky.material.uniforms;
					uniforms[ 'turbidity' ].value = effectController.turbidity;
					uniforms[ 'rayleigh' ].value = effectController.rayleigh;
					uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
					uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

					const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
					const theta = THREE.MathUtils.degToRad( effectController.azimuth );

					sun.setFromSphericalCoords( 1, phi, theta );

					uniforms[ 'sunPosition' ].value.copy( sun );
/*
					window.addEventListener(arrsw[1], () =>{
						raycaster.setFromCamera( pointer, camera );
					});
*/
		
				
//-- Update data

const update = () => {

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children,true );
	
	
	for ( let i = 0; i < intersects.length; i ++ ) {

//console.log(intersects[i].object.name);



	 if(intersects[i].object.name == 'floor'){

	//	document.querySelector('#value').innerText = intersects[i].distance;
	      box.position.x = intersects[i].point.x;
		  box.position.z = intersects[i].point.z;

		 window.addEventListener(arrsw[1], () =>{
  

cameraControls.moveTo(box.position.x, 0.5, box.position.z, true )
		});
				
	  };
	};

};


//-- Loading manager



const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

//	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
   
};

manager.onLoad = function ( ) {
 
	// video.play();

   update();
	anime({
		targets: preloader,
		delay: 800,
		translateY: ['0%', '-100%'],
		easing: 'easeInOutQuint',
	});
	
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	
	let loadingvalue = (itemsLoaded / itemsTotal) * 100;
      loadingvalue = loadingvalue.toFixed(0);
      percentage.innerText = loadingvalue + '%';

};

manager.onError = function ( url ) {

	

};

// const draco = new DRACOLoader();
// draco.setDecoderPath('/draco/');


			let loader = new GLTFLoader(manager);
	      //  loader.setDRACOLoader(draco);
			

            let floor,collider,ceiling,macscreen;

			loader.load('model/newgallery.gltf', function(gltf){

	            gallery = gltf.scene;
     
				gallery.position.y = -1;
				gallery.position.x = -1;

                scene.add(gallery);
				glasswindow = gltf.scene.getObjectByName('glass-window');
		        floor = gallery.getObjectByName('floor');
				ceiling = gallery.getObjectByName('ceiling');
				rabbit = gallery.getObjectByName('Rabbit');
				let gallerytop = gallery.getObjectByName('gallery-top');
				 macscreen = gallery.getObjectByName('screen_glass');
     

				 
			     macscreen.material = macmaterial;
				gallerytop.material.visible = false;			

	

                gallery.traverse(function(child) {

	

					if ( child.isMesh === true && child.material.map !== null ) {
                         // console.log(child.material.map.anisotropy);
						child.material.map.anisotropy = '6';
					//	console.log(child.name);
				  
					 }
		
					if(child.material && child.material.name === 'glassmaterial'){
						 child.material = glassmaterial;
					}

				// 	else if(child.material && child.material.name === 'video-material'){
				// 	//	child.material = videomaterial;
				//    }

	 

				
				})

		
    
			     cameraControls.colliderMeshes.push( gallery );
			});

	
//--Rabbit Animate

function rabbitanimate(){
	 rabbit.rotation.y += 0.015;
}


            function render() {
                requestAnimationFrame(render);
				raycaster.setFromCamera( pointer, camera );
				update();
                rabbitanimate();
				const delta = clock.getDelta();
				const elapsed = clock.getElapsedTime();
				const updated = cameraControls.update( delta );
				 
			 
					// composer.render();
				
			   renderer.render( scene, camera );

                }

render();


