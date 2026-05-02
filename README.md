# 🎓 AI Study Quiz Agent

Un agente de estudio inteligente y potente diseñado para transformar tus documentos en cuestionarios interactivos. Utiliza **Google Gemini 3.1 Flash** para generar preguntas de alta calidad, asegurando que domines cualquier tema con un rigor académico excepcional.

## 🚀 Características

- **Ingesta de Documentos Multiformato:** Soporte para `.pdf`, `.txt`, `.md`, `.ppt` y `.pptx`.
- **Generación Inteligente:** Crea entre 40 y 60 preguntas de opción múltiple basadas exclusivamente en el contenido proporcionado.
- **Respeto al Idioma Original:** El agente detecta y utiliza el idioma del documento para generar el cuestionario.
- **Interfaz Premium:** Diseño moderno con *glassmorphism*, animaciones fluidas y una experiencia de usuario optimizada.
- **Evaluación Rigurosa:** Sistema de calificación con una barrera del 70% para garantizar el aprendizaje real.
- **Aleatoriedad Garantizada:** Las opciones de respuesta se mezclan dinámicamente en cada pregunta.

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/darkansem12-rgb/quizz-para-estudiar.git
cd quizz-para-estudiar
```

### 2. Crear un entorno virtual (Opcional pero recomendado)
```bash
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar la API Key de Gemini
Crea un archivo llamado `.env` en la raíz del proyecto y añade tu clave:
```env
GEMINI_API_KEY=tu_api_key_aqui
```

## 🎮 Cómo usar

1. **Iniciar el servidor:**
   ```bash
   uvicorn backend.main:app --reload
   ```
2. **Abrir la aplicación:**
   Navega a [http://localhost:8000](http://localhost:8000) en tu navegador.
3. **Subir documentos:**
   Arrastra o selecciona tus archivos de estudio.
4. **Generar y Estudiar:**
   Haz clic en "Generar Quizz", espera a que la IA procese el contenido y comienza tu sesión de estudio.

## 🛡️ Reglas de Oro

- **Idioma:** El cuestionario siempre se generará en el idioma del documento original.
- **Aprobación:** Debes obtener al menos un 70% de respuestas correctas. Si no lo logras, el sistema te pedirá generar un nuevo cuestionario para seguir practicando hasta alcanzar la maestría.

---
Desarrollado con pasión para potenciar el aprendizaje continuo. 🚀
