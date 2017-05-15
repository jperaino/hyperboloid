$(document).ready(function(){
    

    // MARK: - PROPERTIES ----------------------------------------------------------------------------

    	// SET HYPERBOLOID VARIABLES

		// Tubes
		var cylRad = 0.15;
		var cylHeight = 50;


		// Circles
		var circRad = 25;
		var circPtCt = 50;
		var circ2Height = cylHeight;
		var circ2Rot = 120 * Math.PI / 180;
		var circ2pos = 40;


		var bottom = new THREE.Object3D(); // Lower circle
		var top = new THREE.Object3D(); // Upper circle
		var cylinders = new THREE.Object3D();
		var endPts = new THREE.Object3D();
		var hyperboloid = new THREE.Object3D();

		// Stairs
		var stairLength = 33;

		// Memory
		var memoryCounter = 0;

		var material = new THREE.MeshBasicMaterial({color: 0xffffff});
		var material2 = new THREE.MeshBasicMaterial({color: 0x4d2b90});


    	// SET SCENE 1 - - - - - - - Scene, camera, renderer
    	var scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x9474cc );

		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(circ2pos/2, 70 , circ2Height/2);
		camera.up = new THREE.Vector3(0,0,1);
		camera.lookAt(new THREE.Vector3(circ2pos/2, 0 , circ2Height/2));


		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight);

		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(circ2pos/2, 0 , circ2Height/2)


		

	// MARK: - ON LOAD DO ----------------------------------------------------------------------------

		// Add WebGL scene to HTML
		$('#canvasPlaceholder').html( renderer.domElement );

		buildHyperboloid();

		
	// MARK: - ADD GEOMETRY  ----------------------------------------------------------------------------
		 function updateHyperboloid() {
		 	var hyperOrig = scene.getObjectByName("hyperboloid");

			// Transform top circle
			top.rotation.z = circ2Rot;
			top.position.x = circ2pos;

			scene.updateMatrixWorld();
	        top.updateMatrixWorld();		

			// Update cylinders
			for(i=0; i < circPtCt; i++) {
				var cyl = hyperOrig.children[0].children[i];

				// get target point
				var focalPt = new THREE.Vector3();
				focalPt.setFromMatrixPosition( top.children[i].matrixWorld );

				// Reorient cylinder to target point
				cyl.lookAt(focalPt);

				var scale = cyl.position.distanceTo(focalPt)/cylHeight;

				// Scale cylinder to target point
				cyl.scale.z = scale;
				//cyl.pos.distanceTo(focalPt);

			}

			//render();

		}


		function buildHyperboloid() {
			
			// Generate points on top and bottom circles
			for(i=0; i < circPtCt; i++) {
				
				// Find start points
				var degrees = ((360/circPtCt)*i);
				var radians = degrees * Math.PI / 180;

				var posX = Math.cos(radians) * circRad;
				var posY = Math.sin(radians) * circRad;

				// Build cylinder
				var geometry = new THREE.CylinderBufferGeometry(cylRad, cylRad, cylHeight);
				var cylinder = new THREE.Mesh(geometry, material);
				cylinder.geometry.rotateX( Math.PI / 2);
				cylinder.geometry.translate(0,0, cylHeight/2 );
				
				// Move cylinder to position
				cylinder.position.x = posX;
				cylinder.position.y = posY;

				var topPointPoint = new THREE.SphereBufferGeometry(.5);
				var topPoint = new THREE.Mesh(topPointPoint, material);
				topPoint.position.x = posX;
				topPoint.position.y = posY;
				topPoint.position.z = cylHeight;

				cylinder.lookAt(topPoint.position);

				// var geo2 = new THREE.SphereBufferGeometry(1);
				// var sphere = new THREE.Mesh(geo2, material);
				// sphere.position.x = posX;
				// sphere.position.y = posY;

				top.add(topPoint);
				cylinders.add (cylinder);
				//cylinders.add (sphere);

			}


			//scene.add( top );

	       	hyperboloid.add( cylinders );
	       	hyperboloid.name = "hyperboloid";

	       	// Add geometries to scene
			scene.add( hyperboloid );
			
			// render the scene
			render();
		};
	
	// MARK: - EVENT LISTENERS --------------------------------------------------------------------

		// Listen for window resize
		window.addEventListener( 'resize', onWindowResize, false );

		// Hide Scroll icon on scroll
		$(window).scroll(function(){
			$("#scrollNotice").css("opacity", 1 - $(window).scrollTop() / 50);
		});


		$(".fadeJ").fadeIn(750)
		

	// MARK: - ACTIONS ----------------------------------------------------------------------------

    	// Keep the view boundary updated
    	function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		// With JQuery
		$('#ex1').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

		$('#ex2').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

		$('#ex3').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

		$('#ex4').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

		$('#ex1').on("slide", function(slideEvt){
			circPtCt = slideEvt.value;
			updateHyperboloid();
		})

		$('#ex2').on("slide", function(slideEvt2){
			rotation = slideEvt2.value * Math.PI / 180;
			circ2Rot = rotation;
			updateHyperboloid();
		})

		$('#ex3').on("slide", function(slideEvt3){
			circ2pos = slideEvt3.value;
			updateHyperboloid();
		})

		$('#ex4').on("slide", function(slideEvt4){
			stairLength = slideEvt4.value;
			updateHyperboloid();
		})


	// MARK: - METHODS ----------------------------------------------------------------------------


	// ___RENDER

		// Create the render loop
		function render() {
			requestAnimationFrame( render );

				// Render scene
				renderer.render( scene, camera);
				controls.update();
		};

	// ___GEOMETRY HELPERS

        // Add sphere mesh at stair lenght points
  //       function getPointInBetweenByLength(pointA, pointB, length) {
    
		//     var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
  //   		finalPt = pointA.clone().add(dir);

		//     var geometry = new THREE.SphereBufferGeometry(.5);
		    
		//     var endSphere = new THREE.Mesh(geometry, material2);
		//     endSphere.position.x = finalPt.x;
		//     endSphere.position.y = finalPt.y;
		//     endSphere.position.z = finalPt.z;
		//     return endSphere;
		// }

	// ___ALERTS






});