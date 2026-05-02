# 🎓 AI Study Quiz Agent

[English](#english) | [Español](#español)

---

<a name="english"></a>
## 🇺🇸 English Version

An intelligent and powerful study agent designed to transform your documents into interactive quizzes. Powered by **Google Gemini 3.1 Flash**, it generates high-quality questions, ensuring you master any subject with exceptional academic rigor.

### 🚀 Features

- **Multi-format Document Ingestion:** Supports `.pdf`, `.txt`, `.md`, `.ppt`, and `.pptx`.
- **Intelligent Generation:** Creates between 40 and 60 multiple-choice questions based exclusively on the provided content.
- **Original Language Respect:** The agent detects and uses the document's language to generate the quiz.
- **Premium Interface:** Modern design with glassmorphism, fluid animations, and an optimized user experience.
- **Rigorous Evaluation:** Scoring system with a 70% threshold to guarantee real learning.
- **Guaranteed Randomness:** Answer options are dynamically shuffled for every question.

### 🛠️ Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/DarkVanitas-art/quizz-para-estudiar.git
cd quizz-para-estudiar
```

#### 2. Create a Virtual Environment (Recommended)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure Gemini API Key
Create a file named `.env` in the project root and add your key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 🎮 How to Use

1. **Start the server:**
   ```bash
   uvicorn backend.main:app --reload
   ```
2. **Open the app:**
   Navigate to [http://localhost:8000](http://localhost:8000) in your browser.
3. **Upload documents:**
   Drag and drop or select your study files.
4. **Generate & Study:**
   Click "Generate Quiz", wait for the AI to process the content, and start your study session.

---

<a name="español"></a>
## 🇲🇽 Español Version

Un agente de estudio inteligente y potente diseñado para transformar tus documentos en cuestionarios interactivos. Utiliza **Google Gemini 3.1 Flash** para generar preguntas de alta calidad, asegurando que domines cualquier tema con un rigor académico excepcional.

### 🚀 Características

- **Ingesta de Documentos Multiformato:** Soporte para `.pdf`, `.txt`, `.md`, `.ppt` y `.pptx`.
- **Generación Inteligente:** Crea entre 40 y 60 preguntas de opción múltiple basadas exclusivamente en el contenido proporcionado.
- **Respeto al Idioma Original:** El agente detecta y utiliza el idioma del documento para generar el cuestionario.
- **Interfaz Premium:** Diseño moderno con *glassmorphism*, animaciones fluidas y una experiencia de usuario optimizada.
- **Evaluación Rigurosa:** Sistema de calificación con una barrera del 70% para garantizar el aprendizaje real.
- **Aleatoriedad Garantizada:** Las opciones de respuesta se mezclan dinámicamente en cada pregunta.

### 🛠️ Instalación y Configuración

#### 1. Clonar el repositorio
```bash
git clone https://github.com/DarkVanitas-art/quizz-para-estudiar.git
cd quizz-para-estudiar
```

#### 2. Crear un entorno virtual (Recomendado)
```bash
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate
```

#### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

#### 4. Configurar la API Key de Gemini
Crea un archivo llamado `.env` en la raíz del proyecto y añade tu clave:
```env
GEMINI_API_KEY=tu_api_key_aqui
```

### 🎮 Cómo usar

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

---
Developed with passion to empower continuous learning. / Desarrollado con pasión para potenciar el aprendizaje continuo. 🚀
