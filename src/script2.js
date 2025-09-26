import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const fontLoader = new FontLoader()

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
// material.transparent = true
// material.opacity = 0.5
// material
material.side = THREE.DoubleSide


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



fontLoader.load('fonts/font.json', (font) => {

    const geometry = new TextGeometry( 'Tipa nasha kvartira :)', {
		font: font,
		size: 0.5,
		depth: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5
	} );

    geometry.center()

    const text = new THREE.Mesh(geometry, material)
    text.position.z = -3
    text.position.y = 1

    scene.add(text)

})


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white', 1)

scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('white', 2)
// directionalLight.shadow = true
directionalLight.position.set(1, 0, 2)
const directionalLight2 = new THREE.DirectionalLight('white', 1)
// directionalLight.shadow = true
directionalLight.position.set(-1, 0, 1)
scene.add(directionalLight2)

// const hemisphereLight = new THREE.HemisphereLight('#ed80e9', 'blue', 1)
// scene.add(hemisphereLight)

const pointLight = new THREE.PointLight('yellow', 0.03)
pointLight.position.x = -0.15
// const pointLighth = new THREE.PointLightHelper(pointLight)

const pointLight2 = new THREE.PointLight('blue', 0.03)
pointLight2.position.x = 0.15

scene.add(pointLight, pointLight2)
/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader()
const cubeTexture = textureLoader.load('/textures/sq.png')
cubeTexture.colorSpace = THREE.SRGBColorSpace;
cubeTexture.generateMipmaps = false
cubeTexture.magFilter = THREE.NearestFilter

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({map: cubeTexture})
)
cube.position.z = -2.7
cube.position.x = 3
cube.position.y = 0.2

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({map: cubeTexture})
)
cube2.position.z = -2.7
cube2.position.x = 2.4
cube2.position.y = 0.2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({map: cubeTexture})
)
cube3.position.z = -2.7
cube3.position.x = 2.4
cube3.position.y = 0.7

const cube4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({map: cubeTexture})
)
cube4.position.z = -2
cube4.position.x = 2.4
cube4.position.y = 0.2

const group = new THREE.Group()
group.position.set(1.4, 0.66, -0.82)


gui.add(group.position, 'x').min(-10).max(10)
gui.add(group.position, 'y').min(-10).max(10)
gui.add(group.position, 'z').min(-10).max(10)

group.add(cube, cube2, cube3, cube4)

scene.add(group)


// Objects

// 0.1 is 1m



const getWallFactory = (material) => (...args) => new THREE.Mesh(
    new THREE.BoxGeometry(...args),
    material
)

const step = {value: 0.1}



const wallFactory = getWallFactory(material);

const createFlat = () => {
    const wallDepth = step.value * 0.2
const totalHeight = step.value * 3
const totalWidth = step.value * 6
const totalDepth= step.value * 7
const doorWidth = step.value
const middleWallDepth = totalDepth - doorWidth
const kitchenAndRoomDiff = step.value * 0.2
const bathDepth = step.value*2



const rightWall = wallFactory(totalHeight, totalDepth, wallDepth)
rightWall.position.x = totalWidth*0.5-wallDepth/2
rightWall.position.y = totalHeight*0.5
rightWall.rotation.x = Math.PI * 0.5
rightWall.rotation.y = Math.PI * 0.5

const leftWall = wallFactory(totalHeight, totalDepth, wallDepth)
leftWall.position.x = -(totalWidth*0.5-wallDepth/2)
leftWall.position.y = totalHeight*0.5
leftWall.rotation.x = Math.PI * 0.5
leftWall.rotation.y = Math.PI * 0.5

const middleWall = wallFactory(totalHeight, totalDepth, wallDepth)
// leftWall.position.x = -(totalWidth*0.5-wallDepth/2)
middleWall.position.x = -kitchenAndRoomDiff
middleWall.position.y = totalHeight*0.5
// middleWall.position.z -= doorWidth/2
middleWall.rotation.x = Math.PI * 0.5
middleWall.rotation.y = Math.PI * 0.5

const roomAndBathWall = wallFactory(totalWidth/2 + kitchenAndRoomDiff, totalHeight, wallDepth)
roomAndBathWall.position.x = (totalWidth/2) / 2 - kitchenAndRoomDiff
roomAndBathWall.position.y = totalHeight*0.5
roomAndBathWall.position.z = totalDepth*0.5-bathDepth

const floor = wallFactory(totalWidth, totalDepth, wallDepth)
floor.rotation.x = Math.PI * 0.5


const distantWall = wallFactory(totalHeight, totalWidth, wallDepth)
distantWall.rotation.z = Math.PI*0.5
distantWall.position.z = -(totalDepth*0.5-wallDepth/2)
distantWall.position.y = totalHeight*0.5

return [rightWall,leftWall, floor, distantWall, middleWall, roomAndBathWall]
}

let walls = createFlat()
scene.add(...walls)


gui.add(step, 'value').min(0.1).max(0.3).step(0.001).name("Flat size").onFinishChange((v) => {
    walls.forEach(i => {
        i.geometry.dispose()
        i.material.dispose()
        scene.remove(i)
    })

    walls = createFlat()
    scene.add(...walls)
})



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime
    // cube.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // cube.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

