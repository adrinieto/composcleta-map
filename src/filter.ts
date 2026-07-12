import * as L from 'leaflet'
import type { POILayerGroup } from './pois'

export function createFilter(
  map: L.Map,
  groups: POILayerGroup[],
): void {
  const FilterControl = L.Control.extend({
    onAdd() {
      const container = L.DomUtil.create('div', 'filter-panel')
      L.DomEvent.disableClickPropagation(container)

      const header = L.DomUtil.create('div', 'filter-header', container)
      const total = groups.reduce((sum, g) => sum + g.count, 0)
      header.textContent = `Aparcamientos de bici (${total})`

      const toggle = L.DomUtil.create('button', 'filter-toggle', header)
      toggle.textContent = '−'

      const list = L.DomUtil.create('div', 'filter-list', container)

      for (const group of groups) {
        if (!group.subtype) continue

        const row = L.DomUtil.create('label', 'filter-row', list)

        const checkbox = L.DomUtil.create('input', '', row) as HTMLInputElement
        checkbox.type = 'checkbox'
        checkbox.checked = true

        const img = L.DomUtil.create('img', 'filter-icon', row) as HTMLImageElement
        img.src = group.subtype.icon
        img.width = 20
        img.height = 20
        img.alt = ''

        const span = L.DomUtil.create('span', '', row)
        span.textContent = group.subtype.label

        const badge = L.DomUtil.create('span', 'filter-badge', row)
        badge.textContent = `${group.count}`

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            group.layer.addTo(map)
          } else {
            map.removeLayer(group.layer)
          }
        })
      }

      let collapsed = false
      toggle.addEventListener('click', () => {
        collapsed = !collapsed
        list.style.display = collapsed ? 'none' : ''
        toggle.textContent = collapsed ? '+' : '−'
      })

      return container
    },
  })

  new FilterControl({ position: 'topright' }).addTo(map)
}
