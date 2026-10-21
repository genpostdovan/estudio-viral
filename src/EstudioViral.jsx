import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Flame,
  Target,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Layout,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Zap,
  Award,
  Clock,
  Play,
  MoreVertical,
  Search,
  Bell,
  Menu,
  User,
  ThumbsUp,
  Eye,
  Compass,
  Tv,
  FolderHeart,
  Wand2,
  ArrowRight,
  CheckCircle2,
  Layers,
  Key,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const COMPETITOR_VIDEOS = [
  {
    id: 'comp-1',
    title: 'Testei a Rotina de 4h de Sono dos Bilionários por 30 Dias (Deu Ruim?)',
    channel: 'Mentalidade Alpha',
    views: '412 mil visualizações',
    time: 'há 2 dias',
    duration: '14:28',
    avatarColor: 'from-blue-500 to-indigo-600',
    thumbGradient: 'from-slate-800 via-indigo-950 to-slate-900',
    badgeText: '30 DIAS SEM DORMIR',
    emoji: '😴'
  },
  {
    id: 'comp-2',
    title: 'O Segredo que as Grandes Marcas Escondem de Você no Supermercado',
    channel: 'Economia Descomplicada',
    views: '1,2 mi de visualizações',
    time: 'há 5 dias',
    duration: '18:05',
    avatarColor: 'from-emerald-500 to-teal-600',
    thumbGradient: 'from-emerald-950 via-neutral-900 to-amber-950',
    badgeText: 'NÃO COMPRE ISSO!',
    emoji: '🛒'
  },
  {
    id: 'comp-3',
    title: 'Construí um Setup Minimalista Gastando Muito Pouco em 2026!',
    channel: 'Tech & Café',
    views: '89 mil visualizações',
    time: 'há 8 horas',
    duration: '11:42',
    avatarColor: 'from-purple-500 to-pink-600',
    thumbGradient: 'from-purple-950 via-slate-900 to-fuchsia-950',
    badgeText: 'BARATO E INSANO',
    emoji: '💻'
  },
  {
    id: 'comp-4',
    title: 'Por que 97% das Pessoas Desistem Antes dos 3 Meses (A Ciência Explica)',
    channel: 'Neurociência Prática',
    views: '650 mil visualizações',
    time: 'há 1 semana',
    duration: '22:15',
    avatarColor: 'from-amber-500 to-orange-600',
    thumbGradient: 'from-orange-950 via-zinc-900 to-red-950',
    badgeText: 'O ERRO Nº 1',
    emoji: '🧠'
  },
  {
    id: 'comp-5',
    title: 'Fui Morar Sozinho aos 19 Anos e Isso Mudou Tudo na Minha Vida',
    channel: 'Diário de Bordo',
    views: '230 mil visualizações',
    time: 'há 3 dias',
    duration: '15:50',
    avatarColor: 'from-rose-500 to-red-600',
    thumbGradient: 'from-rose-950 via-stone-900 to-neutral-900',
    badgeText: 'A REALIDADE',
    emoji: '📦'
  }
];

const apiKey = "";

