<template>
  <div class="vehicle-price-form">
    <form>
      <div class="form-group">
        <label for="vehiclePrice">Vehicle Base Price</label>
        <input
            id="vehiclePrice"
            type="number"
            v-model.number="vehiclePrice"
            placeholder="Enter vehicle price"
            required
        />
      </div>

      <div class="form-group">
        <label for="vehicleType">Vehicle Type</label>
        <select
            id="vehicleType"
            v-model="vehicleType"
            required
        >
          <option value="" disabled>Select type</option>
          <option value="common">Common</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
    </form>

    <div class="form-results">
      <div v-if="totalPrice !== null" class="result">
        <p>Buyer Fee: {{ buyerFee.toFixed(2) }}</p>
        <p>Seller Fee: {{ sellerFee.toFixed(2) }}</p>
        <p>Association Fee: {{ associationFee.toFixed(2) }}</p>
        <p>Storage Fee: {{ storageFee.toFixed(2) }}</p>
        <p>Total Price: {{ totalPrice.toFixed(2) }}</p>
      </div>

      <div v-else class="placeholder-message">
        <p>Please enter a vehicle price to display fees and total price.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';

const vehiclePrice = ref(0);
const vehicleType = ref('common');
const buyerFee = ref(null);
const sellerFee = ref(null);
const associationFee = ref(null);
const storageFee = ref(null);
const totalPrice = ref(null);

import { fetchTotalCost } from '../services/api'

const debouncedGetTotalCost = debounce(async () => {
  if (!vehiclePrice.value || vehiclePrice.value === 0) {
    totalPrice.value = null;
    buyerFee.value = null;
    sellerFee.value = null;
    associationFee.value = null;
    storageFee.value = null;
    return;
  }


  try {
    const response = await fetchTotalCost(vehiclePrice.value, vehicleType.value);

    ({
      buyerFee: buyerFee.value,
      sellerFee: sellerFee.value,
      associationFee: associationFee.value,
      storageFee: storageFee.value,
      totalPrice: totalPrice.value,
    } = response);
  } catch (error) {
    console.error('Error fetching total cost:', error);
  }
}, 500);

// Watch for changes in vehiclePrice or vehicleType and call fetchTotalCost
watch([vehiclePrice, vehicleType], debouncedGetTotalCost, { immediate: true });
</script>

<style scoped>
.vehicle-price-form {
  max-width: 500px;
  margin: auto;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: .5em;
}

input, select {
  width: 100%;
  padding: .5em;
  font-size: 1em;
}

button {
  padding: .7em 1.2em;
  font-size: 1em;
  cursor: pointer;
}

.form-results {
  min-height: 10rem;
  justify-content: flex-start;
  display: flex;
  align-items: center;
}
</style>