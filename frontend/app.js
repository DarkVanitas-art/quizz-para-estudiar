document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btnGenerate = document.getElementById('btn-generate');
    const statusMessage = document.getElementById('file-status');
    const viewUpload = document.getElementById('view-upload');
    const viewLoading = document.getElementById('view-loading');
    const viewQuizz = document.getElementById('view-quizz');
    
    let selectedFile = null;
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFileSelect(e.target.files[0]);
    });

    function handleFileSelect(file) {
        const validTypes = ['.pdf', '.txt', '.md', '.ppt', '.pptx'];
        const isExtensionValid = validTypes.some(ext => file.name.toLowerCase().endsWith(ext));
        
        if (!isExtensionValid) {
            statusMessage.style.color = '#ef4444';
            statusMessage.textContent = 'Formato inválido. Por favor sube un PDF, TXT, MD o Powerpoint.';
            btnGenerate.disabled = true;
            return;
        }
        selectedFile = file;
        statusMessage.style.color = '#34d399';
        statusMessage.textContent = `Archivo cargado: ${file.name}`;
        btnGenerate.disabled = false;
    }

    btnGenerate.addEventListener('click', () => generateQuizz(false));

    async function generateQuizz(isRetry) {
        if (!selectedFile) return;

        // View transitions -> Quizz to Loader or Upload to Loader
        switchView(viewUpload.classList.contains('active-view') ? viewUpload : viewQuizz, viewLoading);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('retry', isRetry);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const rawData = await response.json();
            if (!response.ok) throw new Error(rawData.detail || 'Error en el servidor');
            
            // Empezar quizz
            currentQuestions = rawData.data;
            userAnswers = new Array(currentQuestions.length).fill(null);
            currentQuestionIndex = 0;
            
            switchView(viewLoading, viewQuizz);
            renderQuestion();

        } catch (error) {
            console.error(error);
            alert("No se pudo generar el quizz. Asegúrate de que la GEMINI_API_KEY esté configurada e intenta usar un archivo más corto.\Detalle: " + error.message);
            window.location.reload();
        }
    }

    function switchView(from, to) {
        from.classList.remove('active-view');
        from.classList.add('hidden-view');
        from.style.display = 'none';
        
        to.style.display = 'block';
        setTimeout(() => {
            // trigger repaint
            to.classList.remove('hidden-view');
            to.classList.add('active-view');
        }, 50);
    }

    function renderQuestion() {
        viewQuizz.innerHTML = '';
        if (currentQuestionIndex >= currentQuestions.length) {
            renderResults();
            return;
        }

        const q = currentQuestions[currentQuestionIndex];
        const progress = Math.round((currentQuestionIndex / currentQuestions.length) * 100);
        
        // Mezclar las respuestas de forma aleatoria para evitar sesgos del LLM
        const shuffledOptions = [...q.opciones].sort(() => Math.random() - 0.5);

        const container = document.createElement('div');
        container.innerHTML = `
            <div style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 2rem; height: 8px;">
                <div style="width: ${progress}%; background: #8b5cf6; height: 100%; border-radius: 10px; transition: width 0.3s; box-shadow: 0 0 10px #8b5cf6;"></div>
            </div>
            <h3 style="color:#94a3b8; font-size:1rem; margin-bottom: 1rem;">Pregunta ${currentQuestionIndex + 1} de ${currentQuestions.length}</h3>
            <h2 style="font-size: 1.8rem; margin-bottom: 2rem; line-height: 1.4;">${q.pregunta}</h2>
            <div style="display:flex; flex-direction:column; gap: 1rem;">
                ${shuffledOptions.map((opt) => `
                    <button class="btn btn-primary option-btn" data-opt="${opt}" style="text-align:left; padding: 1.5rem; font-size: 1.1rem;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;

        viewQuizz.appendChild(container);

        // Events
        const opts = container.querySelectorAll('.option-btn');
        opts.forEach(btn => {
            btn.addEventListener('click', (e) => {
                userAnswers[currentQuestionIndex] = e.target.getAttribute('data-opt');
                // Auto next tras feedback visual
                opts.forEach(b => {
                    b.style.pointerEvents = 'none';
                    if (b === btn) b.style.backgroundColor = '#8b5cf6';
                });
                setTimeout(() => {
                    currentQuestionIndex++;
                    renderQuestion();
                }, 400);
            });
        });
    }

    function renderResults() {
        let correctCount = 0;
        let incorrectHTML = '';

        currentQuestions.forEach((q, idx) => {
            // Trim y comparación segura por posibles espacios vacios de mas generados x el llm
            const isCorrect = q.respuesta_correcta.trim() === userAnswers[idx]?.trim();
            if (isCorrect) correctCount++;
            else {
                incorrectHTML += `
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                        <p style="font-weight: bold; margin-bottom:0.5rem;">❌ P${idx+1}: ${q.pregunta}</p>
                        <p style="color: #f8fafc; margin-bottom:0.3rem;">Respondiste: <span style="color:#ef4444; text-decoration:line-through;">${userAnswers[idx] || "No respondido"}</span></p>
                        <p style="color: #34d399;">Correcta: ${q.respuesta_correcta}</p>
                        <p style="margin-top:0.5rem; font-size:0.9rem; color:#94a3b8;"><em>💡 ${q.explicacion}</em></p>
                    </div>
                `;
            }
        });

        // Calculo puro score
        const score = (correctCount / currentQuestions.length) * 100;
        const passed = score > 70;

        let actionButtons = '';
        if (passed) {
            actionButtons = `
                <button class="btn btn-accent" style="margin-bottom: 1rem;" onclick="window.location.reload()">Empezar Nuevo Quizz (Otro archivo)</button>
                <button class="btn btn-primary" id="btn-retry" style="width: 100%;">Mismo tema, diferentes preguntas</button>
            `;
        } else {
            actionButtons = `
                <div style="background: #ef4444; color:white; padding: 1rem; border-radius: 12px; margin-bottom:1.5rem; text-align:center; font-weight:bold;">
                    ¡Reprobado! Score menos de 70%. Es necesario reintentar otro cuestionario para asentar conocimientos.
                </div>
                <button class="btn btn-accent" id="btn-retry">Generar Cuestionario de Recuperación</button>
            `;
        }

        viewQuizz.innerHTML = `
            <div style="text-align:center; margin-bottom: 2rem;">
                <h1 style="font-size: 3.5rem; color: ${passed ? '#34d399' : '#ef4444'}; margin-bottom:0.5rem;">${score.toFixed(0)}%</h1>
                <p style="font-size: 1.2rem; color: #94a3b8;">Aciertos: ${correctCount} de ${currentQuestions.length}</p>
            </div>
            
            <div style="max-height: 50vh; overflow-y: auto; padding-right:1rem; margin-bottom:2rem;">
                ${incorrectHTML || '<p style="text-align:center; color:#34d399;">¡Impecable! Pegaste todas las respuestas.</p>'}
            </div>

            <div>
                ${actionButtons}
            </div>
        `;

        const retryBtn = document.getElementById('btn-retry');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => generateQuizz(true));
        }
    }
});
