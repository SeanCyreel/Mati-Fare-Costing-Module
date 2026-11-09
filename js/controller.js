// CONTROLLER: the only layer that connects Model functions and Views.
import * as model from './model.js';
import fareCalculatorView, { MATI_LOCATIONS } from './views/FareCalculatorView.js';
import transactionView from './views/TransactionView.js';
import summaryView from './views/SummaryView.js';

const formatToday = function () {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const renderAll = function () {
  transactionView.render(model.state.transactions);
  summaryView.render(model.getSummary());
  renderHeaderSummary();
};

const renderHeaderSummary = function () {
  const summary = model.getSummary();
  document.querySelector('#total-collections').textContent =
    `₱${summary.totalCollections.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.querySelector('#total-transactions').textContent = summary.totalTransactions;
  document.querySelector('#total-passengers').textContent = summary.totalPassengers;
};

const controlCalculateFare = function (input) {
  try {
    const result = model.calculateFare({ ...input, locations: MATI_LOCATIONS });
    fareCalculatorView.showResult(result);
  } catch (error) {
    fareCalculatorView.showError(error.message);
  }
};

const validateTransaction = function (data) {
  if (!data.passengerName || !data.passengerName.trim()) {
    throw new Error('Please enter the passenger name.');
  }
  if (!['Regular', 'Student', 'Senior Citizen'].includes(data.passengerType)) {
    throw new Error('Please select a valid passenger type.');
  }
  const count = Number(data.passengerCount);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Passenger count must be a whole number greater than zero.');
  }
  const fare = Number(data.farePerPassenger);
  if (!Number.isFinite(fare) || fare <= 0) {
    throw new Error('Fare per passenger must be greater than zero.');
  }
  if (!data.date) throw new Error('Please select the transaction date.');
};

const controlSubmitTransaction = function (data) {
  try {
    validateTransaction(data);
    if (data.id) {
      model.updateTransaction(data.id, data);
      transactionView.showMessage('Transaction updated successfully.', 'success');
    } else {
      model.addTransaction(data);
      transactionView.showMessage('Transaction added successfully.', 'success');
    }
    renderAll();
    transactionView.resetForm();
  } catch (error) {
    transactionView.showMessage(error.message, 'error');
  }
};

const controlEditTransaction = function (id) {
  const transaction = model.state.transactions.find(item => item.id === id);
  if (transaction) transactionView.fillForm(transaction);
};

const controlDeleteTransaction = function (id) {
  const confirmed = window.confirm('Delete this transaction? This action cannot be undone.');
  if (!confirmed) return;
  model.deleteTransaction(id);
  renderAll();
};

const controlCancelEdit = function () {
  transactionView.resetForm();
};

const init = function () {
  model.loadData();
  fareCalculatorView.addHandlerCalculate(controlCalculateFare);
  transactionView.addHandlerSubmit(controlSubmitTransaction);
  transactionView.addHandlerEdit(controlEditTransaction);
  transactionView.addHandlerDelete(controlDeleteTransaction);
  transactionView.addHandlerCancel(controlCancelEdit);
  fareCalculatorView.render();

  renderAll();

  const dateInput = document.querySelector('#transaction-date');
  if (dateInput) dateInput.value = formatToday();
};

init();
