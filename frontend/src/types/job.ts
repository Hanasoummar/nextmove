export interface ExtractedJob {
  company: string;
  position: string;
  location?: string | null;
  employment_type?: string | null;
  experience_required?: string | null;
  required_skills: string[];
  job_url?: string | null;
  source?: string | null;
}