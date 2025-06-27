// CTI Dashboard – IOC loader en visualisatie (ThreatFox mock)

async function loadIOCFeed() {
  try {
    // Stap 1: Haal statische IOC feed op
    const response = await fetch("ioc.json");
    const data = await response.json();

    // Stap 2: Selecteer het HTML-element
    const feedEl = document.getElementById("ioc-feed");

    // Stap 3: Leeg eerst de inhoud (voor veiligheid)
    feedEl.innerHTML = "";

    // Stap 4: Laat max 10 IOC’s zien
    data.slice(0, 10).forEach(entry => {
      const p = document.createElement("p");
      p.classList = "ioc-card";
      p.innerHTML = `
        <strong>${entry.indicator}</strong> — 
        ${entry.malware || "Onbekend"} 
        <span class="text-xs text-gray-500">[${entry.ioc_type}]</span>
      `;
      feedEl.appendChild(p);
    });

    // Stap 5: Maak Chart
    const labels = data.slice(0, 10).map(i => i.indicator);
    const values = data.slice(0, 10).map(i => i.confidence_score);
    const ctx = document.getElementById('iocChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Confidence Score',
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Confidence: ${ctx.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

  } catch (err) {
    console.error("Fout bij laden van IOC feed:", err);
    const feedEl = document.getElementById("ioc-feed");
    feedEl.innerHTML = "<p class='text-red-600'>⚠️ Kon de IOC-feed niet laden.</p>";
  }
}

// Laad de feed zodra de pagina geladen is
loadIOCFeed();
