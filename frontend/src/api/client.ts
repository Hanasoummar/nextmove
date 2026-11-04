import type { ExtractedJob } from '../types/job';

export interface ApplicationOut extends ExtractedJob {
  id: number;
  application_date: string;
  status: string;
}

export async function extractJob(text: string): Promise<ExtractedJob> {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function extractPdf(file: File): Promise<ExtractedJob> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/extract/pdf', { method: 'POST', body: form });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function saveApplication(job: ExtractedJob): Promise<ApplicationOut> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error(`Save error: ${res.status}`);
  return res.json();
}

export async function getApplications(): Promise<ApplicationOut[]> {
  const res = await fetch('/api/applications');
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return res.json();
}
export async function updateApplicationStatus(
  applicationId: number,
  status: string
): Promise<ApplicationOut> {
  const res = await fetch(
    `/api/applications/${applicationId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);

    throw new Error(
      data?.detail || `Update error: ${res.status}`
    );
  }

  return res.json();
}