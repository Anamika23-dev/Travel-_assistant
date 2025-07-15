//geolocation Api (used to get the user current location)

const locationElement = document.getElementById('location');

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      locationElement.innerText = `🗺️ You are at location : ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
       getWeather(latitude, longitude);
    },
    (error) => {
      locationElement.innerText = " Failed to get location.";
      console.error(error);
    }
  );
} else {
  locationElement.innerText = "Geolocation is not supported.";
}

// INTERSECTION OBSERVER

const cards = document.querySelectorAll("[data-observe]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.3,
});

cards.forEach(card => observer.observe(card));

// NETWORK INFO API
const networkStatus = document.getElementById('networkStatus');

function updateNetworkStatus() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    networkStatus.innerText = "🌐 Network info not supported in your browser.";
    return;
  }

  const type = connection.effectiveType;
  const downlink = connection.downlink;

  networkStatus.innerText = `🌐 You are on a ${type.toUpperCase()} connection (${downlink} Mbps).`;

  if (type === 'slow-2g' || type === '2g') {
    networkStatus.innerText += " ⚠️ You are on a slow connection. Switching to low data mode!";
  }
}

updateNetworkStatus();


//Weather Api(used to get the weather info based on the user Location)

function getWeather(lat, lon) {
  const apiKey = "23837b443d64f0b53e448d04dc82c2dd"
  console.log("🌐 Calling getWeather with:", lat, lon);  

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const weatherBox = document.createElement('div');
      weatherBox.className = 'card';
      weatherBox.innerHTML = `
        <h3>🌤️ Weather Info</h3>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🌥️ Condition: ${data.weather[0].main}</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
      `;
      document.getElementById("places-section").appendChild(weatherBox);
    })
    .catch(err => {
      console.error("Weather error:", err);
    });
}

//canvas api used to drAw on the map)
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

let penColor = document.getElementById("colorPicker").value;
let penSize = document.getElementById("penSize").value;

document.getElementById("colorPicker").addEventListener("change", (e) => {
  penColor = e.target.value;
});

document.getElementById("penSize").addEventListener("input", (e) => {
  penSize = e.target.value;
});

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.fillStyle = "#00ffe5";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();

  document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  })

  document.getElementById("addText").addEventListener("click", () => {
  const text = document.getElementById("canvasText").value;
  if (text.trim()) {
    ctx.font = "16px Segoe UI";
    ctx.fillStyle = penColor;
    ctx.fillText(text, 10, 30); 
  }
});
});




//Background task Api (used to show a travel tip after a delay)
//this function shows a travel  tip after a delay using requestcalback and settimeout as a fallback
//useful for the performance optimization of the app and show the the tip when browser is idle and has spare time 

function showTravelTip() {
    console.log(" Showing th etravel tip........")
  const tipBox = document.createElement("div");
  tipBox.className = "card";
  tipBox.innerHTML = `
    <h3>💡 Travel Tip</h3>
    <p>Remember to carry a power bank and stay hydrated while exploring!</p>
  `;
  document.getElementById("places-section").appendChild(tipBox);
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    showTravelTip();
  });
} else {
  setTimeout(showTravelTip, 3000); 
}
