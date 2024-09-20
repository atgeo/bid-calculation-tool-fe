export const fetchTotalCost = async (vehiclePrice, vehicleType) => {
    try {
        const response = await fetch('http://localhost:9117/api/calculate-price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vehiclePrice, vehicleType }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};
