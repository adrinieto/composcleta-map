import * as L from 'leaflet'
import type { POILayerGroup } from './pois'
import { isMobile } from './utils'

function createFilterRow(
  map: L.Map,
  parent: HTMLElement,
  group: POILayerGroup,
): void {
  const row = L.DomUtil.create('label', 'filter-row', parent)

  const checkbox = L.DomUtil.create('input', '', row) as HTMLInputElement
  checkbox.type = 'checkbox'
  checkbox.checked = true

  const img = L.DomUtil.create('img', 'filter-icon', row) as HTMLImageElement
  img.src = group.subtype!.icon
  img.width = 20
  img.height = 20
  img.alt = ''

  const span = L.DomUtil.create('span', '', row)
  span.textContent = group.subtype!.label

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

export function createFilter(
  map: L.Map,
  groups: POILayerGroup[],
): void {
  const FilterControl = L.Control.extend({
    onAdd() {
      const container = L.DomUtil.create('div', 'filter-panel')
      L.DomEvent.disableClickPropagation(container)

      const header = L.DomUtil.create('div', 'filter-header', container)
      header.textContent = 'Filtros'

      const toggle = L.DomUtil.create('button', 'filter-toggle', header)
      toggle.textContent = '−'

      const list = L.DomUtil.create('div', 'filter-list', container)

      const byParent = new Map<string, POILayerGroup[]>()
      for (const group of groups) {
        const existing = byParent.get(group.parentLabel) ?? []
        existing.push(group)
        byParent.set(group.parentLabel, existing)
      }

      for (const [parentLabel, parentGroups] of byParent) {
        const section = L.DomUtil.create('div', 'filter-section', list)

        const sectionHeader = L.DomUtil.create(
          'div',
          'filter-section-header',
          section,
        )

        const sectionLabel = L.DomUtil.create('span', '', sectionHeader)
        const total = parentGroups.reduce((s, g) => s + g.count, 0)
        sectionLabel.textContent = `${parentLabel} (${total})`

        const sectionList = L.DomUtil.create('div', 'filter-section-list', section)

        for (const group of parentGroups) {
          createFilterRow(map, sectionList, group)
        }
      }

      let collapsed = isMobile()
      toggle.textContent = collapsed ? '+' : '−'
      if (collapsed) list.style.display = 'none'
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
