import { useState } from 'react';
import { Sparkles, Send, FileText, Database as DbIcon, BookOpen, Info } from 'lucide-react';
import { getAIResponse, researchData, datasetsData } from '@/lib/data';
import { Link } from 'react-router-dom';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  relatedResearch?: string[];
  relatedDatasets?: string[];
}

const suggestedQuestions = [
  'Show research about land governance',
  'Find datasets related to rural development',
  'Show evidence related to land-use problems',
  'Explain the Evidence Matrix',
];

export default function AIEvidenceAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am the BhoomiSetu Evidence Assistant. I can help you discover research, datasets, and evidence related to land governance in India. Try one of the suggested questions below, or ask your own.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (question: string) => {
    if (!question.trim()) return;
    setLoading(true);
    const userMsg: ChatMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = getAIResponse(question);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        relatedResearch: response.relatedResearch,
        relatedDatasets: response.relatedDatasets,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="rounded-xl border border-forest-900/10 bg-white shadow-soft overflow-hidden">
      <div className="bg-gradient-to-r from-forest-700 to-forest-600 px-5 py-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
          <Sparkles className="w-5 h-5 text-saffron-300" />
        </div>
        <div>
          <h3 className="text-cream-50 font-semibold">AI Evidence Assistant</h3>
          <p className="text-cream-200 text-xs">Prototype responses · Demo content</p>
        </div>
      </div>

      {/* Messages */}
      <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-forest-700 text-cream-50'
                  : 'bg-cream-100 text-navy-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-navy-900/10">
                  <p className="text-xs font-semibold text-navy-500 mb-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Sources
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, j) => (
                      <span key={j} className="badge bg-navy-50 text-navy-600">{src}</span>
                    ))}
                  </div>
                </div>
              )}

              {msg.relatedResearch && msg.relatedResearch.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-navy-500 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Related Research
                  </p>
                  <div className="space-y-1">
                    {msg.relatedResearch.map((rid) => {
                      const r = researchData.find((x) => x.id === rid);
                      if (!r) return null;
                      return (
                        <Link
                          key={rid}
                          to={`/research/${rid}`}
                          className="block text-xs text-forest-700 hover:text-forest-800 hover:underline"
                        >
                          {r.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {msg.relatedDatasets && msg.relatedDatasets.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-navy-500 mb-1.5 flex items-center gap-1">
                    <DbIcon className="w-3 h-3" /> Related Datasets
                  </p>
                  <div className="space-y-1">
                    {msg.relatedDatasets.map((did) => {
                      const d = datasetsData.find((x) => x.id === did);
                      if (!d) return null;
                      return (
                        <Link
                          key={did}
                          to={`/data/${did}`}
                          className="block text-xs text-saffron-700 hover:text-saffron-800 hover:underline"
                        >
                          {d.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-cream-100 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <p className="text-xs text-navy-400 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="badge bg-forest-50 text-forest-700 hover:bg-forest-100 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-forest-900/10 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend(input)}
          placeholder="Ask about research, datasets, or evidence..."
          className="input-field flex-1"
          disabled={loading}
        />
        <button
          onClick={() => !loading && handleSend(input)}
          disabled={loading || !input.trim()}
          className="btn-primary px-4"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
