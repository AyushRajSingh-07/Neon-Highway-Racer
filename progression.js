/**
 * Neon Highway - Progression, Currency & Economy Engine
 * Manages player currency (₳), vehicle ownership, performance upgrades,
 * custom paint schemes, and Level Mode unlock progression.
 */

class ProgressionEngine {
  constructor() {
    this.CURRENCY_SYMBOL = '₳';

    // Default Fallback State
    this.DEFAULT_BALANCE = 1000; // Starting bonus for immediate exploration
    this.DEFAULT_OWNED = ['cyber_pulse']; // Starting vehicle always owned

    this.init();
  }

  init() {
    // 1. Balance
    const savedBalance = localStorage.getItem('neon_currency');
    if (savedBalance === null || isNaN(parseInt(savedBalance, 10))) {
      this.balance = this.DEFAULT_BALANCE;
      this.saveBalance();
    } else {
      this.balance = Math.max(0, parseInt(savedBalance, 10));
    }

    // 2. Owned Vehicles
    try {
      const owned = JSON.parse(localStorage.getItem('neon_owned_vehicles'));
      if (Array.isArray(owned) && owned.length > 0) {
        this.ownedVehicles = new Set(owned);
      } else {
        this.ownedVehicles = new Set(this.DEFAULT_OWNED);
        this.saveOwnedVehicles();
      }
    } catch (e) {
      this.ownedVehicles = new Set(this.DEFAULT_OWNED);
      this.saveOwnedVehicles();
    }
    // Always ensure starter vehicle is owned
    this.ownedVehicles.add('cyber_pulse');

    // 3. Vehicle Upgrades: { [vehicleId]: { speed: 0..5, accel: 0..5, handling: 0..5 } }
    try {
      const upgrades = JSON.parse(localStorage.getItem('neon_vehicle_upgrades'));
      this.upgrades = (upgrades && typeof upgrades === 'object') ? upgrades : {};
    } catch (e) {
      this.upgrades = {};
    }

    // 4. Vehicle Custom Paint: { [vehicleId]: hexColor }
    try {
      const paints = JSON.parse(localStorage.getItem('neon_vehicle_paints'));
      this.paints = (paints && typeof paints === 'object') ? paints : {};
    } catch (e) {
      this.paints = {};
    }

    // 5. Level Mode Progression: Unlocked Level (1..50)
    const unlocked = parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10);
    this.unlockedLevel = isNaN(unlocked) ? 1 : Math.max(1, Math.min(50, unlocked));
  }

  // --- Currency API ---
  getBalance() {
    return this.balance;
  }

  addCurrency(amount) {
    if (amount <= 0) return this.balance;
    this.balance += Math.round(amount);
    this.saveBalance();
    return this.balance;
  }

  spendCurrency(amount) {
    amount = Math.round(amount);
    if (amount <= 0 || this.balance < amount) return false;
    this.balance -= amount;
    this.saveBalance();
    return true;
  }

  saveBalance() {
    localStorage.setItem('neon_currency', this.balance.toString());
  }

  // --- Vehicle Ownership API ---
  isOwned(vehicleId) {
    if (vehicleId === 'cyber_pulse') return true;
    return this.ownedVehicles.has(vehicleId);
  }

  buyVehicle(vehicleId, price) {
    if (this.isOwned(vehicleId)) return { success: true, message: 'Already owned' };
    if (price === undefined && typeof VEHICLE_SPECS !== 'undefined' && VEHICLE_SPECS[vehicleId]) {
      price = VEHICLE_SPECS[vehicleId].price || 0;
    }
    if (this.balance < price) return { success: false, message: 'Insufficient funds' };

    this.spendCurrency(price);
    this.ownedVehicles.add(vehicleId);
    this.saveOwnedVehicles();
    return { success: true, message: 'Vehicle purchased!' };
  }

  saveOwnedVehicles() {
    localStorage.setItem('neon_owned_vehicles', JSON.stringify(Array.from(this.ownedVehicles)));
  }

  // --- Upgrades API (Speed, Accel, Handling: Levels 0 to 5) ---
  getUpgradeLevel(vehicleId, statKey) {
    if (!this.upgrades[vehicleId]) return 0;
    return this.upgrades[vehicleId][statKey] || 0;
  }

  getUpgradeCost(currentLevel) {
    // Costs scale: Level 1: 300₳, Level 2: 600₳, Level 3: 1000₳, Level 4: 1500₳, Level 5: 2200₳
    const costs = [300, 600, 1000, 1500, 2200];
    return costs[currentLevel] || 3000;
  }

  upgradeStat(vehicleId, statKey) {
    if (!this.isOwned(vehicleId)) return { success: false, message: 'Must own vehicle to upgrade' };
    const currentLvl = this.getUpgradeLevel(vehicleId, statKey);
    if (currentLvl >= 5) return { success: false, message: 'Stat is at maximum level (5/5)' };

    const cost = this.getUpgradeCost(currentLvl);
    if (!this.spendCurrency(cost)) return { success: false, message: 'Insufficient funds' };

    if (!this.upgrades[vehicleId]) this.upgrades[vehicleId] = {};
    this.upgrades[vehicleId][statKey] = currentLvl + 1;
    this.saveUpgrades();

    return { success: true, level: currentLvl + 1, cost };
  }

  saveUpgrades() {
    localStorage.setItem('neon_vehicle_upgrades', JSON.stringify(this.upgrades));
  }

  // --- Getters & Convenience Aliases ---
  get currency() {
    return this.balance;
  }
  set currency(val) {
    this.balance = val;
    this.saveBalance();
  }

  canAfford(amount) {
    return this.balance >= amount;
  }

  getPaint(vehicleId) {
    return this.getPaintColor(vehicleId);
  }

  setPaint(vehicleId, hex) {
    this.setPaintColor(vehicleId, hex);
  }

  getUpgrades(vehicleId) {
    return {
      speed: this.getUpgradeLevel(vehicleId, 'speed'),
      accel: this.getUpgradeLevel(vehicleId, 'accel'),
      handling: this.getUpgradeLevel(vehicleId, 'handling')
    };
  }

  upgradeVehicle(vehicleId, statKey) {
    return this.upgradeStat(vehicleId, statKey).success;
  }

  // --- Paint Customization API ---
  getPaintColor(vehicleId, defaultColor = '#00f0ff') {
    return this.paints[vehicleId] || defaultColor;
  }

  setPaintColor(vehicleId, colorHex) {
    this.paints[vehicleId] = colorHex;
    localStorage.setItem('neon_vehicle_paints', JSON.stringify(this.paints));
  }

  // --- Level Mode Progression API ---
  getUnlockedLevel() {
    return this.unlockedLevel;
  }

  unlockNextLevel(completedLevel) {
    const maxLevels = (typeof LEVELS_CONFIG !== 'undefined' && Array.isArray(LEVELS_CONFIG)) ? LEVELS_CONFIG.length : 50;
    if (completedLevel >= this.unlockedLevel && this.unlockedLevel < maxLevels) {
      this.unlockedLevel = completedLevel + 1;
      localStorage.setItem('neon_unlocked_level', this.unlockedLevel.toString());
    }
  }

  resetAllData() {
    localStorage.removeItem('neon_currency');
    localStorage.removeItem('neon_owned_vehicles');
    localStorage.removeItem('neon_vehicle_upgrades');
    localStorage.removeItem('neon_vehicle_paints');
    localStorage.removeItem('neon_unlocked_level');
    this.init();
  }
}

if (typeof window !== 'undefined') {
  window.ProgressionEngine = ProgressionEngine;
  window.NeonProgression = ProgressionEngine;
  window.progressionEngine = new ProgressionEngine();
  window.neonProgression = window.progressionEngine;
}
if (typeof module !== 'undefined') {
  module.exports = { ProgressionEngine, NeonProgression: ProgressionEngine };
}
