import type { LatLngTuple, MapOptions } from 'leaflet'

export const MAP_CENTER: LatLngTuple = [42.878, -8.544]
export const MAP_ZOOM = 14

export const MAP_OPTIONS: MapOptions = {
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
  zoomControl: true,
}
