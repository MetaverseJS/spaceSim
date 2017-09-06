import FlyControls from './controls/flyControls'

const movementSpeedMultiplier = 350000000

const onScroll = ({ camera, controls, event }) => {
  const deltaY = event.wheelDeltaY
  if (deltaY < 0) {
    camera.position.y *= 1.1
    camera.position.z *= 1.1
  } else {
    camera.position.y *= 0.9
    camera.position.z *= 0.9
  }
}

const adjustThrust = (val, controls) => {
  const newSpeed = controls.movementSpeed + val * movementSpeedMultiplier
  Void.log.debug(`adjusting thrust from ${controls.movementSpeed / movementSpeedMultiplier} to ${newSpeed / movementSpeedMultiplier}`)
  controls.movementSpeed = newSpeed
}

const setFlyControls = ({ ship, camera, el }) => {
  const controls = new FlyControls(ship, el)
  controls.movementSpeed = 0
  controls.domElement = el
  controls.rollSpeed = 0.35
  controls.autoForward = true
  controls.dragToLook = true

  el.addEventListener('mousewheel', event => onScroll({ camera, controls, event }), false)
  el.addEventListener('keydown', event => {
    if (event.key === 'w') {
      adjustThrust(1, controls)
    } else if (event.key === 's') {
      adjustThrust(-1, controls)
    }
  })

  return controls
}

export {
  onScroll,
  setFlyControls
}
