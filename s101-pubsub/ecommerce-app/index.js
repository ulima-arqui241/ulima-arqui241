const express = require('express');
const Kafka = require('kafka-node');

const app = express();
const kafkaClient = new Kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Kafka.Producer(kafkaClient);

app.use(express.json());

app.post('/orders', (req, res) => {
  const order = req.body;

  // Permite publicar los nuvos pedidos en un topico de Kafka
  const payloads = [
    { topic: 'new_orders', messages: JSON.stringify(order) }
  ];

  producer.send(payloads, (error, data) => {
    if (error) {
      console.error('Error publishing order:', error);
      res.status(500).json({ error: 'Error publishing order' });
    } else {
      console.log('Order published:', data);
      res.json({ message: 'Order placed successfully' });
    }
  });
});

app.listen(3000, () => {
  console.log('Ecommerce app is listening on port 3000');
});