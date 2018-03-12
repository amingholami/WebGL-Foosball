// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 4;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 2, ballDirY = 2, ballSpeed = 2.1;

var score1 = 0, score2 = 0;
var maxScore = 5;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.2;

var can_move = false;
var camera_location = 1;
// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

function setup()
{
	// update the board to reflect the max score for match win
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
	
	// now reset player and opponent scores
	score1 = 0;
	score2 = 0;
	
	// set up all the 3D objects in the scene	
	init();
	
	// and let's get cracking!
	animate();
}

function animate()
{	

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	
	pause();
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
	stats.update();
	rotate_daste();
	return_daste();
}

function init()
{
	// set the scene size
	var WIDTH = 960,
	  HEIGHT = 540;

	// set some camera attributes
	var VIEW_ANGLE = 75,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");
	var stats_c = document.createElement("stat");
	document.body.appendChild( stats_c );

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	scene.add(camera);
	camera.rotation.z = (-180) * Math.PI/180;
	camera.position.z = 350;
	
	renderer.setSize(WIDTH, HEIGHT);

	c.appendChild(renderer.domElement);
	

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats_c.appendChild( stats.domElement );

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});
	var paddle1MaterialGhost =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0,
		  transparent: true,
		  opacity:0
		});
	// create the plane's material	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFFFFFF,
		  ambient: 0xFFFFFF,
		  emissive: 0x000000,
		  map: THREE.ImageUtils.loadTexture('bg/planeMaterial_bg.png')
		});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x111111
		});
	// create the pillar's material
	var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x534d0d
		});
	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFFFFFF
		});
		
	var CylinderMaterial =
	  new THREE.MeshPhongMaterial(
		{
		  color: 0xFFFFFF,
		  ambient: 0xFFFFFF,
		  emissive: 0x000000,
		  specular: 0x111111,
		  shininess: 30,
		});
		
		
		
		
		
	// create the playing surface plane
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight, planeQuality, planeQuality),  planeMaterial);
	scene.add(plane);	
	plane.receiveShadow = true;	
	
	
	
	
	var table = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, planeHeight + 15, 20, planeQuality, planeQuality, 1), tableMaterial);
	table.position.z = -11;
	scene.add(table);
	table.receiveShadow = true;	
	
	
	var table_top = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, 15, planeWidth * .18, planeQuality, planeQuality, 1), tableMaterial);
	table_top.position.y = planeHeight/2 + 15/2;
	table_top.position.z = planeWidth * .09 - 16;
	scene.add(table_top);
	
	var table_bottom = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, 15, planeWidth * .18, planeQuality, planeQuality, 1), tableMaterial);
	table_bottom.position.y = -(planeHeight/2 + 15/2);
	table_bottom.position.z = planeWidth * .09 - 16;
	scene.add(table_bottom);
	
	
	var table_right__bottom = new THREE.Mesh(	new THREE.CubeGeometry(15, 15 + planeHeight/4 +4, planeWidth * .12, planeQuality, planeQuality, 1), tableMaterial);
	table_right__bottom.position.x = (planeWidth/2 + 15/2);
	table_right__bottom.position.y = -(planeHeight/2 -15  );
	table_right__bottom.position.z = planeWidth * .06 - 16;
	scene.add(table_right__bottom);
	
	var table_right__top = new THREE.Mesh(	new THREE.CubeGeometry(15, 15 + planeHeight/4 +4, planeWidth * .12, planeQuality, planeQuality, 1), tableMaterial);
	table_right__top.position.x = (planeWidth/2 + 15/2);
	table_right__top.position.y = (planeHeight/2 -15  );
	table_right__top.position.z = planeWidth * .06 - 16;
	scene.add(table_right__top);
	
	var table_right__middle = new THREE.Mesh(	new THREE.CubeGeometry(15, 15*2 + planeHeight , planeWidth * .06, planeQuality, planeQuality, 1), tableMaterial);
	table_right__middle.position.x = (planeWidth/2 + 15/2);
	table_right__middle.position.z = planeWidth * .12 - 16/2 + 4;
	scene.add(table_right__middle);
	
	
	
	
	var table_left__bottom = new THREE.Mesh(	new THREE.CubeGeometry(10, 15 + planeHeight/4 , planeWidth * .12, planeQuality, planeQuality, 1), tableMaterial);
	table_left__bottom.position.x = -(planeWidth/2 + 15/2);
	table_left__bottom.position.y = -(planeHeight/2  - 17.5 );
	table_left__bottom.position.z = planeWidth * .06 - 16;
	scene.add(table_left__bottom);
	
	var table_left__top = new THREE.Mesh(	new THREE.CubeGeometry(10, 15 + planeHeight/4 +4, planeWidth * .12, planeQuality, planeQuality, 1), tableMaterial);
	table_left__top.position.x = -(planeWidth/2 + 15/2);
	table_left__top.position.y = (planeHeight/2 - 19.5  );
	table_left__top.position.z = planeWidth * .06 - 16;
	scene.add(table_left__top);
	
	var table_left__middle = new THREE.Mesh(	new THREE.CubeGeometry(10, 15*2 + planeHeight , planeWidth * .06, planeQuality, planeQuality, 1), tableMaterial);
	table_left__middle.position.x = -(planeWidth/2 + 15/2);
	table_left__middle.position.z = planeWidth * .12 - 16/2 + 4;
	scene.add(table_left__middle);
		
	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 10,
		segments = 6,
		rings = 6;
		
	// // create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
