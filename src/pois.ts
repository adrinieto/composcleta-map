import * as L from 'leaflet'
import type { POIType, POISubtype } from './poi-types'
import { fetchPOIs } from './overpass'
import { CONCELLO_BOUNDS } from './config'
import { devLog } from './utils'

export interface POILayerGroup {
  parentLabel: string
  subtype: POISubtype | null
  layer: L.LayerGroup
  count: number
}

function buildPopupHTML(type: POIType, tags: Record<string, string>): string {
  let html = `<strong>${type.popupLabel}</strong>`

  const rows = type.popupFields
    .filter((f) => tags[f.key])
    .map((f) => `<br>${f.label}: ${tags[f.key]}`)

  if (rows.length > 0) {
    html += rows.join('')
  }

  return html
}

function resolveIcon(
  type: POIType,
  tags: Record<string, string>,
): string {
  if (type.subtypes.length === 0) return type.fallbackIcon
  const subtypeKey = tags[type.tag === 'amenity' ? 'bicycle_parking' : type.tag]
  const subtype = type.subtypes.find((s) => s.key === subtypeKey)
  return subtype?.icon ?? type.fallbackIcon
}

export async function createPOIMarkers(
  map: L.Map,
  types: POIType[],
): Promise<POILayerGroup[]> {
  const data = await fetchPOIs(CONCELLO_BOUNDS, types)
  const result: POILayerGroup[] = []

  for (const type of types) {
    const key = `${type.tag}=${type.value}`
    const pois = data.get(key) ?? []

    devLog(`Fetched ${pois.length} ${type.label}`)

    const groups = new Map<string, POILayerGroup>()

    if (type.subtypes.length === 0) {
      groups.set('__main__', {
        parentLabel: type.label,
        subtype: { key: '__main__', label: type.popupLabel, icon: type.fallbackIcon },
        layer: L.layerGroup(),
        count: 0,
      })
    } else {
      for (const subtype of type.subtypes) {
        groups.set(subtype.key, { parentLabel: type.label, subtype, layer: L.layerGroup(), count: 0 })
      }
      groups.set('__other__', {
        parentLabel: type.label,
        subtype: { key: '__other__', label: 'Otros', icon: type.fallbackIcon },
        layer: L.layerGroup(),
        count: 0,
      })
    }

    for (const poi of pois) {
      let groupKey: string

      if (type.subtypes.length === 0) {
        groupKey = '__main__'
      } else {
        const subtypeKey = poi.tags[type.tag === 'amenity' ? 'bicycle_parking' : type.tag]
        groupKey = type.subtypes.some((s) => s.key === subtypeKey)
          ? subtypeKey
          : '__other__'
      }

      const group = groups.get(groupKey)!
      const iconUrl = resolveIcon(type, poi.tags)

      const icon = L.divIcon({
        className: 'poi-marker',
        html: `<img src="${iconUrl}" width="28" height="28" alt="${type.label}">`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      })

      L.marker([poi.lat, poi.lon], { icon })
        .bindPopup(buildPopupHTML(type, poi.tags))
        .addTo(group.layer)

      group.count++
    }

    for (const group of groups.values()) {
      if (group.count > 0) {
        group.layer.addTo(map)
        devLog(`  ${group.subtype!.label}: ${group.count}`)
      }
      result.push(group)
    }
  }

  return result
}
