import Promise from 'bluebird'

import { createStar, createRandomStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import * as controls from '-/player/controls'
import { onProgress, onError, randomUniform, getUrlParameter } from '-/utils'
import { soPhysics, convertSystemToMeters } from './systemBuilder'
import SystemBuilderWorker from './workers/systemBuilder.worker'
import { createComposer } from '-/webgl/postprocessing/effects'

import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { EffectComposer, GlitchPass, KernelSize, BloomPass, RenderPass, GodRaysPass } from 'postprocessing'

let renderer
let world = null

const animateCallbacks = []

let galaxyRadius
const loadSystem = () => {
  const systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage('!')
  systemWorker.onmessage = e => {
    Void.thisSystem = e.data

    const metersBodies = convertSystemToMeters(Void.thisSystem)
    Void.thisSystem.bodies = metersBodies

    Void.soPhysics = new soPhysics(Void.thisSystem, 0, 0.001, true, true)

    const mkBody = body => {
      if (body.name === 'star') {
        const star = createRandomStar({ radius: body.radius, position: body.position, time: Void.time })
        body.object = star.chromosphere
        // Void.scene.add(star.photosphere)
        Void.scene.add(star.chromosphere)
        Void.scene.add(star.emitter)
        Void.scene.add(star.pointLight)
        animateCallbacks.push(star.animate)
      } else {
        const planet = createPlanet({ radius: body.radius, position: body.position })
        if (planet) {
          body.object = planet
          Void.scene.add(planet)
        }
      }
    }
    Promise.map(Void.thisSystem.bodies, body => Promise.resolve(mkBody(body)).delay(Math.random() * 250), { concurrency: 20 })
  }
  Void.systemLoaded = true
}

const updateSystem = () => {
  let i = 0
  for (const body of Void.thisSystem.bodies) {
    if (body.object) {
      let collidedIndex = Void.soPhysics.collisions.indexOf(body.name)
      if (collidedIndex !== -1) {
        Void.soPhysics.collisions.splice(collidedIndex, 1)
        if (body.name !== 'star') {
          Void.scene.remove(body.object)
          body.radius = Void.soPhysics.gridSystem.rad[i]
          let bodyGeometry = new THREE.SphereGeometry(body.radius, 32, 32)
          let bodyMaterial = new THREE.MeshPhongMaterial({
            color: randomUniform(0.5, 1) * 0xffffff
          })
          const planet = new THREE.Mesh(bodyGeometry, bodyMaterial)
          planet.position.x = body.position.x
          planet.position.y = body.position.y
          planet.position.z = body.position.z
          body.object = planet
          Void.scene.add(planet)

          body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
          body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
          body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
        }
      } else {
        body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
        body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
        body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
      }
      if (Void.soPhysics.gridSystem.names[i] === 'DELETED') {
        Void.scene.remove(body.object)
        // console.log('removed body')
        body.object = ''
      }
    }
    i++
  }
}

const initOimoPhysics = () => {
  // world setting:( TimeStep, BroadPhaseType, Iterations )
  // BroadPhaseType can be
  // 1 : BruteForce
  // 2 : Sweep and prune , the default
  // 3 : dynamic bounding volume tree
  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [ 0, 0, 0 ]
  })
  // populate(1);
  // setInterval(updateOimoPhysics, 1000/60);
}

const addLights = scene => {
  const ambient = new THREE.AmbientLight(0x888888)
  scene.add(ambient)
}

const addShip = scene => {
  const mtlLoader = new THREE.MTLLoader()
  mtlLoader.setPath('app/assets/models/')

  const objLoader = new THREE.OBJLoader()
  objLoader.setPath('app/assets/models/')

  mtlLoader.load('ship.mtl', (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load('ship.obj', (object) => {
      object.position.x = 0
      object.position.y = -350000000000
      object.position.z = 350000000000
      object.scale.set(20, 20, 20)
      object.rotation.set(0.5, -0.25, -0.25)
      object.name = 'spaceShip'

      Void.ship = object
      Void.ship.add(Void.camera)
      Void.camera.position.set(0, 10, 30)
      scene.add(object)

      Void.controls = controls.setFlyControls({ camera: Void.camera, ship: Void.ship, el: document.querySelector('#root > canvas') })
    }, onProgress, onError)
  })
}

