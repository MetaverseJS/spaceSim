import { System } from '-/sim/systemBuilder'

self.onmessage = e => {
  const system = new System(1, 1, 256, 15, 0.1)
  postMessage(system)
}
