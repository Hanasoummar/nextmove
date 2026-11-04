
import { useState, type FormEvent } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  loading: boolean;
}

export default function JobInputForm({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');
  const minimumLength = 50;
  const isValid = text.trim().length >= minimumLength;

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (isValid && !loading) onSubmit(text);
  };

  return (
    <form onSubmit={handle} className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          Job description
        </label>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-cyan-300">
          <Sparkles size={12} />
          AI extraction
        </span>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={11}
          disabled={loading}
          placeholder={`Paste the complete job description here...

For the best results, include:
• Company name
• Job title and location
• Responsibilities
• Required qualifications
• Technical skills
• Experience requirements`}
          className="w-full resize-y rounded-2xl border border-white/10 bg-[#0b1020] p-5 pb-12 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 disabled:opacity-60"
        />

        <div className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-[#151b30] px-2.5 py-1 text-[11px] text-slate-500">
          {text.length} characters
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-xs ${isValid ? 'text-emerald-400' : 'text-slate-500'}`}>
          {isValid
            ? '✓ Description length is sufficient'
            : `${Math.max(0, minimumLength - text.trim().length)} more characters required`}
        </p>

        <p className="text-xs text-slate-500">
          You can review the extracted information before saving.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !isValid}
        className="btn-accent flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
            Analyzing job description...
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Extract job information
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
