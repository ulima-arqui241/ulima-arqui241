const { Kafka } = require('kafkajs');
const express = require('express');

const kafka = new Kafka({
  clientId: 'dwh-app',
  brokers: [process.env.KAFKA_HOST],
});
const consumer = kafka.consumer({ groupId: 'dwh-group' });

// Objeto (temporal) para almacenar la cantidad de ventas por producto
const productSalesCount = {"PROD_001": 2, "PROD_002": 5};

const app = express();
const port = 3002; 

// Para verificar las actualizaciones con cada pedido registrado
app.get('/product-sales', (req, res) => {
  res.json(productSalesCount);
});

const run = async () => {
  //Suscripcion al topico
  await consumer.connect();
  await consumer.subscribe({ topic: 'new_orders', fromBeginning: true });

  //Procesamiento del mensaje
  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log('Received new order:', order);
      
      const { productCode, quantity } = order;

      if (!productSalesCount[productCode]) {
        productSalesCount[productCode] = 0;
      }
      productSalesCount[productCode] += quantity;
    },
  });

  app.listen(port, () => {
    console.log(`Product sales count API running on http://localhost:${port}`);
  });
};

run().catch((error) => {
  console.error('Error in DWH app:', error);
  process.exit(1);
});