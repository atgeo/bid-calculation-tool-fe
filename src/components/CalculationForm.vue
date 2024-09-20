<template>
  <div class="vehicle-price-form">
    <form @submit.prevent="handleSubmit">
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

    <div v-if="totalPrice !== 0" class="result">
      <p>Buyer Fee: {{ buyerFee }}</p>
      <p>Seller Fee: {{ sellerFee }}</p>
      <p>Association Fee: {{ associationFee }}</p>
      <p>Storage Fee: {{ storageFee }}</p>
      <p>Total Price: {{ totalPrice }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const vehiclePrice = ref(0);
const vehicleType = ref('common');
const buyerFee = ref(null);
const sellerFee = ref(null);
const associationFee = ref(null);
const storageFee = ref(null);
const totalPrice = ref(null);

import { fetchTotalCost } from '../services/api'

const getTotalCost = async () => {
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

    buyerFee.value = response.buyerFee;
    sellerFee.value = response.sellerFee;
    associationFee.value = response.associationFee;
    storageFee.value = response.storageFee;
    totalPrice.value = response.totalPrice;
  } catch (error) {
    console.error('Error fetching total cost:', error);
  }
};

// Watch for changes in vehiclePrice or vehicleType and call fetchTotalCost
watch([vehiclePrice, vehicleType], getTotalCost, { immediate: true });
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
</style>