const shipPolarGrid = ship => {
  const helper = new THREE.PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
  helper.geometry.rotateY(Math.PI)
  return helper
}

const squareGrid = () => {
  const size = 100000000
  const divisions = 1000
  const gridHelper1 = new THREE.GridHelper(size, divisions, 0xffffff, 0xfffff)
}

const addUniverse = scene => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)
  scene.add(oort)

  galaxyRadius = 5 * Math.pow(10, 20)
  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)
  scene.add(galaxy)

  const universeGeometry = new THREE.SphereGeometry(4.4 * Math.pow(10, 26), 32, 32)
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)
  scene.add(universe)
}

const addPostprocessing = ({ renderer, scene, camera }) => {
    // postprocessing
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomPass({
    resolutionScale: 0.05,
    kernelSize: 3.0,
    intensity: 0.3,
    distinction: 1
  })
  bloomPass.renderToScreen = true
  bloomPass.combineMaterial.defines.SCREEN_MODE = '1'
  bloomPass.combineMaterial.needsUpdate = true
  composer.addPass(bloomPass)
}

let composer
const init = rootEl => {
  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // camera
  const IAU = 9.4607 * Math.pow(10, 15)
  const farClip = 5 * IAU
  const camera = Void.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, farClip)

  // scene
  const scene = Void.scene = new THREE.Scene()
  addLights(scene)
  addShip(scene)
  addUniverse(scene)

  addPostprocessing({ renderer, scene, camera })

  rootEl.appendChild(renderer.domElement)

  if (getUrlParameter('nostars') === undefined) {
    addStars()
  }

  window.addEventListener('resize', onWindowResize, false)

  Void.world = world

  initOimoPhysics()
  loadSystem()
}

const addStars = () => {
  const radius = galaxyRadius
  let i,
    r = radius,
    starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ]
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = (Math.random() * (2 - 1))
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = (Math.random() * (2 - 1))
    vertex.multiplyScalar(r)

    starsGeometry[0].vertices.push(vertex)
  }
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = (Math.random() * (2 - 1))
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = (Math.random() * (2 - 1))
    vertex.multiplyScalar(r)
    starsGeometry[1].vertices.push(vertex)
  }

  let stars
  const starsMaterials = [
    new THREE.PointsMaterial({ color: 0xffffff, size: 10000000000000000, sizeAttenuation: true, fog: false }),
    new THREE.PointsMaterial({ color: 0xaaaaaa, size: 10000000000000000, sizeAttenuation: true, fog: false }),
    new THREE.PointsMaterial({ color: 0x555555, size: 10000000000000000, sizeAttenuation: true, fog: false }),
    new THREE.PointsMaterial({ color: 0xff0000, size: 10000000000000000, sizeAttenuation: true, fog: false }),
    new THREE.PointsMaterial({ color: 0xffdddd, size: 10000000000000000, sizeAttenuation: true, fog: false }),
    new THREE.PointsMaterial({ color: 0xddddff, size: 10000000000000000, sizeAttenuation: true, fog: false })
  ]
  for (i = 10; i < 30; i++) {
    stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6])
      // stars.rotation.x = Math.random() * 6;
      // stars.rotation.y = Math.random() * 6;
      // stars.rotation.z = Math.random() * 6;
      //  stars.scale.setScalar( i * 10 );
    stars.position.x -= radius / 2
    stars.position.y -= radius / 6
    stars.position.z -= radius / 2
    stars.matrixAutoUpdate = false
    stars.updateMatrix()
    Void.scene.add(stars)
  }
}

const onWindowResize = () => {
  Void.camera.aspect = window.innerWidth / window.innerHeight
  Void.camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateOimoPhysics = () => {
  if (world == null) {
    return
  }
  world.step()
}

let tick = 0
const initialTime = 1000
const animate = () => {
  requestAnimationFrame(animate)

  const delta = Void.clock.getDelta()

  if (Void.controls) {
    Void.controls.update(delta)
  }

  Void.time.value = initialTime + Void.clock.getElapsedTime()

  if (Void.soPhysics && Void.systemLoaded) {
    Void.soPhysics.accelerateCuda()
    updateOimoPhysics()
    updateSystem()

    animateCallbacks.map(x => x(Void.time.value))
  }

  composer.render(delta)
}

export { init, animate, loadSystem, world }
