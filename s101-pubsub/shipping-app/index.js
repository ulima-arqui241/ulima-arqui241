const { Kafka } = require('kafkajs');
const express = require('express');

const kafka = new Kafka({
  clientId: 'shipping-app',
  brokers: [process.env.KAFKA_HOST],
});
const consumer = kafka.consumer({ groupId: 'shipping-group' });


// Objeto (temporal) para almacenar los niveles de stock y demostrar los cambios
const productStock = { "PROD_001": 18, "PROD_002": 15 };

const app = express();
const port = 3001;

// Endpoint que permite obtener los niveles de stock en la aplicacion
app.get('/stock', (req, res) => {
  res.json(productStock);
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'new_orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log('Received new order:', order);

      // El cuerpo del mensaje enviado debe tener los atributos productCode y quantity
      const { productCode, quantity } = order;

      // Verificar si el codigo de producto existe y si la cantidad es mayor que cero
      if (productStock.hasOwnProperty(productCode) && quantity > 0) {
        productStock[productCode] -= quantity;

        // Alerta en caso no haya stock
        if (productStock[productCode] <= 0) {
          console.warn(`Alert: Stock for product ${productCode} has reached zero.`);
          productStock[productCode] = 0; // Para evitar valores negativos
        }
      } else {
        console.log(`Invalid order or out of stock: ${productCode}`);
      }
    },
    
  });
  
  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Stock API running on http://localhost:${port}`);
  });
};
run().catch((error) => {
  console.error('Error in Shipping app:', error);
  process.exit(1);
});
