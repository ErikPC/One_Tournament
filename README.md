# One_Tournament

-manual de usuario
enpoints lo que pides

añadir bloques de codigo para ya tu sabe

-manual de dspliegue
yarn install y cositas

## Introduccion

### Que es?

One Tournament es una API enfocada para tiendas de cartas que busquen tener torneos en tienda. Las tiendas obtendrán Endpoints para generar torneos y añadir los jugadores a dichos torneos.

### Que objetivo tiene?

Cumple como objetivo unificar la organizacion del torneo , con el calculo de rondas y resulado final, siguiendo las normas oficiales de torneo y evitar terceros para calcular las rondas.

### Como determinar las rondas.

| Número de Participantes | Número Esperado de Rondas Suizas | Jugadores Clasificados para el Corte Superior (si aplica) |
| ----------------------- | -------------------------------- | --------------------------------------------------------- |
| 4 - 8                   | 3 rondas                         | Ninguno                                                   |
| 9 - 16                  | 4 rondas                         | Los 2 mejores                                             |
| 17 - 32                 | 5 rondas                         | Los 4 mejores                                             |
| 33 - 64                 | 6 rondas                         | Los 8 mejores                                             |
| 65 - 128                | 7 rondas                         | Los 8 mejores                                             |
| 129 - 256               | 8 rondas                         | Los 16 mejores                                            |
| 257 - 512               | 9 rondas                         | Los 16 mejores                                            |
| 513 - 1024              | 10 rondas                        | Los 32 mejores                                            |

## Instalacion del proyecto

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [`Node`](https://nodejs.org/en): (v12 o superior)
- [`Mongo Atlas`](https://www.mongodb.com/atlas/database): una cuenta con la cual crear base de datos.
- [`Yarn`(opcional)](https://yarnpkg.com/): recomendado para la gestion de paquetes del proyecto

### Instalacion

- Descargar el código fuente: desde el repositorio `https://github.com/ErikPC/One_Tournament`

- Vamos con la terminal a la raiz: comando `cd` para navegar a la carpeta raíz del proyecto en la terminal.

- Instalar dependencias: ejecuta el siguiente comando para instalar todas las dependencias del proyecto

```
yarn install
```

leerá el archivo package.json y descargará todas las dependencias y paquetes necesarios para que el proyecto funcione correctamente.

- Iniciar la aplicación: el package json tiene definido el siguiente script para iniciarse

```
yarn start
```

## Dependecias package.json & scripts

### Dependencias

- `dotenv`: Permite cargar variables de entorno desde un archivo .env en el proyecto. Esto facilita la configuración de valores sensibles como la URI de mongo Atlas.

- `bcryptjs`: Es una librería para el hashing de contraseñas. Proporciona funciones para encriptar y comparar contraseñas de forma segura.

- `express`: Es un framework web rápido Node.js. Facilita la creación de aplicaciones web y APIs con el uso de , middleware y solicitudes HTTP.

- `jest`: Es para las unitarias para JavaScript. Proporciona una amplia gama de herramientas y funciones para escribir y ejecutar pruebas de forma sencilla y eficiente.

- `jsonwebtoken`: Permite generar y verificar tokens de autenticación basados en JSON.

- `moment`: Es una librería para manipular, analizar y formatear fechas y horas en JavaScript.

- `mongoose`: Es una biblioteca de modelado de objetos para Node.js que se utiliza para interactuar con bases de datos MongoDB.

- `nodemon`: Es una herramienta de desarrollo que supervisa los cambios en los archivos del proyecto y reinicia automáticamente el servidor Node.js cuando se detectan cambios. Para el desarrollo en entorno dev.

- `supertest`: Es una librería para realizar pruebas de integración en aplicaciones web y APIs. Permite enviar solicitudes HTTP simuladas y verificar las respuestas recibidas.

### Scripts

- `start`: Ejecuta la aplicación principal utilizando el comando node index.js.

- `dev`: Ejecuta la aplicación en modo de desarrollo utilizando nodemon index.js, lo que reinicia automáticamente el servidor al detectar cambios en los archivos.

- `test`: Ejecuta las pruebas utilizando Jest, un framework de pruebas para JavaScript.

- `coverage`: Ejecuta las pruebas y genera un informe de cobertura utilizando Jest.

## Coverage Test:

Con jest se pudo exportar un coverage. En el siguiente file aparece la cobertura de los test:

[Coverage](./coverage/lcov-report/index.html)

## Horas dedicadas

No hay un seguimiento correto de las horas. En el inicio estuve haciendo horas intermitentes , entoces a veces si me olvidaba activar el clockify, asi que no hay una inversion exacta.

### Tiempo estimado

![](./docs/Horas.PNG)

#### Estimaciones correctas:

- Crear CRUDs
- Autenticación
- Lógica
- Documentacion

#### Estimaciones incorrectas porque:

- Crear Endpoints
  - A medida que iba avanzando la aplicacion por comodidad del usuario han ido apareciendo endpoints y para ayuda de la lógica
- El despliegue
  - No se ha podido dar por bajo presupuesto.

## Bibliografía

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Plataforma de base de datos en la nube de MongoDB.

[Yarn](https://yarnpkg.com/) - Administrador de paquetes para JavaScript.

[dotenv](https://www.npmjs.com/package/dotenv) - Paquete de Node.js que carga variables de entorno desde un archivo .env.

[bcryptjs](https://www.npmjs.com/package/bcryptjs) - Librería para el hashing y comparación de contraseñas.

[Express](https://expressjs.com/) - Framework web rápido, minimalista y flexible para Node.js.

[Jest](https://jestjs.io/) - Framework de pruebas unitarias para JavaScript.

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Implementación de JSON Web Tokens (JWT) para Node.js.

[Moment.js](https://momentjs.com/) - Biblioteca para manipulación de fechas y horas en JavaScript.

[Mongoose](https://mongoosejs.com/) - Herramienta de modelado de objetos MongoDB para Node.js.

[Nodemon](https://nodemon.io/) - Utilidad que monitoriza cambios en archivos y reinicia automáticamente la aplicación.

[Supertest](https://www.npmjs.com/package/supertest) - Marco de pruebas de integración para aplicaciones HTTP.

### Defensa proyecto truco

explicar que funciona , y la historias

historias de mayor valor el orden

max 20 min

- clockify , contar que no lo has hecho por hacer tiempo intermitente
- analisis y justificar tu desvio
