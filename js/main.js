$(document).ready(function(){
    

    // MARK: - PROPERTIES ----------------------------------------------------------------------------

    	// Add date to copyright 
		var d = new Date()
		var year = d.getFullYear()
		console.log(year)
		$('#crDate').html( "<i>Copyright &#169  " + year + " Jim Peraino. All rights reserved.</i>");

    	// SET HYPERBOLOID VARIABLES

		// Tubes
		var cylRad = 0.15;
		var cylHeight = 75;
		var cylSeg = 8;

		// Circles
		var circRad = 25;
		var circPtCt = 45;
		var circ2Height = 50;
		var circ2Rot = 120 * Math.PI / 180;
		var circ2pos = 40;



    	// SET SCENE 1 - - - - - - - Scene, camera, renderer
    	var scene1 = new THREE.Scene();
		scene1.background = new THREE.Color( 0x9474cc );

		var camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera1.position.set(circ2pos/2, 70 , circ2Height/2);
		camera1.up = new THREE.Vector3(0,0,1);
		camera1.lookAt(new THREE.Vector3(circ2pos/2, 0 , circ2Height/2));


		var renderer1 = new THREE.WebGLRenderer({ antialias: true });
		renderer1.setSize( window.innerWidth, window.innerHeight);

		controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
		controls1.center.set(circ2pos/2, 0 , circ2Height/2)


		

	// MARK: - ON LOAD DO ----------------------------------------------------------------------------

		// Add WebGL scene to HTML
		$('#canvasPlaceholder').html( renderer1.domElement );

		buildHyperboloid();

		
	// MARK: - ADD GEOMETRY  ----------------------------------------------------------------------------

		function removeHyperboloid() {
			var selectedObject = scene1.getObjectByName("hyperboloid");
			// selectedObject.cylinders[0].material.dispose();
			// selectedObject.cylinders[0].geometry.dispose();

			// !!BUG!! Something is wrong here causing a memory leak? 
			for(j=0; j < selectedObject.children.length; j++) {
				for(i=0; i < selectedObject.children[j].children.length; i++) {
					selectedObject.children[j].children[i].material.dispose();
					selectedObject.children[j].children[i].geometry.dispose();
					
					scene1.remove(selectedObject.children[j].children[i]);
					selectedObject.children[j].remove(selectedObject.children[j].children[i]);
				}

				scene1.remove(selectedObject.children[j]);
				selectedObject.remove(selectedObject.children[j]);
			}

			scene1.remove(selectedObject);


		}

		function buildHyperboloid() {

			var bottom = new THREE.Object3D(); // Lower circle
			var top = new THREE.Object3D(); // Upper circle
			var connectors = new THREE.Object3D();
			var hyperboloid = new THREE.Object3D();

			// Generate points on top and bottom circles
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

				bottom.add( cylinder );
				top.add( cylinder2 );
			}

			// Transform top circle
			top.rotation.z = circ2Rot;
			top.position.x += circ2pos;

			// Draw lines for points on circles
	        scene1.updateMatrixWorld();
	        top.updateMatrixWorld();
	       	var material = new THREE.MeshBasicMaterial({color: 0xffffff});

	       	for(i=0; i < bottom.children.length; i++){
	       		// Get points from circles
	       		var pointB = bottom.children[i].position;
	       		var pointT = new THREE.Vector3();
	       		pointT.setFromMatrixPosition( top.children[i].matrixWorld);

	       		// Build connector
	       		var connector = cylinderMesh( pointB , pointT, material);
	       		
	       		// Add connectors to Scene
	       		connectors.add( connector) ;
	       	}
	       	
	       	hyperboloid.add( connectors );
	       	//hyperboloid.add( bottom );
	       	//hyperboloid.add( top );
	       	hyperboloid.name = "hyperboloid";

	       	// Add geometries to scene
			scene1.add( hyperboloid );
			
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

	// MARK: - ACTIONS ----------------------------------------------------------------------------

    	// Keep the view boundary updated
    	function onWindowResize() {
			camera1.aspect = window.innerWidth / window.innerHeight;
			camera1.updateProjectionMatrix();
			renderer1.setSize( window.innerWidth, window.innerHeight );
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

		$('#ex1').on("slide", function(slideEvt){
			circPtCt = slideEvt.value;
			removeHyperboloid();
			buildHyperboloid();
		})

		$('#ex2').on("slide", function(slideEvt2){
			rotation = slideEvt2.value * Math.PI / 180;
			circ2Rot = rotation;
			removeHyperboloid();
			buildHyperboloid();
		})

		$('#ex3').on("slide", function(slideEvt3){
			circ2pos = slideEvt3.value;
			removeHyperboloid();
			buildHyperboloid();
		})



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
		};

	// ___GEOMETRY HELPERS

		// Add cylinder mesh from Points
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


	// ___ALERTS






});