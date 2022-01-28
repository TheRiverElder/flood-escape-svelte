export {}
// import type { Game } from "./Game";

// export class WebGLGameRenderer {

//     game: Game;
//     canvas: HTMLCanvasElement;
//     scene: THREE.Scene;
//     camera: THREE.Camera;
//     glRenderer: THREE.Renderer;
//     light: THREE.light;
//     controls: OrbitControlls;
//     gameObjects: [THREE.Mesh, THREE.Mesh, THREE.Mesh][];

//     initialize(game: Game, canvas: HTMLCanvasElement) {
//         this.game = game;
//         this.canvas = canvas;

//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//         this.scene = new THREE.Scene();
//         this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//         this.glRenderer = new THREE.WebGLRenderer({ canvas: this.canvas });
//         this.glRenderer.setSize(window.innerWidth, window.innerHeight);

//         const tileSize = CONFIG.tileSize;
//         const cpx = game.width / 2 * tileSize;
//         const cpy = game.height / 2 * tileSize;

//         this.light = new THREE.PointLight(0xffffff, 1);
//         this.light.position.set(cpx, 1.5 * CONFIG.maxWaterLevel * tileSize, cpy);
//         this.light.castShadow = true;
//         this.scene.add(this.light);
//         this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//         this.camera.position.set(-10, 1.5 * CONFIG.maxWaterLevel * tileSize, -10);
//         this.camera.lookAt(cpx, 0, cpy);
//         this.scene.add(this.camera);

//         this.controls = new OrbitControls(this.camera, canvas);
//         this.controls.target = new THREE.Vector3(cpx, 0, cpy);
//         this.controls.update();

//         const landMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
//         const waterMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff/*, transparent: true, opacity: 0.5*/ });
//         const structureMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

//         this.gameObjects = game.tiles.map((tile, i) => {
//             const landGeometry = new THREE.BoxGeometry(tileSize, 1, tileSize);
//             const land = new THREE.Mesh(landGeometry, landMaterial);
//             land.userData.id = i;

//             land.position.set(tile.x * tileSize, tile.terrain.altitude / 2, tile.y * tileSize);
//             land.scale.y = tile.terrain.altitude;

//             const waterGeometry = new THREE.BoxGeometry(tileSize, 1, tileSize);
//             const water = new THREE.Mesh(waterGeometry, waterMaterial);
//             water.userData.id = i;

//             const structureGeometry = new THREE.BoxGeometry(tileSize / 2, 1, tileSize / 2);
//             const structure = new THREE.Mesh(structureGeometry, structureMaterial);
//             structure.userData.id = i;

//             const structureHeight = Math.max(CONFIG.maxWaterLevel + 1 - tile.terrain.altitude, 0);
//             structure.position.set(tile.x * tileSize, tile.terrain.altitude * tileSize + structureHeight / 2, tile.y * tileSize);
//             structure.scale.set(0.5, structureHeight, 0.5);

//             this.scene.add(land, water, structure);
//             return [land, water, structure];
//         });
//     }

//     render() {
//         const tileSize = CONFIG.tileSize;

//         const tiles = this.game.tiles;
//         const gameObjects = this.gameObjects;
//         for (let i = 0; i < tiles.length; i++) {
//             const { x, y, terrain: { altitude, water }, structure } = tiles[i];
//             const [landMesh, waterMesh, structureMesh] = gameObjects[i];

//             if (water <= 0) {
//                 this.scene.remove(waterMesh);
//             } else {
//                 this.scene.add(waterMesh);
//                 waterMesh.position.set(x * tileSize, (altitude + water / 2) * tileSize, y * tileSize);
//                 waterMesh.scale.y = water;
//             }

//             // if (structureMesh.material.visible !== !!structure) structureMesh.material.visible = !!structure;
//             if (structure) {
//                 // structureMesh.position.set((x + 0.5) * tileSize, 0, (y + 0.5) * tileSize);
//                 // structureMesh.scale.set(0.5, CONFIG.maxWaterLevel, 0.5);
//                 this.scene.add(structureMesh);
//             } else {
//                 this.scene.remove(structureMesh);
//             }
//             // if (waterMesh.material.visible && waterMesh.position.y === 0) {
//             //     console.log("traitor!");
//             // }
//         }

//         this.controls.update();
//         this.glRenderer.render(this.scene, this.camera);
//     }
// }