# 🕹️ Arcade Simulator – Aplicación Web Interactiva

**Arcade Simulator** es una aplicación web creada con **[v0.dev](https://v0.dev)** que emula la experiencia de una máquina arcade clásica.  
Ofrece una selección de **minijuegos interactivos** accesibles desde una interfaz moderna, responsiva y fácil de usar.

[![Repo](https://img.shields.io/badge/GitHub-TodTete-blue?logo=github)](https://github.com/TodTete/Arcade-)
[![Status](https://img.shields.io/badge/status-en%20desarrollo-orange)](#estado)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 Objetivo del proyecto

Recrear un **entorno lúdico y nostálgico** que permita disfrutar de distintos juegos desde una única plataforma web, fomentando la exploración de experiencias interactivas construidas con componentes generados mediante **inteligencia artificial**.

---

## 🧱 Tecnologías y herramientas

- 🧠 **v0.dev** – Generación de interfaz con IA  
- ⚛️ **Next.js + React** – Base del proyecto  
- 🎨 **Tailwind CSS** – Estilos responsivos y modernos  
- 🎮 **HTML/CSS/JS** – Para la lógica de los minijuegos  
- 📦 **Arquitectura modular** – Facilita agregar nuevos juegos  

---

## 🕹️ Juegos incluidos

Actualmente disponibles:

- 🐍 **Snake**  
- 🧱 **Breakout**  
- 🪙 **Coin Catch**  
- 🎯 **Reaction Game**  

*(La lista puede ampliarse en futuras versiones)*

---

## 📂 Estructura del proyecto

```

Arcade-/
├─ app/             # Páginas principales (Next.js App Router)
├─ components/      # Componentes reutilizables
├─ hooks/           # Custom hooks
├─ lib/             # Funciones auxiliares
├─ public/          # Archivos estáticos
├─ styles/          # Estilos globales
├─ .gitignore
├─ README.md
├─ components.json
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.ts
└─ tsconfig.json

````

---

## 🚀 Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TodTete/Arcade-.git
   cd Arcade-

2. Instala dependencias:

   ```bash
   npm install
   ```
3. Ejecuta en modo desarrollo:

   ```bash
   npm run dev
   ```
4. Abre en tu navegador:
   👉 `http://localhost:3000`

---

## ⚠️ Recomendaciones

* Funciona mejor en **navegadores modernos** (Chrome, Edge, Firefox).
* Se recomienda usar en **pantallas amplias** para una experiencia más inmersiva.
* Proyecto con fines **educativos y experimentales**.

---

## 🔮 Próximos pasos

* [ ] Añadir más minijuegos (Tetris, Pong, Memory Game).
* [ ] Sistema de puntuaciones globales y ranking.
* [ ] Modo multijugador local.
* [ ] Exportar como **PWA (Progressive Web App)**.

---

## 👤 Autor

**Ricardo Vallejo**
🔗 [Repositorio oficial](https://github.com/TodTete/Arcade-)

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [`LICENSE`](LICENSE) para más detalles.
