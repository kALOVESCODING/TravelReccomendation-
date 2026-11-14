let travelData = null;

// Task 6: fetch the data
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log(data);
  })
  .catch(error => console.error('Error loading data:', error));

// Task 7 and 8: keyword search
function searchRecommendations() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!keyword || !travelData) return;

  let matches = [];

  if (keyword.includes('beach')) {
    matches = travelData.beaches;
  } else if (keyword.includes('temple')) {
    matches = travelData.temples;
  } else if (keyword.includes('countr')) {
    travelData.countries.forEach(country => matches.push(...country.cities));
  } else {
    // also allow a country name, like "japan"
    const country = travelData.countries.find(c => c.name.toLowerCase().includes(keyword));
    if (country) matches = country.cities;
  }

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p class="no-results">No results found. Try beach, temple or country.</p>';
    return;
  }

  matches.forEach(place => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

// Task 9: reset
function resetResults() {
  document.getElementById('results').innerHTML = '';
  document.getElementById('searchInput').value = '';
}

document.getElementById('searchBtn').addEventListener('click', searchRecommendations);
document.getElementById('resetBtn').addEventListener('click', resetResults);