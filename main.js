import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/FlyControls.js';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/PointerLockControls.js';
import { FirstPersonControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/FirstPersonControls.js';

const webgl = document.querySelector('#webgl');
const preloader = document.querySelector('.preloader-wrapper');
const circle = document.querySelector('.joystick-area');
const percentage = document.querySelector('#percentage');
const width = webgl.offsetWidth;
const height = webgl.offsetHeight;


CameraControls.install( { THREE: THREE } );
let gallery,glasswindow,boxshape;


			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();



function onPointerMove( event ) {


	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);



//-- Scene
    		const scene = new THREE.Scene();

//-- Camera
            const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100 );
            scene.add( camera );
			camera.position.set(5.3,9,0);


//--Renderer
			const renderer = new THREE.WebGLRenderer({
				 antialias: true,
				 canvas: webgl,
				 logarithmicDepthBuffer:true,
				});
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.setPixelRatio(window.devicePixelRatio / 1.4);
			renderer.outputEncoding = THREE.sRGBEncoding;
		    renderer.toneMapping = THREE.ACESFilmicToneMapping;


		const EPS = 1e-5;
			// camera.position.set( 0, 0,- EPS );
			const cameraControls = new CameraControls( camera, renderer.domElement );
 cameraControls.azimuthRotateSpeed = - 0.2; // negative value to invert rotation direction
 cameraControls.polarRotateSpeed   = - 0.2; // negative value to invert rotation direction
 cameraControls.truckSpeed = 0;
 cameraControls.polarRotateSpeed = 0.5;
 cameraControls.azimuthRotateSpeed = 1.5;
cameraControls.minDistance = cameraControls.maxDistance = 0.2;
 //cameraControls.touches.two = cameraControls.ACTION.TOUCH_ZOOM_TRUCK;

 cameraControls.saveState();

//--Post Processing

		/*	const composer = new EffectComposer( renderer );
			composer.addPass( new RenderPass( scene, camera ) );

			const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
			composer.addPass( pass ); */


//-- Scene Background

const pmremGenerator = new THREE.PMREMGenerator( renderer );

scene.environment = pmremGenerator.fromScene( new RoomEnvironment() ).texture;


//-- Screen Resize
window.addEventListener('resize', () =>{
	onWindowResize()
});
			function onWindowResize() {

	     		camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			};

//-- camera-Controls


const glassgeometry = new THREE.BoxGeometry( 5.1,7,9 );

//-- Materials

const glassmaterial = new THREE.MeshPhysicalMaterial( {color: '#D4EFFF',
	opacity: 0.55,
	transparent: true,

} );


const cylinder = new THREE.Mesh(glassgeometry,glassmaterial);
scene.add(cylinder);
cylinder.position.set(-3.62,1,15);

boxshape = new THREE.BoxGeometry(0.3,0.2,0.3);
const boxmaterial = new THREE.MeshBasicMaterial({
	color: 'white',
	visible: false,
})

const box = new THREE.Mesh(boxshape,boxmaterial);
scene.add(box);
box.position.y = -0.85;



//-- Update data

const update = () => {
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
	 if(intersects[i].object.name == 'floor'){

	//	document.querySelector('#value').innerText = intersects[i].distance;
		 box.position.x = intersects[i].point.x;
		 box.position.z = intersects[i].point.z;

		 window.addEventListener('dblclick', () =>{

cameraControls.moveTo( box.position.x, 1.2, box.position.z, true )
 

		});


		let timeout;
		let lastTap = 0;
		window.addEventListener('touchend', function(event) {
			let currentTime = new Date().getTime();
			let tapLength = currentTime - lastTap;
			clearTimeout(timeout);
			if (tapLength < 900 && tapLength > 0) {
				cameraControls.moveTo( box.position.x, 1.2, box.position.z, true )
				event.preventDefault();
			} else {
			
				timeout = setTimeout(function() {
				console.log('nothing')
					clearTimeout(timeout);
				}, 500);
			}
			lastTap = currentTime;
		});
		


		window.addEventListener('touchend', touchended);

	
		function touchended(event){
          //  console.log(event);
		//	cameraControls.moveTo( box.position.x, 1.2, box.position.z, true )
			 
			
					};	

				
	  };

	  

	

	};


};

//-- Loading manager

THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {



};

THREE.DefaultLoadingManager.onLoad = function ( ) {
        percentage.style.pointerEvents = 'none';


	anime({
		targets: preloader,
		delay: 1000,
		translateY: ['0%', '-100%'],
	    easing: 'easeInOutQuint',
	});
};

THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {


	let loadingvalue = (itemsLoaded / itemsTotal) * 100;
      loadingvalue = loadingvalue.toFixed(0);
      percentage.innerText = loadingvalue + '%';
};

THREE.DefaultLoadingManager.onError = function ( url ) {

};

			let loader = new GLTFLoader();
            let floor,collider;
			loader.load('model/newgallery.gltf', function(gltf){

	            gallery = gltf.scene;

				gallery.position.y = -1;
				gallery.position.x = -1;

                scene.add(gallery);
				glasswindow = gltf.scene.getObjectByName('glass-window');
		        floor = gallery.getObjectByName('floor')
                let glassstand = gallery.getObjectByName('glass-stand');
              //  console.log(glassstand.position);
								cameraControls.colliderMeshes.push( gallery );
			});



            function render() {
                requestAnimationFrame(render);
				const time = performance.now();


				const delta = clock.getDelta();
				const elapsed = clock.getElapsedTime();
				const updated = cameraControls.update( delta );

					// composer.render();
					update();
			   renderer.render( scene, camera );

            //     console.log(camera.rotation);
                }

render();
