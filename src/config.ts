import * as L from 'leaflet'
import type { LatLngTuple, MapOptions } from 'leaflet'

const STORAGE_KEY = 'composcleta-map-state'

function loadMapState(): { center: LatLngTuple; zoom: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const { center, zoom } = JSON.parse(raw)
      return { center, zoom }
    }
  } catch { /* ignore */ }
  return { center: MAP_CENTER, zoom: MAP_ZOOM }
}

export const MAP_CENTER: LatLngTuple = [42.878, -8.544]
export const MAP_ZOOM = 14

const saved = loadMapState()

export const MAP_OPTIONS: MapOptions = {
  center: saved.center,
  zoom: saved.zoom,
  zoomControl: true,
}

export function saveMapState(map: L.Map): void {
  const c = map.getCenter()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    center: [c.lat, c.lng],
    zoom: map.getZoom(),
  }))
}

export const CONCELLO_BOUNDS = L.latLngBounds(
  [42.8241442, -8.6320116],
  [42.9896310, -8.3900878],
)
