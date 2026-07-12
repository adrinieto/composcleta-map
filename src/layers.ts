import * as L from 'leaflet'

const CYCLOSM_URL = 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
const CYCLOSM_ATTR =
  '&copy; <a href="https://www.cyclosm.org">CyclOSM</a> — <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const cyclosmLayer: L.TileLayer = L.tileLayer(CYCLOSM_URL, {
  attribution: CYCLOSM_ATTR,
  maxZoom: 20,
})
