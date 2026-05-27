# Guía de Configuración para Portátil (Vive Travel)

Esta guía te permitirá clonar y configurar de forma idéntica los dos proyectos de la agencia de viajes en tu portátil.

---

## 1. Clonar los Repositorios

Abre una terminal en la carpeta donde deseas guardar los proyectos en tu portátil (por ejemplo, en `Downloads` o tu carpeta de proyectos) y ejecuta los siguientes comandos:

```bash
# 1. Clonar la página web de la Agencia X
git clone https://github.com/trespapaginas-source/ViveTravel-web.git

# 2. Clonar el CMS de la Agencia
git clone https://github.com/trespapaginas-source/vivetravel-CMS.git
```

---

## 2. Configurar Archivos `.env`

Dado que los archivos de variables de entorno `.env` están excluidos de Git por seguridad, debes crearlos manualmente en la raíz de cada proyecto clonado en tu portátil.

### A. Para el proyecto `ViveTravel-web` (Agencia X)
Crea un archivo llamado `.env` en la raíz de la carpeta `ViveTravel-web` y agrega el siguiente contenido:

```env
DATABASE_URL=file:../db/custom.db
NEXT_PUBLIC_SUPABASE_URL="https://gvpioebttpmtblsjilbt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cGlvZWJ0dHBtdGJsc2ppbGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzE2MTQsImV4cCI6MjA5MDA0NzYxNH0.r2cvgwwoLD70dz-0OPJD_F_PXR3e-UUmh7seuXLJgDI"
```

### B. Para el proyecto `vivetravel-CMS` (CMS)
Crea un archivo llamado `.env` en la raíz de la carpeta `vivetravel-CMS` y agrega el siguiente contenido:

```env
DATABASE_URL="postgresql://postgres.gvpioebttpmtblsjilbt:DataCMS202621@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
NEXT_PUBLIC_SUPABASE_URL="https://gvpioebttpmtblsjilbt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cGlvZWJ0dHBtdGJsc2ppbGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzE2MTQsImV4cCI6MjA5MDA0NzYxNH0.r2cvgwwoLD70dz-0OPJD_F_PXR3e-UUmh7seuXLJgDI"
```

---

## 3. Instalar Dependencias

En cada una de las carpetas de los proyectos, instala las librerías necesarias con el siguiente comando:

```bash
# Entrar a la carpeta e instalar dependencias
npm install
```

---

## 4. Ejecutar los Servidores en Localhost

Para poder visualizar ambos proyectos de forma simultánea sin conflicto de puertos, ejecútalos en puertos distintos:

### Página de la Agencia (Puerto 3000)
Dentro del proyecto `ViveTravel-web`, ejecuta:
```bash
npx next dev -p 3000
```
*Acceso:* http://localhost:3000

### CMS de la Agencia (Puerto 3001)
Dentro del proyecto `vivetravel-CMS`, ejecuta:
```bash
npx next dev -p 3001
```
*Acceso:* http://localhost:3001
