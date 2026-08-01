import type { PolylineOptions } from 'leaflet'

export interface WayType {
  id: string
  label: string
  popupLabel: string
  overpassLines: string[]
  style: PolylineOptions
  popupFields: { key: string; label: string }[]
  icon: string
}

export const WAY_TYPES: WayType[] = [
  {
    id: 'contraflow',
    label: 'Contrasentido bici',
    popupLabel: 'Calle con contrasentido ciclista',
    overpassLines: [
      'way["oneway"]["oneway:bicycle"="no"]',
      'way["oneway"]["cycleway"="opposite"]',
      'way["oneway"]["cycleway"="opposite_lane"]',
      'way["oneway"]["cycleway"="opposite_track"]',
      'way["oneway"]["cycleway:left"="opposite"]',
      'way["oneway"]["cycleway:right"="opposite"]',
      'way["oneway:bicycle"="-1"]',
    ],
    style: {
      color: '#d57aff',
      weight: 5,
      opacity: 0.8,
    },
    popupFields: [
      { key: 'oneway', label: 'Dirección única' },
      { key: 'oneway:bicycle', label: 'Bici contrasentido' },
      { key: 'cycleway', label: 'Carril bici' },
      { key: 'cycleway:left', label: 'Carril bici (izq)' },
      { key: 'cycleway:right', label: 'Carril bici (der)' },
      { key: 'maxspeed', label: 'Límite velocidad' },
    ],
    icon: new URL('./icons/contraflow.svg', import.meta.url).href,
  },
]
