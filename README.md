# Nodepop API

API de servicio para aplicación de compra-venta de artículos de segunda mano.
Práctica del VI BootCamp Development Mobile - KeepCoding.

## Requisitos
- Node >= 8.9.1
- MongoDB

## Instalación
### Instalar dependencias 

Dentro del directorio nodepop ejecutar: 

`npm install`

### Configuración inicial
1. Copiar fichero ".env.example" en la raíz con nombre ".env"
2. Asignar valor a las variables de entorno del fichero ".env":
- JWT_SECRET: Clave para la generación de Tokens de Usuario
- JWT_EXPIRES_IN: Tiempo de expiración de los tokens generados
- MONGO_URI: Uri de conexión a Base de Datos MongoDB
- MONGO_PORT: Puerto de conexión a Base de Datos MongoDB
- PORT: Puerto de escucha de la API
3. Cargar datos iniciales (opcional): `npm run installBD`

### Arranque del servicio
Desde el directorio nodepop, ejecutar:
`npm run start`

## Operaciones permitidas
**Nota:** Todas las peticiones admiten la cabecera *Accept-Language* para especificar el lenguaje de los mensajes de error de respuesta. Los lenguajes admitidos son: **es**(Español), **en**(Inglés). En caso de que la cabecera no sea informada o su valor sea distinto a los lenguajes admitidos, los mensajes de respuesta serán enviados en inglés.

### Registro
Realiza el alta de un usuario en la Base de Datos

- Url: **/apiv1/usuarios/registro**
- Método: **POST**
- Parámetros Body:
    - **nombre**: (Obligatorio) Nombre del usuario a dar de alta
    - **email**: (Obligatorio) Email del usuario a dar de alta
    - **clave**: (Obligatorio) Password del usuario a dar de alta
- Ejemplo: 
    - Petición: `http://localhost:3000/apiv1/usuarios/registro`
    - Respuesta: `{"success":true}`


### Autenticación
Realiza petición de Login en el sistema para obtener Token de usuario, necesario para algunos servicios del API. Devuelve Token de usuario.

- Url: **/apiv1/usuarios/authenticate**
- Método: **POST**
- Parámetros Body:
    - **email**: (Obligatorio) Email del usuario a loguear
    - **clave**: (Obligatorio) Password del usuario a loguear
- Ejemplo:
    - Petición: `http://localhost:3000/apiv1/usuarios/authenticate`
    - Respuesta: ` {"success":true,"result":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzNjg2ODYyMjQ3NDY1N2E1ZTI0MDVlIiwiaWF0IjoxNTEzNTI2MTU2LCJleHAiOjE1MTM2OTg5NTZ9.Fw18OoAzk2JMRcolXREbzlxCIAD0GCPET3f_X9EvPm0"}`

### Lista de Anuncios
Devuelve el listado de anuncios que cumplan las condiciones informadas por parámetros

- Url: **/apiv1/anuncios**
- Método: **GET**
- Parámetros Body:
    - **x-access-token**: (Obligatorio) Token de usuario obtenido despues de autenticar. Puede ser informado en el Body o como parámetro query (ver parametro *token*).
- Parámetros Query:
    - **token**: (Obligatorio) Token de usuario obtenido después de autenticar. Puede ser informado como parámetro query o en el Body (ver parámetro *x-access-token*)
    - **start**: (Opcional) Para listados paginados. Indica a partir de qué elemento desea obtener los resultados (por defecto 0).
    - **limit**: (Opcional) Número máximo de registros a devolver (por defecto 10)
    - **sort**: (Opcional) Indica si se desea obtener el resultado ordenado (ascendente) por un campo concreto (Ejemplo: `sort=precio`)
    - **tags**: (Opcional) Devuelve únicamente elementos que tengan el tag definido. Definir tantas veces como tags deban contener los anuncios a devolver (Ejemplo: `tags=lifestyle&tags=motor`)
    - **venta**: (Opcional) Indica qué tipo de anuncios debe devolver el API (true=Anuncios de venta / false = Anuncios de compra).
    - **precio**: (Opcional) Permite indicar el precio exacto o rango de precios de los anuncios a devolver:
        - `precio=X`: Devuelve únicamente anuncios cuyo precio sea igual a "X"
        - `precio=X-`: Devuelve únicamente anuncios cuyo precio sea mayor o igual a "X".
        - `precio=-X`: Devuelve únicamente anuncios cuyo precio sea menor o igual a "X".
        - `precio=X-Y`: Devuelve únicamente anuncios cuyo precio esté comprendido entre X e Y.
    - **nombre**: (Opcional) Indica el nombre por el que deben comenzar los anuncios a devolver

