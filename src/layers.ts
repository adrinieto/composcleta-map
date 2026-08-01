import * as L from 'leaflet'

const CYCLOSM_URL = 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
const CYCLOSM_ATTR =
  '&copy; <a href="https://www.cyclosm.org">CyclOSM</a> — <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const cyclosmLayer: L.TileLayer = L.tileLayer(CYCLOSM_URL, {
  attribution: CYCLOSM_ATTR,
  maxZoom: 20,
})

const OSM_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const osmLayer: L.TileLayer = L.tileLayer(OSM_URL, {
  attribution: OSM_ATTR,
  maxZoom: 19,
})

const POSITRON_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const POSITRON_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const lightLayer: L.TileLayer = L.tileLayer(POSITRON_URL, {
  attribution: POSITRON_ATTR,
  maxZoom: 20,
})