async function fetchWithRetry(url, options, maxRetries = 3) {
  let delay = 1000;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Status ${response.status}: ${errBody}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

export default function App() {
  const [topic, setTopic] = useState('Como usar Inteligência Artificial para criar vídeos virais em metade do tempo');
  const [audience, setAudience] = useState('Criadores de conteúdo iniciantes e empreendedores digitais de 18 a 35 anos');
  const [tone, setTone] = useState('Educativo');
  const [channelName, setChannelName] = useState('Seu Canal Oficial');

  const [customApiKey, setCustomApiKey] = useState('');
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const [strategyData, setStrategyData] = useState(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState(null);

  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);

  const [thumbnails, setThumbnails] = useState([
    { id: 0, loading: false, imageUrl: null, error: null, concept: null },
    { id: 1, loading: false, imageUrl: null, error: null, concept: null },
    { id: 2, loading: false, imageUrl: null, error: null, concept: null }
  ]);
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);

  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);
  const [feedDevice, setFeedDevice] = useState('desktop');

  const [copiedKey, setCopiedKey] = useState(null);

  const strategySectionRef = useRef(null);
  const thumbSectionRef = useRef(null);
  const feedSectionRef = useRef(null);

  const activeApiKey = customApiKey.trim() || apiKey;

  const handleSaveApiKey = (e) => {
    if (e) e.preventDefault();
    setCustomApiKey(tempKeyInput.trim());
    setIsApiModalOpen(false);
  };

  const handleClearApiKey = () => {
    setTempKeyInput('');
    setCustomApiKey('');
  };

  const copyToClipboard = (text, key) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  };

  const handleGenerateStrategy = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim() || !audience.trim()) return;

    if (!activeApiKey) {
      setIsApiModalOpen(true);
      setStrategyError('Por favor, configure sua Chave da API Gemini no botão do topo para gerar a estratégia.');
      return;
    }

    setIsGeneratingStrategy(true);
    setStrategyError(null);

    const systemInstruction = `Você é um estrategista de YouTube de elite no Brasil, especialista em retenção, psicologia do clique (CTR), storytelling e crescimento viral.
Gere todo o conteúdo em português do Brasil vibrante, autêntico e altamente persuasivo.`;

    const userPrompt = `Crie um pacote completo de vídeo viral para o YouTube com base nas informações abaixo:
- Tema do Vídeo: "${topic}"
- Público-Alvo: "${audience}"
- Tom Escolhido: "${tone}"

Requisitos obrigatórios:
1. 5 títulos magnéticos com alto potencial de clique (CTR). Cada um deve ter uma nota de 0 a 10 (ex: 9.4), o gatilho mental principal utilizado (escolha estritamente entre: "Curiosidade", "Especificidade", "Emoção" ou "Urgência") e uma breve justificativa do porquê funciona.
2. 3 ganchos de abertura (hooks) para os primeiros 5 segundos do vídeo, desenhados para impedir que o espectador feche o vídeo.
3. Uma estrutura de roteiro dividida em 4 a 5 blocos estratégicos, cada um contendo o tempo estimado, o conteúdo chave e um "Loop Aberto" (open loop) explícito para prender a atenção até o próximo bloco.
4. 3 conceitos visuais de Thumbnail 16:9 de altíssimo impacto (foco em expressão facial forte, texto curto de 2 a 3 palavras e alto contraste de cores).`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            titles: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  score: { type: "NUMBER" },
                  trigger: { type: "STRING" },
                  reason: { type: "STRING" }
                },
                required: ["title", "score", "trigger", "reason"]
              }
            },
            hooks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  style: { type: "STRING" },
                  script: { type: "STRING" },
                  visualCue: { type: "STRING" }
                },
                required: ["style", "script", "visualCue"]
              }
            },
            scriptBlocks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  blockName: { type: "STRING" },
                  duration: { type: "STRING" },
                  content: { type: "STRING" },
                  openLoop: { type: "STRING" }
                },
                required: ["blockName", "duration", "content", "openLoop"]
              }
            },
            thumbnailConcepts: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  conceptName: { type: "STRING" },
                  facialExpression: { type: "STRING" },
                  shortText: { type: "STRING" },
                  colorContrast: { type: "STRING" },
                  visualDescription: { type: "STRING" }
                },
                required: ["conceptName", "facialExpression", "shortText", "colorContrast", "visualDescription"]
              }
            }
          },
          required: ["titles", "hooks", "scriptBlocks", "thumbnailConcepts"]
        }
      }
    };

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${activeApiKey}`;
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) {
        throw new Error('Resposta vazia da IA.');
      }

      const parsed = JSON.parse(rawJson);
      setStrategyData(parsed);
      setSelectedTitleIndex(0);

      const initialThumbs = (parsed.thumbnailConcepts || []).slice(0, 3).map((concept, idx) => ({
        id: idx,
        loading: false,
        imageUrl: null,
        error: null,
        concept
      }));
      setThumbnails(initialThumbs);

      setTimeout(() => {
        strategySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      console.error('Erro na geração de estratégia:', err);
      setStrategyError(
        'Não foi possível gerar a estratégia. Verifique se sua Chave da API do Google AI Studio está correta e válida.'
      );
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const generateSingleThumbnail = async (index, titleText, conceptObj) => {
    if (!activeApiKey) {
      setIsApiModalOpen(true);
      return;
    }

    setThumbnails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, loading: true, error: null } : item))
    );

    const imagePrompt = `Create a high-converting, viral YouTube thumbnail in 16:9 widescreen aspect ratio.
