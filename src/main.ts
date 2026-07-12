import * as L from 'leaflet'
import './style.css'
import { MAP_OPTIONS, CONCELLO_BOUNDS } from './config'
import { cyclosmLayer } from './layers'
import { POI_TYPES } from './poi-types'
import { createPOIMarkers } from './pois'
import { createFilter } from './filter'
import { addMyLocationControl } from './location'
import { devLog } from './utils'

const map = L.map('map', MAP_OPTIONS)
cyclosmLayer.addTo(map)
addMyLocationControl(map)

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

function loadPOIs() {
  statusEl.innerHTML = ''
  statusEl.className = 'status-message'
  L.DomUtil.create('div', 'spinner', statusEl)
  L.DomUtil.create('span', '', statusEl).textContent = 'Cargando datos\u2026'

  createPOIMarkers(map, POI_TYPES)
    .then((groups) => {
      statusEl.remove()
      createFilter(map, groups)
    })
    .catch((err) => {
      console.error('Failed to load POIs:', err)
      statusEl.innerHTML = ''
      L.DomUtil.create('span', '', statusEl).textContent = 'Error obteniendo datos '
      const retry = L.DomUtil.create('button', 'retry-btn', statusEl)
      retry.textContent = 'Reintentar'
      retry.addEventListener('click', loadPOIs)
      statusEl.classList.add('error')
    })
}

loadPOIs()
