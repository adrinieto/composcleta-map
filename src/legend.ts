import * as L from 'leaflet'

export function addLegendControl(map: L.Map): void {
  let dialog: HTMLElement | null = null

  const LegendControl = L.Control.extend({
    options: { position: 'bottomright' },

    onAdd() {
      const container = L.DomUtil.create('div', 'legend-control')
      const btn = L.DomUtil.create('a', '', container)
      btn.href = '#'
      btn.title = 'Leyenda CyclOSM'
      btn.textContent = '\uD83D\uDCD6'

      L.DomEvent.disableClickPropagation(container)
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        if (dialog) {
          dialog.remove()
          dialog = null
          return
        }

        dialog = L.DomUtil.create('div', 'legend-dialog', map.getContainer())
        const header = L.DomUtil.create('div', 'legend-dialog-header', dialog)
        L.DomUtil.create('span', '', header).textContent = 'Leyenda CyclOSM'
        const close = L.DomUtil.create('button', 'legend-dialog-close', header)
        close.textContent = '\u00D7'
        close.addEventListener('click', () => {
          dialog?.remove()
          dialog = null
        })

        const iframe = L.DomUtil.create('iframe', 'legend-dialog-iframe', dialog)
        iframe.src = 'https://www.cyclosm.org/legend.html'
        iframe.loading = 'lazy'

        L.DomEvent.disableClickPropagation(dialog)
        L.DomEvent.disableScrollPropagation(dialog)
      })

      return container
    },
  })

  new LegendControl().addTo(map)
}
