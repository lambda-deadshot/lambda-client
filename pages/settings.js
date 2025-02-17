let settings;
settings = window.electron.getSettings();
let rpcEnabled = settings.rpc || false;

function fireToast(success, message) {
    const toastContainer = document.getElementById('status-toast');
    if (!toastContainer) return;
    const alert = document.createElement('div');
    alert.className = `px-2 py-1 alert  ${success ? 'alert-success' : 'alert-error'}`;
    alert.innerHTML = `<span>${message}</span>`; 

    toastContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 2000); 
}

document.getElementById('rpc-toggle').addEventListener("change", () => {
    window.electron.sendSettingChange(`rpc:${!settings.rpc}:${document.getElementById('rpc-text').value}`)
    settings.rpc = !settings.rpc
});

document.getElementById('brainrot-toggle').addEventListener("change", () => {
    window.electron.sendSettingChange(`brainrot:${!settings.brainrot}`)
    settings.brainrot = !settings.brainrot
});

window.electron.on('skin-upload', (_, { success, message }) => {
    fireToast(success, message)
});


document.getElementById('ar-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("ar", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('ar-player-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("ar-player", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('awp-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("awp", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('awp-player-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("awp-player", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('smg-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("smg", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('smg-player-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("smg-player", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('shotgun-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("shotgun", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('shotgun-player-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("shotgun-player", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

document.getElementById('mainmenu-upload').addEventListener("change", (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === "image/webp") {
        const reader = new FileReader();

        reader.onload = () => {

            window.electron.sendSkinUpload("mainmenu", reader.result.split(',')[1]);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error("Please upload a valid WebP image.");
    }
});

//custom filters
const previewUrls = [
    './filterpreviews/factory.png',
    './filterpreviews/forest.png',
    './filterpreviews/neotokyo.png',
    './filterpreviews/refinery.png',
    './filterpreviews/snowfall.png',
    './filterpreviews/vineyard.png'
  ];

  let currentIndex = 0;
  const previewImage = document.getElementById('filterPreviewImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function updatePreviewImage() {
    previewImage.src = previewUrls[currentIndex];
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault()
    currentIndex = (currentIndex - 1 + previewUrls.length) % previewUrls.length;
    updatePreviewImage();
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    currentIndex = (currentIndex + 1) % previewUrls.length;
    updatePreviewImage();
  });

  // Get slider elements
  const redSlider = document.getElementById('redSlider');
  const greenSlider = document.getElementById('greenSlider');
  const blueSlider = document.getElementById('blueSlider');
  const alphaSlider = document.getElementById('alphaSlider');
  const feColorMatrix = document.querySelector('#customFilter feColorMatrix');
  const influenceSlider = document.getElementById('influenceSlider');
  let influence = parseFloat(influenceSlider.value) || 0.1; // Default influence

  // Update influence value when slider changes
  influenceSlider.addEventListener('input', () => {
    influence = parseFloat(influenceSlider.value) || 0;
    updateFilter(); // Apply new influence immediately
  });
  

// Update the filter matrix using slider values (with subtle cross-channel influence)
function updateFilter() {
    const red   = parseFloat(redSlider.value)   || 0;
    const green = parseFloat(greenSlider.value) || 0;
    const blue  = parseFloat(blueSlider.value)  || 0;
    const alpha = parseFloat(alphaSlider.value) || 0;
  
    const matrixValues = [
      red,   green * influence, blue * influence, 0, 0,   // Red row
      red * influence, green,   blue * influence, 0, 0,   // Green row
      red * influence, green * influence, blue,   0, 0,   // Blue row
      red * influence, green * influence, blue * influence, alpha, 0  // Alpha row
    ];
  
    feColorMatrix.setAttribute('values', matrixValues.join(' '));
  }
  
  // Listen for color slider changes
  [redSlider, greenSlider, blueSlider, alphaSlider].forEach(slider => {
    slider.addEventListener('input', updateFilter);
  });
  
  // On form submission, send the computed matrix as an object to Electron
  const form = document.getElementById('customFilterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const red   = parseFloat(redSlider.value)   || 0;
    const green = parseFloat(greenSlider.value) || 0;
    const blue  = parseFloat(blueSlider.value)  || 0;
    const alpha = parseFloat(alphaSlider.value) || 0;
    const matrixObj = {
      row1: [red,   0,    0,    0, 0],
      row2: [0,   green,  0,    0, 0],
      row3: [0,     0,  blue,   0, 0],
      row4: [0,     0,    0,  alpha, 0]
    };
    window.electron.sendCustomCBFilter(matrixObj);
  });

  // Initialize the filter on page load
  updateFilter();