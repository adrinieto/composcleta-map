import type { LatLngBounds } from 'leaflet'
import type { POIType } from './poi-types'

interface OverpassElement {
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags: Record<string, string>
}

interface OverpassResponse {
  elements: OverpassElement[]
}

export interface POI {
  id: number
  lat: number
  lon: number
  tags: Record<string, string>
}

export async function fetchPOIs(
  bounds: LatLngBounds,
  types: POIType[],
): Promise<Map<string, POI[]>> {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  const bbox = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`

  const queries = types
    .map(
      (t) =>
        `node["${t.tag}"="${t.value}"](${bbox});\nway["${t.tag}"="${t.value}"](${bbox});\nrelation["${t.tag}"="${t.value}"](${bbox});`,
    )
    .join('\n')

  const query = `
[out:json][timeout:25];
(
  ${queries}
);
out center;
`

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)

  const data: OverpassResponse = await res.json()

  const grouped = new Map<string, POI[]>()
  for (const type of types) {
    grouped.set(
      `${type.tag}=${type.value}`,
      data.elements
        .filter((e) => e.tags[type.tag] === type.value)
        .map((e) => {
          const lat = e.lat ?? e.center?.lat ?? 0
          const lon = e.lon ?? e.center?.lon ?? 0
          return { id: e.id, lat, lon, tags: e.tags }
        }),
    )
  }

  return grouped
}
