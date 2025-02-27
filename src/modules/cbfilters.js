function applyFilter(type) {
  const filters = {
    normal: 'none',
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    protanomaly: 'url(#protanomaly)',
    deuteranomaly: 'url(#deuteranomaly)',
    tritanomaly: 'url(#tritanomaly)',
    achromatopsia: 'url(#achromatopsia)',
    custom: 'url(#custom)',
  }
  const elements = document.querySelectorAll('canvas, iframe')
  const filterValue = type === 'normal' ? filters.normal : filters[type]
  elements.forEach((element) => {
    element.style.filter = filterValue
  })
}
module.exports = {
  applyFilter: applyFilter,
}
