# Proyecto de automatización de pruebas con Playwright-Cucumber 

Este proyecto sencillo de automatización de QA utiliza Playwright (assertions y browsers aislados) y Cucumber como runner de pruebas para ejecutar una suite de pruebas a la web http://sauce-demo.com. Está desarrollado en TypeScript para una mejor experiencia de desarrollo. 

## ¿Qué es Playwright?

Playwright es un framework de automatización web moderno desarrollado por Microsoft que permite controlar navegadores web de manera programática. Una de sus características clave es la arquitectura de navegadores aislados, que proporciona entornos de prueba independientes y confiables.

### Ventajas de Playwright frente a otros frameworks de automatización

- **Multi-navegador**: Soporta Chromium, Firefox y WebKit con una sola API, eliminando la necesidad de drivers externos como en Selenium.
- **Arquitectura aislada**: Cada prueba se ejecuta en un contexto de navegador aislado, lo que mejora la estabilidad y reduce interferencias entre pruebas.
- **Auto-espera**: Espera automáticamente a que los elementos estén listos, reduciendo la necesidad de esperas manuales y la ocurrencia de *flaky tests*
- **Capturas de pantalla y videos**: Fácil generación de evidencias visuales para debugging.
- **Headless por defecto**: Ejecuta pruebas en modo headless para mayor velocidad.

## Instalación

-  Requiere node v22. 

Puedes descargar nvm (gestor de versiones de node) en este repositorio: https://github.com/nvm-sh/ y posteriormente instalar y habilitar node v22

 
  ```bash
   nvm install node 22
   ```
  ```bash
   nvm use 22
   ```
  ```bash
   node --version
   ```
- Instalar dependencias:  

```bash
   npm install -D
   ```

## Ejecución

Para ejecutar todas las pruebas:

```bash
npm run test:all
```

Para ejecutar pruebas específicas:

```bash
npm test features/<nombrefichero.feature>
```

## Reportes

Los reportes se generan automáticamente en la carpeta `reports/` al finalizar la ejecución de las pruebas. Contiene un reporte HTML de Cucumber y capturas de pantalla de escenarios fallidos (si los hubiere).

Para ver el reporte localmente:

```bash
npm run report:local
```
