# clapps api

## Prerequisitos

Instalar npm, nodejs y mysql.

## Instalación

Dirigirse al directorio principal del programa y ejecutar `npm install`. De esta manera se descargaran todas las dependencias necesarias.

##Ejecución

Para la correcta ejecución del programa primero se debe configurar un usuario de mysql. Una vez que se tenga el usuario creado, correr en mysql el script de sql que se encuentra en `db/clappsdb.sql` el cual creará la base de datas y table correspondiente.
Luego modificar el archivo `config/config.js` para que tenga el usuario y contraseña de la cuenta de mysql.
Una vez que se termina de configurar, finalmente se puede correr el servidor dirigiendose al directorio principal y ejecutando `npm start`.
Abrir un navegador en http://localhost:3000/ para interactuar con el servidor a traves de una interfaz web.

