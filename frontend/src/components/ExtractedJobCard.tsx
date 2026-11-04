
import type { ExtractedJob } from '../types/job';
import {
  Building2,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  GraduationCap,
  Globe2,
  Link2,
  Plus,
  X,
  RefreshCw,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  job: ExtractedJob;
  onChange: (job: ExtractedJob) => void;
  onReExtract: () => void;
  onSave: () => void;
  saving: boolean;
}

const fields = [
  { key: 'company', label: 'Company', placeholder: 'Company name', icon: Building2 },
  { key: 'position', label: 'Job title', placeholder: 'Position title', icon: BriefcaseBusiness },
  { key: 'location', label: 'Location', placeholder: 'City, country', icon: MapPin },
  { key: 'employment_type', label: 'Employment type', placeholder: 'Full-time, Internship...', icon: Clock3 },
  { key: 'experience_required', label: 'Experience required', placeholder: 'Entry-level, 2+ years...', icon: GraduationCap },
  { key: 'source', label: 'Source', placeholder: 'LinkedIn, company website...', icon: Globe2 },
  { key: 'job_url', label: 'Job URL', placeholder: 'https://...', icon: Link2 },
] as const;

export default function ExtractedJobCard({
  job,
  onChange,
  onReExtract,
  onSave,
  saving,
}: Props) {
  const updateField = (key: keyof ExtractedJob, value: string) => {
    onChange({ ...job, [key]: value });
  };

  const addSkill = () => {
    const skill = window.prompt('Enter a skill:')?.trim();

    if (
      skill &&
      !job.required_skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      onChange({
        ...job,
        required_skills: [...job.required_skills, skill],
      });
    }
  };

  const removeSkill = (index: number) => {
    onChange({
      ...job,
      required_skills: job.required_skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Extracted job details
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Review and edit the information identified by AI.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300">
          <CheckCircle2 size={13} strokeWidth={2} />
          Extraction successful
        </span>
      </div>

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {fields.map(({ key, label, placeholder, icon: Icon }) => (
          <div key={key} className={key === 'job_url' ? 'sm:col-span-2' : ''}>
            <label
              htmlFor={key}
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400"
            >
              <Icon size={13} strokeWidth={1.8} className="text-violet-300" />
              {label}
            </label>

            <input
              id={key}
              value={(job[key] as string | null) ?? ''}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0b1020] px-3.5 py-2.5 text-[13px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.018] p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Required skills
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Edit the skills identified in the job description.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-violet-300">
            {job.required_skills.length} skills
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.required_skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/15 bg-violet-400/[0.07] px-2.5 py-1.5 text-[11px] font-medium text-violet-200"
            >
              {skill}

              <button
                type="button"
                onClick={() => removeSkill(index)}
                aria-label={`Remove ${skill}`}
                className="text-violet-300/60 transition hover:text-rose-400"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={addSkill}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-violet-400/30 px-2.5 py-1.5 text-[11px] font-semibold text-violet-300 transition hover:border-violet-300/60 hover:bg-violet-400/[0.06]"
          >
            <Plus size={12} />
            Add skill
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onReExtract}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.06] hover:text-cyan-200 disabled:opacity-50"
        >
          <RefreshCw size={14} />
          Re-extract
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-accent inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving application...' : 'Save application'}
        </button>

        <p className="text-[11px] text-slate-500 sm:ml-auto">
          Review details before saving.
        </p>
      </div>
    </div>
  );
}
