# Proyecto Ventas de Productos de Ropas Deportivas - Backend React Avanzado - RollingCode

## Alcance del proyecto 💡

En este proyecto los alumnos en forma grupal se dividirán las tareas necesarias para diseñar una aplicación
para que los clientes puedan administrar usuarios , productos y ventas de ropas deportivas.

El alcance de este proyecto se centra en realizar todos los pasos del CRUD y deberá contar con un login con
diferentes opciones dependiendo el usuario que se loguea. Se considera que solo el usuario administrador
podrá administrar las diferentes opciones de menú, mientras que los clientes deberán iniciar su sesión o
registrarse.

## Tecnologias / Herramientas 🛠

- [HTML](https://developer.mozilla.org/es/docs/Web/HTML)
- [Javascript](https://www.w3schools.com/js/)
- [NodeJs](https://nodejs.org/es)
- [ExpressJs](https://expressjs.com/es/)
- [BabelJs](https://babeljs.io/)
- [Mongoose](https://mongoosejs.com/)
- [Cors](https://github.com/expressjs/cors#readme)
- [Morgan](https://github.com/expressjs/morgan)
- [Express Validator](https://express-validator.github.io/docs)
- [Markdown](https://markdown.es/)

## Link a la API en producción:

- [Vercel](https://dashboard-react-avanzado-backend.vercel.app/)

## Pasos para clonar y ejecutar el Servidor 🖥

Sigue estos pasos para clonar y ejecutar el servidor en tu entorno local:

1.  **Requisitos previos:** Asegúrate de tener Node.js instalado en tu sistema. Puedes descargar la versión más reciente desde el sitio web oficial de Node.js (https://nodejs.org).
    Asegúrate también de tener un administrador de paquetes de Node.js instalado, como npm (que se instala junto con Node.js) o Yarn.

2.  **Clona el repositorio:** En tu línea de comandos, ejecuta el siguiente comando para clonar el repositorio:

    ```
    git clone https://github.com/lourdesgarciafyl/Dashboard-React-Avanzado-Backend.git
    ```

3.  **Accede al directorio:** Ve al directorio de la aplicación clonada:

    ```
    cd <Dashboard-React-Avanzado-Backend>
    ```

4.  **Instala las dependencias:** Ejecuta el siguiente comando para instalar las dependencias de la aplicación:

    ```
    npm install
    ```

5.  **Inicia el servidor:** Utiliza el siguiente comando para iniciar la aplicación en tu entorno local:

    ```
     npm run dev
    ```

    Esto ejecutará el script definido en el archivo package.json para iniciar el servidor Node.js.

6.  **Accede al servidor:** Abre tu navegador web y visita la siguiente URL: _http://localhost:4010_. El servidor debería cargarse y estar listo para usarse.

- Se recomienda usar [Postman](https://www.postman.com/) para las solicitudes al servidor.

## Métodos :

## Métodos de Usuarios:

| Método | #Url de User          | #Action                      |
| ------ | --------------------- | ---------------------------- |
| POST   | /auth/registerclient  | Registrar un cliente         |
| POST   | /auth/new             | Registrar un administrador   |
| POST   | /auth/login           | Loguear un usuario           |
| POST   | /auth                 | Crear nuevo usuario          |
| GET    | /auth                 | Muestra la lista de usuarios |
| GET    | /auth/:id             | Busca un usuario por su id   |
| PUT    | /auth/newpassword/:id | Crear nueva contraseña       |
| GET    | /auth/revalidatetoken | Revalidar token              |

Ejemplo de Body en el envío de Crear nuevo usuario administrador (form-data):

```
   {
      "firstname": "Juan",
      "lastname": "Perez",
      "email": "juanperez@gmail.com",
      "password": "12345678Aa",
      "status": "Activo",
      "role": "Cliente",
      "image": "link de la imagen de un avatar"
   }
```

Ejemplo de Body en el envío de Registro de un cliente nuevo con permiso normal:

```
   {
      "firstname": "Jose",
      "lastname": "Cliente",
      "email": "josecliente@cliente.com",
      "password": "123456Aa"
   }
```

## Métodos de productos:

| Método | #Url de products             | #Action                              |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | /products                    | Crear nuevo producto                 |
| GET    | /products /actives           | Muestra la lista de productos        |
| PUT    | /products/:id                | Edita un producto por su id          |
| DELETE | /products/:id                | Borra un producto por su id          |
| GET    | /products/:id                | Busca un producto por su id          |
| PUT    | /products/activate/:id       | Activar un producto por su id        |
| PUT    | /products/desactivate/:id    | Desactivar un producto por su id     |
| GET    | /products/category/:category | Buscar producto por nombre de categ. |
| GET    | /products/stock              | Traer el stock de un producto.       |

Ejemplo de Body en el envío de Crear producto (form-data):

```
{
      "productName": "Remera Mangas cortas XL color amarilla",
      "price": 9500,
      "image": "link de la imagen",
      "detail": "Descripción de la remera.",
      "stock": 33,
      "status": "Activo",
      "categoria": "Remera"
}
```

## Métodos de categorias:

| Método | #Url de categorie   | #Action                        |
| ------ | ------------------- | ------------------------------ |
| POST   | /categories         | Crear nueva categoria          |
| GET    | /categories         | Muestra todas las categorias   |
| GET    | /categories/actives | Muestra las categorias activas |

Ejemplo de Body en crear categoria:

```
{
      "categoryName": "Pizza",
      "status": "Activo"
}
```

## Métodos de ventas:

| Método | #Url de sales         | #Action                     |
| ------ | --------------------- | --------------------------- |
| POST   | /sales                | Crear nueva venta           |
| GET    | /sales                | Muestra la lista de ventas  |
| DELETE | /sales/:id            | Borra una venta por su id   |
| PUT    | /sales/cancelsale/:id | Cancela la venta por su id  |
| GET    | /sales/:id            | Muestra una venta por su id |

Ejemplo de Body en crear una venta:

```
 {
    "user": "idUser",
    "saleDate": "2023-10-04T21:03:01.000Z",
    "cartProducts": [
        {
             {
                "_id": "2123213",
                "productName": "Remera Nike",
                "price": 12000,
                "quantity": 2,
            },
             {
                "_id": "3232312",
                "productName": "Pantalón Nike",
                "price": 15000,
                "quantity": 1,
            },

        },
    ],
    "status": "Realizada",
    "totalPrice": 39000
}
```

## Repositorio FrontEnd 📌

[FrontEnd](https://github.com/cristianq3/Dashboard-React-Avanzado-RollingCode)

## Integrantes del grupo :

- [Lourdes Garcia](https://github.com/lourdesgarciafyl)
- [María Laura Elias](https://github.com/marialauraelias)
- [Ariel Medina](https://github.com/arielm1000)
- [Herrera Nicolas](https://github.com/herreranicolas)
- [Cristian Quiroga](https://github.com/cristianq3)
- [Juan Gerardo Romero Uro](https://github.com/jgromerou)d
