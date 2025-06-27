async function loadIOCFeed() {
  const res = await fetch("https://threatfox-api.abuse.ch/api/v1/");
  const data = await res.json();
  const feedEl = document.getElementById("ioc-feed");

  // Simpele IOC lijst tonen
  data.data.slice(0, 10).forEach(entry => {
    const item = document.createElement("p");
    item.textContent = `${entry.indicator} – ${entry.malware} (${entry.ioc_type})`;
    feedEl.appendChild(item);
  });

  // Chart
  const ctx = document.getElementById('iocChart').getContext('2d');
  const labels = data.data.slice(0, 10).map(i => i.indicator);
  const values = data.data.slice(0, 10).map(i => parseInt(i.confidence_score));
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Confidence',
        data: values,
        backgroundColor: 'rgba(75,192,192,0.5)'
      }]
    }
  });
}
loadIOCFeed();
