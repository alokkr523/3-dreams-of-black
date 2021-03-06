var SceneUtils = {

	addMesh: function ( scene, geometry, scale, px, py, pz, rx, ry, rz, material ) {

		var mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = px;
		mesh.position.y = py;
		mesh.position.z = pz;

		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;

		mesh.scale.x = scale;
		mesh.scale.y = scale;
		mesh.scale.z = scale;

		scene.addObject( mesh );

		return mesh;

	},

	addPanoramaCubeWebGL: function ( scene, size, textureCube ) {

		var shader = ShaderUtils.lib["cube"];
		shader.uniforms["tCube"].texture = textureCube;

		var material = new THREE.MeshShaderMaterial( { fragment_shader: shader.fragment_shader,
							   vertex_shader: shader.vertex_shader,
							   uniforms: shader.uniforms
							} ),

			mesh = new THREE.Mesh( new Cube( size, size, size, 1, 1, null, true ), material );

		scene.addObject( mesh );

		return mesh;

	},

	addPanoramaCube: function( scene, size, images ) {

		var materials = [], mesh;
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[0] ) } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[1] ) } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[2] ) } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[3] ) } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[4] ) } ) );
		materials.push( new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[5] ) } ) );

		mesh = new THREE.Mesh( new Cube( size, size, size, 1, 1, materials, true ), new THREE.MeshFaceMaterial() );
		scene.addObject( mesh );

		return mesh;

	},

	addPanoramaCubePlanes: function ( scene, size, images ) {


		var hsize = size/2, plane = new Plane( size, size ), pi2 = Math.PI/2, pi = Math.PI;

		SceneUtils.addMesh( scene, plane, 1,      0,     0,  -hsize,  0,      0,  0, new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[5] ) } ) );
		SceneUtils.addMesh( scene, plane, 1, -hsize,     0,       0,  0,    pi2,  0, new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[0] ) } ) );
		SceneUtils.addMesh( scene, plane, 1,  hsize,     0,       0,  0,   -pi2,  0, new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[1] ) } ) );
		SceneUtils.addMesh( scene, plane, 1,     0,  hsize,       0,  pi2,    0, pi, new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[2] ) } ) );
		SceneUtils.addMesh( scene, plane, 1,     0, -hsize,       0, -pi2,    0, pi, new THREE.MeshBasicMaterial( { map: new THREE.Texture( images[3] ) } ) );

	}

};
