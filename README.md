# Pokémon Trainer

Prueba técnica de frontend hecha con Angular. Creas un perfil de entrenador, eliges 3 Pokémon de la primera generación y ves el resumen de tu equipo con las barras de progreso de cada Pokémon.

## Requisitos

- Node.js (versión LTS)
- npm

## Instalación

```bash
npm install
```

## Correr en desarrollo

```bash
ng serve
```

Luego abre `http://localhost:4200/`. La app recarga sola cuando cambias un archivo.

## Build de producción

```bash
ng build
```

El resultado queda en la carpeta `dist/`.

## Correr con Docker

Si tienes Docker instalado, no hace falta instalar Node ni las dependencias:

```bash
docker build -t pokemon-trainer .
docker run -p 8080:80 pokemon-trainer
```

Luego abre `http://localhost:8080`. Para detenerlo, `Ctrl+C`.

La imagen se construye en dos etapas: la primera compila la app con Node y la segunda sirve los archivos con nginx, así que la imagen final no lleva Node ni `node_modules`. La configuración de nginx está en `nginx.conf` y redirige cualquier ruta a `index.html`, que es lo que necesita el enrutador de Angular para que funcione recargar la página en `/profile` o `/pokemon`.

## Ramas

El repositorio sigue Git Flow:

- **`master`** — la rama de producción. Solo recibe lo que ya está terminado y probado.
- **`develop`** — la rama de integración. Aquí se va juntando el avance antes de pasarlo a `master`.
- **`feature/*`** — una rama por cada parte del proyecto, que sale de `develop` y vuelve a `develop` al terminar.

Las ramas de feature que se trabajaron:

| Rama | Qué incluye |
| --- | --- |
| `feature/core-and-data-services` | Modelos, constantes y los servicios de PokeAPI y del entrenador |
| `feature/trainer-form` | Formulario de perfil con sus validaciones |
| `feature/pokemon-list` | Listado de Pokémon, buscador y selección del equipo |
| `feature/trainer-detail` | Resumen del entrenador con las stats del equipo |
| `feature/dockerfile` | Dockerfile y configuración de nginx |

Los commits están en inglés siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `chore`).

## Notas

- El perfil se guarda en el `localStorage` del navegador, así que si recargas la página no pierdes los datos. Para empezar de cero, límpialo desde las herramientas de desarrollo del navegador.
- La primera carga del listado de Pokémon tarda unos segundos porque trae los 151 con su detalle.
- La app necesita conexión a internet para consultar la PokeAPI.

## Estructura

```
src/app/
├── core/        # modelos, constantes, servicios y guards
├── features/    # una carpeta por pantalla
└── shared/      # componentes y utilidades reutilizables
```