
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  PencilLine,
  BriefcaseBusiness,
  Check,
  ArrowRight,
  CircleDot,
} from 'lucide-react';

import JobInputForm from '../components/JobInputForm';
import ExtractedJobCard from '../components/ExtractedJobCard';
import { extractJob, saveApplication } from '../api/client';
import type { ExtractedJob } from '../types/job';

const workflowSteps = [
  {
    number: '01',
    icon: FileText,
    title: 'Extract job details',
    description: 'Identify the company, position and key requirements.',
  },
  {
    number: '02',
    icon: PencilLine,
    title: 'Review & refine',
    description: 'Validate and edit the information extracted by AI.',
  },
  {
    number: '03',
    icon: BriefcaseBusiness,
    title: 'Track opportunities',
    description: 'Save the opportunity and organize your applications.',
  },
];

export default function ExtractPage() {
  const [job, setJob] = useState<ExtractedJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastText, setLastText] = useState('');

  const navigate = useNavigate();

  const handleExtract = async (text: string) => {
    setLoading(true);
    setError(null);
    setLastText(text);

    try {
      setJob(await extractJob(text));
    } catch {
      setError(
        'Job extraction failed. Please check that the backend is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!job) return;

    setSaving(true);
    setError(null);

    try {
      await saveApplication(job);
      navigate('/applications');
    } catch {
      setError('Unable to save this application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* Compact hero */}
      <section className="hero-section relative overflow-hidden">
        <div className="hero-glow" />

        <div className="relative z-10 max-w-2xl">
          <div className="hero-badge">
            <Sparkles size={13} strokeWidth={1.8} />
            AI-POWERED JOB ASSISTANT
          </div>

          <h2 className="hero-title">
            Turn job descriptions into
            <span className="gradient-text"> opportunities.</span>
          </h2>

          <p className="hero-description">
            Extract key job information, review the details and manage your
            opportunities in one organized workspace.
          </p>

          <div className="hero-features">
            <span>
              <Check size={13} /> AI extraction
            </span>
            <span>
              <Check size={13} /> Editable results
            </span>
            <span>
              <Check size={13} /> Application tracking
            </span>
          </div>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <Sparkles size={34} strokeWidth={1.2} />
        </div>
      </section>

      {/* Extraction panel */}
      <section className="glass-card overflow-hidden rounded-2xl">

        <div className="extraction-header">
          <div className="flex items-center gap-3">
            <div className="extraction-icon">
              <Sparkles size={19} strokeWidth={1.7} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Smart Job Extraction
              </h3>
              <p className="mt-1 text-[11px] text-slate-400">
                Transform job postings into structured information
              </p>
            </div>
          </div>

          <span className="system-ready">
            <CircleDot size={11} />
            SYSTEM READY
          </span>
        </div>

        <div className="p-5 sm:p-7">
          {!job && (
            <>
              <div className="mb-5">
                <h3 className="text-base font-bold text-slate-100">
                  Paste a job description
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs leading-6 text-slate-400">
                  Add a job posting below. Our AI will identify the company,
                  position, location, skills and other important details.
                </p>
              </div>

              <JobInputForm
                onSubmit={handleExtract}
                loading={loading}
              />

              {loading && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] p-3 text-xs text-cyan-300">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
                  Analyzing the job description...
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}
            </>
          )}

          {job && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Review extracted information
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Check and edit the information before saving.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300">
                  <Check size={13} />
                  Extraction completed
                </span>
              </div>

              <ExtractedJobCard
                job={job}
                onChange={setJob}
                onReExtract={() => handleExtract(lastText)}
                onSave={handleSave}
                saving={saving}
              />

              {error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setJob(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-cyan-300"
              >
                <ArrowRight size={13} className="rotate-180" />
                Extract another job description
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Workflow */}
      <section className="workflow-section">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow">HOW IT WORKS</p>
            <h3 className="mt-1.5 text-base font-bold text-slate-100">
              From posting to opportunity
            </h3>
          </div>

          <span className="hidden text-[11px] text-slate-500 sm:block">
            Three simple steps
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {workflowSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="workflow-card">
                <div className="flex items-center justify-between">
                  <div className="workflow-icon">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>

                  <span className="workflow-number">
                    {step.number}
                  </span>
                </div>

                <h4 className="mt-4 text-[13px] font-bold text-slate-200">
                  {step.title}
                </h4>

                <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
