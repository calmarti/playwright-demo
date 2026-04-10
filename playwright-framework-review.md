# Playwright Framework Review — playwright-demo

> **Proyecto:** playwright-demo (IvanQA)
> **Fecha de revisión:** 2026-04-10
> **Revisor:** Raúl Molina Hernández
> **Versión Playwright:** ^1.59.0
> **Aplicación bajo test:** [SauceDemo](https://www.saucedemo.com/)

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Análisis por capa](#3-análisis-por-capa)
   - 3.1 [Configuración (`playwright.config.ts`)](#31-configuración-playwrightconfigts)
   - 3.2 [Page Objects](#32-page-objects)
   - 3.3 [Tests](#33-tests)
   - 3.4 [Test Data](#34-test-data)
   - 3.5 [Setup / Autenticación](#35-setup--autenticación)
   - 3.6 [CI/CD (GitHub Actions)](#36-cicd-github-actions)
   - 3.7 [TypeScript / Toolchain](#37-typescript--toolchain)
4. [Bugs confirmados](#4-bugs-confirmados)
5. [Fortalezas del framework](#5-fortalezas-del-framework)
6. [Debilidades y riesgos](#6-debilidades-y-riesgos)
7. [Cobertura de tests](#7-cobertura-de-tests)
8. [Acciones recomendadas](#-acciones-recomendadas)

---

## 1. Resumen ejecutivo

El proyecto implementa un framework de automatización E2E con **Playwright + TypeScript** sobre la aplicación demo SauceDemo. La base es sólida: aplica correctamente el patrón **Page Object Model (POM)**, gestiona el estado de autenticación con `globalSetup`, usa localizadores semánticos y tiene integración continua en GitHub Actions.

Sin embargo, existen **dos bugs activos** que provocarían fallos en ejecución, credenciales en texto plano, `slowMo` hardcodeado en CI, ausencia de cobertura multi-browser y varias inconsistencias menores que reducen la mantenibilidad. Este documento detalla todos los hallazgos y propone un plan de acción priorizado.

---

## 2. Estructura del proyecto

```
playwright-demo/
├── .github/
│   └── workflows/
│       └── playwright.yml          # Pipeline CI
├── page-objects/
│   ├── login-page.ts               # POM: página de login
│   └── products-page.ts            # POM: página de productos
├── setup/
│   └── global.setup.ts             # Autenticación global (storageState)
├── test-data/
│   ├── items.ts                    # Datos de productos
│   └── users.ts                    # Credenciales de usuarios ⚠️
├── tests/
│   ├── login.spec.ts               # Tests de login (5 casos)
│   └── products.spec.ts            # Tests de productos (5 casos)
├── types.ts                        # Tipos compartidos (Item, By, Order)
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

**Métricas de partida:**

| Métrica | Valor |
|---------|-------|
| Archivos de test | 2 |
| Casos de test totales | 10 |
| Page Objects | 2 |
| Browsers configurados | 1 (Chromium) |
| Reporters activos | 1 (HTML) |
| Cobertura API | 0% |

---

## 3. Análisis por capa

### 3.1 Configuración (`playwright.config.ts`)

#### Aspectos positivos

- `forbidOnly: !!process.env.CI` — previene que `test.only` llegue a CI.
- `retries: 2` en CI — buena red de seguridad para flakiness de red.
- `testIdAttribute: 'data-test'` — alineado con los atributos del DOM de SauceDemo.
- `storageState` global configurado — evita repetir el login en cada test.
- `headless` condicional según entorno.

#### Problemas

**`slowMo: 500` está activo en todos los entornos, incluido CI.**

```ts
// playwright.config.ts — línea 41
launchOptions: {
  slowMo: 500,   // ⚠️ añade 500 ms artificiales entre cada acción
},
```

Con 10 tests y múltiples pasos, esto añade decenas de segundos innecesarios a cada ejecución en CI. `slowMo` debe limitarse a desarrollo local.

```ts
// Solución recomendada
launchOptions: {
  slowMo: process.env.CI ? 0 : 500,
},
```

**Reporter insuficiente para CI.**

Solo hay un reporter HTML, que no expone resultados consumibles por GitHub Actions ni por herramientas de agregación. Añadir al menos el reporter `github` o `junit`.

```ts
reporter: [
  ['html', { open: 'never' }],
  ['github'],          // ✅ anotaciones nativas en PR
  // ['junit', { outputFile: 'results.xml' }],
],
```

**`workers: 1` en CI apaga la paralelización.**

Para un proyecto pequeño es aceptable, pero debe documentarse como decisión consciente, no valor por defecto.

---

### 3.2 Page Objects

#### `login-page.ts`

##### Bug crítico — método `logout()` referencia una propiedad inexistente

```ts
// login-page.ts — línea 42
async logout(){
  this.openMenuLocator.click();  // ❌ 'openMenuLocator' no existe
}
```

La propiedad correcta se llama `openTopLeftMenuLocator`. TypeScript debería haberlo detectado, pero el proyecto no incluye un paso de comprobación de tipos (`tsc --noEmit`) en el pipeline. El método tampoco tiene `await`.

```ts
// Corrección
async logout() {
  await this.openTopLeftMenuLocator.click();
}
```

##### `TODO` pendiente en el constructor

```ts
// login-page.ts — línea 14
//TODO: add locator suffix where needed
```

Indica trabajo incompleto. Debe resolverse o convertirse en issue rastreado.

##### `succesfulLoginLocator` es frágil

```ts
this.succesfulLoginLocator = page.getByText('Products');
```

`getByText('Products')` puede coincidir con múltiples elementos (encabezado, enlace de menú, texto de botón). Es preferible usar un localizador más específico:

```ts
this.succesfulLoginLocator = page.getByRole('heading', { name: 'Products' });
```

##### `failedLoginLocator` depende de un string literal exacto

```ts
this.failedLoginLocator = page.getByRole('heading', {
  name: "Epic sadface: Username and password do not match any user in this service"
});
```

Un cambio de copy en la aplicación rompe todos los tests negativos. Mejor apuntar al contenedor del error por su `data-test`:

```ts
this.failedLoginLocator = page.getByTestId('error-message-container');
```

#### `products-page.ts`

- Uso correcto de `getByTestId`, `getByRole` y `filter()` — buenas prácticas.
- El método `sortItemsBy` es funcional pero podría simplificarse con un mapa de valores en lugar de `if/else`.
- `navigateToProductsPage()` navega directamente a `/inventory.html` sin verificar autenticación previa — aceptable por el `storageState`, pero podría fallar silenciosamente si el estado expira.

---

### 3.3 Tests

#### `login.spec.ts`

##### Buenas prácticas observadas

- `test.use({ storageState: { cookies: [], origins: [] } })` — anula correctamente el estado de auth global para tests de login.
- `test.step()` usado consistentemente para estructura BDD (Given / When / Then).
- `beforeEach` centraliza la navegación y la aserción de URL.

##### Inconsistencias

| Problema | Descripción |
|----------|-------------|
| Nomenclatura de tests | Mezcla de mayúscula inicial (`'User with valid...'`) y minúscula (`'user with valid...'`, `'Valid user...'`). |
| Test de logout sin `test.step` | El test `'Valid user should be able to log out'` no usa la estructura de pasos del resto del describe. |
| Localizador de logout hardcodeado en el test | `page.getByRole('link', { name: /Logout/i })` debería encapsularse en el Page Object. |

#### `products.spec.ts`

##### Bugs confirmados — `await` faltante

```ts
// products.spec.ts — línea 83
expect(productsPage.shoppingCartLocator).toHaveText('3');  // ❌ sin await

// products.spec.ts — línea 87
expect(page).toHaveURL((/cart\.html/));  // ❌ sin await
```

Las aserciones de Playwright devuelven una `Promise`. Sin `await`, se ejecutan pero nunca se esperan, con lo que el test pasa aunque el estado sea incorrecto.

```ts
// Corrección
await expect(productsPage.shoppingCartLocator).toHaveText('3');
await expect(page).toHaveURL(/cart\.html/);
```

##### Variable `authJson` declarada pero no usada

```ts
// products.spec.ts — línea 8
const authJson = path.join(__dirname, '../setup/auth.json');  // ⚠️ no se usa
```

Importación de `path` innecesaria. Con `strict: true` en tsconfig esto debería advertir; si no lo hace, revisar la configuración del linter.

##### `eslint` instalado pero sin configuración visible

El `package.json` declara `eslint ^9.39.2` como devDependency, pero no hay fichero `.eslintrc.*` ni configuración en `package.json`. El linter está instalado pero inactivo.

---

### 3.4 Test Data

- Separación limpia entre datos de usuario (`users.ts`) y datos de producto (`items.ts`).
- Tipado correcto con la interfaz `Item`.

##### Credenciales en texto plano — riesgo de seguridad

```ts
// users.ts
validUser: {
  username: 'standard_user',
  password: 'secret_sauce'   // ⚠️ visible en el repositorio
}
```

Para un proyecto de demo contra una aplicación pública, el riesgo es bajo. Sin embargo, el patrón establece un precedente incorrecto. La integración con `dotenv` ya está preparada pero comentada en `playwright.config.ts`.

```ts
// Patrón recomendado
validUser: {
  username: process.env.TEST_USERNAME ?? 'standard_user',
  password: process.env.TEST_PASSWORD ?? 'secret_sauce',
}
```

---

### 3.5 Setup / Autenticación

`global.setup.ts` implementa correctamente el patrón de autenticación con `storageState`: ejecuta el login una sola vez y persiste las cookies en `auth.json`.

##### Inconsistencia: no usa el Page Object `LoginPage`

```ts
// global.setup.ts — usa selectores directos
await page.getByPlaceholder('Username').fill(validUser.username);
await page.click('[data-test="login-button"]');
```

Si los selectores del formulario cambian, hay que actualizarlos en dos sitios. El setup debería usar `LoginPage` para centralizar el mantenimiento.

##### Dependencia frágil en `config.projects[0]`

```ts
const { baseURL } = config.projects[0].use;
```

Si se reordenan los proyectos en `playwright.config.ts`, el setup toma la URL incorrecta. Mejor usar `config.use.baseURL`.

---

### 3.6 CI/CD (GitHub Actions)

```yaml
# playwright.yml
- name: Run Playwright tests
  run: npx playwright test --trace=on
```

##### Puntos positivos

- Trigger en `push` y `pull_request` a `master`.
- Upload de artefactos solo en fallo (`if: ${{ failure() }}`).
- `retention-days: 15` razonable.
- Node LTS y `npm ci` correctos.

##### Mejoras recomendadas

| Punto | Problema | Solución |
|-------|----------|----------|
| `--trace=on` siempre activo | Los traces en CI para todos los tests generan artefactos muy pesados | Usar `--trace=on-first-retry` o confiar en el valor del config |
| No hay paso `tsc --noEmit` | Los errores de tipos no se detectan antes de ejecutar tests | Añadir step de type-check |
| No hay caché de `node_modules` | `npm ci` descarga todo en cada ejecución | Añadir `actions/cache` para `~/.npm` |
| No hay caché de browsers de Playwright | `npx playwright install` descarga ~300 MB en cada run | Añadir caché de `~/.cache/ms-playwright` |
| Un solo browser (Chromium) | Sin cross-browser en CI | Activar Firefox/WebKit cuando la suite madure |

---

### 3.7 TypeScript / Toolchain

- `strict: true` activo — buena base para detectar errores en tiempo de compilación.
- `moduleResolution: NodeNext` y `module: NodeNext` — configuración moderna y correcta.
- **No hay paso `tsc --noEmit` en CI**: el bug de `this.openMenuLocator` habría sido detectado automáticamente con una comprobación de tipos.

---

## 4. Bugs confirmados

| # | Archivo | Línea | Descripción | Severidad |
|---|---------|-------|-------------|-----------|
| B-1 | `page-objects/login-page.ts` | 42 | `logout()` referencia `this.openMenuLocator` (no existe). Falla en tiempo de ejecución. | **Alta** |
| B-2 | `tests/products.spec.ts` | 83 | `expect(...).toHaveText('3')` sin `await` — la aserción nunca se espera. | **Alta** |
| B-3 | `tests/products.spec.ts` | 87 | `expect(page).toHaveURL(...)` sin `await` — la aserción nunca se espera. | **Alta** |

---

## 5. Fortalezas del framework

- **Page Object Model** correctamente implementado y con responsabilidades bien delimitadas.
- **Autenticación centralizada** con `globalSetup` y `storageState` — patrón recomendado por Playwright.
- **Localizadores semánticos** (`getByRole`, `getByTestId`, `getByPlaceholder`) — resistentes a cambios de estilos o estructura DOM.
- **`testIdAttribute` configurado** — alinea `getByTestId` con el atributo real de la app.
- **Tipado fuerte** con interfaz `Item` y tipos `By` / `Order`.
- **`test.step()`** usado en login para trazabilidad BDD.
- **Separación de datos de test** en módulos independientes.
- **CI/CD funcional** con artefactos de reporte.
- **`forbidOnly`** en CI previene tests exclusivos accidentales.

---

## 6. Debilidades y riesgos

| Área | Riesgo | Nivel |
|------|--------|-------|
| Credenciales en texto plano en repositorio | Patrón inseguro replicable | Medio |
| Sin verificación de tipos en CI (`tsc --noEmit`) | Bugs de tipos llegan a ejecución | Alto |
| ESLint instalado pero sin configurar | Linter inactivo, código sin análisis estático | Medio |
| `slowMo: 500` en todos los entornos | Tests lentos innecesariamente en CI | Medio |
| Un solo browser en la suite | Sin cobertura cross-browser | Medio |
| Sin reporter para CI (JUnit/GitHub) | Resultados no visibles directamente en PR | Bajo |
| Sin tests de API | Cobertura solo E2E, más lenta y frágil | Bajo |
| Sin caché en GitHub Actions | Pipeline más lento de lo necesario | Bajo |

---

## 7. Cobertura de tests

### Módulo Login (`login.spec.ts`)

| Caso | Cubierto |
|------|----------|
| Login con credenciales válidas | ✅ |
| Login con password inválida | ✅ |
| Login con username inválido | ✅ |
| Login con ambas credenciales inválidas | ✅ |
| Logout exitoso | ✅ |
| Usuario bloqueado (`locked_out_user`) | ❌ |
| Usuario con problema de rendimiento (`performance_glitch_user`) | ❌ |
| Validación de campos vacíos | ❌ |

### Módulo Productos (`products.spec.ts`)

| Caso | Cubierto |
|------|----------|
| Ordenar por nombre descendente | ✅ |
| Ordenar por precio ascendente | ✅ |
| Navegar al detalle de un producto | ✅ |
| Añadir un producto y eliminarlo del carrito | ✅ |
| Añadir varios productos e ir al carrito | ✅ |
| Ordenar por nombre ascendente | ❌ |
| Ordenar por precio descendente | ❌ |
| Verificar contenido del carrito | ❌ |
| Proceso de checkout | ❌ |

---

## 🎯 Acciones recomendadas

| Acción | Prioridad | Impacto | Esfuerzo | Responsable sugerido |
|--------|-----------|---------|----------|----------------------|
| Corregir bug B-1: `this.openMenuLocator` → `this.openTopLeftMenuLocator` + añadir `await` en `logout()` | **Crítica** | Alto | Muy bajo | QA Automation |
| Corregir bugs B-2 y B-3: añadir `await` a las aserciones sin await en `products.spec.ts` | **Crítica** | Alto | Muy bajo | QA Automation |
| Añadir paso `tsc --noEmit` al pipeline de CI | **Alta** | Alto | Bajo | QA Automation / DevOps |
| Configurar ESLint con reglas para Playwright (ej. `eslint-plugin-playwright`) | **Alta** | Alto | Bajo | QA Automation |
| Mover `slowMo` a condicional por entorno (`CI ? 0 : 500`) | **Alta** | Medio | Muy bajo | QA Automation |
| Migrar credenciales a variables de entorno con `dotenv` como fallback | **Alta** | Medio | Bajo | QA Automation |
| Refactorizar `global.setup.ts` para usar `LoginPage` POM y `config.use.baseURL` | **Media** | Medio | Bajo | QA Automation |
| Añadir reporter `github` (o `junit`) al pipeline de CI | **Media** | Medio | Muy bajo | QA Automation / DevOps |
| Añadir caché de `node_modules` y browsers de Playwright en GitHub Actions | **Media** | Medio | Bajo | DevOps |
| Reemplazar `succesfulLoginLocator` por `getByRole('heading', { name: 'Products' })` | **Media** | Bajo | Muy bajo | QA Automation |
| Reemplazar `failedLoginLocator` por localizador de `data-test` del contenedor de error | **Media** | Bajo | Muy bajo | QA Automation |
| Eliminar variable `authJson` sin usar y el import de `path` en `products.spec.ts` | **Baja** | Bajo | Muy bajo | QA Automation |
| Homogeneizar nomenclatura de tests (casing consistente) | **Baja** | Bajo | Bajo | QA Automation |
| Encapsular localizador de logout en `LoginPage` (retirar del spec) | **Baja** | Bajo | Muy bajo | QA Automation |
| Activar Firefox y WebKit como proyectos adicionales en CI | **Baja** | Alto | Medio | QA Automation |
| Ampliar cobertura: usuarios especiales, checkout, validaciones de campos vacíos | **Baja** | Alto | Alto | QA Automation |
