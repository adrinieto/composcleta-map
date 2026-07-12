import * as L from 'leaflet'
import type { POIType } from './poi-types'
import { fetchPOIs } from './overpass'
import { CONCELLO_BOUNDS } from './config'
import { devLog } from './utils'

function buildPopupHTML(type: POIType, tags: Record<string, string>): string {
  let html = `<strong>${type.label}</strong>`

  const rows = type.popupFields
    .filter((f) => tags[f.key])
    .map((f) => `<br>${f.label}: ${tags[f.key]}`)

  if (rows.length > 0) {
    html += rows.join('')
  }

  return html
}

export async function createPOIMarkers(
  map: L.Map,
  types: POIType[],
): Promise<void> {
  const data = await fetchPOIs(CONCELLO_BOUNDS, types)

  for (const type of types) {
    const key = `${type.tag}=${type.value}`
    const pois = data.get(key) ?? []

    devLog(`Fetched ${pois.length} ${type.label}`)

    const group = L.layerGroup()

    for (const poi of pois) {
      const icon = L.divIcon({
        className: 'poi-marker',
        html: `<img src="${type.icon}" width="28" height="28" alt="${type.label}">`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      })

      L.marker([poi.lat, poi.lon], { icon })
        .bindPopup(buildPopupHTML(type, poi.tags))
        .addTo(group)
    }

    group.addTo(map)
  }
}
