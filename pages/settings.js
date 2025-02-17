let settings;
settings = window.electron.getSettings();
let rpcEnabled = settings.rpc || false;

document.getElementById('rpc-toggle').addEventListener("change", () => {
    window.electron.sendSettingChange(`rpc:${!settings.rpc}`)
    settings.rpc = !settings.rpc
});

document.getElementById('brainrot-toggle').addEventListener("change", () => {
    window.electron.sendSettingChange(`brainrot:${!settings.brainrot}`)
    settings.brainrot = !settings.brainrot
});

window.electron.on('skin-upload', (_, { success, message }) => {
    const toastContainer = document.getElementById('status-toast');
    if (!toastContainer) return;

    const alert = document.createElement('div');
    alert.className = `px-2 py-1 alert  ${success ? 'alert-success' : 'alert-error'}`;
    alert.innerHTML = `<span>${message}</span>`; // Set content using innerHTML for simplicity

    toastContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 2000); // Remove the alert after 2 seconds
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

  // Update the filter matrix using slider values (diagonal matrix)
  function updateFilter() {
    const red   = parseFloat(redSlider.value)   || 0;
    const green = parseFloat(greenSlider.value) || 0;
    const blue  = parseFloat(blueSlider.value)  || 0;
    const alpha = parseFloat(alphaSlider.value) || 0;
    // Construct a 4x5 matrix: each slider sets the diagonal for its output channel.
    const matrixValues = [
      red,   0,     0,     0, 0,
      0,   green,   0,     0, 0,
      0,     0,   blue,    0, 0,
      0,     0,     0,   alpha, 0
    ];
    feColorMatrix.setAttribute('values', matrixValues.join(' '));
  }

  // Listen for slider changes
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