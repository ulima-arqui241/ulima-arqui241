# Demo Balanceo de Carga con Nginx

## Descripción General
Este proyecto establece una demostración de la táctica de redundancia activa, tendremos un conjunto de 3 copias funcionales de una aplicación en Node.js. Estas 3 aplicaciones se conectarán a la misma instancia de MongoDB. Adicionalmente se expone un endpoint que permite visualizar los resultados almacenados en la base de datos junto con el hostName (ID del contendor) que atendió la solicitud, demostrando que se está trabajando con los 3 nodos. 

### Servicios
- **app**: Aplicación web en Javascript.
- **mongodb**: Se utilizará este motor de base de datos para almacenar registros sencillos de posts de redes sociales: titulo y mensaje.
- **nginx**: Se utilizará para el balanceo de carga.

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
4. Con este comando se iniciarán 3 instancias independiente de la aplicación hecha con Node.js. El servicio de Nginx podrá accederse a través del puerto 80. Por lo tanto, se puede acceder a [http://localhost/](http://localhost/) para poder observar la respuesta.

```json
{"hostName":"641c784eff22","posts":[{"_id":"6561ae9ccc3bc0f6d888313e","title":"First Post","content":"This is the first post"},{"_id":"6561ae9ccc3bc0f6d888313f","title":"Second Post","content":"This is the second post"}]}
```

5. Observe que si vuelve a consultar la información, el valor del hostName variará, pues otro de los nodos creados estará atendiendo la solicitud.