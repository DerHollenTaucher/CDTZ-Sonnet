import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { TextureLoader } from 'three';

// 1. Initialize Three.js core objects
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a2b3c);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set camera initial position
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-10, 10, -5);
scene.add(fillLight);
mainLight.position.set(10, 15, 5);
scene.add(mainLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 3. Add a test cube
//const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
//const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//cube.position.set(0, 0, 0);
//scene.add(cube);



//Problem sets
const questionBank = {
    math: [
        { q: "What's the average of 2, 8, 14, 16, 20 ?", a: "12" },
        { q: "A = {-4,0,1,2,8} , B = {x|x^3=x}, A∩B= ？", a: "{0,1}" },
        { q: "What's the solution set of (x-4)/(x-1)>=2 ?(Answer in form of {x|?<x<?})", a: "{x|-2<=x<1}" },
        { q: "z = 1+i, 1/(z-1) = ?", a: "-i"}
    ],
    chinese: [
        { q: "“昨夜閑潭夢落花”“我欲因之夢吳越”“鐵馬冰河入夢來”夢往往以一種獨特的方式呈現我們的感受和期冀，為我們打開更浩瀚的天空。我們也常常向別人講述自己的夢，用文字記錄自己的夢，以行動實現自己的夢。_________,_________..... please fill in the blank.", a: "如果有一天，我們能夠將夢贈予他人" },
        { q: "Fill in the blank: 周末的音樂會圓滿成功，媒體報道時引用蘇軾《赤壁賦》中的“____,____”兩句，形容洞簫的尾音婉轉悠長，連綿不斷。", a: "餘音裊裊，不絕如縷"},
        { q: "Fill in the blank：老年大學的教室裏懸挂著一副對聯，寫的是陸游《臨安春雨初霽》中的“____,____”，對應著開設的書法和茶藝兩門課。", a: "矮紙斜行閒作草，晴窗細乳戲分茶"}

    ],
    english: [
        { q: "How much is the shirt? Answer in form of Pounds__ .", a: "9.15" },
        { q: "Fill in the blank: Suppose you are school English Newspaper edit ___ , foreign teacher Chris promised to write an article introducing Canadian Sports last month, please write an email to Chris.", a: "Li Hua"}
    ]
};


// add ground
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
scene.add(plane);

// Add enemies
const enemies = [];
const textureLoader = new TextureLoader();
const subjects = ['math', 'chinese', 'english', 'math'];

const enemyPositions = [];
for (let i = 0; i < 4; i++) {
    enemyPositions.push({
        x: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20
    });
}

enemyPositions.forEach((pos, index) => {
    const enemyGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.5);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    enemyGroup.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const texture = textureLoader.load('textures/' + subjects[index] + '.jpg');
    const headMaterials = [
        new THREE.MeshLambertMaterial({ color: 0x8B4513 }), // right
        new THREE.MeshLambertMaterial({ color: 0x8B4513 }), // left
        new THREE.MeshLambertMaterial({ color: 0x8B4513 }), // top
        new THREE.MeshLambertMaterial({ color: 0x8B4513 }), // bottom
        new THREE.MeshLambertMaterial({ map: texture }), // front
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })  // back
    ];
    const head = new THREE.Mesh(headGeometry, headMaterials);
    head.position.y = 1.8;
    enemyGroup.add(head);

    enemyGroup.position.set(pos.x, 0, pos.z);
    scene.add(enemyGroup);
    enemies.push(enemyGroup);

    // Patrol properties
    enemyGroup.angle = index * Math.PI / 2;
    enemyGroup.radius = 3;
    enemyGroup.userData.centerX = 0; // Patrol around the building center
    enemyGroup.userData.centerZ = 0;
    enemyGroup.userData.subject = subjects[index];
    // Random movement targets
    enemyGroup.targetX = (Math.random() - 0.5) * 20;
    enemyGroup.targetZ = (Math.random() - 0.5) * 20;
    enemyGroup.targetY = Math.random() * 5;
});

// 4. 加载OBJ模型（带材质）
//const loader = new THREE.OBJMTLLoader();
//loader.load(
  //  'models/testmodel1.obj',
    //'models/testmodel1.mtl',
    //function (object) {
        // 模型缩放（根据你的平台大小调整）
      //  object.scale.set(1, 1, 1);
        //scene.add(object);
    //}
