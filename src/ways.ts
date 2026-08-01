import * as L from 'leaflet'
import type { WayType } from './way-types'
import { devLog } from './utils'
import type { POILayerGroup } from './pois'
import type { OverpassElement } from './overpass'

function matchesOverpassLine(line: string, tags: Record<string, string>): boolean {
  const re = /\["([^"]+)"(?:="([^"]*)")?\]/g
  let match: RegExpExecArray | null
  while ((match = re.exec(line)) !== null) {
    const key = match[1]
    const value = match[2]
    if (value !== undefined) {
      if (tags[key] !== value) return false
    } else {
      if (!(key in tags)) return false
    }
  }
  return true
}

function matchesType(type: WayType, tags: Record<string, string>): boolean {
  return type.overpassLines.some(line => matchesOverpassLine(line, tags))
}

function buildPopupHTML(type: WayType, tags: Record<string, string>, id: number): string {
  const name = tags.name
  let html = `<strong>${name || type.popupLabel}</strong>`

  for (const field of type.popupFields) {
    const val = tags[field.key]
    if (val) {
      html += `<br>${field.label}: ${val}`
    }
  }

  if (import.meta.env.DEV) {
    html += `<br><a href="https://www.openstreetmap.org/way/${id}" target="_blank" rel="noopener">Abrir en OpenStreetMap</a>`
  }

  return html
}

export function createWayLayers(
  map: L.Map,
  types: WayType[],
  elements: OverpassElement[],
): POILayerGroup[] {
  const layers = new Map<string, { type: WayType; layer: L.LayerGroup; count: number }>()
  for (const type of types) {
    layers.set(type.id, { type, layer: L.layerGroup(), count: 0 })
  }

  for (const el of elements) {
    if (el.type !== 'way' || !el.geometry) continue

    const latlngs = el.geometry.map(p => L.latLng(p.lat, p.lon))

    for (const entry of layers.values()) {
      if (!matchesType(entry.type, el.tags)) continue

      L.polyline(latlngs, entry.type.style)
        .bindPopup(buildPopupHTML(entry.type, el.tags, el.id))
        .addTo(entry.layer)
      entry.count++
    }
  }

  const result: POILayerGroup[] = []
  for (const entry of layers.values()) {
    if (entry.count > 0) {
      entry.layer.addTo(map)
    }
    result.push({
      parentLabel: entry.type.label,
      subtype: { key: entry.type.id, label: entry.type.label, icon: entry.type.icon },
      layer: entry.layer,
      count: entry.count,
    })
    devLog(`  ${entry.type.label}: ${entry.count} vías`)
  }

  return result
}
