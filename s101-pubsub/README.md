# Proyecto Pub/Sub con Kafka

## Descripción General
Este proyecto establece una demostración del patrón Pub/Sub con Apache Kafka para el flujo de mensajes, ZooKeeper para la coordinación de Kafka y varias aplicaciones Node.js (ecommerce-app, shipping-app y dwh-app) que interactúan con Kafka.

### Servicios
- **ZooKeeper**: Servicio de coordinación para Kafka.
- **Kafka**: Sistema de mensajería para manejar eventos. Cada pedido del sistema se registrará como un mensaje en un tópico.
- **ecommerce-app**: Expondrá un endpoint (POST) para registrar un nuevo pedido en el sistema.
- **shipping-app**: Al estar suscrita al tópico, esta aplicación actualizará el stock de los productos disponibles (almacenado en memoria por simplicidad).
- **dwh-app**: Al estar suscrita al tópico, esta aplicación actualizará la cantidad de unidades vendidas por producto.

## Primeros Pasos

### Requisitos Previos
- Docker
- Docker Compose

### Ejecutar la demo
1. Clonar el repositorio:
```
git clone [URL]
```

2. Navegar hasta la carpeta de esta demo
```
cd [nombre-carpeta]
```

3. Ejecute el siguiente comando
```
docker compose up -d
```
4. Con este comando los servicios estarán levantados. Con ello ya es posible registrar un pedido en el sistema. Previamente puede explorar el resultados el llamado a los servicios de stock y ventas por producto:

### Endpoint: Información de Stock

**URL:** `http://localhost:3001/stock`

**Respuesta**
```json
{
  "PROD_001": 18,
  "PROD_002": 15
}
``````

### Endpoint: Ventas por producto

**URL:** `http://localhost:3002/product-sales`

**Respuesta**
```json
{
  "PROD_001": 2,
  "PROD_002": 5
}
``````


4. Es posible ahora registrar un nuevo pedido realizando un POST request al servicio de e-commerce. Por ejemplo (puede también hacerlo a través de POSTMAN u otra herramienta similar):

```bash
curl -X POST -H "Content-Type: application/json" -d '{"productCode": "PROD_001", "quantity": 5}' http://localhost:3000/orders
```

5. Con ello podemos observar que se estará publicando un mensaje en el tópico correspondiente en Kafka, el cual actualizará automáticamente la información de stock y la información del DWH. Puede comprobar los nuevos valores a través de los endpoints correspondientes.

### Endpoint: Información de Stock

**URL:** `http://localhost:3001/stock`

**Respuesta**
```json
{
  "PROD_001": 13,
  "PROD_002": 15
}
``````

### Endpoint: Ventas por producto

**URL:** `http://localhost:3002/product-sales`

**Respuesta**
```json
{
  "PROD_001": 7,
  "PROD_002": 5
}
``````