//);
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.load(
    'models/CDTZ5.mtl',
    function (materials) {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(
            'models/CDTZ5.obj',
            function (object) {
                // Scale the model
                object.scale.set(0.2, 0.2, 0.2);

                // Compute bounding box after scaling
                const box = new THREE.Box3().setFromObject(object);
                const size = box.getSize(new THREE.Vector3());

                // Center the model
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);

                // Position so bottom is at y=0
                object.position.y += size.y / 2;

                // Make materials visible by setting color to white if black
                object.traverse(function (child) {
                    if (child.isMesh && child.material) {
                        if (child.material.color && child.material.color.equals(new THREE.Color(0, 0, 0))) {
                            child.material.color.set(0xffffff);
                        }
                    }
                });

                scene.add(object);
                console.log('model loaded');

                // Position camera to view the model
                //camera.position.set(0, 5, 10);
                //camera.lookAt(0, 0, 0);
            },
            undefined,
            function (error) {
                console.error('OBJ loading error:', error);
            }
        );
    },
    undefined,
    function (error) {
        console.error('MTL loading error:', error);
    }
);
// 4. 第一人称控制器 + 跳跃功能
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

//control initial hight
controls.getObject().position.y = 10;
controls.getObject().position.z = 50;

//initial set
//camera.position.y = 10;

// 跳跃相关变量
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let isJumping = false;
let jumpVelocity = 0;
const GRAVITY = 0.05;
const JUMP_FORCE = 1.2;

// Raycaster for ground detection
const raycaster = new THREE.Raycaster();
const downDirection = new THREE.Vector3(0, -1, 0);

// click to lock pointer
document.body.addEventListener('click', () => {
    controls.lock();
});

// keyboard input handling
const keys = {};
document.addEventListener('keydown', (e) => { keys[e.code] = true; });
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

//Interactions (global variables)
let pickedItems = [];
let cheatCount = 0;
let hasActiveShield = false;
let shieldEndTime = 0;
let isGameOver = false;

// 5. 游戏循环
function animate() {
    requestAnimationFrame(animate);

    // 移动逻辑
    velocity.x -= velocity.x * 10.0 * 0.01;
    velocity.z -= velocity.z * 10.0 * 0.01;
    direction.z = keys['KeyW'] ? 1 : keys['KeyS'] ? -1 : 0;
    direction.x = keys['KeyA'] ? -1 : keys['KeyD'] ? 1 : 0;
    direction.normalize();

    if (keys['KeyW'] || keys['KeyS']) velocity.z -= direction.z * 200.0 * 0.01;
    if (keys['KeyA'] || keys['KeyD']) velocity.x -= direction.x * 200.0 * 0.01;

    controls.moveRight(-velocity.x * 0.01);
    controls.moveForward(-velocity.z * 0.01);

    // Ground detection
    raycaster.set(controls.getObject().position, downDirection);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const groundY = intersects[0].point.y;
        if (!isJumping) {
            controls.getObject().position.y = groundY + 2; // Stand 2 units above ground
        }
    }

    // 跳跃逻辑
    if (keys['Space'] && !isJumping) {
        isJumping = true;
        jumpVelocity = JUMP_FORCE;
    }
    if (isJumping) {
        controls.getObject().position.y += jumpVelocity;
        jumpVelocity -= GRAVITY;
        // 落地检测（站回平台）
        if (controls.getObject().position.y <= 2) {
            controls.getObject().position.y = 2;
            isJumping = false;
            jumpVelocity = 0;
        }
    }


    // Item interaction
    itemMeshes.forEach((itemMesh, index) => {
        const distance = controls.getObject().position.distanceTo(itemMesh.position);
        if (distance < 1.5 && keys['KeyE'] && !pickedItems.includes(itemMesh.userData.id)) {
            pickedItems.push(itemMesh.userData.id);
            scene.remove(itemMesh);
            itemMeshes.splice(index, 1);

            if (itemMesh.userData.type === "defense") {
                hasActiveShield = true;
                shieldEndTime = Date.now() + itemMesh.userData.effect.duration * 1000;
                alert("You have just picked up a book! Enemies cannot approach you for 10 seconds!");
            } else if (itemMesh.userData.type === "cheat") {
                cheatCount++;
                alert(`You picked up a cheat! Now you have ${cheatCount} pages of cheats.`);
            }
        }
    });

    //ITEMS
    if (hasActiveShield) {
        //check whether shield expired
        if (Date.now() > shieldEndTime) {
            hasActiveShield = false;
        }
    }

    // Move enemies
    enemies.forEach(enemy => {
        const distance = camera.position.distanceTo(enemy.position);
        if (distance < 15 && !hasActiveShield) {
            // Chase the player aggressively
            const direction = new THREE.Vector3().subVectors(camera.position, enemy.position).normalize();
            enemy.position.add(direction.multiplyScalar(0.08)); // More aggressive chase speed
        } else {
            // Move towards random target
            const targetPos = new THREE.Vector3(enemy.targetX, enemy.targetY, enemy.targetZ);
            const dirToTarget = new THREE.Vector3().subVectors(targetPos, enemy.position).normalize();
            enemy.position.add(dirToTarget.multiplyScalar(0.03)); // Slow patrol speed

            // Check if reached target
            if (enemy.position.distanceTo(targetPos) < 1) {
                // Pick new random target
                enemy.targetX = (Math.random() - 0.5) * 20;
                enemy.targetZ = (Math.random() - 0.5) * 20;
                enemy.targetY = Math.random() * 5;
            }
        }
        // Make the face always look at the player
        enemy.lookAt(controls.getObject().position);
    });

    // Check for enemy collision to trigger quiz
    if (!hasActiveShield) {
        enemies.forEach(enemy => {
            const distance = controls.getObject().position.distanceTo(enemy.position);
            if (distance < 2 && document.getElementById('quizUI').style.display === 'none') {
                showQuiz(enemy.userData.subject);
            }
        });
    }

    renderer.render(scene, camera);
}