//		  color: 0xD43001,
		  color: 0xFFFFFF,
		  ambient: 0xFFFFFF,
		  emissive: 0x000000,
		  map: THREE.ImageUtils.loadTexture('bg/soccer_ball.jpg')
		});
		
		
		/************* 		BALL	********/
		
	// Create a ball with sphere geometry
	ball = new THREE.Mesh(
	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),
	  sphereMaterial);

	// // add the sphere to the scene
	scene.add(ball);
		
	ball.position.x = 0;
	ball.position.y = 0;
	// set ball above the table surface
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	
	
	daste1 = new THREE.Object3D();
	scene.add(daste1);
	daste2 = new THREE.Object3D();
	scene.add(daste2);
	
	

	
	daste1.rotation.y = 45 * Math.PI * 180;
	/*********		paddle	*********/
	
	
	// // set up the paddle vars
	paddleWidth = 10;
	paddleHeight = 25;
	paddleDepth = 20;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1MaterialGhost);

	// // add the sphere to the scene
	scene.add(paddle1);
	
	paddle1Daste = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1Material);

	// // add the sphere to the scene
	daste1.add(paddle1Daste);
	paddle1Daste.receiveShadow = true;
    paddle1Daste.castShadow = true;


	
	paddle2 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1MaterialGhost);
	  
	// // add the sphere to the scene
	scene.add(paddle2);
	
	paddle2Daste = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle2Material);
	  
	// // add the sphere to the scene
	daste2.add(paddle2Daste);
	paddle2Daste.receiveShadow = true;
    paddle2Daste.castShadow = true;
	
	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth + 50;
	paddle2.position.x = fieldWidth/2 - paddleWidth - 50;
	
	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
	
	// set paddles on each side of the table
	daste1.position.x = -fieldWidth/2 + paddleWidth + 50;
	daste2.position.x = fieldWidth/2 - paddleWidth - 50;
	
	paddle1Daste.position.x = 0;
	paddle2Daste.position.x = 0;
	
	// lift paddles over playing surface
	var cylinderRadius = 2.5;
	daste1.position.z = paddleDepth + (cylinderRadius * 2);
	daste2.position.z = paddleDepth + (cylinderRadius * 2);
	
	paddle1Daste.position.z -= (cylinderRadius * 2);
	paddle2Daste.position.z -= (cylinderRadius * 2);
	
	
	// white cylinder
	
	var CylinderGeometry =	new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, planeHeight * 2, planeQuality);
	var cylinder1 = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
	cylinder1.position.set(paddle1Daste.position.x, paddle1Daste.position.y, 0 );
	daste1.add(cylinder1);
	
	var cylinder2 = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
	cylinder2.position.set(paddle2Daste.position.x, paddle2Daste.position.y, 0 );
	daste2.add(cylinder2);
	
	
	// head of paddles
	var CylinderGeometry =	new THREE.SphereGeometry(paddleWidth / 1.5, 32, 16, 0, 2* Math.PI, 0, Math.PI);
	var sphere1 = new THREE.Mesh(CylinderGeometry, paddle1Material);
	sphere1.position.set(paddle1Daste.position.x, paddle1Daste.position.y, paddleWidth / 1.5 * 2 - (cylinderRadius * 2));
	daste1.add(sphere1);
	
	var sphere2 = new THREE.Mesh(CylinderGeometry, paddle2Material);
	sphere2.position.set(paddle2Daste.position.x, paddle2Daste.position.y, paddleWidth / 1.5 * 2 - (cylinderRadius * 2));
	daste2.add(sphere2);
	
	
	// big daste
	var CylinderGeometry =	new THREE.CylinderGeometry(cylinderRadius*5, cylinderRadius*5, planeHeight/3, planeQuality);
	var cylinder1_daste = new THREE.Mesh(CylinderGeometry, paddle1Material);
	cylinder1_daste.position.set(cylinder1.position.x, (planeHeight + cylinderRadius*5 + 20), cylinder1.position.z);
	daste1.add(cylinder1_daste);
	
	var cylinder2_daste = new THREE.Mesh(CylinderGeometry, paddle2Material);
	cylinder2_daste.position.set(cylinder2.position.x, -(planeHeight + cylinderRadius*5 + 20), cylinder2.position.z);
	daste2.add(cylinder2_daste);
	
	
	// big micro daste 
	var CylinderGeometry =	new THREE.CylinderGeometry(cylinderRadius*8, cylinderRadius*8, planeHeight/60, planeQuality);
	var cylinder1_daste_micro = new THREE.Mesh(CylinderGeometry, paddle1Material);
	cylinder1_daste_micro.position.set(cylinder1.position.x, (planeHeight + cylinderRadius*5 - 15), cylinder1.position.z);
	daste1.add(cylinder1_daste_micro);
	
	var cylinder2_daste_micro = new THREE.Mesh(CylinderGeometry, paddle2Material);
	cylinder2_daste_micro.position.set(cylinder2.position.x, -(planeHeight + cylinderRadius*5 - 15), cylinder2.position.z);
	daste2.add(cylinder2_daste_micro);
	
	
	
    cylinder1.castShadow = true;
    cylinder1_daste_micro.castShadow = true;
	cylinder1_daste.castShadow = true;
	sphere1.castShadow = true;
	
	cylinder2.castShadow = true;
    cylinder2_daste_micro.castShadow = true;
	cylinder2_daste.castShadow = true;
	sphere2.castShadow = true;
		

	
	// finally we finish by adding a ground plane
	// to show off pretty shadows
	var ground = new THREE.Mesh(
	  new THREE.CubeGeometry(5000, 2000, 3, 1, 1, 1), groundMaterial);
	  
    // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -100;	
	scene.add(ground);		
	
	
	/*************		LIGHTS		***************/
		
	// // create a point light
	pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 0;
	pointLight.intensity = .5;
	pointLight.distance = 1000;
	// add to the scene
	scene.add(pointLight);
	
	pointLight2 =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight2.position.x = 1000;
	pointLight2.position.y = 0;
	pointLight2.position.z = 10000;
	pointLight2.intensity = .5;
	pointLight2.distance = 100000;
	// add to the scene
	scene.add(pointLight2);
		
	// add a spot light
	// this is important for casting shadows
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;	
}




