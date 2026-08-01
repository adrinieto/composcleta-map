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
  {
    id: 'speed30',
    parentLabel: 'Infraestructura ciclista',
    label: 'Calles 30',
    popupLabel: 'Calle limitada a 30',
    overpassLines: [
      'way["oneway"="yes"]["maxspeed"="30"]',
      'way["oneway"="yes"]["maxspeed"="30 km/h"]',
      'way["oneway"="yes"]["zone:maxspeed"="30"]',
      'way["oneway"="yes"]["zone:maxspeed:forward"="30"]',
      'way["oneway"="yes"]["zone:maxspeed:backward"="30"]',
      'way["oneway"="yes"]["maxspeed:type"="zone30"]',
    ],
    style: {
      color: '#0ca678',
      weight: 5,
      opacity: 0.8,
    },
    popupFields: [
      { key: 'name', label: 'Nombre' },
      { key: 'maxspeed', label: 'Velocidad máxima' },
      { key: 'zone:maxspeed', label: 'Zona 30' },
    ],
    icon: new URL('./icons/speed30.svg', import.meta.url).href,
  },
  {
    id: 'speed20',
    parentLabel: 'Infraestructura ciclista',
    label: 'Calles 20',
    popupLabel: 'Calle limitada a 20',
    overpassLines: [
      'way["oneway"="yes"]["maxspeed"="20"]',
      'way["oneway"="yes"]["maxspeed"="20 km/h"]',
      'way["oneway"="yes"]["zone:maxspeed"="20"]',
      'way["oneway"="yes"]["zone:maxspeed:forward"="20"]',
      'way["oneway"="yes"]["zone:maxspeed:backward"="20"]',
      'way["oneway"="yes"]["maxspeed:type"="zone20"]',
    ],
    style: {
      color: '#66a80f',
      weight: 5,
      opacity: 0.8,
    },
    popupFields: [
      { key: 'name', label: 'Nombre' },
      { key: 'maxspeed', label: 'Velocidad máxima' },
      { key: 'zone:maxspeed', label: 'Zona 20' },
    ],
    icon: new URL('./icons/speed20.svg', import.meta.url).href,
  },
]
