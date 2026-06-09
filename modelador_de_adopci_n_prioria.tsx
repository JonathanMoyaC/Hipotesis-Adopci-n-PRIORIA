import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  GitCommit, 
  Settings2, 
  HelpCircle, 
  TrendingUp, 
  Sliders, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  RefreshCw,
  ChevronRight,
  Info,
  Layers,
  HeartPulse,
  Brain,
  Zap,
  Activity,
  Award,
  BookOpen,
  ArrowRightLeft
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [selectedElement, setSelectedElement] = useState({ type: 'welcome', id: null });
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram', 'simulator', 'editor', 'ai'
  
  // Custom Construct Data (editable)
  const [constructs, setConstructs] = useState({
    fup: { id: 'fup', name: 'Facilidad de Uso Percibida', desc: 'Grado en que el profesional clínico cree que utilizar PRIORIA será libre de esfuerzo cognitivo y operativo.', col: 0, row: 0, score: 4.2, color: 'from-emerald-500 to-teal-600', icon: 'Sparkles' },
    cf: { id: 'cf', name: 'Condiciones Facilitadoras', desc: 'Percepción de la disponibilidad de recursos técnicos, organizacionales y asistencia para usar PRIORIA.', col: 0, row: 1.5, score: 3.8, color: 'from-cyan-500 to-blue-600', icon: 'Layers' },
    co: { id: 'co', name: 'Compatibilidad Organizacional', desc: 'Grado de alinemento de PRIORIA con los valores de la institución, la práctica médica actual y las necesidades operativas.', col: 0, row: 3, score: 4.0, color: 'from-indigo-500 to-purple-600', icon: 'Settings2' },
    trans: { id: 'trans', name: 'Transparencia', desc: 'Claridad e inteligibilidad en las explicaciones y algoritmos con los que opera la IA de PRIORIA (explicabilidad).', col: 0, row: 4.5, score: 3.5, color: 'from-orange-500 to-amber-600', icon: 'HelpCircle' },
    priv: { id: 'priv', name: 'Privacidad y Seguridad', desc: 'Confianza en las salvaguardas de confidencialidad, manejo seguro de datos clínicos y cumplimiento normativo.', col: 0, row: 6, score: 4.5, color: 'from-rose-500 to-pink-600', icon: 'GitCommit' },
    sup: { id: 'sup', name: 'Supervisión Humana', desc: 'Capacidad de intervención activa del clínico (human-in-the-loop) para auditar, modificar o rechazar decisiones de la IA.', col: 0, row: 7.5, score: 4.1, color: 'from-violet-500 to-fuchsia-600', icon: 'CheckCircle2' },
    
    up: { id: 'up', name: 'Utilidad Percibida', desc: 'Expectativa de que PRIORIA mejore sustancialmente la precisión diagnóstica, la seguridad del paciente y la eficiencia clínica.', col: 1, row: 0.5, score: 4.3, color: 'from-teal-600 to-cyan-600', icon: 'TrendingUp' },
    conf: { id: 'conf', name: 'Confianza en la IA Clínica', desc: 'Aceptación y seguridad depositada en el juicio clínico asistido, asumiendo que los riesgos están controlados.', col: 1, row: 5.5, score: 3.9, color: 'from-sky-600 to-blue-700', icon: 'HeartPulse' },
    
    adop: { id: 'adop', name: 'Intención de Adopción de PRIORIA', desc: 'Predisposición voluntaria y compromiso conductual del equipo de salud para integrar el sistema en la práctica habitual.', col: 2, row: 3, score: 4.1, color: 'from-slate-800 to-slate-900', icon: 'FileText' }
  });

  // Custom Hypothesis weights/paths (editable)
  const [hypotheses, setHypotheses] = useState({
    H1: { id: 'H1', from: 'fup', to: 'up', weight: 0.45, label: 'H1: Facilidad de Uso → Utilidad', desc: 'Una interfaz intuitiva disminuye la carga de aprendizaje, catalizando la percepción de beneficio clínico.', status: 'Soportada (+)' },
    H2: { id: 'H2', from: 'up', to: 'adop', weight: 0.50, label: 'H2: Utilidad → Adopción', desc: 'El impacto directo percibido sobre el desempeño clínico es el principal motor de la intención conductual.', status: 'Soportada (+)' },
    H3: { id: 'H3', from: 'cf', to: 'adop', weight: 0.25, label: 'H3: Cond. Facilitadoras → Adopción', desc: 'Tener soporte técnico y capacitación reduce las barreras de uso e incentiva la adopción rápida.', status: 'Soportada (+)' },
    H4: { id: 'H4', from: 'co', to: 'adop', weight: 0.35, label: 'H4: Compatibilidad → Adopción', desc: 'La integración sin fricciones en los flujos preexistentes acelera el deseo de uso institucional.', status: 'Soportada (+)' },
    H5: { id: 'H5', from: 'trans', to: 'conf', weight: 0.30, label: 'H5: Transparencia → Confianza', desc: 'Conocer el porqué detrás de una recomendación algorítmica construye puentes de credibilidad clínica.', status: 'Soportada (+)' },
    H6: { id: 'H6', from: 'priv', to: 'conf', weight: 0.28, label: 'H6: Privacidad y Seg. → Confianza', desc: 'La seguridad absoluta de los datos sensibles de los pacientes es indispensable para depositar confianza en la IA.', status: 'Soportada (+)' },
    H7: { id: 'H7', from: 'sup', to: 'conf', weight: 0.40, label: 'H7: Supervisión → Confianza', desc: 'Sentir que la IA asiste y no reemplaza la autonomía médica genera una relación de confianza cooperativa.', status: 'Soportada (+)' },
    H8: { id: 'H8', from: 'conf', to: 'adop', weight: 0.42, label: 'H8: Confianza → Adopción', desc: 'Un nivel robusto de confianza clínica reduce la percepción de riesgo, impulsando la decisión de uso.', status: 'Soportada (+)' }
  });

  // Gemini State variables
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [aiError, setAiError] = useState("");
  const [suggestedWeights, setSuggestedWeights] = useState(null);

  // Reference hooks to measure node positions dynamically
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({});

  // Recalculate coordinates based on refs/IDs in DOM
  const updateCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords = {};

    Object.keys(constructs).forEach((key) => {
      const el = document.getElementById(`node-${key}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        newCoords[key] = {
          left: rect.left - containerRect.left,
          right: rect.right - containerRect.left,
          top: rect.top - containerRect.top + rect.height / 2,
          center: rect.left - containerRect.left + rect.width / 2,
          height: rect.height,
          width: rect.width,
          yCenter: rect.top - containerRect.top + rect.height / 2,
          xCenter: rect.left - containerRect.left + rect.width / 2
        };
      }
    });
    setCoords(newCoords);
  };

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    const timer = setTimeout(updateCoordinates, 400);
    return () => {
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer);
    };
  }, [constructs, activeTab]);

  // Handle updates to scores (for simulation)
  const handleScoreChange = (id, newScore) => {
    setConstructs(prev => ({
      ...prev,
      [id]: { ...prev[id], score: parseFloat(newScore) }
    }));
  };

  // Handle updates to weights (for editor)
  const handleWeightChange = (id, newWeight) => {
    setHypotheses(prev => ({
      ...prev,
      [id]: { ...prev[id], weight: parseFloat(newWeight) }
    }));
  };

  // --- MATHEMATICAL SIMULATOR LOGIC ---
  const calculations = useMemo(() => {
    const { fup, cf, co, trans, priv, sup } = constructs;
    const { H1, H2, H3, H4, H5, H6, H7, H8 } = hypotheses;

    const calculatedUtilidad = Math.min(5, Math.max(1, 1.5 + (fup.score - 3) * H1.weight * 1.5));

    const totalConfWeight = H5.weight + H6.weight + H7.weight;
    const weightedConfSum = (trans.score * H5.weight + priv.score * H6.weight + sup.score * H7.weight);
    const calculatedConfianza = Math.min(5, Math.max(1, 1.2 + (weightedConfSum / (totalConfWeight || 1) - 3) * 1.4));

    const calculatedAdopcion = Math.min(5, Math.max(1, 
      (calculatedUtilidad * H2.weight + 
       cf.score * H3.weight + 
       co.score * H4.weight + 
       calculatedConfianza * H8.weight) * 1.2
    ));

    return {
      up: parseFloat(calculatedUtilidad.toFixed(2)),
      conf: parseFloat(calculatedConfianza.toFixed(2)),
      adop: parseFloat(calculatedAdopcion.toFixed(2))
    };
  }, [constructs, hypotheses]);

  useEffect(() => {
    setConstructs(prev => {
      let changed = false;
      const updated = { ...prev };
      if (updated.up.score !== calculations.up) {
        updated.up = { ...updated.up, score: calculations.up };
        changed = true;
      }
      if (updated.conf.score !== calculations.conf) {
        updated.conf = { ...updated.conf, score: calculations.conf };
        changed = true;
      }
      if (updated.adop.score !== calculations.adop) {
        updated.adop = { ...updated.adop, score: calculations.adop };
        changed = true;
      }
      return changed ? updated : prev;
    });
  }, [calculations]);

  // --- GEMINI API INTEGRATION WITH BACKOFF RETRY ---
  const callGeminiAPI = async (promptText, systemInstruction) => {
    const apiKey = ""; // Runtime automatically provisions the key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error en la llamada API: Código ${response.status}`);
        }
        
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "No se ha podido recuperar una respuesta válida de la IA.";
      } catch (err) {
        if (i === 4) throw err;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  // Action 1: Strategic Advisory Analysis
  const handleGenerateAIReport = async () => {
    setAiLoading(true);
    setAiError("");
    setAiReport("");
    
    const activeModelSummary = `
      CONSTRUCTOS INDEPENDIENTES:
      - Facilidad de Uso Percibida (FUP): ${constructs.fup.score}
      - Condiciones Facilitadoras (CF): ${constructs.cf.score}
      - Compatibilidad Organizacional (CO): ${constructs.co.score}
      - Transparencia (TRANS): ${constructs.trans.score}
      - Privacidad y Seguridad (PRIV): ${constructs.priv.score}
      - Supervisión Humana (SUP): ${constructs.sup.score}

      MEDIADORES Y DEPENDIENTES:
      - Utilidad Percibida (UP) calculada: ${constructs.up.score}
      - Confianza en la IA Clínica (CONF) calculada: ${constructs.conf.score}
      - Intención de Adopción de PRIORIA calculada: ${constructs.adop.score}

      COEFICIENTES DE RUTA (HIPÓTESIS ACTUALES):
      - H1: ${hypotheses.H1.weight} | H2: ${hypotheses.H2.weight}
      - H3: ${hypotheses.H3.weight} | H4: ${hypotheses.H4.weight}
      - H5: ${hypotheses.H5.weight} | H6: ${hypotheses.H6.weight}
      - H7: ${hypotheses.H7.weight} | H8: ${hypotheses.H8.weight}
    `;

    const systemPrompt = "Eres un consultor de IA clínico experto en modelos de adopción tecnológica de salud (TAM/UTAUT) y bioética médica aplicada a sistemas de soporte de decisión clínica (CDSS).";
    const userPrompt = `
      Analiza científicamente el siguiente estado estructural para el sistema PRIORIA:
      ${activeModelSummary}

      Genera una consultoría estratégica en español con las siguientes secciones:
      1. **Diagnóstico del Cuello de Botella Estructural**: Cuál es la variable más debilitada y cómo frena la adopción clínica de PRIORIA.
      2. **Análisis de Confianza vs. Utilidad**: Analiza si la intención de adopción está más impulsada por la eficiencia de la herramienta (H2) o por garantías de seguridad y ética clínica (H8).
      3. **Plan de Mitigación Hospitalaria**: Dos intervenciones accionables e innovadoras para elevar la adopción.
      Presenta el texto de manera profesional usando Markdown refinado. No asumas datos ficticios innecesarios.
    `;

    try {
      const responseText = await callGeminiAPI(userPrompt, systemPrompt);
      setAiReport(responseText);
    } catch (err) {
      setAiError("La conexión con Gemini falló. Inténtalo de nuevo.");
    } finally {
      setAiLoading(false);
    }
  };

  // Action 2: Simulate Clinical Scenarios
  const handleSimulateScenario = async (scenarioType) => {
    setAiLoading(true);
    setAiError("");
    setAiReport("");
    setSuggestedWeights(null);

    let scenarioText = "";
    if (scenarioType === 'skeptic') {
      scenarioText = "Hospital público de alta complejidad con médicos senior altamente resistentes al cambio digital, sobrecargados de trabajo y desconfiados de algoritmos 'caja negra'. Carecen de presupuesto técnico inmediato pero priorizan la seguridad legal.";
    } else if (scenarioType === 'innovative') {
      scenarioText = "Clínica de investigación médica privada de élite. Personal joven apasionado por la innovación y la medicina explicable, con excelente infraestructura en la nube y procesos automatizados de auditoría clínica.";
    } else {
      scenarioText = customScenario || "Centro médico con un flujo de trabajo moderado que busca implementar PRIORIA sin cambiar su infraestructura actual.";
    }

    const systemPrompt = "Eres un agente analítico estructurado que devuelve únicamente objetos en formato JSON estricto.";
    const userPrompt = `
      Analiza este entorno clínico: "${scenarioText}"
      Estima puntuaciones realistas (del 1.0 al 5.0) para los constructos y devuelve este JSON exacto sin markdown:
      {
        "fup": X.X,
        "cf": X.X,
        "co": X.X,
        "trans": X.X,
        "priv": X.X,
        "sup": X.X,
        "reasoning": "Explicación de 2 líneas sobre la dinámica del hospital y los sesgos lógicos aplicados."
      }
    `;

    try {
      const responseJSONText = await callGeminiAPI(userPrompt, systemPrompt);
      const cleanJSON = responseJSONText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJSON);
      
      setConstructs(prev => ({
        ...prev,
        fup: { ...prev.fup, score: parsed.fup || 3.0 },
        cf: { ...prev.cf, score: parsed.cf || 3.0 },
        co: { ...prev.co, score: parsed.co || 3.0 },
        trans: { ...prev.trans, score: parsed.trans || 3.0 },
        priv: { ...prev.priv, score: parsed.priv || 3.0 },
        sup: { ...prev.sup, score: parsed.sup || 3.0 }
      }));

      setAiReport(`### 🏥 Escenario Clínico Aplicado Exitosamente\n\n**Análisis de la IA:** ${parsed.reasoning}\n\n*Los puntajes en la columna de entrada de tu diagrama se han calibrado automáticamente. Puedes verificar el flujo de relaciones en la pestaña de Diagrama.*`);
    } catch (err) {
      setAiError("La IA no pudo estructurar correctamente el escenario. Intenta simplificar la descripción.");
    } finally {
      setAiLoading(false);
    }
  };

  // Action 3: Path Optimization Generator
  const handleOptimizePaths = async () => {
    setAiLoading(true);
    setAiError("");
    setAiReport("");
    setSuggestedWeights(null);

    const systemPrompt = "Eres un modelador estadístico especializado en PLS-SEM para salud digital. Retornas exclusivamente JSON.";
    const userPrompt = `
      Basado en el marco empírico de adopción de IA, calcula los pesos ideales (coeficientes beta entre 0.15 y 0.65) para las hipótesis H1-H8 para maximizar la Adopción equilibrando la confianza y la utilidad clínica.
      Devuelve este JSON exacto sin markdown:
      {
        "H1": X.XX, "H2": X.XX, "H3": X.XX, "H4": X.XX, "H5": X.XX, "H6": X.XX, "H7": X.XX, "H8": X.XX,
        "explanation": "Breve sustento teórico de por qué este equilibrio de pesos optimiza el comportamiento del modelo."
      }
    `;

    try {
      const responseJSONText = await callGeminiAPI(userPrompt, systemPrompt);
      const cleanJSON = responseJSONText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJSON);
      
      setSuggestedWeights(parsed);
      setAiReport(`### ⚙️ Optimización de Coeficientes Calculada por la IA\n\n${parsed.explanation}\n\n**Pesos Propuestos por Gemini:**\n- H1 (FUP → UP): **${parsed.H1}** | H2 (UP → Adopción): **${parsed.H2}**\n- H3 (CF → Adopción): **${parsed.H3}** | H4 (CO → Adopción): **${parsed.H4}**\n- H5 (TRANS → CONF): **${parsed.H5}** | H6 (PRIV → CONF): **${parsed.H6}**\n- H7 (SUP → CONF): **${parsed.H7}** | H8 (CONF → Adopción): **${parsed.H8}**`);
    } catch (err) {
      setAiError("Ocurrió un error al estimar los coeficientes óptimos.");
    } finally {
      setAiLoading(false);
    }
  };

  // Apply weights calculated by IA
  const applySuggestedWeights = () => {
    if (!suggestedWeights) return;
    setHypotheses(prev => {
      const updated = { ...prev };
      Object.keys(suggestedWeights).forEach(key => {
        if (updated[key]) {
          updated[key] = { ...updated[key], weight: suggestedWeights[key] };
        }
      });
      return updated;
    });
    setSuggestedWeights(null);
    setAiReport("### ✅ Coeficientes Optimizados Aplicados\n\n¡Fabuloso! Todos los pesos del modelo estructural han sido actualizados con los valores recomendados por la IA de Gemini. Revisa el diagrama o simulador para analizar los nuevos efectos directos e indirectos.");
  };

  // --- SVG PATH GENERATION LOGIC WITH INTELLIGENT COLLISION AVOIDANCE ---
  const getPathData = (fromId, toId, hKey) => {
    const from = coords[fromId];
    const to = coords[toId];
    if (!from || !to) return '';

    let startX = from.right;
    let startY = from.top;
    let endX = to.left;
    let endY = to.top;

    // Linear connection for TAM H1
    if (fromId === 'fup' && toId === 'up') {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    // Dynamic curvature to route AROUND the middle column
    if (fromId === 'cf' && toId === 'adop') {
      // Route H3 over "Utilidad Percibida" box elegantly
      const controlX1 = startX + (endX - startX) * 0.35;
      const controlY1 = startY - 60; 
      const controlX2 = startX + (endX - startX) * 0.65;
      const controlY2 = endY - 60;
      return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    }

    if (fromId === 'co' && toId === 'adop') {
      // Route H4 under "Utilidad Percibida" and over "Confianza" cleanly
      const controlX1 = startX + (endX - startX) * 0.35;
      const controlY1 = startY + 45; 
      const controlX2 = startX + (endX - startX) * 0.65;
      const controlY2 = endY + 25;
      return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    }

    if (toId === 'adop') {
      const controlX = startX + (endX - startX) * 0.5;
      return `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
    }

    if (toId === 'conf') {
      const controlX = startX + (endX - startX) * 0.5;
      return `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
    }

    const controlX = startX + (endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
  };

  // Calculate clean offsets for path hypothesis badges
  const getHypothesisLabelPos = (fromId, toId) => {
    const from = coords[fromId];
    const to = coords[toId];
    if (!from || !to) return { x: 0, y: 0 };

    let startX = from.right;
    let startY = from.top;
    let endX = to.left;
    let endY = to.top;

    if (fromId === 'fup' && toId === 'up') {
      return { x: startX + (endX - startX) * 0.45, y: startY - 14 };
    }

    const midX = startX + (endX - startX) * 0.5;
    const midY = startY + (endY - startY) * 0.5;

    // Reposition labels for curved bypass routes to avoid overlapping cards
    if (fromId === 'cf') return { x: midX - 30, y: midY - 65 }; // lifted high
    if (fromId === 'co') return { x: midX - 35, y: midY + 45 }; // pushed low
    if (fromId === 'trans') return { x: midX - 25, y: midY - 15 };
    if (fromId === 'priv') return { x: midX - 10, y: midY - 15 };
    if (fromId === 'sup') return { x: midX + 15, y: midY - 12 };

    return { x: midX, y: midY - 12 };
  };

  const renderConstructIcon = (iconName, colorClass = "text-slate-600") => {
    const props = { className: `w-5 h-5 ${colorClass}` };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Settings2': return <Settings2 {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'GitCommit': return <GitCommit {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      default: return <FileText {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg border border-teal-100">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              Modelo Estructural de Adopción PRIORIA
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">XAI & TAM CLINICAL MODEL</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Modelador predictivo de ecuaciones de ruta estructural (SEM) asistido por Inteligencia Artificial</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 flex-wrap justify-center">
          <button
            onClick={() => { setActiveTab('diagram'); updateCoordinates(); }}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'diagram' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            Diagrama Interactivo
          </button>
          <button
            onClick={() => { setActiveTab('simulator'); updateCoordinates(); }}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'simulator' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Simulador de Ruta
          </button>
          <button
            onClick={() => { setActiveTab('editor'); updateCoordinates(); }}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'editor' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Editar Hipótesis
          </button>
          <button
            onClick={() => { setActiveTab('ai'); updateCoordinates(); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-600 hover:bg-teal-50'}`}
          >
            <Brain className="w-3.5 h-3.5" />
            ✨ Consultor IA Gemini
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COMPONENT */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col justify-center items-center min-h-[500px]">
          
          {activeTab === 'diagram' && (
            <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-md p-6 relative">
              
              {/* Static Instruction/Info Banner (No overlaps with columns anymore) */}
              <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Estructura de Rutas e Instrucciones Interactivas</span>
                  Haz clic en cualquier nodo de constructo o marcador de hipótesis (<span className="font-mono bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-700">H1-H8</span>) para auditar y ver su sustento teórico en el panel de la derecha, o configurar la fuerza de su camino estructural en tiempo real.
                </div>
              </div>

              {/* Relative Container for SVG & Cards */}
              <div className="relative" ref={containerRef}>
                
                {/* Connections Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0d9488" />
                    </marker>
                  </defs>

                  {/* Lines drawing */}
                  {Object.entries(hypotheses).map(([key, hyp]) => {
                    const pathD = getPathData(hyp.from, hyp.to, key);
                    const isSelected = selectedElement.type === 'hypothesis' && selectedElement.id === key;
                    const isRelatedNodeSelected = selectedElement.type === 'construct' && 
                      (selectedElement.id === hyp.from || selectedElement.id === hyp.to);
                    
                    const strokeColor = isSelected ? '#0d9488' : isRelatedNodeSelected ? '#2dd4bf' : '#cbd5e1';
                    const strokeWidth = isSelected ? '3.5' : isRelatedNodeSelected ? '2.5' : '1.8';
                    const marker = isSelected || isRelatedNodeSelected ? 'url(#arrow-active)' : 'url(#arrow)';

                    return (
                      <g key={key} className="transition-all duration-300">
                        {/* Fat helper for easier selection click */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="15"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement({ type: 'hypothesis', id: key });
                          }}
                        />
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={key === 'H3' || key === 'H4' ? '4,4' : '0'}
                          markerEnd={marker}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Grid Layout of Cards */}
                <div className="grid grid-cols-3 gap-x-8 md:gap-x-16 gap-y-4 relative z-20">
                  
                  {/* Column 1: Inputs */}
                  <div className="flex flex-col gap-6 justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">Columna 1: Variables Entrada</div>
                    {['fup', 'cf', 'co', 'trans', 'priv', 'sup'].map(id => {
                      const construct = constructs[id];
                      const isSelected = selectedElement.type === 'construct' && selectedElement.id === id;
                      return (
                        <div
                          key={id}
                          id={`node-${id}`}
                          onClick={() => setSelectedElement({ type: 'construct', id })}
                          className={`p-3 rounded-xl cursor-pointer transition-all border shadow-xs flex flex-col justify-between h-24 ${
                            isSelected 
                              ? 'bg-white border-teal-500 ring-2 ring-teal-100 scale-[1.02] shadow-md' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${construct.color} text-white`}>
                              {renderConstructIcon(construct.icon, "text-white w-4 h-4")}
                            </div>
                            <span className="text-[9px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">V: {construct.score}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-[11px] text-slate-800 leading-tight line-clamp-2">{construct.name}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Column 2: Mediators */}
                  <div className="flex flex-col justify-around gap-12 pt-8">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 text-center">Columna 2: Mediadoras</div>
                    
                    {/* Mediator 1: Utilidad Percibida */}
                    <div
                      id="node-up"
                      onClick={() => setSelectedElement({ type: 'construct', id: 'up' })}
                      className={`p-4 rounded-xl cursor-pointer transition-all border shadow-xs flex flex-col justify-between h-32 ${
                        selectedElement.type === 'construct' && selectedElement.id === 'up'
                          ? 'bg-white border-teal-500 ring-2 ring-teal-100 scale-[1.02] shadow-md' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${constructs.up.color} text-white`}>
                          {renderConstructIcon(constructs.up.icon, "text-white w-4 h-4")}
                        </div>
                        <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 border border-teal-150 px-1.5 py-0.5 rounded">Calc: {constructs.up.score}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-800 leading-tight">{constructs.up.name}</h3>
                        <span className="text-[9px] text-slate-400 block mt-0.5">TAM Core</span>
                      </div>
                    </div>

                    {/* Mediator 2: Confianza */}
                    <div
                      id="node-conf"
                      onClick={() => setSelectedElement({ type: 'construct', id: 'conf' })}
                      className={`p-4 rounded-xl cursor-pointer transition-all border shadow-xs flex flex-col justify-between h-32 ${
                        selectedElement.type === 'construct' && selectedElement.id === 'conf'
                          ? 'bg-white border-teal-500 ring-2 ring-teal-100 scale-[1.02] shadow-md' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${constructs.conf.color} text-white`}>
                          {renderConstructIcon(constructs.conf.icon, "text-white w-4 h-4")}
                        </div>
                        <span className="text-[9px] font-extrabold bg-sky-50 text-sky-700 border border-sky-150 px-1.5 py-0.5 rounded">Calc: {constructs.conf.score}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-800 leading-tight">{constructs.conf.name}</h3>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Filtro Ético</span>
                      </div>
                    </div>

                  </div>

                  {/* Column 3: Outcome Variable */}
                  <div className="flex flex-col justify-center gap-4 pt-12">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 text-right">Columna 3: Resultado</div>
                    
                    <div
                      id="node-adop"
                      onClick={() => setSelectedElement({ type: 'construct', id: 'adop' })}
                      className={`p-6 rounded-2xl cursor-pointer transition-all border-2 shadow-lg flex flex-col justify-between h-56 relative overflow-hidden ${
                        selectedElement.type === 'construct' && selectedElement.id === 'adop'
                          ? 'bg-slate-900 text-white border-teal-500 ring-4 ring-teal-500/20 scale-[1.02]' 
                          : 'bg-slate-900 text-white border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

                      <div className="flex items-start justify-between relative z-10">
                        <div className="p-2.5 rounded-xl bg-teal-500 text-slate-950">
                          {renderConstructIcon(constructs.adop.icon, "text-slate-950 w-5 h-5")}
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Meta</span>
                          <span className="text-xl font-black text-teal-400 tracking-tight block mt-0.5">{constructs.adop.score} / 5.0</span>
                        </div>
                      </div>
                      
                      <div className="relative z-10 mt-4">
                        <h3 className="font-extrabold text-xs text-white leading-snug">{constructs.adop.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{constructs.adop.desc}</p>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3 relative z-10">
                        <div 
                          className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300" 
                          style={{ width: `${(constructs.adop.score / 5.0) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Path Badges */}
                {Object.entries(hypotheses).map(([key, hyp]) => {
                  const pos = getHypothesisLabelPos(hyp.from, hyp.to);
                  const isSelected = selectedElement.type === 'hypothesis' && selectedElement.id === key;
                  if (pos.x === 0 && pos.y === 0) return null;

                  return (
                    <button
                      key={`label-${key}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ type: 'hypothesis', id: key });
                      }}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`z-30 px-2 py-0.5 rounded-md text-[10px] font-black shadow-md transition-all border duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-500 scale-105 ring-2 ring-teal-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350 hover:shadow'
                      }`}
                    >
                      {key} <span className="font-normal text-[9px] opacity-80">({hyp.weight.toFixed(2)})</span>
                    </button>
                  );
                })}

              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-5 h-5 text-teal-600" />
                <div>
                  <h2 className="font-bold text-slate-800">Simulador Estructural Integrado PRIORIA</h2>
                  <p className="text-xs text-slate-500">Mueve los puntajes de los profesionales médicos para observar el efecto de arrastre predictivo en tiempo real.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-6">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">Variables de Entrada</h3>
                  {['fup', 'cf', 'co', 'trans', 'priv', 'sup'].map(id => {
                    const con = constructs[id];
                    return (
                      <div key={id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1 text-[11px]">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${con.color}`}></span>
                            {con.name}
                          </span>
                          <span className="bg-white border px-2 py-0.5 rounded font-mono text-slate-800 font-bold">{con.score.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          value={con.score}
                          onChange={(e) => handleScoreChange(id, e.target.value)}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-inner">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Mediación en Tiempo Real</h3>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-slate-700 flex items-center gap-1"><TrendingUp className="w-4 h-4 text-teal-600" /> Utilidad Percibida</span>
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">{constructs.up.score.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${(constructs.up.score / 5) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-slate-700 flex items-center gap-1"><HeartPulse className="w-4 h-4 text-sky-600" /> Confianza en IA Clínica</span>
                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">{constructs.conf.score.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${(constructs.conf.score / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-xl p-5 text-center space-y-3 shadow-md border border-slate-800">
                    <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">Intención de Adopción Real</span>
                    <div className="text-4xl font-black text-white">{constructs.adop.score.toFixed(2)} <span className="text-sm text-slate-400 font-medium">/ 5.0</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-teal-600" />
                  <div>
                    <h2 className="font-bold text-slate-800">Cargas y Coeficientes de Hipótesis</h2>
                    <p className="text-xs text-slate-500">Configura empíricamente la influencia teórica de cada camino de ruta en el sistema.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(hypotheses).map(([key, hyp]) => (
                  <div key={key} className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded">{key}</span>
                        <span className="text-[10px] text-slate-400 italic">{hyp.status}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 mt-2">{hyp.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 mb-3">{hyp.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 min-w-[50px]">Carga β:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={hyp.weight}
                        onChange={(e) => handleWeightChange(key, e.target.value)}
                        className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                      <span className="font-mono text-xs font-bold text-teal-600 bg-white border px-2 py-0.5 rounded">{hyp.weight.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
              
              {/* Header AI */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-teal-50 border border-teal-100 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-600 text-white rounded-lg">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 flex items-center gap-1">
                      Consultoría Clínica con IA de Gemini
                    </h2>
                    <p className="text-xs text-teal-700">Estimación estadística y análisis predictivo de resistencia al cambio médico en tiempo real.</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleGenerateAIReport}
                    disabled={aiLoading}
                    className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    ✨ Analizar Adopción
                  </button>
                  <button
                    onClick={handleOptimizePaths}
                    disabled={aiLoading}
                    className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    ✨ Optimizar Coeficientes
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Lateral column of scenarios */}
                <div className="md:col-span-1 space-y-4 border-r border-slate-150 pr-0 md:pr-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Modelar Entorno Clínico</h3>
                  <p className="text-[10px] text-slate-400 leading-normal">Selecciona un escenario hospitalario preestablecido para calibrar los constructos automáticamente usando IA.</p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSimulateScenario('skeptic')}
                      disabled={aiLoading}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs space-y-1"
                    >
                      <span className="font-bold text-slate-800 flex items-center gap-1">🩺 Hospital Público con Médicos Escépticos</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Urgencias saturadas, sin formación en IA y fuerte recelo ético por sesgo de caja negra.</p>
                    </button>

                    <button
                      onClick={() => handleSimulateScenario('innovative')}
                      disabled={aiLoading}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs space-y-1"
                    >
                      <span className="font-bold text-slate-800 flex items-center gap-1">🔬 Clínica Privada Digital y Joven</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Médicos de vanguardia, excelente infraestructura técnica, pero vacíos legales de supervisión humana.</p>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Escenario Personalizado</label>
                    <textarea
                      value={customScenario}
                      onChange={(e) => setCustomScenario(e.target.value)}
                      placeholder="Ej: Clínica oncológica con alto presupuesto pero médicos cansados de interfaces complejas..."
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    ></textarea>
                    <button
                      onClick={() => handleSimulateScenario('custom')}
                      disabled={aiLoading || !customScenario.trim()}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Zap className="w-3 h-3" /> ✨ Calcular Escenario
                    </button>
                  </div>
                </div>

                {/* Report display panel */}
                <div className="md:col-span-2 space-y-4 flex flex-col min-h-[300px]">
                  
                  {/* Action panel when Suggested Weights exist */}
                  {suggestedWeights && (
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-xs font-bold text-amber-800 block">¡Nuevos coeficientes teóricos recomendados!</span>
                        <p className="text-[10px] text-amber-600">Puedes aplicar estos pesos estadísticos para recalcular la intención de adopción.</p>
                      </div>
                      <button
                        onClick={applySuggestedWeights}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" /> ✨ Aplicar Optimización
                      </button>
                    </div>
                  )}

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-[360px]">
                    {aiLoading ? (
                      <div className="h-full flex flex-col justify-center items-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-semibold animate-pulse">Gemini analizando la matriz estadística y literatura clínica...</span>
                      </div>
                    ) : aiError ? (
                      <div className="text-rose-600 text-xs text-center p-4">
                        {aiError}
                      </div>
                    ) : aiReport ? (
                      <div className="prose prose-sm prose-teal text-slate-700 leading-relaxed space-y-3">
                        {aiReport.split('\n').map((line, idx) => {
                          if (line.startsWith('### ')) {
                            return <h4 key={idx} className="font-black text-slate-900 text-xs mt-3 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-teal-600" /> {line.replace('### ', '')}</h4>;
                          } else if (line.startsWith('## ')) {
                            return <h3 key={idx} className="font-black text-slate-900 text-sm border-b pb-1 mt-4">{line.replace('## ', '')}</h3>;
                          } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                            return <p key={idx} className="pl-2 font-bold text-xs text-slate-800 mt-2">{line}</p>;
                          } else if (line.startsWith('- ') || line.startsWith('* ')) {
                            return <li key={idx} className="ml-4 text-[11px] text-slate-600 list-disc">{line.substring(2)}</li>;
                          } else if (line.trim() === '') {
                            return <div key={idx} className="h-1"></div>;
                          } else {
                            const boldMatch = line.match(/\*\*(.*?)\*\*/g);
                            if (boldMatch) {
                              let formattedLine = line;
                              boldMatch.forEach(match => {
                                const clean = match.replace(/\*\*/g, '');
                                formattedLine = formattedLine.replace(match, `<strong>${clean}</strong>`);
                              });
                              return <p key={idx} className="text-[11px] text-slate-600" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                            }
                            return <p key={idx} className="text-[11px] text-slate-600">{line}</p>;
                          }
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-slate-400 text-center space-y-2 p-6">
                        <Brain className="w-10 h-10 text-slate-300" />
                        <p className="text-xs font-semibold">Genera reportes de adopción mediante la IA de Gemini</p>
                        <p className="text-[10px] text-slate-400 max-w-xs">Usa los botones de arriba para simular entornos reales, diagnosticar cuellos de botella u optimizar coeficientes con algoritmos de LLM.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL - DETAILED SPECIFICATIONS */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col overflow-y-auto">
          
          {selectedElement.type === 'welcome' && (
            <div className="p-6 space-y-6">
              <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl">
                <h3 className="font-extrabold text-xs text-teal-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  Estructura de Tres Columnas
                </h3>
                <p className="text-xs text-teal-700 leading-relaxed mt-2 font-medium">
                  Este modelo se organiza de manera lógica en tres columnas integradas para evitar fricciones visuales e inconsistencias empíricas.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hipótesis Estructurales</h4>
                <div className="space-y-2">
                  {Object.entries(hypotheses).map(([key, hyp]) => (
                    <div 
                      key={key} 
                      onClick={() => setSelectedElement({ type: 'hypothesis', id: key })}
                      className="p-2.5 border border-slate-150 rounded-lg hover:border-slate-350 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{key}</span>
                        <span className="text-slate-500 block text-[10px] truncate max-w-[200px]">{hyp.label.split(': ')[1]}</span>
                      </div>
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">{hyp.weight.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedElement.type === 'construct' && (() => {
            const con = constructs[selectedElement.id];
            const incomingHyp = Object.entries(hypotheses).filter(([_, h]) => h.to === selectedElement.id);
            const outgoingHyp = Object.entries(hypotheses).filter(([_, h]) => h.from === selectedElement.id);

            return (
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded">Constructo</span>
                    <button onClick={() => setSelectedElement({ type: 'welcome', id: null })} className="text-slate-400 hover:text-slate-600 text-xs font-bold">Cerrar ×</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${con.color} text-white`}>
                      {renderConstructIcon(con.icon, "text-white w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-slate-800 leading-tight">{con.name}</h3>
                      <span className="text-[9px] text-slate-400 font-mono">ID: {con.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Definición Operacional</span>
                  <p className="text-xs text-slate-600 leading-normal">{con.desc}</p>
                </div>

                <div className="p-4 border border-slate-150 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Puntaje Clínico:</span>
                    <span className="font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs">{con.score.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={con.score}
                    onChange={(e) => handleScoreChange(con.id, e.target.value)}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Rutas Conectadas</h4>
                  {incomingHyp.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Antecedido por:</span>
                      {incomingHyp.map(([key, h]) => (
                        <div key={key} onClick={() => setSelectedElement({ type: 'hypothesis', id: key })} className="p-2 bg-slate-50 rounded-lg text-[11px] hover:bg-slate-100 cursor-pointer border border-slate-100 flex justify-between items-center">
                          <span className="font-medium text-slate-700">{constructs[h.from].name} <span className="font-bold text-teal-600">({key})</span></span>
                          <span className="font-mono text-slate-500">β={h.weight.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {outgoingHyp.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Predice directamente a:</span>
                      {outgoingHyp.map(([key, h]) => (
                        <div key={key} onClick={() => setSelectedElement({ type: 'hypothesis', id: key })} className="p-2 bg-slate-50 rounded-lg text-[11px] hover:bg-slate-100 cursor-pointer border border-slate-100 flex justify-between items-center">
                          <span className="font-medium text-slate-700">{constructs[h.to].name} <span className="font-bold text-teal-600">({key})</span></span>
                          <span className="font-mono text-slate-500">β={h.weight.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {selectedElement.type === 'hypothesis' && (() => {
            const hyp = hypotheses[selectedElement.id];
            const sourceNode = constructs[hyp.from];
            const targetNode = constructs[hyp.to];

            return (
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-widest px-2.5 py-1 rounded">Hipótesis</span>
                    <button onClick={() => setSelectedElement({ type: 'welcome', id: null })} className="text-slate-400 hover:text-slate-600 text-xs font-bold">Cerrar ×</button>
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-800 leading-tight">{selectedElement.id}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{hyp.label}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between gap-2 text-xs">
                  <div className="text-center flex-1">
                    <span className="font-bold text-slate-700 block truncate text-[11px]">{sourceNode.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">Origen</span>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                  <div className="text-center flex-1">
                    <span className="font-bold text-slate-700 block truncate text-[11px]">{targetNode.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">Destino</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sustento Empírico</span>
                  <p className="text-xs text-slate-600 leading-normal bg-slate-50 border p-3 rounded-lg italic font-medium">
                    "{hyp.desc}"
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Coeficiente de Ruta (β):</span>
                    <span className="font-mono font-black text-teal-600 bg-white border px-2 py-0.5 rounded text-xs">{hyp.weight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={hyp.weight}
                    onChange={(e) => handleWeightChange(selectedElement.id, e.target.value)}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
              </div>
            );
          })()}

        </div>

      </main>
    </div>
  );
}