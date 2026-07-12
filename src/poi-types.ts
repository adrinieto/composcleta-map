export interface POIPopupField {
  key: string
  label: string
}

export interface POIType {
  tag: string
  value: string
  label: string
  icon: string
  popupFields: POIPopupField[]
}

export const POI_TYPES: POIType[] = [
  {
    tag: 'amenity',
    value: 'bicycle_parking',
    label: 'Aparcamiento de bicicletas',
    icon: '/src/icons/parking.svg',
    popupFields: [
      { key: 'capacity', label: 'Capacidad' },
      { key: 'covered', label: 'Cubierto' },
    ],
  },
]
