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
  fallbackIcon: string
  subtypes: POISubtype[]
  popupFields: POIPopupField[]
}

export const POI_TYPES: POIType[] = [
  {
    tag: 'amenity',
    value: 'bicycle_parking',
    label: 'Aparcamientos de bici',
    fallbackIcon: '/src/icons/parking-other.svg',
    subtypes: [
      { key: 'stands', label: 'U-invertida', icon: '/src/icons/parking-stands.svg' },
      { key: 'wall_loops', label: 'De rueda', icon: '/src/icons/parking-wall-loops.svg' },
    ],
    popupFields: [
      { key: 'bicycle_parking', label: 'Tipo' },
      { key: 'capacity', label: 'Capacidad' },
      { key: 'covered', label: 'Cubierto' },
    ],
  },
]