// Handles camera and lighting logic
function cameraPhysics()
{
	// we can easily notice shadows if we dynamically move lights during the game
	spotLight.position.x = ball.position.x;
	spotLight.position.y = ball.position.y;
	spotLight.position.z = ball.position.z + 600;
	
	

	// rotate to face towards the opponent
	switch (camera_location){
		case 0:
			
			camera.position.x = -0.01 * (ball.position.y) * Math.PI/180;

			camera.position.y += (paddle1.position.y - camera.position.y) * .2;
			if(camera.position.z < 350)
			camera.position.z += 5;
			
			camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
			if(camera.rotation.y < 0)
			camera.rotation.y += .01 * Math.PI/180;
			camera.rotation.z = (-180) * Math.PI/180;
		break;
		case 1:
			// move to behind the player's paddle
			if(camera.position.x >= paddle1.position.x - 150)
				camera.position.x -= 10;
			camera.position.y += (paddle1.position.y - camera.position.y) * .2;
			if(camera.position.z > paddle1.position.z + 210)
				camera.position.z -=(paddle1.position.z + 200)/70;
			else
			camera.position.z = paddle1.position.z + 200 + 0.1 * ( paddle1.position.x - ball.position.x );
//			document.getElementById("pause").innerHTML = camera.position.z;
			
			camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
			if(camera.rotation.y >= -45 * Math.PI/180)
				camera.rotation.y += -2 * Math.PI/180;
			if(camera.rotation.z <= (-90) * Math.PI/180)
				camera.rotation.z += 2 * Math.PI/180;
		break;
		
		case 2:
			if(camera.position.x < paddle1.position.x /2 + 0.1 * ( paddle1.position.x - ball.position.x )-5)
				camera.position.x +=  10;
			else
				camera.position.x = paddle1.position.x /2 + 0.1 * ( paddle1.position.x - ball.position.x );
			if(camera.position.y <= fieldHeight/2 - 50)
				camera.position.y += 10;
			if(camera.position.z >= paddle1.position.z + 240)
				camera.position.z -= 10;
			if(camera.rotation.x > -10 * Math.PI/180)
				camera.rotation.x += -.2 * Math.PI/180;
			if(camera.rotation.y < -10 * Math.PI)
				camera.rotation.y += 2 * Math.PI;
			else
			 camera.rotation.y = -0.01 * (ball.position.x) * Math.PI/180;
			if(camera.rotation.z > (-180) * Math.PI/180)
				camera.rotation.z += -2 * Math.PI/180;

		break;	
	}
}




