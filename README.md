# Sistema de Gestión de Restaurantes

## Información del Estudiante
- **Nombre:** Felix Ernesto Orduz Grimaldo
- **Código Estudiante:** 202311718
- **Email:** f.orduz@uniandes.edu.co

## Descripción del Proyecto
Este proyecto es un sistema de gestión de restaurantes desarrollado con Nest.js. Permite administrar restaurantes, platos y sus asociaciones, ofreciendo una API RESTful completa para estas operaciones.

## Tecnologías Utilizadas
- Nest.js
- TypeScript
- PostgreSQL (Base de datos)
- TypeORM (ORM)

## Estructura del Proyecto
El proyecto está organizado en los siguientes módulos principales:
- Restaurantes
- Platos
- Asociación Restaurante-Plato

## Características Principales

### Restaurantes
- CRUD completo de restaurantes
- Validación de tipos de cocina (Italiana, Japonesa, Mexicana, Colombiana, India, Internacional)
- Campos: nombre, dirección, tipo de cocina, página web

### Platos
- CRUD completo de platos
- Validación de precios (números positivos)
- Validación de categorías (entrada, plato fuerte, postre, bebida)
- Campos: nombre, descripción, precio, categoría

### Asociación Restaurante-Plato
- Asociar platos a restaurantes
- Consultar platos por restaurante
- Actualizar asociaciones
- Eliminar asociaciones

## API Endpoints

### Restaurantes
- `GET /restaurants` - Obtener todos los restaurantes
- `GET /restaurants/:id` - Obtener un restaurante específico
- `POST /restaurants` - Crear un nuevo restaurante
- `PUT /restaurants/:id` - Actualizar un restaurante
- `DELETE /restaurants/:id` - Eliminar un restaurante

### Platos
- `GET /dishes` - Obtener todos los platos
- `GET /dishes/:id` - Obtener un plato específico
- `POST /dishes` - Crear un nuevo plato
- `PUT /dishes/:id` - Actualizar un plato
- `DELETE /dishes/:id` - Eliminar un plato

### Asociación Restaurante-Plato
- `POST /restaurants/:restaurantId/dishes/:dishId` - Asociar un plato a un restaurante
- `GET /restaurants/:restaurantId/dishes` - Obtener todos los platos de un restaurante
- `GET /restaurants/:restaurantId/dishes/:dishId` - Obtener un plato específico de un restaurante
- `PUT /restaurants/:restaurantId/dishes` - Actualizar los platos de un restaurante
- `DELETE /restaurants/:restaurantId/dishes/:dishId` - Eliminar la asociación de un plato con un restaurante

## Pruebas
El proyecto incluye pruebas automatizadas para:
- Lógica de Restaurantes
- Lógica de Platos
- Lógica de Asociación

Las colecciones de Postman se encuentran en la carpeta `collections/` y contienen pruebas para todos los endpoints mencionados.

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` con las siguientes variables:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=restaurant_db
```

4. Ejecutar migraciones:
```bash
npm run migration:run
```

5. Iniciar el servidor:
```bash
npm run start:dev
```

## Versión
v1.0.0 - Parcial Práctico
