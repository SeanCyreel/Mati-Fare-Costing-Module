import View from './View.js';
import { FARE_TIERS } from '../farePricing.js';

// Coordinates are approximate landmark/area reference points inside Mati City.
// The straight-line distance is multiplied by a road-detour factor; it is NOT live road routing.
export const MATI_LOCATIONS = [
  { name: 'Mati Baywalk', lat: 6.9548, lon: 126.2168 },
  { name: 'Davao Oriental State University (DOrSU)', lat: 6.9430, lon: 126.2380 },
  { name: 'Dahican Beach', lat: 6.9030, lon: 126.2670 },
  { name: 'Mati City Hall', lat: 6.9552, lon: 126.2180 },
  { name: 'Subangan Museum', lat: 6.9510, lon: 126.2180 },
  { name: 'Mati Port', lat: 6.9565, lon: 126.2130 },
  { name: 'Mati Airport', lat: 6.9280, lon: 126.2730 },
  { name: 'Central (Poblacion)', lat: 6.9550, lon: 126.2170 },
  { name: 'Badas', lat: 6.9780, lon: 126.2500 },
  { name: 'Bobon', lat: 6.8660, lon: 126.3270 },
  { name: 'Buso', lat: 7.0060, lon: 126.2360 },
  { name: 'Cabuaya', lat: 6.9900, lon: 126.3000 },
  { name: 'Culian', lat: 6.9870, lon: 126.1900 },
  { name: 'Dahican', lat: 6.9030, lon: 126.2670 },
  { name: 'Danao', lat: 6.9900, lon: 126.1800 },
  { name: 'Dawan', lat: 6.9140, lon: 126.1530 },
  { name: 'Don Enrique Lopez', lat: 6.9300, lon: 126.1800 },
  { name: 'Don Martin Marundan', lat: 6.9700, lon: 126.2000 },
  { name: 'Don Salvador Lopez Sr.', lat: 7.0200, lon: 126.1800 },
  { name: 'Langka (Lanca)', lat: 6.9480, lon: 126.0400 },
  { name: 'Lawigan', lat: 7.0200, lon: 126.1500 },
  { name: 'Libudon', lat: 6.9900, lon: 126.1300 },
  { name: 'Luban', lat: 6.9300, lon: 126.3100 },
  { name: 'Macambol', lat: 6.9800, lon: 126.3000 },
  { name: 'Mamali', lat: 6.9200, lon: 126.3300 },
  { name: 'Matiao', lat: 7.0820, lon: 126.2400 },
  { name: 'Mayo', lat: 7.0020, lon: 126.3320 },
  { name: 'Sainz', lat: 6.9700, lon: 126.1900 },
  { name: 'Sanghay', lat: 7.0500, lon: 126.2100 },
  { name: 'Tagabakid', lat: 7.0060, lon: 126.3480 },
  { name: 'Tagbinonga', lat: 6.9900, lon: 126.1700 },
  { name: 'Taguibo', lat: 7.0300, lon: 126.1400 },
  { name: 'Tamisan', lat: 6.8440, lon: 126.2980 }
];

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
})[c]);

class FareCalculatorView extends View {
  _parentElement = document.querySelector('#fare-calculator');

  _generateMarkup() {
    const options = MATI_LOCATIONS.map(location =>
      `<option value="${escapeHTML(location.name)}">${escapeHTML(location.name)}</option>`
    ).join('');
    const fareTiers = FARE_TIERS.map(tier => `
      <tr>
        <td>${tier.name}</td>
        <td>₱${tier.minFuelPrice.toFixed(2)}–₱${tier.maxFuelPrice.toFixed(2)}</td>
        <td>₱${tier.baseFare.toFixed(2)}</td>
        <td>₱${tier.ratePerKm.toFixed(2)}</td>
      </tr>`).join('');

    return `
      <form class="calculator-form" novalidate>
        <div class="route-grid">
          <div class="field">
            <label for="route-from">Point A — Origin</label>
            <select id="route-from" name="from" required>${options}</select>
          </div>
          <div class="field">
            <label for="route-to">Point B — Destination</label>
            <select id="route-to" name="to" required>${options}</select>
          </div>
        </div>
        <div class="form-grid" style="margin-top:13px">
          <div class="field">
            <label for="route-passengers">Number of passengers</label>
            <input id="route-passengers" name="passengerCount" type="number" min="1" step="1" value="1" required>
          </div>
          <div class="field">
            <label for="fuel-price">Gasoline price (₱/liter)</label>
            <input id="fuel-price" name="fuelPrice" type="number" min="50" max="200" step="0.01" value="85.20" required>
          </div>
          <div class="field">
            <label for="road-factor">Estimated road-distance adjustment</label>
            <input id="road-factor" name="roadFactor" type="number" min="1" max="2" step="0.05" value="1.30" required>
          </div>
        </div>
        <div class="form-actions"><button class="btn btn-primary" type="submit">Calculate estimated fare</button></div>
        <p class="message" data-message aria-live="polite"></p>
        <div class="result-box"><span>Total route fare for all passengers</span><strong data-result>₱0.00</strong></div>
        <div class="route-breakdown" data-breakdown>
          <span>Select two Mati City locations to calculate an estimate.</span>
        </div>
      </form>
      <p class="fuel-note">The gasoline price selects a fare tier; the fare is not calculated from fuel consumption. Route distance is an estimate based on location coordinates and the adjustment above.</p>
      <div class="fare-schedule">
        <h3>Transparent fare schedule</h3>
        <p>Base fare covers the first 0–3.0 km. Beyond 3.0 km, the tier rate is prorated by the exact added distance. The total is authoritative; average passenger shares are shown to 3 decimal places.</p>
        <div class="table-wrap">
          <table class="fare-tier-table">
            <thead><tr><th>Price tier</th><th>Fuel price per liter</th><th>Base fare (0–3 km)</th><th>Rate per added km</th></tr></thead>
            <tbody>${fareTiers}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  addHandlerCalculate(handler) {
    this._parentElement.addEventListener('submit', event => {
      if (!event.target.matches('.calculator-form')) return;
      event.preventDefault();
      handler(Object.fromEntries(new FormData(event.target).entries()));
    });
  }

  showResult(result) {
    this._parentElement.querySelector('[data-result]').textContent =
      `₱${result.tripFare.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    this._parentElement.querySelector('[data-breakdown]').innerHTML = `
      <div><span>Route</span><strong>${escapeHTML(result.from)} → ${escapeHTML(result.to)}</strong></div>
      <div><span>Estimated road distance</span><strong>${result.distanceKm.toFixed(2)} km</strong></div>
      <div><span>Fuel price tier</span><strong>${result.tier.name} (₱${result.fuelPrice.toFixed(2)}/L)</strong></div>
      <div><span>Base fare (first 0–3 km)</span><strong>₱${result.tier.baseFare.toFixed(2)}</strong></div>
      <div><span>Added distance × rate</span><strong>${result.addedDistanceKm.toFixed(2)} km × ₱${result.tier.ratePerKm.toFixed(2)} = ₱${result.addedDistanceCharge.toFixed(2)}</strong></div>
      <div><span>Total fare for ${result.passengerCount} passenger${result.passengerCount === 1 ? '' : 's'}</span><strong>₱${result.tripFare.toFixed(2)}</strong></div>
      <div><span>Average shared fare per passenger</span><strong>₱${result.farePerPassenger.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</strong></div>`;
    this._showMessage('Fare is based on the displayed tier and estimated route distance. Confirm the route distance and fare with passengers.', 'success');
  }

  showError(message) {
    this._showMessage(message, 'error');
  }
}

export default new FareCalculatorView();