function ballPhysics()
{
	if(can_move){
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -fieldWidth/2)
	{	
		if ((ball.position.y >= -fieldHeight/4 + 10) && (ball.position.y <= fieldHeight/4 - 10)){
			// CPU scores
			score2++;
			// update scoreboard HTML
			document.getElementById("scores").innerHTML = "<span class='red'>" + score2 + "</span>-<span class='blue'>" + score1 + "</span>";
			// reset ball to center
			resetBall(2);
			matchScoreCheck();	
		}else{
			ballDirX = -ballDirX;
			ball.rotation.x = -ball.rotation.x;
		}
	}
	
	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= fieldWidth/2)
	{	
		if ((ball.position.y >= -fieldHeight/4 + 10) && (ball.position.y <= fieldHeight/4 - 10)){
			// Player scores
			score1++;
			// update scoreboard HTML
			document.getElementById("scores").innerHTML = "<span class='red'>" + score2 + "</span>-<span class='blue'>" + score1 + "</span>";
			// reset ball to center
			resetBall(1);
			matchScoreCheck();	
		}else{
			ballDirX = -ballDirX;
			ball.rotation.x = -ball.rotation.x;
		}
	}
	
	// if ball goes off the top side (side of table)
	if (ball.position.y <= -fieldHeight/2 + 10 )
	{
		ballDirY = -ballDirY;
		ball.rotation.y = -ball.rotation.y;
	}	
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= fieldHeight/2 - 10)
	{
		ballDirY = -ballDirY;
		ball.rotation.y = -ball.rotation.y;
	}
		
	
		// update ball position over time
		ball.position.x += ballDirX * ballSpeed;
		ball.position.y += ballDirY * ballSpeed;
		
		if(ball.rotation.y < 0)
		ball.rotation.y -= ballSpeed * 0.075;
		else
		ball.rotation.y += ballSpeed * 0.075;
		
		if(ball.rotation.x < 0)
		ball.rotation.X -= ballSpeed * 0.075;
		else
		ball.rotation.X += ballSpeed * 0.075;
	}
	// limit ball's y-speed to 2x the x-speed
	// this is so the ball doesn't speed from left to right super fast
	if (ballDirY > ballSpeed * 2.1)
	{
		ballDirY = ballSpeed * 2.1;
		ball.rotation.x = ballSpeed * 0.1;
		ball.rotation.y = ballSpeed * 0.1;
	}
	else if (ballDirY < -ballSpeed * 2.1)
	{
		ballDirY = -ballSpeed * 2.1;
		ball.rotation.x = -ballSpeed * 0.1;
		ball.rotation.y = -ballSpeed * 0.1;
	}
	
}


/**********************************************************

				MOVEMENT OF THE PADDLES

***********************************************************/

