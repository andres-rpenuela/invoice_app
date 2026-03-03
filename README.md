ls -l# AngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Notas
La carpeta `npm-cache` es utilizada por npm para almacenar archivos temporales y caché de paquetes. 

Si experimentas problemas con la instalación de paquetes o con el rendimiento de npm, limpiar el caché puede ayudar a resolver estos problemas.

a. Borrar manualmente: `C:\Users\andre\AppData\Local\npm-cache`
b. Borrar y verificar con comandos:
```bash
npm cache clean --force
npm cache verify
```

----

Para los test del proeycto, instalar:

```bash
# Instalar Playwright como dependencia de desarrollo
npm install -D playwright

# Si falla
npx playwright install

# Si falla, instalar el navegador específico
npx playwright install chromium
```

---

Regla rápida para npm:

| Comando                  | ¿Dónde se instala? |
| ------------------------ | ------------------ |
| `npm install paquete`    | Proyecto           |
| `npm install -D paquete` | Proyecto (dev)     |
| `npm install -g paquete` | Global             |

Para ejecutar herramientas del proyecto usar `npx`:

```bash
npx playwright test
npx ng test
npx ng serve
```
Esto usa la versión que está en node_modules

O cuando no quieres contaminar tu sistema:

En vez de:
```
npm install -g @angular/cli
```

Puedes hacer:
```
npx @angular/cli new proyecto
