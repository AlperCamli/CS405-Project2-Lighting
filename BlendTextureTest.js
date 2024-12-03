	/**
 * @Instructions
 * @task1 : Complete the setTexture function to handle non power of 2 sized textures
 * @task2 : Implement the lighting by modifying the fragment shader, constructor,
 *      @task3:
 *      @task4:
 * setMesh, draw, setAmbientLight, setSpecularLight and enableLighting functions
 */


function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {

	var trans1 = [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);
	
	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);
	
	var rotatx = [
	1, 0, 0, 0,
	0, rotatXCos, -rotatXSin, 0,
	0, rotatXSin, rotatXCos, 0,
	0, 0, 0, 1
	]
	
	var rotaty = [
	rotatYCos, 0, -rotatYSin, 0,
	0, 1, 0, 0,
	rotatYSin, 0, rotatYCos, 0,
	0, 0, 0, 1
	]
	
	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);
	
	return mvp;
	}
	
	
	class MeshDrawer {
		// The constructor is a good place for taking care of the necessary initializations.
		constructor() {
			this.prog = InitShaderProgram(meshVS, meshFS);
			this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
			this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');
			
			this.colorLoc = gl.getUniformLocation(this.prog, 'color');
			
			this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
			this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');
			
			
			this.vertbuffer = gl.createBuffer();
			this.texbuffer = gl.createBuffer();
			
			this.numTriangles = 0;
			
			/**
			* @Task2 : You should initialize the required variables for lighting here NP
			*/
			this.normalBuffer = gl.createBuffer();
			this.normalLoc = gl.getAttribLocation(this.prog, "normal"); //test works; normal
			this.lightPos = gl.getUniformLocation(this.prog, 'lightPos');
			this.ambientIntensity = gl.getUniformLocation(this.prog, 'ambient');
			this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');
			
			//specular light
			this.viewPositionLocation = gl.getUniformLocation(this.prog, "uViewPosition");
			this.MetallicityLocation = gl.getUniformLocation(this.prog, "uMetallicity");
			this.specularLightIntensity = gl.getUniformLocation(this.prog, "specularIntensity");


			
		
		}
		
		setMesh(vertPos, texCoords, normalCoords) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
			
			// update texture coordinates
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
			
			this.numTriangles = vertPos.length / 3;
			
			/**
			* @Task2 : You should update the rest of this function to handle the lighting DONE!
			*/

			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);

		
		}
		
		// This method is called to draw the triangular mesh.
		// The argument is the transformation matrix, the same matrix returned
		// by the GetModelViewProjection function above.
		
		draw(trans) {
			gl.useProgram(this.prog);
			
			gl.uniformMatrix4fv(this.mvpLoc, false, trans);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
			gl.enableVertexAttribArray(this.vertPosLoc);
			gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
			gl.enableVertexAttribArray(this.texCoordLoc);
			gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
			
			/**
			* @Task2 : You should update this function to handle the lighting PROBLEM
			
			///////////////////////////////
			*/
			let viewPosition = [0.0, 0.0, -1.0];
			const lightColor = [1.0, 1.0, 1.0];
			const lightDirection = [-lightX, -lightY, -1.0];
			const normalizedLightDirection = normalize(lightDirection);
			let metallicity = 32;
			
			// Normals
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
			gl.enableVertexAttribArray(this.normalLoc);
			gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
			
			// Pass lighting uniforms
			gl.uniform3fv(this.lightPos, normalizedLightDirection); //works
			gl.uniform3fv(this.colorLoc, lightColor); // Light color as vec3
			gl.uniform1f(this.ambientIntensity, this.ambientIntensityValue);
			gl.uniform1i(this.enableLightingLoc, this.lightingEnabled ? 1 : 0); // Lighting toggle
			
			//specular light
			gl.uniform3fv(this.viewPositionLocation, viewPosition); 
       		gl.uniform1f(this.specularLightIntensity, this.specularIntensity); 
			gl.uniform1f(this.MetallicityLocation, metallicity); 
			//gl.uniformMatrix4fv(this.mvpLoc, false, GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY));
			
			
			
			updateLightPos();
			
			
			gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
			
		
		}
		
		// This method is called to set the texture of the mesh.
		// The argument is an HTML IMG element containing the texture data.
		setTexture(img) {
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);

			//const texture2 = gl.createTexture();//4
			//gl.bindTexture(gl.TEXTURE_2D, texture2);//4
			
			// You can set the texture image data using the following command.
			gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img);
			
			// Set texture parameters
			if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				//console.error("Task 1: Non power of 2, you should implement this part to accept non power of 2 sized textures");
				/**
				* @Task1 : You should implement this part to accept non power of 2 sized textures
				*/

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			
			}
			
			gl.useProgram(this.prog);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			const sampler = gl.getUniformLocation(this.prog, 'tex');
			gl.uniform1i(sampler, 0);
		}


		setTexture2(img) {
			const texture2 = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture2);

			
			// You can set the texture image data using the following command.
			gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img);
			
			// Set texture parameters
			if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				//console.error("Task 1: Non power of 2, you should implement this part to accept non power of 2 sized textures");
				/**
				* @Task1 : You should implement this part to accept non power of 2 sized textures
				*/

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			
			}
			
			gl.useProgram(this.prog);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			const sampler2 = gl.getUniformLocation(this.prog, 'tex2');
			gl.uniform1i(sampler2, 1);//changed to 1 from 0
		}
			
		showTexture(show) {
			gl.useProgram(this.prog);
			gl.uniform1i(this.showTexLoc, show);
		}
		
		enableLighting(show) {
			//console.error("Task 2: You should implement the lighting and implement this function ");
			/**
			* @Task2 : You should implement the lighting and implement this function 
			*/
			this.lightingEnabled = show;
			updateLightPos() // Default light position
			this.setAmbientLight(0.5);
			this.setSpecularLight(0.5);
		
		
		}
		
		setAmbientLight(ambient) {
			//console.error("Task 2: You should implement the lighting and implement this function ");
			/**
			* @Task2 : You should implement the lighting and implement this function 
			*/
			this.ambientIntensityValue = ambient;
			
		}

		setSpecularLight(intensity) {
			this.specularIntensity = intensity;
		}
	}
	
	
	function isPowerOf2(value) {
		return (value & (value - 1)) == 0;
	}
	
	function normalize(v, dst) {
		dst = dst || new Float32Array(3);
		var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		// make sure we don't divide by 0.
		if (length > 0.00001) {
			dst[0] = v[0] / length;
			dst[1] = v[1] / length;
			dst[2] = v[2] / length;
		}
		return dst;
	}

	function normalizeVector(v) {
		let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		if (length > 0.00001) {
			return [v[0] / length, v[1] / length, v[2] / length];
		} else {
			return [0, 0, 0];
		}
	}
	
	// Vertex shader source code
	const meshVS = `
	attribute vec3 pos;
	attribute vec2 texCoord;
	attribute vec3 normal;
	
	uniform mat4 mvp;
	
	varying vec2 v_texCoord;
	varying vec3 v_normal;
	
	void main()
	{
		v_texCoord = texCoord;
		v_normal = normal;
		
		gl_Position = mvp * vec4(pos,1);
	}`;
	
	// Fragment shader source code
	/**
	 * @Task2 : You should update the fragment shader to handle the lighting
	 */
	const meshFS = `
	precision mediump float;
	
	uniform bool showTex;
	uniform bool enableLighting;

	uniform sampler2D tex;
	uniform sampler2D tex2;

	uniform vec3 color;
	uniform vec3 lightPos;
	uniform float ambient;
	

	varying vec2 v_texCoord;
	varying vec3 v_normal;

	//specular
	uniform vec3 uViewPosition;
	uniform float uMetallicity;
	uniform float specularIntensity;
	
	void main()
	{

		
		if(showTex && enableLighting){
		// UPDATE THIS PART TO HANDLE LIGHTING
		//gl_FragColor = texture2D(tex, v_texCoord);
		
			vec3 normal = normalize(v_normal);
			vec3 lightDir = normalize(lightPos);

			vec3 viewDir = normalize(uViewPosition);//check

			//diffuse light
			float light = max(dot(normal, lightDir), 0.0);
			vec3 diffuse = color * (light * ambient); //color light needed
			
			//ambient lighting
			vec3 ambientLoc = lightDir;
			
			//specular light
			vec3 reflectDir = reflect(-lightDir, normal);
			float spec = (pow(max(dot(viewDir, reflectDir), 0.0), uMetallicity)) * specularIntensity;
			vec3 specular = color * spec;
			
			//final color rendering

			//texture mix
			vec4 textureColor = texture2D(tex, v_texCoord);
			vec4 textureColor2 = texture2D(tex2, v_texCoord);
			float blendFactor = 0.5;
			vec4 blendedTexture = mix(tex, tex2, blendFactor); //blend factor = 0.5


			//vec3 finalColor = (color + diffuse + specular) * textureColor.rgb;
			//gl_FragColor = vec4(finalColor, textureColor.a);
			vec3 finalColor = (color + diffuse + specular) * blendedTexture.rgb;
			gl_FragColor = vec4(finalColor, blendedTexture.a);
			
		}
		else if(showTex){
			gl_FragColor = texture2D(tex, v_texCoord);
		}
		else{
			gl_FragColor =  vec4(1.0, 0, 0, 1.0);
		}
	
	
	
	}`;
	
	
	// Light direction parameters for Task 2
	var lightX = 1;
	var lightY = 1;

	const keys = {};
	function updateLightPos() {
	const translationSpeed = 0.1;
	if (keys['ArrowUp']) lightY -= translationSpeed;	
	if (keys['ArrowDown']) lightY += translationSpeed;
	if (keys['ArrowRight']) lightX -= translationSpeed;
	if (keys['ArrowLeft']) lightX += translationSpeed;
	}
	///////////////////////////////////////////////////////////////////////////////////