// Handles CPU paddle movement and logic
function opponentPaddleMovement()
{
	if(can_move){
		// Lerp towards the ball on the y plane
		paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
		
		// in case the Lerp function produces a value above max paddle speed, we clamp it
		if (Math.abs(paddle2DirY) <= paddleSpeed)
		{	
			paddle2.position.y += paddle2DirY;
			daste2.position.y += paddle2DirY;
		}
		// if the lerp value is too high, we have to limit speed to paddleSpeed
		else
		{
			// if paddle is lerping in +ve direction
			if (paddle2DirY > paddleSpeed)
			{
				paddle2.position.y += paddleSpeed;
				daste2.position.y += paddleSpeed;
			}
			// if paddle is lerping in -ve direction
			else if (paddle2DirY < -paddleSpeed)
			{
				paddle2.position.y -= paddleSpeed;
				daste2.position.y -= paddleSpeed;
			}
		}
	}
}


// Handles player's paddle movement
function playerPaddleMovement()
{
	if(can_move){
		// move left
		if (Key.isDown(Key.DOWNARROW) || Key.isDown(Key.LEFTARROW))		
		{
			// if paddle is not touching the side of table
			// we move
			if (paddle1.position.y < fieldHeight * 0.45)
			{
				paddle1DirY = paddleSpeed * 0.5;
			}
			// else we don't move
			// to indicate we can't move
			else
			{
				paddle1DirY = 0;
//				paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
			}
		}	
		// move right
		else if (Key.isDown(Key.UPARROW) || Key.isDown(Key.RIGHTARROW))
		{
			// if paddle is not touching the side of table
			// we move
			if (paddle1.position.y > -fieldHeight * 0.45)
			{
				paddle1DirY = -paddleSpeed * 0.5;
			}
			// else we don't move and stretch the paddle
			// to indicate we can't move
			else
			{
				paddle1DirY = 0;
//				paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
			}
		}
		// else don't move paddle
		else
		{
			// stop the paddle
			paddle1DirY = 0;
		}
		
//		paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
//		paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;	
		paddle1.position.y += paddle1DirY;
		daste1.position.y += paddle1DirY;
//		document.getElementById("pause").innerHTML = paddle1.position.y;
	}
}


// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	// and if ball is aligned with paddle1 on y plane
	if (ball.position.y <= paddle1.position.y + paddleHeight/2
	&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
	{
	// and if ball is travelling towards player (-ve direction)
		if (ballDirX < 0)
		{
			if (ball.position.x <= paddle1.position.x + paddleWidth
			&&  ball.position.x >= paddle1.position.x)
			{
			
				// rotate the paddle to indicate a hit
				daste1_rotation = true;
				rotation_right = true;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ball.rotation.x = -ball.rotation.x;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				if(ball.position.y < 0)
				ballDirY += paddle1DirY * 0.7;
				else
				ballDirY -= paddle1DirY * 0.7;
				document.getElementById('ding').play();
			}
		}
		else 
			if (ball.position.x >= paddle1.position.x - paddleWidth
			&&  ball.position.x <= paddle1.position.x)
			{
				// rotate the paddle to indicate a hit
				daste1_rotation = true;
				rotation_right = false;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ball.rotation.x = -ball.rotation.x;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				if(ball.position.y < 0)
				ballDirY += paddle1DirY * 0.7;
				else
				ballDirY -= paddle1DirY * 0.7;
				document.getElementById('ding').play();
			}
	}
	
	
	// OPPONENT PADDLE LOGIC	
// and if ball is aligned with paddle2 on y plane
	if (ball.position.y <= paddle2.position.y + paddleHeight/2
	&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
	{
		// and if ball is travelling towards opponent (+ve direction)
		if (ballDirX > 0)
		{
			// if ball is aligned with paddle2 on x plane
			// remember the position is the CENTER of the object
			// we only check between the front and the middle of the paddle (one-way collision)
			if (ball.position.x >= paddle2.position.x - paddleWidth
			&&  ball.position.x <= paddle2.position.x)
			{
				daste2_rotation = true;
				rotation_right = true;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ball.rotation.x = -ball.rotation.x;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				if(ball.position.y < 0)
				ballDirY += paddle1DirY * 0.7;
				else
				ballDirY -= paddle1DirY * 0.7;
				document.getElementById('ding').play();
			}
		}else if (ball.position.x <= paddle2.position.x + paddleWidth
			&&  ball.position.x >= paddle2.position.x)
			{
				daste2_rotation = true;
				rotation_right = false;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ball.rotation.x = -ball.rotation.x;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				if(ball.position.y < 0)
				ballDirY += paddle1DirY * 0.7;
				else
				ballDirY -= paddle1DirY * 0.7;
				document.getElementById('ding').play();
			}
	}
}

function resetBall(loser)
{
	// position the ball in the center of the table
	ball.position.x = 0;
	ball.position.y = 0;
	
	// if player lost the last point, we send the ball to opponent
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
		ballDirX = 1;
	}
	
	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
	
}


