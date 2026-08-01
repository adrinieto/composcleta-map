import * as L from 'leaflet'
import './style.css'
import { MAP_OPTIONS, CONCELLO_BOUNDS, saveMapState } from './config'
import { cyclosmLayer, osmLayer, lightLayer } from './layers'
import { POI_TYPES } from './poi-types'
import { createPOIMarkers } from './pois'
import { createFilter } from './filter'
import { addMyLocationControl } from './location'
import { addLegendControl } from './legend'
import { devLog, relativeTime } from './utils'
import { fetchAllData } from './overpass'
import { WAY_TYPES } from './way-types'
import { createWayLayers } from './ways'

const map = L.map('map', MAP_OPTIONS)
cyclosmLayer.addTo(map)
addMyLocationControl(map)
addLegendControl(map)
L.control.layers(
  { 'Ciclista': cyclosmLayer, 'Light': lightLayer, 'Estándar': osmLayer },
  undefined,
  { collapsed: false },
).addTo(map)

map.on('moveend', () => saveMapState(map))

let timestampEl: HTMLElement | null = null

const TimestampControl = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd() {
    timestampEl = L.DomUtil.create('div', 'data-timestamp')
    return timestampEl
  },
})
new TimestampControl().addTo(map)

let lastFetchedAt: number | null = null

function renderTimestamp(): void {
  if (timestampEl && lastFetchedAt !== null) {
    timestampEl.textContent = `Datos actualizados ${relativeTime(lastFetchedAt)}`
  }
}

setInterval(renderTimestamp, 60_000)

if (import.meta.env.DEV) {
  L.rectangle(CONCELLO_BOUNDS, {
    color: '#ff0000',
    weight: 2,
    fillOpacity: 0.05,
    dashArray: '5, 10',
  }).addTo(map)
  devLog('Concello bounds displayed')
}

const statusEl = L.DomUtil.create('div', 'status-message', map.getContainer())

async function loadData(): Promise<void> {
  statusEl.innerHTML = ''
  statusEl.className = 'status-message'
  L.DomUtil.create('div', 'spinner', statusEl)
  L.DomUtil.create('span', '', statusEl).textContent = 'Cargando datos\u2026'

  try {
    const result = await fetchAllData(CONCELLO_BOUNDS, POI_TYPES, WAY_TYPES)
    lastFetchedAt = result.fetchedAt
    renderTimestamp()
    const poiGroups = await createPOIMarkers(map, POI_TYPES, result.elements)
    const wayGroups = createWayLayers(map, WAY_TYPES, result.elements)
    statusEl.remove()
    createFilter(map, [...poiGroups, ...wayGroups])
  } catch (err) {
    console.error('Failed to load data:', err)
    statusEl.innerHTML = ''
    L.DomUtil.create('span', '', statusEl).textContent = 'Error obteniendo datos '
    const retry = L.DomUtil.create('button', 'retry-btn', statusEl)
    retry.textContent = 'Reintentar'
    retry.addEventListener('click', loadData)
    statusEl.classList.add('error')
  }
}

loadData()
