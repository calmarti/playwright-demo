# Suite de pruebas automatizadas E2E para "Sauce Demo" - Paywright - Typescript - GitHub Actions

Este proyecto realiza la automatización de pruebas de extremo a extremo (E2E) para la web [SauceDemo](https://www.saucedemo.com/), utilizando **Playwright** como framework de pruebas y siguiendo el patrón de diseño **Page Object Model (POM)** para garantizar un código mantenible y escalable. 

El proyecto cubre los siguientes casos de prueba:
 
* **Login (`login.spec.ts`):** 
   + Login exitoso 
   + Login fallido (4 casos de prueba posibles)
   + Logout
* **Products (`products.spec.ts`):**  
   + Ordenar el listado de productos por nombre en orden descendente
   + Ordenar el listado de productos por precio en orden ascendente
   + Visualizar el detalle de un producto
   + Agregar un producto al carrito y luego quitarlo
   + Agregar varios productos e ir a la página del carrito

### Contexto autenticado por defecto

En `global.setup.ts` se realiza la autenticación como parte del ciclo de vida de cada test en `products.spec.ts` y de futuros tests `spec.ts` que puedan crearse. Es decir, cada test utiliza un `browser.context` ya autenticado.  

El estado "autenticado" se guarda en el fichero auth.json: 

```bash
await page.context().storageState({ path: authJson });
```


Los tests de `login.spect.ts` excluyen de forma explícita la creación de un contexto autenticado:

`test.use({ storageState: { cookies: [], origins: [] } });`

---

## 🚀 Instalación y ejecución local

### 1. Requisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 22 o superior).
 
### 2. Instalación
 
```bash
# Instalar las dependencias del proyecto (package.json)

npm install

# Instalar los navegadores necesarios para Playwright

npx playwr ight install --with-deps
 ```` 

### 3. Ejecutar los tests
Puedes ejecutar las pruebas de distintas maneras:

- Ejecutar todos los tests 
 
```bash
npx playwright test --trace=on

#la opción --trace=on genera un fichero de traza con logs detallados. 

#Aún si no ha habido fallos puede accederse a la traza desde el reporte 
```

- Ejecutar los tests de un fichero `spec.ts`

```bash
npx playwright test file.spec --trace=on
```
- Abrir el reporte
```bash
npx playwright show-report 
```


## ⚙️ CI: Pipeline de GitHub Actions

El proyecto incluye una integración continua utilizando **GitHub Actions**. Esta pipeline consiste de un único job que ejecuta las pruebas end-to-end.

### Funcionamiento
El pipeline está configurado en el archivo `.github/workflows/playwright.yml` y funciona de la siguiente manera:

1.  **Disparadores (Triggers):** El pipeline se activa automáticamente cada vez que se realiza un **push** o un **pull request** a la rama `master`.

2.  **Entorno:** Ejecuta las pruebas en un contenedor con la última versión de **ubuntu-latest**.
3.  **Pasos del Job:**
    * Prepara el entorno instalando Node.js (versión LTS) y las dependencias del proyecto mediante `npm ci`.
    * Descarga e instala los binarios de los navegadores de Playwright con sus dependencias de sistema.
    * Ejecuta la suite completa de pruebas con el flag `--trace=on`.
4.  **Gestión de Trazas y Reportes:**
    * Al finalizar la ejecución (y siempre que haya fallado algún test), se **genera y sube un artefacto** `playwright-report`.
    * Este artefacto incluye el reporte HTML y la **traza** de Playwright, permitiendo inspeccionar visualmente qué ocurrió en caso de fallo.
