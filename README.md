# ADMINISTRATIVA IUDC

Este proyecto es una aplicación React para la gestión de informes financieros y el manejo de solicitudes PQR (Preguntas, Quejas y Reclamos) a través de una API REST. Permite la creación, visualización, y actualización de PQRs, así como la carga de documentos y autenticación de usuarios.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Uso de la Aplicación](#uso-de-la-aplicación)
  - [Crear un PQR](#crear-un-pqr)
  - [Obtener un PQR por ID](#obtener-un-pqr-por-id)
  - [Cargar un Documento](#cargar-un-documento)
  - [Login de Usuario](#login-de-usuario)
  - [Crear Usuario](#crear-usuario)
  - [Actualizar un PQR por ID](#actualizar-un-pqr-por-id)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)

## Requisitos Previos

- [Node.js](https://nodejs.org/) versión 12 o superior
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) como manejador de paquetes
- API REST backend en funcionamiento (se espera que esté en `localhost:8080`)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   npm install
   ```
2. Uso de la Aplicación
## Crear un PQR
## Para crear un nuevo PQR, puedes utilizar el siguiente formato de datos:

    ```
    curl --location 'http://localhost:8080/api/pqrs' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer <token>' \
    --data '{
        "idPersona": 1,
        "idPrograma": 1,
        "idDocumento": 1,
        "nombreCaso": "Nombre del Caso",
        "idTipologia": 2,
        "plazoDiasRespuesta": 30
    }'
    ```
## Obtener un PQR por ID
## Para obtener los datos de un PQR específico por su ID:

  ```
    curl -X GET http://localhost:8080/api/pqrs/{id}
  ```
## Cargar un Documento
## Para cargar un documento relacionado con un PQR:

  ```
    curl --location 'http://localhost:8080/api/documentos/upload' \
    --header 'Authorization: Bearer <token>' \
    --form 'file=@"/ruta/al/archivo.docx"' \
    --form 'idTipologia="1"'
  ```
## Login de Usuario
## Para autenticar a un usuario:


```
      Copiar código
      curl --location 'http://localhost:8080/api/auth/login' \
      --header 'Content-Type: application/json' \
      --data-raw '{
          "email": "juan.perez@example.com",
          "pass": "password123"
      }'
  ```
## Crear Usuario
## Para crear un nuevo usuario en el sistema:

  ```
      curl --location 'http://localhost:8080/api/personas' \
      --header 'Content-Type: application/json' \
      --data-raw '{
          "nombres": "Juan",
          "apellidos": "Pérez",
          "email": "juan.perez@example.com",
          "password": "password123",
          "celular": "3112345678",
          "tipoUsuario": "A",
          "fechaCreacion": "2024-09-12T12:00:00"
      }'
  ```

## Actualizar un PQR por ID

## Para actualizar los datos de un PQR específico por su ID:

  ```
  curl -X PUT http://localhost:8080/api/pqrs/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
      "idPersona": 1,
      "idPrograma": 1,
      "idDocumento": 1,
      "nombreCaso": "Nuevo Nombre del Caso",
      "idTipologia": 3,
      "fechaCierreCaso": "2024-10-01T15:30:00",
      "fechaClasificacion": "2024-09-15T10:00:00",
      "plazoDiasRespuesta": 45
      }'
  ```

## Estructura del Proyecto

```
    📂 src
     ┣ 📂 components
     ┃ ┗ 📂 Sidebar
     ┃ ┃ ┗ 📜 Sidebar.js       # Componente de la barra lateral
     ┣ 📂 pages
     ┃ ┗ 📜 FinancialStatus.js  # Página principal con la tabla de datos financieros y PQRs
     ┣ 📂 styles
     ┃ ┗ 📜 DatasAdmin.css      # Estilos para la página de administración de datos
     ┗ 📜 App.js                # Componente principal de la aplicación
```
