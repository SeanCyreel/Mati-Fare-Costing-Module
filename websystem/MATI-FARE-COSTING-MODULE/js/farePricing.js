export const FARE_TIERS = [
  { name: 'Tier 1', minFuelPrice: 50, maxFuelPrice: 59.99, baseFare: 15, ratePerKm: 2 },
  { name: 'Tier 2', minFuelPrice: 60, maxFuelPrice: 79.99, baseFare: 20, ratePerKm: 3 },
  { name: 'Tier 3', minFuelPrice: 80, maxFuelPrice: 89.99, baseFare: 20, ratePerKm: 4 },
  { name: 'Tier 4', minFuelPrice: 90, maxFuelPrice: 99.99, baseFare: 20, ratePerKm: 5 },
  { name: 'Tier 5', minFuelPrice: 100, maxFuelPrice: 124.99, baseFare: 20, ratePerKm: 6 },
  { name: 'Tier 6', minFuelPrice: 125, maxFuelPrice: 149.99, baseFare: 20, ratePerKm: 7 },
  { name: 'Tier 7', minFuelPrice: 150, maxFuelPrice: 174.99, baseFare: 25, ratePerKm: 8 },
  { name: 'Tier 8', minFuelPrice: 175, maxFuelPrice: 200, baseFare: 30, ratePerKm: 9 }
];

export const getFareTier = function (fuelPrice) {
  return FARE_TIERS.find(tier =>
    fuelPrice >= tier.minFuelPrice && fuelPrice <= tier.maxFuelPrice
  );
};