//items(props) Book or cheat
const items = [
    //book for shield
    {
        id: "book1",
        type: "defense",
        position: new THREE.Vector3(-1.5, 23, -5), //POSITION
        texture: "textures/book1.jpg",
        effect: { radius: 10, duration: 10 }
    },
    {
        id: "book2",
        type: "defense",
        position: new THREE.Vector3(-2, 20, -6), //POSITION
        texture: "textures/book2.jpg",
        effect: { radius: 5, duration: 10 }
    },

    //cheat for escape from answering
    {
        id: "cheat1",
        type: "cheat",
        position: new THREE.Vector3(-4, 25, -5), //POSITION
        texture: "textures/cheat1.jpg"
    },
    {
        id: "cheat2",
        type: "cheat",
        position: new THREE.Vector3(-3, 15, -7), //POSITION
        texture: "textures/cheat2.jpg"
    }
];


function createItem(itemData) {
    const item = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.2, 0.8),
        new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(itemData.texture)
        })
    );
    item.position.copy(itemData.position);
    item.userData = itemData;
    scene.add(item);
    return item;
}
const itemMeshes = items.map(createItem);

animate();

// 6. 窗口自适应
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Quiz variables
let currentQuestion = null;

function showQuiz(subject) {
    const questions = questionBank[subject];
    // Randomly select question
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];

    document.getElementById('quizUI').style.display = 'block';
    document.getElementById('quizQuestion').innerText = currentQuestion.q;
    document.getElementById('quizInput').value = '';
    document.getElementById('quizTip').innerText = '';
}

function checkAnswer() {
    const answer = document.getElementById('quizInput').value.trim();
    if (answer === currentQuestion.a) {
        document.getElementById('quizTip').innerText = 'Correct! You escaped the enemy.';
        // Move the triggering enemy away
        enemies.forEach(enemy => {
            if (camera.position.distanceTo(enemy.position) < 2) {
                enemy.position.set((Math.random() - 0.5) * 40, Math.random() * 5, (Math.random() - 0.5) * 40);
                enemy.targetX = enemy.position.x;
                enemy.targetZ = enemy.position.z;
                enemy.targetY = enemy.position.y;
            }
        });
        setTimeout(() => {
            document.getElementById('quizUI').style.display = 'none';
        }, 2000);
    } else {
        if (cheatCount > 0) {
            cheatCount--;
            document.getElementById('quizTip').innerText = `Wrong, but you used a cheat! You have ${cheatCount} cheats left.`;
            // Treat as correct
            enemies.forEach(enemy => {
                if (camera.position.distanceTo(enemy.position) < 2) {
                    enemy.position.set((Math.random() - 0.5) * 40, Math.random() * 5, (Math.random() - 0.5) * 40);
                    enemy.targetX = enemy.position.x;
                    enemy.targetZ = enemy.position.z;
                    enemy.targetY = enemy.position.y;
                }
            });
            setTimeout(() => {
                document.getElementById('quizUI').style.display = 'none';
            }, 2000);
        } else {
            document.getElementById('quizTip').innerText = 'Wrong, try again.';
        }
    }
}

function showGameOver(message) {
    document.getElementById('gameOverUI').style.display = 'block';
    document.getElementById('gameOverText').innerText = message;
}

function restartGame() {
    document.getElementById('gameOverUI').style.display = 'none';
    document.getElementById('quizInput').value = '';
    document.getElementById('quizTip').innerText = '';
    camera.position.set(0, 0, 0);
    controls.getObject().position.set(0, 10, 50);
}

// Make functions global for HTML onclick
window.restartGame = restartGame;
window.checkAnswer = checkAnswer;
