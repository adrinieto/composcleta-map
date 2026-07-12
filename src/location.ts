import * as L from 'leaflet'
import { isMobile } from './utils'

export function addMyLocationControl(map: L.Map): void {
  const LocationControl = L.Control.extend({
    options: { position: 'topleft' },

    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
      const btn = L.DomUtil.create('a', 'leaflet-control-location', container)
      btn.href = '#'
      btn.title = 'Mi ubicación'
      btn.innerHTML = '<img src="/src/icons/my-location.svg" alt="Mi ubicación">'

      L.DomEvent.disableClickPropagation(container)
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        map.locate({ setView: true, maxZoom: isMobile() ? 16 : 14 })
      })

      return container
    },
  })

  new LocationControl().addTo(map)

  map.on('locationerror', () => {
    alert('No se pudo obtener tu ubicación')
  })
}