// checks if either player or opponent has reached 7 points
function matchScoreCheck()
{
	// if player has 5 points
	if (score1 >= maxScore)
	{
		// stop the ball
		can_move = false;
		// write to the banner
		document.getElementById("scores").innerHTML = "You Win!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		document.getElementById("pause").innerHTML = "";
	}
	// else if opponent has 5 points
	else if (score2 >= maxScore)
	{
		// stop the ball
		can_move = false;
		// write to the banner
		document.getElementById("scores").innerHTML = "<span style='color:red;'>GAME OVER!</span>";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		document.getElementById("pause").innerHTML = "";
	}
}

var status = false;

function pause(){
	if (score2 < maxScore && score1 < maxScore)
	if (Enter_isUp)		
	{
		if (can_move == false){// resume the game
			can_move = true;
			document.getElementById("pause").innerHTML = "";
		}else{// pause the game
			can_move = false;	
			document.getElementById("pause").innerHTML = "PAUSE!";
		}
		Enter_isUp = false;
	}
}


var daste1_rotation = false;
var daste2_rotation = false;
var rotation_right = true;	
var first_run = true;
var charkhesh = 10 * Math.PI/180;

function rotate_daste(){
	if(can_move){
		if(first_run){
			daste1_rotation_temp =  daste1.rotation.y;
			daste2_rotation_temp =  daste2.rotation.y;
			first_run = false;
		}
	
		if(Key.isDown(Key.SPACE))
		{
			if(rotation_right)
				daste1.rotation.y += -2*charkhesh;
			else
				daste1.rotation.y += 2*charkhesh;
		}else
		
		
		if(daste2_rotation)
		{
			if(rotation_right == false)
				daste2.rotation.y += -charkhesh;
			else
				daste2.rotation.y += charkhesh;
				// (daste2.rotation.y % daste2_rotation_temp) >= (356 * Math.PI/180)
			if((daste2.rotation.y >= (356 * Math.PI/180) + daste2_rotation_temp &&
					 daste2.rotation.y <= (369 * Math.PI/180) + daste2_rotation_temp) || 
				(daste2.rotation.y <= (-356 * Math.PI/180) + daste2_rotation_temp && 
						daste2.rotation.y >= (-369 * Math.PI/180) + daste2_rotation_temp)){
				daste2_rotation = false;
				daste2.rotation.y = daste2_rotation_temp;
			}
		}
	}
}


window.addEventListener('keyup', function( ev ) {
			switch( ev.keyCode ) {
				case 32:// Space
				daste1_rotation = false;
				first_charkhesh = true;
				break;
				case 13:// Enter
				Enter_isUp = true;
				break;
				case 67:// C
				camera_location++ ;
				if(camera_location == 3)
				camera_location=0;
				break;
			}
		}, false
	);
	
function return_daste(){
	if(can_move){
	//	document.getElementById("pause").innerHTML = (daste1_rotation_temp % daste1.rotation.y % Math.PI*2);
		if(!daste1_rotation && first_charkhesh){
			if(rotation_right)
			daste1.rotation.y += charkhesh;
		else
			daste1.rotation.y += -charkhesh;
			//(daste1.rotation.y % daste1_rotation_temp) >= (356 * Math.PI/180)
			if(Math.abs(daste1_rotation_temp % daste1.rotation.y % Math.PI*2) >= (-20 * Math.PI/180) &&
					 Math.abs(daste1_rotation_temp % daste1.rotation.y % Math.PI*2) <= (20 * Math.PI/180)){
				daste1_rotation = true;
				daste1.rotation.y = daste1_rotation_temp;
			}
		}
	}
}