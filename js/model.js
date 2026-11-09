// MODEL: owns application data and LocalStorage. It never accesses the DOM.
import { getFareTier } from './farePricing.js';

export const state = {
  transactions: [],
  calculator: {
    passengerCount: 1,
    farePerPassenger: 0,
    total: 0
  }
};

const STORAGE_KEY = 'matiFareManagementData';

export const loadData = function () {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (parsed && Array.isArray(parsed.transactions)) {
      state.transactions = parsed.transactions;
    }
  } catch (error) {
    console.error('Unable to load saved transactions:', error);
    state.transactions = [];
  }
};

const saveData = function () {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    transactions: state.transactions
  }));
};

export const calculateFare = function (input) {
  const count = Number(input.passengerCount);
  const fuelPrice = Number(input.fuelPrice);
  const roadFactor = Number(input.roadFactor);

  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Passenger count must be a whole number greater than zero.');
  }
  if (!Number.isFinite(fuelPrice) || fuelPrice < 50 || fuelPrice > 200) {
    throw new Error('Gasoline price must be between ₱50.00 and ₱200.00 per liter.');
  }
  if (Math.abs(fuelPrice * 100 - Math.round(fuelPrice * 100)) > 1e-8) {
    throw new Error('Gasoline price must be entered to two decimal places.');
  }
  const tier = getFareTier(fuelPrice);
  if (!tier) throw new Error('No fare tier is configured for this gasoline price.');
  if (!Number.isFinite(roadFactor) || roadFactor < 1 || roadFactor > 2) {
    throw new Error('Road-distance adjustment must be between 1.00 and 2.00.');
  }
  if (input.from === input.to) {
    throw new Error('Please choose two different Mati City locations.');
  }

  const locations = input.locations;
  const from = locations.find(location => location.name === input.from);
  const to = locations.find(location => location.name === input.to);
  if (!from || !to) throw new Error('Choose locations from Mati City only.');

  const toRadians = degrees => degrees * Math.PI / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const straightLineKm = 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.max(0.5, straightLineKm * roadFactor);
  const addedDistanceKm = Math.max(0, distanceKm - 3);
  const addedDistanceCharge = addedDistanceKm * tier.ratePerKm;
  const tripFare = Math.round((tier.baseFare + addedDistanceCharge) * 100) / 100;
  const farePerPassenger = tripFare / count;

  state.calculator = {
    from: input.from, to: input.to, distanceKm, addedDistanceKm,
    addedDistanceCharge, tier, tripFare, farePerPassenger,
    passengerCount: count, fuelPrice, roadFactor
  };
  return state.calculator;
};

export const addTransaction = function (transactionData) {
  const transaction = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    passengerName: transactionData.passengerName.trim(),
    passengerType: transactionData.passengerType,
    passengerCount: Number(transactionData.passengerCount),
    farePerPassenger: Number(transactionData.farePerPassenger),
    totalFare: Number(transactionData.passengerCount) * Number(transactionData.farePerPassenger),
    date: transactionData.date,
    location: 'Mati City, Davao Oriental'
  };

  state.transactions.push(transaction);
  saveData();
  return transaction;
};

export const updateTransaction = function (id, transactionData) {
  const transaction = state.transactions.find(item => item.id === id);
  if (!transaction) throw new Error('Transaction could not be found.');

  transaction.passengerName = transactionData.passengerName.trim();
  transaction.passengerType = transactionData.passengerType;
  transaction.passengerCount = Number(transactionData.passengerCount);
  transaction.farePerPassenger = Number(transactionData.farePerPassenger);
  transaction.totalFare = transaction.passengerCount * transaction.farePerPassenger;
  transaction.date = transactionData.date;
  saveData();
};

export const deleteTransaction = function (id) {
  state.transactions = state.transactions.filter(item => item.id !== id);
  saveData();
};

export const getSummary = function () {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const today = localNow.toISOString().slice(0, 10);
  const todaysTransactions = state.transactions.filter(item => item.date === today);

  return {
    totalTransactions: todaysTransactions.length,
    totalPassengers: todaysTransactions.reduce((sum, item) => sum + item.passengerCount, 0),
    totalCollections: todaysTransactions.reduce((sum, item) => sum + item.totalFare, 0),
    allTransactions: state.transactions.length
  };
};
