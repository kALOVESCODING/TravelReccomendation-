let travelData = null;

// Load the data from the JSON file
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Data loaded:', data);
  })
  .catch(error => console.error('Error loading data:', error));

// Search for beaches, temples or countries
function searchRecommendations() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!keyword) return;

  if (!travelData) {
    resultsDiv.innerHTML = '<p class="no-results">Data is still loading. Please try again.</p>';
    return;
  }

  let matches = [];

  if (keyword.includes('beach')) {
    matches = travelData.beaches || travelData.beach || [];
  } else if (keyword.includes('temple')) {
    matches = travelData.temples || travelData.temple || [];
  } else if (keyword.includes('countr')) {
    (travelData.countries || []).forEach(country => {
      matches.push(...country.cities);
    });
  } else {
    // Also allow a country name, for example "japan"
    const country = (travelData.countries || []).find(c =>
      c.name.toLowerCase().includes(keyword)
    );
    if (country) matches = country.cities;
  }

  console.log('Keyword:', keyword, 'Matches:', matches);

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p class="no-results">No results found. Try beach, temple or country.</p>';
    return;
  }

  matches.forEach(place => {
    const time = place.timeZone
      ? new Date().toLocaleTimeString('en-US', { timeZone: place.timeZone, hour12: true })
      : '';

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      ${time ? `<p>Local time: ${time}</p>` : ''}
    `;
    resultsDiv.appendChild(card);
  });
}

// Clear the results and the search box
function resetResults() {
  document.getElementById('results').innerHTML = '';
  document.getElementById('searchInput').value = '';
}

// Buttons
document.getElementById('searchBtn').addEventListener('click', searchRecommendations);
document.getElementById('resetBtn').addEventListener('click', resetResults);