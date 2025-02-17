

const statsBgColor = "#010203";
const statsTextColor = "#ffffff";
window.addEventListener('DOMContentLoaded', () => {
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .stats-container {
                position: absolute;
                padding: 1rem; /* 16px */
                gap: 0.5rem; /* 8px */
                z-index: 9999;
                background-color: ${statsBgColor};
                color: ${statsTextColor};
                font-family: 'Encode Sans SemiCondensed', sans-serif;
            }

            .stats-table {
                border-collapse: collapse;
                width: fit-content;
            }

            .stats-row {
                display: table-row;
            }

            .stats-label,
            .stats-value {
                padding: 4px 8px; /* Adjust padding for spacing */
            }

            .stats-label {
                text-align: left;
                font-weight: 600; /* Semi-bold */
            }

            .stats-value {
                text-align: right;
            }
        </style>
    `);
    function statsHTML(options) {
        let html = `
        <div id="stats" class="stats-container">
            <table class="stats-table">
        `;
    
        if (options.fps) {
            html += `
                <tr class="stats-row">
                    <td class="stats-label">FPS:</td>
                    <td id="fps" class="stats-value">--</td>
                </tr>
            `;
        }
    
        if (options.ping) {
            html += `
                <tr class="stats-row">
                    <td class="stats-label">Ping:</td>
                    <td id="ping" class="stats-value">--</td>
                </tr>
            `;
        }
    
        if (options.cpu) {
            html += `
                <tr class="stats-row">
                    <td class="stats-label">CPU Usage:</td>
                    <td id="cpu-usage" class="stats-value">--</td>
                </tr>
            `;
        }
    
        if (options.ram) {
            html += `
                <tr class="stats-row">
                    <td class="stats-label">RAM Usage:</td>
                    <td id="ram-usage" class="stats-value">--</td>
                </tr>
            `;
        }
    
        if (options.uptime) {
            html += `
                <tr class="stats-row">
                    <td class="stats-label">Uptime:</td>
                    <td id="uptime" class="stats-value">--</td>
                </tr>
            `;
        }
    
        html += `
            </table>
        </div>
        `;
    
        return html;
    }
    document.body.insertAdjacentHTML('beforeend', statsHTML({fps:true, ping:true, cpu:true, ram:true, uptime:true}));


    // Make stats container draggable
    const statsContainer = document.getElementById('stats');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    statsContainer.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - statsContainer.offsetLeft;
        offsetY = event.clientY - statsContainer.offsetTop;
        statsContainer.classList.add('dragging');
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            statsContainer.style.left = `${event.clientX - offsetX}px`;
            statsContainer.style.top = `${event.clientY - offsetY}px`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        statsContainer.classList.remove('dragging');
    });
    
// colorblind filters SVG
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('style', 'height:0px; width:0px');
svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svg.setAttribute('version', '1.1');
svg.setAttribute('id', 'colorblindFilters')

svg.innerHTML = `
<defs>
  <filter id="protanopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.8, 0.7, 0,   0, 0
              0.2, 1.2, 0,   0, 0
              0,   0.3, 1.5, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="deuteranopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.6, 0.4, 0,   0, 0
              0.4, 1.6, 0,   0, 0
              0,   0.2, 1.8, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="tritanopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.05, 0,  0,   0, 0
              0,    1.6, 0.4, 0, 0
              0,    0.4, 1.6, 0, 0
              0,    0,   0,   1, 0"/>
  </filter>
  <filter id="achromatopsia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.0, 0.5, 0.5, 0, 0
              0.5, 1.0, 0.5, 0, 0
              0.5, 0.5, 1.0, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="protanomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.4, 0.6, 0,   0, 0
            0.1, 1.6, 0,   0, 0
            0,   0.2, 1.8, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
<filter id="deuteranomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.3, 0.7, 0,   0, 0
            0.2, 1.4, 0.4, 0, 0
            0,   0.3, 1.7, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
<filter id="tritanomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.1, 0.1, 0,   0, 0
            0,   1.5, 0.5, 0, 0
            0,   0.5, 1.5, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
</defs>

`;
document.body.insertAdjacentElement('afterbegin', svg);

// colorblind filters JS  
const filterScript = document.createElement('script');
filterScript.textContent = `
const filters = {
  normal: 'none',
  protanopia: 'url(#protanopia)',
  deuteranopia: 'url(#deuteranopia)',
  tritanopia: 'url(#tritanopia)',
  protanomaly: 'url(#protanomaly)',
  deuteranomaly: 'url(#deuteranomaly)',
  tritanomaly: 'url(#tritanomaly)',
  achromatopsia: 'url(#achromatopsia)', 
  custom: 'url(#custom)'
};

function applyFilter(type) {
    const elements = document.querySelectorAll('canvas, iframe');
    const filterValue = type === 'normal' ? filters.normal : filters[type];
    elements.forEach(element => {
      element.style.filter = filterValue;
    });
} 
`;

//custom filters js
const customFilterScript = document.createElement('script');
customFilterScript.textContent = `
    function updateCustomFilter(matrix) {
        // Get the SVG element by its ID
        const svg = document.getElementById("colorblindFilters");
        if (!svg) {
          console.error("SVG element with id 'colorblindFilters' not found.");
          return;
        }
    
        // Ensure there is a <defs> element; create one if it doesn't exist
        let defs = svg.querySelector("defs");
        if (!defs) {
          defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          svg.prepend(defs);
        }
    
        // Check for an existing filter with id "custom"
        let filter = defs.querySelector("#custom");
        if (!filter) {
          filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
          filter.setAttribute("id", "custom");
          defs.appendChild(filter);
        }
    
        // Check for an existing feColorMatrix; create one if needed
        let feColorMatrix = filter.querySelector("feColorMatrix");
        if (!feColorMatrix) {
          feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
          feColorMatrix.setAttribute("in", "SourceGraphic");
          feColorMatrix.setAttribute("type", "matrix");
          filter.appendChild(feColorMatrix);
        }
    
        // Convert the matrix object into a single string of values.
        // We expect the object to have keys: row1, row2, row3, row4.
        const rowKeys = ["row1", "row2", "row3", "row4"];
        const rows = rowKeys.map(key => {
          const row = matrix[key];
    
          // Debugging: Log exact issue
          if (!row) {
            console.error('Matrix property is missing or undefined.');
            return "0, 0, 0, 0, 0"; // Default row to avoid breaking
          }
          if (!Array.isArray(row)) {
            console.error('Matrix property is not an array:', row);
            return "0, 0, 0, 0, 0"; // Default row to avoid breaking
          }
          if (row.length !== 5) {
            console.error('Matrix property does not have exactly 5 values:', row);
            return "0, 0, 0, 0, 0"; // Default row to avoid breaking
          }
    
          return row.join(", ");
        });
    
        const valuesString = rows.join(" ");
    
        // Update the values attribute of the feColorMatrix element
        feColorMatrix.setAttribute("values", valuesString);
        applyFilter('custom')
    }
    


`
console.log("pre")
document.body.insertAdjacentElement('beforeend', filterScript);
document.body.insertAdjacentElement('beforeend', customFilterScript);
console.log("post")

// brainrot mode overlay
const brainrotScript = document.createElement('script');
brainrotScript.textContent = `
function toggleBrainrot(show) {
  const videoUrls = [
    "https://www.youtube.com/embed/3xWJ0FSgJVE?autoplay=1",
    "https://www.youtube.com/embed/RnpO6tM6A8k?autoplay=1",
    "https://www.youtube.com/embed/bXVcXbhhxcI?autoplay=1" ,
    "https://www.youtube.com/embed/qmwgpPfDieI?autoplay=1"
  ];

  const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

  const existingOverlay = document.getElementById("youtube-overlay");

  if (show) {
    if (!existingOverlay) {
      const overlay = document.createElement("div");
      overlay.id = "youtube-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = "9999";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
      overlay.style.opacity = "0.25"; 
      overlay.style.pointerEvents = "none";  
      const iframe = document.createElement("iframe");
      iframe.src = randomVideoUrl;
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; encrypted-media";
      iframe.style.position = "absolute";
      iframe.style.top = "50%";
      iframe.style.left = "50%";
      iframe.style.transform = "translate(-50%, -50%)";
      iframe.style.width = "100%"; // Adjust width as needed
      iframe.style.height = "100%"; // Adjust height as needed
      iframe.style.opacity = "1";  // Set the opacity to 100% for the iframe

      // Append the iframe to the overlay div
      overlay.appendChild(iframe);
      
      // Append the overlay div to the body
      document.body.appendChild(overlay);
    }
  } else {
    // Remove the overlay if it exists
    if (existingOverlay) {
      existingOverlay.remove();
    }
  }
  }
  
`
document.body.insertAdjacentElement('beforeend', brainrotScript)

}); //DOMContentLoaded