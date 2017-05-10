$(document).ready(function(){
    

    // MARK: - PROPERTIES ----------------------------------------------------------------------------

    	// SET SCENE 1 - - - - - - - Scene, camera, renderer
    	var scene1 = new THREE.Scene();
		scene1.background = new THREE.Color( 0x5d99c6 );

		var camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera1.position.set(0,100,50);
		camera1.up = new THREE.Vector3(0,0,1);

		var renderer1 = new THREE.WebGLRenderer({ antialias: true });
		renderer1.setSize( window.innerWidth, window.innerHeight);

		var cylRad = 0.25;
		var cylHeight = 75;
		var cylSeg = 8;

		var circRad = 25;
		var circPtCt = 30;


		var circ2Height = 50;

	// MARK: - ON LOAD DO ----------------------------------------------------------------------------

		// Add WebGL scene to HTML
		$('#canvasPlaceholder').html( renderer1.domElement );

		controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);

		var bottom = new THREE.Object3D();
		var top = new THREE.Object3D();

		for(i=0; i < circPtCt; i++) {

			// Add a cylinder
			// var geometry = new THREE.CylinderGeometry(cylRad, cylRad, cylHeight, cylSeg);
			var geometry = new THREE.SphereGeometry(.5);
			var material = new THREE.MeshBasicMaterial({color: 0xffffff});
			var cylinder = new THREE.Mesh(geometry, material);
			
			var degrees = ((360/circPtCt)*i);
			var radians = degrees * Math.PI / 180;

			var posX = Math.cos(radians) * circRad;
			var posY = Math.sin(radians) * circRad;

			cylinder.position.setX(posX);
			cylinder.position.setY(posY);

			var cylinder2 = new THREE.Mesh(geometry, material);

			cylinder2.position.setX(posX);
			cylinder2.position.setY(posY);
			cylinder2.position.setZ(circ2Height);

			console.log(cylinder.position);

			bottom.add( cylinder );
			top.add( cylinder2 );

			
			//scene1.add( cylinder2 );

			// var cylinder2 = cylinder;
			// cylinder2.position.setZ(circ2Height);

			// scene1.add( cylinder2 );

		}

		// console.log(bottom.children.length);

		for(i=0; i < bottom.children.length; i++) {
			// console.log(bottom.children[i].position.x);
		}

		top.rotation.z = Math.PI/2;

		
		function cylinderMesh(pointX, pointY, material) {
            var direction = new THREE.Vector3().subVectors(pointY, pointX);
            var orientation = new THREE.Matrix4();
            orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
            orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
                0, 0, 1, 0,
                0, -1, 0, 0,
                0, 0, 0, 1));
            var edgeGeometry = new THREE.CylinderGeometry(cylRad, cylRad, direction.length(), 8, 1);
            var edge = new THREE.Mesh(edgeGeometry, material);
            edge.applyMatrix(orientation);
            // position based on midpoints - there may be a better solution than this
            edge.position.x = (pointY.x + pointX.x) / 2;
            edge.position.y = (pointY.y + pointX.y) / 2;
            edge.position.z = (pointY.z + pointX.z) / 2;
            return edge;
        }

        scene1.updateMatrixWorld();
        top.updateMatrixWorld();
       	var material = new THREE.MeshBasicMaterial({color: 0xffffff});

       	for(i=0; i < bottom.children.length; i++){

       		console.log("running");

       		var pointB = bottom.children[i].position;
       		var pointT = new THREE.Vector3();

       		pointT.setFromMatrixPosition( top.children[i].matrixWorld);

       		var connector = cylinderMesh( pointB , pointT, material);
       		scene1.add( connector) ;

       	}
       	

       	


 

		scene1.add( bottom );
		scene1.add( top );
		
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
				// bottom.rotation.x += 0.0003
				// bottom.rotation.y += 0.0003
				// bottom.rotation.z += 0.0003

				// Render scene
				renderer1.render( scene1, camera1);
				controls1.update();
		}




	// ___ALERTS


    // ___GEOMETRY 





});