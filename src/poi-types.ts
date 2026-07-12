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
    fallbackIcon: '/src/icons/parking-other.svg',
    subtypes: [
      { key: 'stands', label: 'U-invertida', icon: '/src/icons/parking-stands.svg' },
      { key: 'wall_loops', label: 'De rueda', icon: '/src/icons/parking-wall-loops.svg' },
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
    fallbackIcon: '/src/icons/repair.svg',
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
