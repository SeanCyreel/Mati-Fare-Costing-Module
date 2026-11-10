import View from './View.js';

class TransactionView extends View {
  _parentElement = document.querySelector('#transactions');

  _generateMarkup() {
    const rows = this._data.length
      ? this._data.map(item => `
        <tr>
          <td><strong>${this._escape(item.passengerName)}</strong><br><span class="muted">${this._escape(item.passengerType)}</span></td>
          <td>${item.passengerCount}</td>
          <td>₱${item.farePerPassenger.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</td>
          <td><strong>₱${item.totalFare.toFixed(2)}</strong></td>
          <td>${this._escape(item.date)}</td>
          <td>
            <button class="btn btn-secondary btn-small" type="button" data-edit="${item.id}">Edit</button>
            <button class="btn btn-danger btn-small" type="button" data-delete="${item.id}">Delete</button>
          </td>
        </tr>`).join('')
      : `<tr><td colspan="6"><div class="empty-state"><strong>No transactions yet</strong>Use the form above to record a passenger transaction.</div></td></tr>`;

    return `
      <form class="transaction-form" novalidate>
        <input type="hidden" name="id" value="">
        <div class="form-grid">
          <div class="field">
            <label for="passenger-name">Passenger name</label>
            <input id="passenger-name" name="passengerName" maxlength="60" placeholder="Enter passenger name" required>
          </div>
          <div class="field">
            <label for="passenger-type">Passenger type</label>
            <select id="passenger-type" name="passengerType" required>
              <option value="Regular">Regular</option>
              <option value="Student">Student</option>
              <option value="Senior Citizen">Senior Citizen</option>
            </select>
          </div>
          <div class="field">
            <label for="passenger-count">Passenger count</label>
            <input id="passenger-count" name="passengerCount" type="number" min="1" step="1" value="1" required>
          </div>
          <div class="field">
            <label for="passenger-fare">Fare per passenger (₱)</label>
            <input id="passenger-fare" name="farePerPassenger" type="number" min="0.01" step="0.001" placeholder="Enter agreed fare" required>
          </div>
          <div class="field full">
            <label for="transaction-date">Transaction date</label>
            <input id="transaction-date" name="date" type="date" required>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit" data-submit-label>Add transaction</button>
          <button class="btn btn-secondary" type="button" data-cancel hidden>Cancel edit</button>
        </div>
        <p class="message" data-message aria-live="polite"></p>
      </form>
      <div class="table-wrap" style="margin-top:18px">
        <table>
          <thead><tr><th>Passenger</th><th>Count</th><th>Fare each</th><th>Total</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', event => {
      if (!event.target.matches('.transaction-form')) return;
      event.preventDefault();
      const formData = new FormData(event.target);
      handler(Object.fromEntries(formData.entries()));
    });
  }

  addHandlerEdit(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-edit]');
      if (button) handler(button.dataset.edit);
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-delete]');
      if (button) handler(button.dataset.delete);
    });
  }

  addHandlerCancel(handler) {
    this._parentElement.addEventListener('click', event => {
      if (event.target.closest('[data-cancel]')) handler();
    });
  }

  fillForm(transaction) {
    const form = this._parentElement.querySelector('.transaction-form');
    Object.entries({
      id: transaction.id,
      passengerName: transaction.passengerName,
      passengerType: transaction.passengerType,
      passengerCount: transaction.passengerCount,
      farePerPassenger: transaction.farePerPassenger,
      date: transaction.date
    }).forEach(([name, value]) => { form.elements[name].value = value; });
    form.querySelector('[data-submit-label]').textContent = 'Save changes';
    form.querySelector('[data-cancel]').hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  resetForm() {
    const form = this._parentElement.querySelector('.transaction-form');
    if (!form) return;
    form.reset();
    form.elements.id.value = '';
    form.elements.passengerCount.value = 1;
    form.querySelector('[data-submit-label]').textContent = 'Add transaction';
    form.querySelector('[data-cancel]').hidden = true;
    this._showMessage('', '');
  }

  showMessage(message, type = 'error') {
    this._showMessage(message, type);
  }
}

export default new TransactionView();
