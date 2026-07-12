import * as L from 'leaflet'
import './style.css'
import { MAP_OPTIONS } from './config'
import { cyclosmLayer } from './layers'

const map = L.map('map', MAP_OPTIONS)
cyclosmLayer.addTo(map)
