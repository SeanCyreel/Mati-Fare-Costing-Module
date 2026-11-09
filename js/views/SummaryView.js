import View from './View.js';

class SummaryView extends View {
  _parentElement = document.querySelector('#daily-summary');

  _generateMarkup() {
    return `
      <div class="summary-list">
        <div class="summary-row"><span>Transactions today</span><strong>${this._data.totalTransactions}</strong></div>
        <div class="summary-row"><span>Passengers today</span><strong>${this._data.totalPassengers}</strong></div>
        <div class="summary-row"><span>All saved records</span><strong>${this._data.allTransactions}</strong></div>
      </div>
      <div class="summary-highlight">
        <span>Today's fare collections</span>
        <strong>₱${this._data.totalCollections.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
      </div>
      <p class="message">Summary is based on transactions dated today.</p>`;
  }
}

export default new SummaryView();
