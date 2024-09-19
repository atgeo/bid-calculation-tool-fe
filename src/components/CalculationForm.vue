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
          <option value="Common">Common</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>
    </form>

    <div v-if="totalPrice !== null" class="result">
      <p>Total Price: {{ totalPrice }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const vehiclePrice = ref(0);
const vehicleType = ref('common');
const totalPrice = ref(null);

const fetchTotalCost = async () => {
  try {
    const token = 'q9WokQm3TJ7wcJhA3M78e23T2dmIRRJGIEHPoK0k4f7fde41';

    const response = await fetch('http://localhost:9117/api/calculate-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Replace with your actual token
      },
      body: JSON.stringify({
        vehiclePrice: vehiclePrice.value,
        vehicleType: vehicleType.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    totalPrice.value = data.totalPrice; // Update with the actual field from the response
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

// Watch for changes in vehiclePrice or vehicleType and call fetchTotalCost
watch([vehiclePrice, vehicleType], fetchTotalCost, { immediate: true });
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