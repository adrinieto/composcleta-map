import * as L from 'leaflet'
import type { LatLngTuple, MapOptions } from 'leaflet'

export const MAP_CENTER: LatLngTuple = [42.878, -8.544]
export const MAP_ZOOM = 14

export const MAP_OPTIONS: MapOptions = {
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
  zoomControl: true,
}

export const CONCELLO_BOUNDS = L.latLngBounds(
  [42.8241442, -8.6320116],
  [42.9896310, -8.3900878],
)
