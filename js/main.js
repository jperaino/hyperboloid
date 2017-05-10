$(document).ready(function(){
    

    // MARK: - PROPERTIES ----------------------------------------------------------------------------

    	// SET SCENE 1 - - - - - - - Scene, camera, renderer
    	var scene1 = new THREE.Scene();
		scene1.background = new THREE.Color( 0x5d99c6 );

		var camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera1.position.set(0,0,100);

		var renderer1 = new THREE.WebGLRenderer({ antialias: true });
		renderer1.setSize( window.innerWidth, window.innerHeight);

		var cylRad = 0.25;
		var cylHeight = 75;
		var cylSeg = 8;

		var circRad = 25;
		var circPtCt = 30;

	// MARK: - ON LOAD DO ----------------------------------------------------------------------------

		// Add WebGL scene to HTML
		$('#canvasPlaceholder').html( renderer1.domElement );

		controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);


		for(i=0; i < circPtCt; i++) {

			// Add a cylinder
			var geometry = new THREE.CylinderGeometry(cylRad, cylRad, cylHeight, cylSeg);
			var material = new THREE.MeshBasicMaterial({color: 0xffffff});
			var cylinder = new THREE.Mesh(geometry, material);
			
			var degrees = ((360/circPtCt)*i);
			var radians = degrees * Math.PI / 180;

			var posX = Math.cos(radians) * circRad;
			var posY = Math.sin(radians) * circRad;

			cylinder.position.setX(posX);
			cylinder.position.setZ(posY);

			scene1.add( cylinder );

		}

		// render the scene
		render();
	
	// MARK: - EVENT LISTENERS --------------------------------------------------------------------

		// Listen for window resize
		window.addEventListener( 'resize', onWindowResize, false );

		// Hide Scroll icon on scroll
		$(window).scroll(function(){
			$("#scrollNotice").css("opacity", 1 - $(window).scrollTop() / 50);
		});

	// MARK: - ACTIONS ----------------------------------------------------------------------------

    	// Keep the view boundary updated
    	function onWindowResize() {
			camera1.aspect = window.innerWidth / window.innerHeight;
			camera1.updateProjectionMatrix();
			renderer1.setSize( window.innerWidth, window.innerHeight );

			camera2.aspect = window.innerWidth / window.innerHeight;
			camera2.updateProjectionMatrix();
			renderer2.setSize( window.innerWidth, window.innerHeight );
		}

	// MARK: - METHODS ----------------------------------------------------------------------------


	// ___RENDER

		// Create the render loop
		function render() {
			requestAnimationFrame( render );

				// Set cube rotation
				// cylinder.rotation.x += 0.0003
				// cylinder.rotation.y += 0.0003
				// cylinder.rotation.z += 0.0003

				// Render scene
				renderer1.render( scene1, camera1);
				controls1.update();
		}




	// ___ALERTS


    // ___GEOMETRY 





});