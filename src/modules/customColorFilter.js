function updateCustomFilter(matrix) {
  // Get the SVG element by its ID
  const svg = document.getElementById('colorblindFilters')
  if (!svg) {
    console.error("SVG element with id 'colorblindFilters' not found.")
    return
  }

  let defs = svg.querySelector('defs')
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    svg.prepend(defs)
  }

  let filter = defs.querySelector('#custom')
  if (!filter) {
    filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.setAttribute('id', 'custom')
    defs.appendChild(filter)
  }

  let feColorMatrix = filter.querySelector('feColorMatrix')
  if (!feColorMatrix) {
    feColorMatrix = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feColorMatrix'
    )
    feColorMatrix.setAttribute('in', 'SourceGraphic')
    feColorMatrix.setAttribute('type', 'matrix')
    filter.appendChild(feColorMatrix)
  }

  const rowKeys = ['row1', 'row2', 'row3', 'row4']
  const rows = rowKeys.map((key) => {
    const row = matrix[key]

    // Debugging: Log exact issue
    if (!row) {
      console.error('Matrix property is missing or undefined.')
      return '0, 0, 0, 0, 0'
    }
    if (!Array.isArray(row)) {
      console.error('Matrix property is not an array:', row)
      return '0, 0, 0, 0, 0'
    }
    if (row.length !== 5) {
      console.error('Matrix property does not have exactly 5 values:', row)
      return '0, 0, 0, 0, 0'
    }

    return row.join(', ')
  })

  const valuesString = rows.join(' ')

  feColorMatrix.setAttribute('values', valuesString)
  applyFilter('custom')
}
module.exports = {
  updateCustomFilter: updateCustomFilter,
}
