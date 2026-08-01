import type { LatLngBounds } from 'leaflet'
import type { POIType } from './poi-types'
import type { WayType } from './way-types'
import { loadCache, saveCache, isFresh, hashString } from './cache'

export interface FetchResult {
  elements: OverpassElement[]
  fetchedAt: number
}

export interface OverpassElement {
  id: number
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  geometry?: { lat: number; lon: number }[]
  tags: Record<string, string>
}

export interface POI {
  id: number
  type: string
  lat: number
  lon: number
  tags: Record<string, string>
}

async function overpassQuery(query: string): Promise<OverpassElement[]> {
  const url = 'https://overpass-api.de/api/interpreter'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'composcleta-osm-map/1.0 (https://github.com/adrinieto/composcleta-map)',
    },
    body: new URLSearchParams({ data: query }),
  })
  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)
  const data: { elements: OverpassElement[] } = await res.json()
  return data.elements
}

function bboxString(bounds: LatLngBounds): string {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  return `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`
}

export async function fetchAllData(
  bounds: LatLngBounds,
  poiTypes: POIType[],
  wayTypes: WayType[],
): Promise<FetchResult> {
  const bbox = bboxString(bounds)

  const poiLines = poiTypes.flatMap(t => [
    `node["${t.tag}"="${t.value}"](${bbox})`,
    `way["${t.tag}"="${t.value}"](${bbox})`,
    `relation["${t.tag}"="${t.value}"](${bbox})`,
  ])
  const wayLines = wayTypes.flatMap(t => t.overpassLines.map(l => `${l}(${bbox})`))
  const allLines = [...poiLines, ...wayLines]

  const query = `
[out:json][timeout:25];
(
  ${allLines.join(';\n')};
);
out center geom;
`

  const cacheKey = `composcleta:overpass:${bbox}:${hashString(query)}`
  const cached = loadCache<OverpassElement[]>(cacheKey)
  if (cached && isFresh(cached)) {
    return { elements: cached.data, fetchedAt: cached.timestamp }
  }

  try {
    const elements = await overpassQuery(query)
    saveCache(cacheKey, elements)
    return { elements, fetchedAt: Date.now() }
  } catch (err) {
    if (cached) {
      return { elements: cached.data, fetchedAt: cached.timestamp }
    }
    throw err
  }
}

export async function fetchPOIs(
  bounds: LatLngBounds,
  types: POIType[],
): Promise<Map<string, POI[]>> {
  const bbox = bboxString(bounds)

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

  const elements = await overpassQuery(query)

  const grouped = new Map<string, POI[]>()
  for (const type of types) {
    grouped.set(
      `${type.tag}=${type.value}`,
      elements
        .filter((e) => e.tags[type.tag] === type.value)
        .map((e) => {
          const lat = e.lat ?? e.center?.lat ?? 0
          const lon = e.lon ?? e.center?.lon ?? 0
          return { id: e.id, type: e.type, lat, lon, tags: e.tags }
        }),
    )
  }

  return grouped
}