Video Title Context: "${titleText}".
Visual Concept: ${conceptObj.visualDescription}.
Subject & Facial Expression: Close-up expressive face showing ${conceptObj.facialExpression}, dramatic studio rim lighting, ultra-sharp eyes.
Bold Text Overlay in Portuguese: Include large, legible, high-impact 3D typography reading "${conceptObj.shortText}".
Color Palette & Contrast: ${conceptObj.colorContrast}, vibrant saturation, high dynamic range, cinematic depth of field, modern YouTube creator aesthetic.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: imagePrompt }]
        }
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '16:9' }
      }
    };

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${activeApiKey}`;
      const result = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const part = result?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (!part || !part.inlineData?.data) {
        throw new Error('Nenhuma imagem retornada pelo modelo.');
      }

      const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;

      setThumbnails((prev) =>
        prev.map((item, i) => (i === index ? { ...item, loading: false, imageUrl, error: null } : item))
      );
    } catch (err) {
      console.error(`Erro ao gerar thumbnail ${index + 1}:`, err);
      setThumbnails((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                loading: false,
                error: 'Falha ao renderizar. Verifique sua cota de API e clique em Tentar Novamente.'
              }
            : item
        )
      );
    }
  };

  const handleGenerateAllThumbnails = async (customTitleIndex = selectedTitleIndex) => {
    if (!strategyData || !strategyData.thumbnailConcepts) return;
    setIsGeneratingThumbs(true);

    const chosenTitle = strategyData.titles[customTitleIndex]?.title || topic;
    const concepts = strategyData.thumbnailConcepts.slice(0, 3);

    setTimeout(() => {
      thumbSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    await Promise.all(
      concepts.map((concept, idx) => generateSingleThumbnail(idx, chosenTitle, concept))
    );

    setIsGeneratingThumbs(false);
  };

  const handleDownloadThumbnail = (imageUrl, index) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail-estudio-viral-conceito-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatAllStrategyText = () => {
    if (!strategyData) return '';
    const titlesText = strategyData.titles
      .map((t, idx) => `${idx + 1}. ${t.title} [Nota: ${t.score}/10 | Gatilho: ${t.trigger}]\n   Por que funciona: ${t.reason}`)
      .join('\n\n');

    const hooksText = strategyData.hooks
      .map((h, idx) => `GANCHO ${idx + 1} (${h.style}):\n"${h.script}"\n[Visual: ${h.visualCue}]`)
      .join('\n\n');

    const scriptText = strategyData.scriptBlocks
      .map((b, idx) => `BLOCO ${idx + 1}: ${b.blockName} (${b.duration})\nConteúdo: ${b.content}\n🔓 Loop Aberto: ${b.openLoop}`)
      .join('\n\n');

    return `=== ESTÚDIO VIRAL — PLANEJAMENTO DE VÍDEO ===\nTema: ${topic}\nPúblico: ${audience}\nTom: ${tone}\n\n--- 5 TÍTULOS DE ALTO CLIQUE ---\n${titlesText}\n\n--- 3 GANCHOS DE 5 SEGUNDOS ---\n${hooksText}\n\n--- ESTRUTURA DE ROTEIRO COM LOOPS ABERTOS ---\n${scriptText}`;
  };

  const getTriggerBadgeStyle = (trigger = '') => {
    const normalized = trigger.toLowerCase();
    if (normalized.includes('curiosidade')) return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    if (normalized.includes('especificidade')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (normalized.includes('emo')) return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    if (normalized.includes('urg')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  };

  const activeTitleObj = strategyData?.titles?.[selectedTitleIndex] || {
    title: topic || 'Seu Título Viral Aparecerá Aqui',
    score: 9.5,
    trigger: 'Curiosidade'
  };

  const activeThumbObj = thumbnails[selectedThumbIndex] || thumbnails[0];

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 font-sans selection:bg-rose-500 selection:text-white pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090A0F]/85 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-600/25">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  Estúdio Viral
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  YouTube AI Lab
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Títulos de alto CTR, Roteiros com Loops Abertos & Thumbnails 16:9
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              1. Briefing
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${strategyData ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500'}`}>
              2. Títulos & Roteiro
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${thumbnails.some(t => t.imageUrl) ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500'}`}>
              3. Thumbnails 16:9
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${thumbnails.some(t => t.imageUrl) ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500'}`}>
              4. Teste do Feed
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setTempKeyInput(customApiKey);
                setIsApiModalOpen(true);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                customApiKey.trim()
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Configurar Chave do Google AI Studio"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {customApiKey.trim() ? 'API Key Ativa' : 'Configurar API Key'}
              </span>
            </button>

            {strategyData && (
              <button
                onClick={() => copyToClipboard(formatAllStrategyText(), 'all-strategy')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800/90 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-all cursor-pointer"
              >
                {copiedKey === 'all-strategy' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tudo Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-300" />
                    <span className="hidden sm:inline">Exportar Textos</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Configurar Google Gemini API</h3>
                <p className="text-xs text-zinc-400">Necessário para uso no site público</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Sua chave fica salva apenas no seu navegador (localStorage) com total segurança.
                </span>
              </p>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Chave da API Gemini (AIzaSy...)
                </label>
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="Cole sua chave aqui..."
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 focus:border-rose-500 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <span>Gerar chave grátis no AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {customApiKey && (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Remover chave
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsApiModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Salvar Chave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <section className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-800/80">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
                <Sparkles className="w-4 h-4" />
                Etapa 1 • Direção Criativa
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Sobre o que é o seu próximo vídeo viral?
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/70 px-3.5 py-2 rounded-xl border border-zinc-800">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>IA integrada: Gemini 3 Flash + Imagens 16:9</span>
            </div>
          </div>

          <form onSubmit={handleGenerateStrategy} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Tema ou Ideia Central do Vídeo
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Passei 7 dias vivendo apenas com inteligência artificial decidindo minha rotina..."
                  className="w-full rounded-xl bg-zinc-950/90 border border-zinc-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Para quem é esse vídeo? (Público-Alvo)
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Ex: Jovens adultos interessados em produtividade e tecnologia"
                    className="w-full rounded-xl bg-zinc-950/90 border border-zinc-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Nome do seu Canal (para o preview no Teste do Feed)
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Ex: Canal Criador Pro"
                    className="w-full rounded-xl bg-zinc-950/90 border border-zinc-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-300">
                Escolha o Tom da Narrativa
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'Educativo',
                    title: 'Educativo & Prático',
                    desc: 'Foco em clareza, passos acionáveis e valor imediato.',
                    icon: Target,
                    accent: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/50 text-cyan-300'
                  },
                  {
                    id: 'Polêmico',
                    title: 'Polêmico & Contraintuitivo',
                    desc: 'Quebra de crenças populares e opiniões fortes.',
                    icon: Flame,
                    accent: 'from-rose-500/20 to-orange-600/10 border-rose-500/50 text-rose-300'
                  },
                  {
                    id: 'Storytelling',
                    title: 'Storytelling Imersivo',
                    desc: 'Jornada do herói, tensão emocional e transformação.',
                    icon: MessageSquare,
                    accent: 'from-purple-500/20 to-indigo-600/10 border-purple-500/50 text-purple-300'
                  }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = tone === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTone(item.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `bg-gradient-to-br ${item.accent} shadow-lg`
                          : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                          {item.title}
                        </span>
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">
                A IA vai gerar <strong className="text-zinc-200">5 títulos</strong>,{' '}
                <strong className="text-zinc-200">3 ganchos</strong>,{' '}
                <strong className="text-zinc-200">roteiro estruturado</strong> e{' '}
                <strong className="text-zinc-200">3 conceitos de thumbnail</strong>.
              </div>
              <button
                type="submit"
                disabled={isGeneratingStrategy || !topic.trim() || !audience.trim()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white shadow-lg shadow-rose-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isGeneratingStrategy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Construindo Estratégia Viral...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Gerar Estratégia Completa</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {strategyError && (
            <div className="mt-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-start gap-3 text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-rose-300">Atenção</p>
                <p className="text-xs text-rose-200/90 mt-1">{strategyError}</p>
              </div>
              <button
                onClick={() => {
                  if (!customApiKey.trim()) setIsApiModalOpen(true);
                  else handleGenerateStrategy();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-200 border border-rose-500/30 transition-all cursor-pointer"
              >
                Configurar / Tentar
              </button>
            </div>
          )}
        </section>

        {isGeneratingStrategy && (
          <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-5 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-rose-400 animate-spin" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">
                Analisando padrões de retenção e gatilhos de clique...
              </h3>
              <p className="text-xs text-zinc-400">
                O Gemini está criando 5 títulos otimizados, ganchos e blocos de roteiro com loops abertos.
              </p>
            </div>
          </section>
        )}

        {strategyData && !isGeneratingStrategy && (
          <div ref={strategySectionRef} className="space-y-10">
            <section className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                    <Award className="w-4 h-4" />
                    Etapa 2.1 • Psicologia do Clique (CTR)
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    5 Títulos com Alto Potencial de Clique
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Clique em um título para escolhê-lo como base das suas Thumbnails e Teste do Feed.
                  </p>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      strategyData.titles
                        .map((t, i) => `${i + 1}. ${t.title} (${t.score}/10 - ${t.trigger})`)
                        .join('\n'),
                      'copy-titles'
                    )
                  }
                  className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
                >
                  {copiedKey === 'copy-titles' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Títulos Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar 5 Títulos</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {strategyData.titles.map((item, idx) => {
                  const isSelected = selectedTitleIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTitleIndex(idx)}
                      className={`group p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-500/15 via-zinc-900 to-zinc-900 border-rose-500/60 shadow-lg shadow-rose-950/30'
                          : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white group-hover:text-rose-200 transition-colors">
                              {item.title}
                            </h3>
                            {isSelected && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Escolhido
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">{item.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/60">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getTriggerBadgeStyle(
                            item.trigger
                          )}`}
                        >
                          Gatilho: {item.trigger}
                        </span>

                        <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-white">{item.score}</span>
                          <span className="text-[10px] text-zinc-500">/10</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/50 p-4 rounded-xl">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-xs text-zinc-400">Título selecionado para as Thumbnails:</span>
                  <p className="text-sm font-bold text-rose-300">“{activeTitleObj.title}”</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerateAllThumbnails(selectedTitleIndex)}
                  disabled={isGeneratingThumbs}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isGeneratingThumbs ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando 3 Thumbnails...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>Gerar 3 Thumbnails 16:9 para este Título</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-5 bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Etapa 2.2 • Primeiros 5 Segundos
                      </div>
                      <h2 className="text-lg font-bold text-white">3 Ganchos de Abertura</h2>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          strategyData.hooks
                            .map((h, i) => `Gancho ${i + 1} (${h.style}): "${h.script}" [Visual: ${h.visualCue}]`)
                            .join('\n\n'),
                          'copy-hooks'
                        )
                      }
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                      title="Copiar todos os ganchos"
                    >
                      {copiedKey === 'copy-hooks' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {strategyData.hooks.map((hook, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            Opção {idx + 1} • {hook.style}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-zinc-100 leading-relaxed italic">
                          “{hook.script}”
                        </p>

                        <div className="pt-2 border-t border-zinc-800/70 flex items-start gap-2 text-xs text-zinc-400">
                          <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-zinc-300">Ação Visual:</strong> {hook.visualCue}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="lg:col-span-7 bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                      <Layers className="w-3.5 h-3.5" />
                      Etapa 2.3 • Retenção Contínua
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      Estrutura de Roteiro com Loops Abertos
                    </h2>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        strategyData.scriptBlocks
                          .map(
                            (b, i) =>
                              `Bloco ${i + 1}: ${b.blockName} (${b.duration})\n${b.content}\nLoop Aberto: ${b.openLoop}`
                          )
                          .join('\n\n'),
                        'copy-script'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'copy-script' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Roteiro Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Roteiro</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  {strategyData.scriptBlocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h3 className="text-sm font-bold text-white">{block.blockName}</h3>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                          ⏱ {block.duration}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {block.content}
                      </p>

                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300">Loop Aberto: </strong>
                          {block.openLoop}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section
              ref={thumbSectionRef}
              className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
                    <ImageIcon className="w-4 h-4" />
                    Etapa 3 • Laboratório de Imagens 16:9
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    3 Conceitos de Thumbnail Lado a Lado
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Baseadas no título: <strong className="text-zinc-200">“{activeTitleObj.title}”</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateAllThumbnails(selectedTitleIndex)}
                  disabled={isGeneratingThumbs}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGeneratingThumbs ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Renderizando 3 Thumbnails...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Gerar Imagens das 3 Thumbnails</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {thumbnails.map((thumb, idx) => {
                  const isSelectedForFeed = selectedThumbIndex === idx;
                  const concept = thumb.concept || {};

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                        isSelectedForFeed
                          ? 'bg-zinc-950 border-violet-500 ring-2 ring-violet-500/25 shadow-xl'
                          : 'bg-zinc-950/70 border-zinc-800/90 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden border-b border-zinc-800">
                          {thumb.loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-zinc-900 via-violet-950/30 to-zinc-900 animate-pulse">
                              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mb-2" />
                              <span className="text-xs font-semibold text-violet-200">
                                Gerando imagem 16:9...
                              </span>
                            </div>
                          ) : thumb.error ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-rose-950/30">
                              <AlertCircle className="w-7 h-7 text-rose-400 mb-2" />
                              <p className="text-xs text-rose-200 mb-3">{thumb.error}</p>
                              <button
                                onClick={() =>
                                  generateSingleThumbnail(idx, activeTitleObj.title, concept)
                                }
                                className="px-3 py-1.5 rounded-lg bg-rose-500/25 text-xs font-semibold text-rose-200"
                              >
                                Tentar Novamente
                              </button>
                            </div>
                          ) : thumb.imageUrl ? (
                            <img
                              src={thumb.imageUrl}
                              alt={concept.conceptName || `Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-violet-950/20">
                              <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                              <p className="text-xs font-semibold text-zinc-300">
                                Conceito #{idx + 1} Pronto
                              </p>
                              <p className="text-[11px] text-zinc-500 mt-1 mb-3">
                                Texto: “{concept.shortText}”
                              </p>
                              <button
                                onClick={() =>
                                  generateSingleThumbnail(idx, activeTitleObj.title, concept)
                                }
                                className="px-3.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Gerar Thumbnail
                              </button>
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-mono font-semibold text-white">
                            12:45
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                              {concept.conceptName}
                            </span>
                            {isSelectedForFeed && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                Ativa no Feed
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="text-zinc-500 shrink-0">Texto:</span>
                              <span className="font-bold text-amber-300 uppercase">
                                “{concept.shortText}”
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-zinc-500 shrink-0">Expressão:</span>
                              <span className="text-zinc-300">{concept.facialExpression}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedThumbIndex(idx);
                            feedSectionRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            });
                          }}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelectedForFeed
                              ? 'bg-violet-600 text-white border-violet-500'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                          }`}
                        >
                          <Layout className="w-3.5 h-3.5" />
                          <span>Testar no Feed</span>
                        </button>

                        {thumb.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownloadThumbnail(thumb.imageUrl, idx)}
                            className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                            title="Baixar PNG"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              ref={feedSectionRef}
              className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
                    <Layout className="w-4 h-4" />
                    Etapa 4 • Simulador de Destaque Visual
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Teste do Feed (YouTube Mockup)
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setFeedDevice('desktop')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        feedDevice === 'desktop' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedDevice('mobile')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        feedDevice === 'mobile' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Celular</span>
                    </button>
                  </div>
                </div>
              </div>

              {feedDevice === 'desktop' ? (
                <div className="rounded-2xl bg-[#0F0F0F] border border-zinc-800 overflow-hidden shadow-2xl">
                  <div className="h-14 px-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#0F0F0F]">
                    <div className="flex items-center gap-4">
                      <Menu className="w-5 h-5 text-zinc-400" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-5 rounded bg-red-600 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                        <span className="font-bold text-sm text-white">YouTube</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
                    <CompetitorCard video={COMPETITOR_VIDEOS[0]} />

                    <div className="group cursor-pointer rounded-xl p-2 -m-2 bg-rose-500/5 ring-2 ring-rose-500/60 relative transition-all">
                      <div className="absolute -top-3 left-3 z-20 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Seu Vídeo
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-3">
                        {activeThumbObj?.imageUrl ? (
                          <img
                            src={activeThumbObj.imageUrl}
                            alt="Sua Thumbnail"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-900 via-violet-950 to-zinc-900 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-lg font-black text-amber-300 uppercase tracking-tight">
                              {activeThumbObj?.concept?.shortText || 'SEU TEXTO AQUI'}
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-mono font-semibold text-white">
                          12:45
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {channelName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                            {activeTitleObj.title}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 truncate">{channelName}</p>
                        </div>
                      </div>
                    </div>

                    {COMPETITOR_VIDEOS.slice(1, 5).map((video) => (
                      <CompetitorCard key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-sm mx-auto rounded-[36px] bg-[#0F0F0F] border-[6px] border-zinc-800 overflow-hidden shadow-2xl">
                  <div className="bg-black px-5 py-2 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>09:41</span>
                    <div className="w-20 h-4 bg-zinc-900 rounded-full" />
                    <span>5G 100%</span>
                  </div>

                  <div className="divide-y divide-zinc-800/60 max-h-[640px] overflow-y-auto">
                    <div className="p-3 bg-rose-500/5 border-l-4 border-rose-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                          Seu Vídeo no Celular
                        </span>
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                        {activeThumbObj?.imageUrl ? (
                          <img
                            src={activeThumbObj.imageUrl}
                            alt="Sua Thumbnail Mobile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-900 via-violet-950 to-zinc-900 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-base font-black text-amber-300 uppercase">
                              {activeThumbObj?.concept?.shortText || 'SEU TEXTO'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {channelName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                            {activeTitleObj.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{channelName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function CompetitorCard({ video }) {
  return (
    <div className="group cursor-default">
      <div
        className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${video.thumbGradient} mb-3 p-4 flex items-center justify-between border border-zinc-800/60`}
      >
        <div className="space-y-1.5 max-w-[68%]">
          <span className="inline-block px-2 py-0.5 rounded bg-black/70 text-[10px] font-black tracking-wider text-amber-400 uppercase">
            {video.badgeText}
          </span>
          <p className="text-xs font-extrabold text-white leading-tight line-clamp-2 drop-shadow">
            {video.title}
          </p>
        </div>
        <div className="text-4xl sm:text-5xl select-none filter drop-shadow-md">
          {video.emoji}
        </div>
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-mono font-semibold text-white">
          {video.duration}
        </span>
      </div>

      <div className="flex gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${video.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          {video.channel.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-zinc-200 line-clamp-2 leading-snug">
            {video.title}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 truncate">{video.channel}</p>
          <p className="text-xs text-zinc-500">
            {video.views} • {video.time}
          </p>
        </div>
        <MoreVertical className="w-4 h-4 text-zinc-500 shrink-0 mt-1" />
      </div>
    </div>
  );
}
