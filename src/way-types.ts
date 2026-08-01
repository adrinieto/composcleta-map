import type { PolylineOptions } from 'leaflet'

export interface WayType {
  id: string
  parentLabel: string
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
    parentLabel: 'Infraestructura ciclista',
    label: 'Contrasentido bici',
    popupLabel: 'Calle con circulación en contrasentido',
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
      weight: 10,
      opacity: 1,
    },
    popupFields: [
      { key: 'oneway', label: 'Dirección única' },
      { key: 'oneway:bicycle', label: 'Bici dirección única' },
      { key: 'cycleway', label: 'Carril bici' },
      { key: 'cycleway:left', label: 'Carril bici (izq)' },
      { key: 'cycleway:right', label: 'Carril bici (der)' },
      { key: 'maxspeed', label: 'Límite velocidad' },
    ],
    icon: new URL('./icons/contraflow.svg', import.meta.url).href,
  },
]
