export interface POIPopupField {
  key: string
  label: string
}

export interface POISubtype {
  key: string
  label: string
  icon: string
}

export interface POIType {
  tag: string
  value: string
  label: string
  popupLabel: string
  fallbackIcon: string
  subtypes: POISubtype[]
  popupFields: POIPopupField[]
}

export const POI_TYPES: POIType[] = [
  {
    tag: 'amenity',
    value: 'bicycle_parking',
    label: 'Aparcamientos de bici',
    popupLabel: 'Aparcamiento de bici',
    fallbackIcon: new URL('./icons/parking-other.svg', import.meta.url).href,
    subtypes: [
      { key: 'stands', label: 'U-invertida', icon: new URL('./icons/parking-stands.svg', import.meta.url).href },
      { key: 'wall_loops', label: 'De rueda', icon: new URL('./icons/parking-wall-loops.svg', import.meta.url).href },
    ],
    popupFields: [
      { key: 'name', label: 'Nombre' },
      { key: 'bicycle_parking', label: 'Tipo' },
      { key: 'capacity', label: 'Capacidad' },
      { key: 'covered', label: 'Cubierto' },
    ],
  },
  {
    tag: 'amenity',
    value: 'bicycle_repair_station',
    label: 'Servicios',
    popupLabel: 'Estación de reparación',
    fallbackIcon: new URL('./icons/repair.svg', import.meta.url).href,
    subtypes: [],
    popupFields: [
      { key: 'name', label: 'Nombre' },
      { key: 'service:bicycle:cleaning', label: 'Limpieza' },
      { key: 'service:bicycle:pump', label: 'Bomba de aire' },
      { key: 'service:bicycle:screwdriver', label: 'Destornillador' },
      { key: 'service:bicycle:tools', label: 'Herramientas' },
      { key: 'service:bicycle:chain_tool', label: 'Reparación de cadena' },
      { key: 'service:bicycle:stand', label: 'Soporte' },
    ],
  },
]
