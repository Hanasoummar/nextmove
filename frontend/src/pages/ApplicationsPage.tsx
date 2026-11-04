
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  getApplications,
  updateApplicationStatus,
  type ApplicationOut,
} from '../api/client';

const STATUS_STYLES: Record<string, string> = {
  Applied: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
  Interview: 'border-violet-400/20 bg-violet-400/10 text-violet-300',
  Offer: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  Rejected: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
  Pending: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  Withdrawn: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
};

const STATUS_DOT: Record<string, string> = {
  Applied: 'bg-cyan-400',
  Interview: 'bg-violet-400',
  Offer: 'bg-emerald-400',
  Rejected: 'bg-rose-400',
  Pending: 'bg-amber-400',
  Withdrawn: 'bg-slate-400',
};

function formatDate(value: string) {
  if (!value) return '—';

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: 'cyan' | 'violet' | 'green';
}) {
  const colors = {
    cyan: {
      icon: 'border-cyan-400/15 bg-cyan-400/10 text-[#22D3EE]',
      glow: 'bg-cyan-400',
      hover: 'group-hover:border-cyan-400/25',
      number: 'text-white',
    },
    violet: {
      icon: 'border-violet-400/15 bg-violet-400/10 text-[#A78BFA]',
      glow: 'bg-violet-400',
      hover: 'group-hover:border-violet-400/25',
      number: 'text-white',
    },
    green: {
      icon: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300',
      glow: 'bg-emerald-400',
      hover: 'group-hover:border-emerald-400/25',
      number: 'text-white',
    },
  };

  const style = colors[color];

  return (
    <div
      className={`glass-card group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-1 ${style.hover}`}
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${style.glow} opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-15`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${style.number}`}>
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${style.icon}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load applications
  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        setLoading(true);
        setError('');

        const data = await getApplications();

        if (active) {
          setApps(data);
        }
      } catch {
        if (active) {
          setError('Unable to load your applications. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, []);

  // Update application status
  const handleStatusChange = async (
    applicationId: number,
    newStatus: string
  ) => {
    try {
      const updatedApplication = await updateApplicationStatus(
        applicationId,
        newStatus
      );

      setApps((currentApplications) =>
        currentApplications.map((app) =>
          app.id === applicationId ? updatedApplication : app
        )
      );
    } catch (error) {
      console.error('Failed to update application status:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Could not update application status.'
      );
    }
  };

  // Statistics
  const interviews = apps.filter(
    (app) => app.status === 'Interview'
  ).length;

  const offers = apps.filter(
    (app) => app.status === 'Offer'
  ).length;

  // Search and status filtering
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        app.company.toLowerCase().includes(query) ||
        app.position.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apps, search, statusFilter]);

  const statuses = [
    'All',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
    'Pending',
    'Withdrawn',
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Career dashboard
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My <span className="text-[#A78BFA]">Applications</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Track your opportunities, follow your progress and keep your job
            search organized in one place.
          </p>
        </div>

        <Link
          to="/"
          className="group inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400 to-violet-400 px-5 py-3 text-sm font-bold text-[#09111E] shadow-lg shadow-cyan-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-400/20"
        >
          <Plus size={17} strokeWidth={2.5} />
          Add application
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total applications"
          value={apps.length}
          description="All your saved opportunities"
          icon={BriefcaseBusiness}
          color="cyan"
        />

        <StatCard
          label="Interviews"
          value={interviews}
          description="Opportunities moving forward"
          icon={MessageSquare}
          color="violet"
        />

        <StatCard
          label="Offers received"
          value={offers}
          description="Successful applications"
          icon={Target}
          color="green"
        />
      </section>

      {/* Applications table */}
      <section className="glass-card overflow-hidden rounded-2xl border border-white/[0.06]">

        {/* Section heading and filters */}
        <div className="border-b border-white/[0.06] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Application pipeline
                </h2>
                <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                  {filteredApps.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Review and monitor all your job opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search company or position..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0b1020] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#22D3EE]/50 focus:ring-2 focus:ring-[#22D3EE]/10 sm:w-64"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#22D3EE]"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#0b1020] px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-[#A78BFA]/50 focus:ring-2 focus:ring-[#A78BFA]/10"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All statuses' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-400/20 border-t-[#22D3EE]" />
            <p className="mt-4 text-sm text-slate-400">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="m-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-center">
            <p className="text-sm text-rose-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-[#A78BFA] transition hover:text-white"
            >
              Refresh page
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && apps.length === 0 && (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] text-[#22D3EE]">
              <FileSearch size={29} strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-semibold text-white">
              No applications yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Start building your application pipeline by extracting a job
              description and saving your first opportunity.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-400 px-5 py-2.5 text-sm font-bold text-[#09111E] transition hover:brightness-110"
            >
              <Plus size={16} />
              Create your first application
            </Link>
          </div>
        )}

        {/* No search results */}
        {!loading && !error && apps.length > 0 && filteredApps.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Search size={28} className="mx-auto text-slate-600" />
            <h3 className="mt-3 font-semibold text-white">
              No matching applications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="mt-4 text-sm font-medium text-[#A78BFA] transition hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Data table */}
        {!loading && !error && filteredApps.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    {[
                      'Company / Position',
                      'Application date',
                      'Status',
                      'Location',
                      'Key skills',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {filteredApps.map((app) => {
                    const statusStyle =
                      STATUS_STYLES[app.status] ??
                      'border-slate-400/20 bg-slate-500/10 text-slate-300';

                    const statusDot =
                      STATUS_DOT[app.status] ?? 'bg-slate-400';

                    return (
                      <tr
                        key={app.id}
                        className="group transition-colors hover:bg-cyan-400/[0.025]"
                      >
                        {/* Company and position */}
                        <td className="px-5 py-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-400 transition group-hover:border-cyan-400/20 group-hover:text-[#22D3EE]">
                              <BriefcaseBusiness size={14} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-100 transition group-hover:text-[#A78BFA]">
                                {app.company}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {app.position}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3 text-sm text-slate-400">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={14} className="text-slate-600" />
                            {formatDate(app.application_date)}
                          </span>
                        </td>

                        {/* Editable status */}
                        <td className="px-5 py-3">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value)
                            }
                            aria-label={`Change status for ${app.company}`}
                            className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium outline-none transition-all ${statusStyle}`}
                          >
                            {statuses
                              .filter((status) => status !== 'All')
                              .map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-[#111827] text-white"
                                >
                                  {status}
                                </option>
                              ))}
                          </select>
                          <span className="sr-only">
                            Current status indicator: {statusDot}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-3 text-sm text-slate-400">
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={14} className="text-slate-600" />
                            {app.location || 'Not specified'}
                          </span>
                        </td>

                        {/* Skills */}
                        <td className="px-5 py-3">
                          <div className="flex max-w-[230px] flex-wrap gap-1">
                            {(app.required_skills ?? [])
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="rounded-md border border-white/[0.07] bg-white/[0.035] px-1.5 py-0.5 text-[10px] text-slate-400 transition hover:border-violet-400/20 hover:text-[#A78BFA]"
                                >
                                  {skill}
                                </span>
                              ))}

                            {(app.required_skills?.length ?? 0) > 3 && (
                              <span className="rounded-md border border-violet-400/15 bg-violet-400/10 px-1.5 py-0.5 text-[10px] text-[#A78BFA]">
                                +{app.required_skills.length - 3}
                              </span>
                            )}

                            {(!app.required_skills ||
                              app.required_skills.length === 0) && (
                              <span className="text-xs text-slate-600">
                                No skills listed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-white/[0.06] px-6 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing{' '}
                <span className="font-semibold text-[#22D3EE]">
                  {filteredApps.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-300">
                  {apps.length}
                </span>{' '}
                applications
              </p>

              <p className="text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Data synchronized with your application database
                </span>
              </p>
            </div>
          </>
        )}
      </section>

      {/* Bottom note */}
      <div className="flex items-start gap-3 rounded-xl border border-violet-400/[0.12] bg-violet-400/[0.035] px-5 py-4">
        <Sparkles size={17} className="mt-0.5 shrink-0 text-[#A78BFA]" />
        <p className="text-xs leading-5 text-slate-400">
          <span className="font-semibold text-[#A78BFA]">Stay consistent.</span>{' '}
          Keep your applications updated to get a clearer picture of your job
          search progress.
        </p>
      </div>
    </div>
  );
}
