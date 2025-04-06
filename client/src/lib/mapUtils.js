/**
 * Helper function to fix React-Leaflet null DOM reference issues
 */
export const fixLeafletMapOnLoad = () => {
  // Force re-render of Leaflet map container once DOM is ready
  window.dispatchEvent(new Event('resize'));
  
  // Fix Leaflet marker icon issues with webpack
  // This works when the traditional icon fix fails
  setTimeout(() => {
    document.querySelectorAll('.leaflet-marker-icon').forEach(icon => {
      if (!icon.src || icon.src.includes('marker-icon.png')) {
        icon.src = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
      }
    });
    
    document.querySelectorAll('.leaflet-marker-shadow').forEach(shadow => {
      if (!shadow.src || shadow.src.includes('marker-shadow.png')) {
        shadow.src = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
      }
    });
  }, 500);
};