- Ejemplo:
    - Petición: `http://localhost:3000/apiv1/anuncios?start=0&limit=5&sort=precio&tags=lifestyle&tags=work&venta=true&precio=-1500&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzNjg2ODYyMjQ3NDY1N2E1ZTI0MDVlIiwiaWF0IjoxNTEzNTIzNjc1LCJleHAiOjE1MTM2OTY0NzV9.ENrxMQaNinf9Z7hFiuLsbsGtg26ZnjGyuvhX4kJvuL0`
    - Respuesta: ` {"success":true,"result":[{"_id":"5a36868622474657a5e2405b","nombre":"Macbook Pro 13'","venta":true,"precio":1500,"foto":"images/anuncios/macbook13.png","tags":["work","lifestyle"]}]}`

### Lista de Tags
Devuelve listado de los diferentes Tags disponibles en la Base de Datos

- Url: **/apiv1/anuncios/tags**
- Método: **POST**/**GET**
- Ejemplo:
    - Petición: `http://localhost:3000/apiv1/anuncios/tags`
    - Respuesta: ` {"success":true,"result":["lifestyle","motor","mobile","work"]}`

## Desarrolladores
Tras realizar una modificación en el código, realizar validación de calidad del código mediante:
`npm run eslint`


## URLs de acceso para práctica del módulo DevOps
### Ejercicio 1 - Despliegue de aplicación Node.js
- Url: https://nodepop.proyectodev.com
- Descripción: La página principal muestra una breve descripción del funcionamiento de la API usando el dominio de prueba (https://nodepop.proyectodev.com). En dicha página se ha incluído una imagen y se hace uso de una hoja de estilos CSS servidas ambas por NGINX con la cabecera X-Owner: CristianBB. De igual manera, la consulta de las imagenes cuya ruta es devuelta por la API también son devueltas por NGINX.

### Ejercicio 2 - Carga de web estática
- Url 1: https://34.193.92.49 (Mostrará error de certificado puesto que se ha preparado para el subdominio cristian.proyectodev.com)
- Url 2: https://cristian.proyectodev.com
- Descripción: La plantilla utilizada NO proviene de https://startbootstrap.com ya que quería aprovechar para dejar preparada la página de mi CV. En cualquier caso se trata de una web html servida directamente por Nginx. Hasta la corrección de la práctica esta web estará configurada como DEFAULT en Nginx para que el acceso mediante la IP del servidor cargue dicha web. Una vez realizada la corrección, el servidor por defecto será el blog de wordpress (Ver extras)

### Extras

He aprovechado para instalar en la misma instancia una base de datos MariaDB, el interprete de PHP y configurar Nginx para que el acceso mediante el dominio principal cargue un blog de Wordpress.
- Url: https://www.proyectodev.com/
- Descripción: He instalado el plugin de Wordpress Supercache, que se encarga de generar contenido estático para agilizar la carga de las páginas. Aprovechando ésto se han definido reglas en NGINX para que el contenido estático sea devuelto directamente por NGINX con la misma cabecera X-Owner: CristianBB del primer Ejercicio.



## Changelog
- 0.0.1: Versión inicial del API
- 0.0.2: Añadida información correspondiente a la práctica del módulo de DevOps

## Autor
**Cristian Blázquez Bustos**
