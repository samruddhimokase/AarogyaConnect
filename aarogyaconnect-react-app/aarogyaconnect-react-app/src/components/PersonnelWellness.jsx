import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, BadgeCheck, BarChart3, Check,
  ChevronRight, ClipboardCheck, HeartHandshake, LockKeyhole, Moon,
  Phone, ShieldCheck, Sparkles, Users
} from 'lucide-react';

const STORAGE_KEYS = {
  consent: 'aarogya_wellness_consent',
  profile: 'aarogya_wellness_profile',
  checkIns: 'aarogya_wellness_checkins',
  requests: 'aarogya_wellness_requests',
  audit: 'aarogya_wellness_audit'
};

const readStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const initialProfile = {
  personnelId: '', name: '', age: '', department: '', rank: '', yearsOfService: '',
  dutyLocation: '', shiftType: 'Day', emergencyContact: '', shareAggregate: false
};

const initialCheckIn = {
  stress: 3, sleep: 3, fatigue: 3, workload: 3, mood: 3,
  anxiety: 3, exhaustion: 3, overtime: 1, balance: 3
};

const questions = [
  { key: 'stress', label: 'How stressful has work felt?', low: 'Low', high: 'Very high' },
  { key: 'sleep', label: 'How restorative was your sleep?', low: 'Poor', high: 'Very good', reverse: true },
  { key: 'fatigue', label: 'How fatigued do you feel?', low: 'Not fatigued', high: 'Very fatigued' },
  { key: 'workload', label: 'How manageable is your workload?', low: 'Manageable', high: 'Overwhelming' },
  { key: 'mood', label: 'How has your mood been?', low: 'Very low', high: 'Positive', reverse: true },
  { key: 'anxiety', label: 'How much worry or tension have you felt?', low: 'Very little', high: 'A lot' },
  { key: 'exhaustion', label: 'How physically exhausted do you feel?', low: 'Not exhausted', high: 'Very exhausted' },
  { key: 'balance', label: 'How is your work-life balance?', low: 'Very difficult', high: 'Good', reverse: true }
];

const getRisk = (score) => score < 35 ? 'Low Risk' : score < 65 ? 'Moderate Risk' : 'High Risk';

function assessRisk(values) {
  const factors = [];
  const weighted = [
    [values.stress, 15], [6 - values.sleep, 15], [values.fatigue, 12],
    [values.workload, 12], [6 - values.mood, 10], [values.anxiety, 12],
    [values.exhaustion, 10], [6 - values.balance, 7]
  ];
  const score = Math.round(weighted.reduce((total, [value, weight]) => total + ((value - 1) / 4) * weight, 0) + (values.overtime / 5) * 7);
  if (values.sleep <= 2) factors.push('Poor sleep contributed to increased risk.');
  if (values.workload >= 4) factors.push('High workload contributed to increased risk.');
  if (values.overtime >= 3) factors.push('Repeated night shifts or overtime contributed to increased risk.');
  if (values.fatigue >= 4 || values.exhaustion >= 4) factors.push('Elevated fatigue or physical exhaustion contributed to increased risk.');
  if (values.anxiety >= 4) factors.push('Higher worry levels contributed to increased risk.');
  if (values.mood <= 2) factors.push('Lower reported mood contributed to increased risk.');
  if (values.balance <= 2) factors.push('Work-life balance concerns contributed to increased risk.');

  const risk = getRisk(score);
  const action = risk === 'High Risk'
    ? 'Consider rest and recovery, and request confidential support or speak with an authorized welfare officer.'
    : risk === 'Moderate Risk'
      ? 'Consider a recovery break and review the factors below. Confidential support is available.'
      : 'Continue your current recovery practices and check in again when useful.';
  return { score, risk, factors: factors.length ? factors : ['No single elevated factor stood out in this check-in.'], action };
}

function storeAudit(action) {
  const entries = readStored(STORAGE_KEYS.audit, []);
  entries.unshift({ action, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify(entries.slice(0, 100)));
}

function Stat({ label, value, tone = 'text-white', icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-teal-300" />}
      </div>
      <p className={`mt-2 text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function TrendBars({ title, records, field, color }) {
  const points = records.slice(-12);
  if (!points.length) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><h3 className="text-sm font-bold text-white">{title}</h3><p className="py-8 text-center text-xs text-slate-500">Complete a check-in to see your trend.</p></div>;
  }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <div className="mt-5 flex h-28 items-end gap-2" role="img" aria-label={`${title} across ${points.length} check-ins`}>
        {points.map((record, index) => {
          const value = Math.max(0, Math.min(100, field === 'score' ? record.score : ((record.values[field] - 1) / 4) * 100));
          return <div key={`${record.timestamp}-${index}`} title={`${new Date(record.timestamp).toLocaleDateString()}: ${Math.round(value)}`} className={`min-w-2 flex-1 rounded-t ${color}`} style={{ height: `${Math.max(6, value)}%` }} />;
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>Earlier</span><span>Most recent</span></div>
    </div>
  );
}

export default function PersonnelWellness({ onClose }) {
  const [section, setSection] = useState('overview');
  const [consented, setConsented] = useState(() => localStorage.getItem(STORAGE_KEYS.consent) === 'true');
  const [profile, setProfile] = useState(() => ({ ...initialProfile, ...readStored(STORAGE_KEYS.profile, {}) }));
  const [checkIns, setCheckIns] = useState(() => readStored(STORAGE_KEYS.checkIns, []));
  const [requests, setRequests] = useState(() => readStored(STORAGE_KEYS.requests, []));
  const [values, setValues] = useState(initialCheckIn);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [period, setPeriod] = useState('week');
  const [supportType, setSupportType] = useState('Counselling request');
  const [supportNote, setSupportNote] = useState('');
  const [welfareUser, setWelfareUser] = useState('');
  const [welfarePass, setWelfarePass] = useState('');
  const [welfareAuthorized, setWelfareAuthorized] = useState(false);
  const [loginError, setLoginError] = useState('');

  const visibleRecords = useMemo(() => {
    const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return checkIns.filter(record => new Date(record.timestamp).getTime() >= cutoff);
  }, [checkIns, period]);
  const recentHighRisk = checkIns.slice(0, 3).filter(record => record.risk === 'High Risk').length >= 2;
  const latestRecord = checkIns[0];
  const currentAssessment = latestAssessment || (latestRecord && { ...latestRecord, action: assessRisk(latestRecord.values).action });

  const acceptConsent = () => {
    localStorage.setItem(STORAGE_KEYS.consent, 'true');
    setConsented(true);
    storeAudit('consent_granted');
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (!consented) return;
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    storeAudit('profile_updated');
    setSection('overview');
  };

  const submitCheckIn = (event) => {
    event.preventDefault();
    if (!consented) return;
    const assessment = assessRisk(values);
    const record = { ...assessment, values: { ...values }, timestamp: new Date().toISOString() };
    const updated = [record, ...checkIns].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.checkIns, JSON.stringify(updated));
    setCheckIns(updated);
    setLatestAssessment(record);
    storeAudit('wellbeing_checkin_submitted');
    setSection('prediction');
  };

  const submitSupportRequest = (event) => {
    event.preventDefault();
    if (!consented) return;
    const updated = [{ id: `support-${Date.now()}`, type: supportType, note: supportNote, status: 'Pending', timestamp: new Date().toISOString() }, ...requests];
    localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(updated));
    setRequests(updated);
    setSupportNote('');
    storeAudit('support_request_created');
  };

  const loginWelfare = (event) => {
    event.preventDefault();
    if (welfareUser.trim().toLowerCase() === 'welfare' && welfarePass === 'support2026') {
      setWelfareAuthorized(true);
      setLoginError('');
      storeAudit('welfare_demo_role_authenticated');
    } else {
      setLoginError('Demo access not recognized. Use the welfare demo credentials shown below.');
    }
  };

  const revokeConsent = () => {
    for (const key of [STORAGE_KEYS.consent, STORAGE_KEYS.profile, STORAGE_KEYS.checkIns, STORAGE_KEYS.requests]) localStorage.removeItem(key);
    setConsented(false);
    setProfile(initialProfile);
    setCheckIns([]);
    setRequests([]);
    setLatestAssessment(null);
    setSection('overview');
    storeAudit('consent_revoked_and_local_data_cleared');
  };

  const tabs = [
    ['overview', 'Overview', Activity], ['profile', 'Personnel profile', Users],
    ['checkin', 'Wellbeing check-in', ClipboardCheck], ['prediction', 'Stress prediction', Sparkles],
    ['trends', 'Trend dashboard', BarChart3], ['support', 'Welfare support', HeartHandshake],
    ['welfare', 'Authorized dashboard', ShieldCheck]
  ];

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-300"><ShieldCheck className="h-4 w-4" /> PERSONNEL WELLNESS</div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Stress & Welfare Monitoring</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Private, voluntary check-ins and practical support for personnel in public safety services.</p>
        </div>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white md:self-center"><ArrowLeft className="h-4 w-4" /> AarogyaConnect</button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-2" role="tablist" aria-label="Personnel wellness sections">
        {tabs.map(([id, label, Icon]) => <button key={id} type="button" role="tab" aria-selected={section === id} onClick={() => setSection(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${section === id ? 'bg-teal-400 text-slate-950' : 'border border-slate-800 bg-slate-900 text-slate-300 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4 text-xs text-cyan-100">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
        <p><strong>Privacy notice:</strong> This demonstration stores information only in this browser. Browser storage is not encrypted or a production security control. No trained AI model is connected; risk estimates use transparent rules and are not medical diagnoses. Use approved secure services before handling real personnel data.</p>
      </div>

      {section === 'overview' && <div className="space-y-5">
        {recentHighRisk && <div className="flex gap-3 rounded-2xl border border-amber-500/50 bg-amber-950/30 p-4 text-amber-100"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-300" /><div><p className="text-sm font-bold">Early support reminder</p><p className="mt-1 text-xs text-amber-100/80">Recent check-ins show repeated high-risk scores. Consider rest and recovery, confidential counselling, or contacting an authorized welfare officer. This is not a diagnosis or personnel label.</p><button type="button" onClick={() => setSection('support')} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-200">View support options <ChevronRight className="h-3 w-3" /></button></div></div>}
        <div className="grid gap-4 md:grid-cols-3"><Stat label="Latest stress risk" value={currentAssessment?.risk || 'Not assessed'} tone={currentAssessment?.risk === 'High Risk' ? 'text-rose-300' : currentAssessment?.risk === 'Moderate Risk' ? 'text-amber-300' : 'text-teal-300'} icon={Activity} /><Stat label="Latest score" value={currentAssessment ? `${currentAssessment.score}/100` : '--'} tone="text-white" icon={BarChart3} /><Stat label="Support requests" value={requests.filter(request => request.status === 'Pending').length} tone="text-cyan-300" icon={HeartHandshake} /></div>
        {!consented ? <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5 sm:p-7"><h2 className="text-lg font-bold text-white">Your wellbeing data stays voluntary</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">Before collecting any profile or wellbeing information, review and accept the privacy notice. You can withdraw consent at any time; doing so clears this module&apos;s locally stored profile, check-ins, and support requests.</p><button type="button" onClick={acceptConsent} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300"><Check className="h-4 w-4" /> I consent to voluntary local demo storage</button></div> : <div className="grid gap-4 md:grid-cols-2"><button type="button" onClick={() => setSection('checkin')} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left hover:border-teal-500/50"><span><span className="block text-sm font-bold text-white">Start a check-in</span><span className="mt-1 block text-xs text-slate-400">A few quick questions, saved only after submit.</span></span><ChevronRight className="h-5 w-5 text-teal-300" /></button><button type="button" onClick={() => setSection('support')} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left hover:border-teal-500/50"><span><span className="block text-sm font-bold text-white">Find confidential support</span><span className="mt-1 block text-xs text-slate-400">Counselling, recovery resources, and help contacts.</span></span><ChevronRight className="h-5 w-5 text-teal-300" /></button></div>}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-bold text-white">A supportive tool, not a diagnosis</h2><p className="mt-2 text-xs leading-relaxed text-slate-400">Risk bands summarize self-reported work and wellbeing factors to help guide optional support. They must not be used for fitness-for-duty, promotion, discipline, or clinical decisions.</p></div>
      </div>}

      {section === 'profile' && <div className="space-y-4">
        {!consented ? <ConsentGate onConsent={acceptConsent} /> : <form onSubmit={saveProfile} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"><div className="mb-5"><h2 className="text-lg font-bold text-white">Personnel profile</h2><p className="mt-1 text-xs text-slate-400">Only fields you choose to provide are stored in this browser.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
          ['personnelId', 'Personnel ID', 'text'], ['name', 'Name', 'text'], ['age', 'Age', 'number'], ['department', 'Department / Force', 'text'], ['rank', 'Rank / Role', 'text'], ['yearsOfService', 'Years of service', 'number'], ['dutyLocation', 'Duty location', 'text'], ['emergencyContact', 'Emergency contact', 'tel']
        ].map(([key, label, type]) => <label key={key} className="text-xs font-semibold text-slate-300">{label}<input type={type} min={type === 'number' ? 0 : undefined} value={profile[key]} onChange={event => setProfile(previous => ({ ...previous, [key]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-teal-400" /></label>)}<label className="text-xs font-semibold text-slate-300">Shift type<select value={profile.shiftType} onChange={event => setProfile(previous => ({ ...previous, shiftType: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"><option>Day</option><option>Night</option><option>Rotating</option><option>On call</option></select></label></div><label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300"><input type="checkbox" checked={profile.shareAggregate} onChange={event => setProfile(previous => ({ ...previous, shareAggregate: event.target.checked }))} className="mt-0.5 accent-teal-400" /><span>Allow my risk band to contribute to anonymous aggregate demo counts. No name or personnel ID is shown in the welfare dashboard.</span></label><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Save profile</button><button type="button" onClick={revokeConsent} className="rounded-xl border border-rose-500/40 px-4 py-3 text-xs font-bold text-rose-300">Withdraw consent & clear local data</button></div></form>}
      </div>}

      {section === 'checkin' && <div className="space-y-4">
        {!consented ? <ConsentGate onConsent={acceptConsent} /> : <form onSubmit={submitCheckIn} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"><div className="mb-5"><h2 className="text-lg font-bold text-white">Wellbeing check-in</h2><p className="mt-1 text-xs text-slate-400">Choose 1 to 5. Your answers are not collected until you submit.</p></div><div className="grid gap-5 md:grid-cols-2">{questions.map(question => <label key={question.key} className="block"><span className="flex justify-between gap-3 text-xs font-semibold text-slate-200"><span>{question.label}</span><span className="text-teal-300">{values[question.key]}/5</span></span><input type="range" min="1" max="5" step="1" value={values[question.key]} onChange={event => setValues(previous => ({ ...previous, [question.key]: Number(event.target.value) }))} className="mt-3 w-full accent-teal-400" /><span className="flex justify-between text-[10px] text-slate-500"><span>{question.low}</span><span>{question.high}</span></span></label>)}</div><label className="mt-6 block text-xs font-semibold text-slate-200">Recent overtime or night shifts<div className="mt-2 flex items-center gap-3"><input type="range" min="0" max="5" step="1" value={values.overtime} onChange={event => setValues(previous => ({ ...previous, overtime: Number(event.target.value) }))} className="w-full accent-teal-400" /><span className="w-20 text-right text-teal-300">{values.overtime} shifts</span></div><span className="mt-1 block text-[10px] text-slate-500">In the last 7 days</span></label><button className="mt-6 rounded-xl bg-teal-400 px-5 py-3 text-xs font-black text-slate-950">Submit check-in & see estimate</button></form>}
      </div>}

      {section === 'prediction' && <div className="space-y-4">
        {!consented ? <ConsentGate onConsent={acceptConsent} /> : currentAssessment ? <>
          <div className={`rounded-2xl border p-5 sm:p-7 ${currentAssessment.risk === 'High Risk' ? 'border-rose-500/40 bg-rose-950/20' : currentAssessment.risk === 'Moderate Risk' ? 'border-amber-500/40 bg-amber-950/20' : 'border-teal-500/30 bg-teal-950/20'}`}><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rule-based estimate • not a diagnosis</span><h2 className="mt-2 text-2xl font-black text-white">{currentAssessment.risk}</h2><p className="mt-1 text-sm text-slate-300">Stress risk score: <strong className="text-white">{currentAssessment.score}/100</strong></p></div><div className="grid h-20 w-20 place-items-center rounded-full border-4 border-teal-300/70 text-xl font-black text-white">{currentAssessment.score}</div></div><div className="mt-6 grid gap-5 md:grid-cols-2"><div><h3 className="text-xs font-bold uppercase text-slate-300">Contributing factors</h3><ul className="mt-2 space-y-2">{currentAssessment.factors.map(factor => <li key={factor} className="flex gap-2 text-xs text-slate-300"><span className="text-teal-300">•</span>{factor}</li>)}</ul></div><div><h3 className="text-xs font-bold uppercase text-slate-300">Recommended next action</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{currentAssessment.action}</p><p className="mt-3 text-xs text-slate-400">Recent trend: {checkIns.length < 2 ? 'More check-ins are needed to show a trend.' : checkIns[0].score > checkIns[1].score ? 'Risk score increased since your prior check-in.' : checkIns[0].score < checkIns[1].score ? 'Risk score decreased since your prior check-in.' : 'Risk score is steady since your prior check-in.'}</p></div></div></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs leading-relaxed text-slate-400">This transparent fallback uses weighted self-reported factors. It is not a trained or validated ML model and cannot determine mental health status. Use the estimate only as a prompt for voluntary self-care or support.</p></div>
        </> : <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center"><Activity className="mx-auto h-8 w-8 text-teal-300" /><p className="mt-3 text-sm font-bold text-white">No check-in yet</p><button type="button" onClick={() => setSection('checkin')} className="mt-3 text-xs font-bold text-teal-300">Start a voluntary check-in</button></div>}
      </div>}

      {section === 'trends' && <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-white">Your wellbeing trends</h2><p className="mt-1 text-xs text-slate-400">Personal history is visible only in this browser session.</p></div><div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1" aria-label="Trend period">{[['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']].map(([key, label]) => <button type="button" key={key} onClick={() => setPeriod(key)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === key ? 'bg-teal-400 text-slate-950' : 'text-slate-400'}`}>{label}</button>)}</div></div><div className="grid gap-4 sm:grid-cols-2">{[['Stress score', 'score', 'bg-rose-400'], ['Sleep quality', 'sleep', 'bg-sky-400'], ['Fatigue', 'fatigue', 'bg-amber-300'], ['Workload', 'workload', 'bg-teal-300']].map(([title, field, color]) => <TrendBars key={field} title={title} records={visibleRecords} field={field} color={color} />)}</div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="text-sm font-bold text-white">Risk-level history</h3>{visibleRecords.length ? <div className="mt-3 flex flex-wrap gap-2">{visibleRecords.map((record, index) => <span key={`${record.timestamp}-${index}`} className={`rounded-lg border px-3 py-2 text-xs ${record.risk === 'High Risk' ? 'border-rose-500/40 text-rose-300' : record.risk === 'Moderate Risk' ? 'border-amber-500/40 text-amber-300' : 'border-teal-500/40 text-teal-300'}`}>{new Date(record.timestamp).toLocaleDateString()} · {record.risk}</span>)}</div> : <p className="mt-3 text-xs text-slate-500">No check-ins in this period.</p>}</div></div>}

      {section === 'support' && <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"><div className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-teal-300" /><h2 className="text-lg font-bold text-white">Welfare support</h2></div><p className="mt-2 text-xs text-slate-400">Choose an option. Requests are private in this demo and not visible as individual records on the authorized dashboard.</p>{!consented ? <div className="mt-5"><ConsentGate onConsent={acceptConsent} /></div> : <form onSubmit={submitSupportRequest} className="mt-5 space-y-4"><label className="block text-xs font-semibold text-slate-300">Support type<select value={supportType} onChange={event => setSupportType(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"><option>Counselling request</option><option>Confidential support request</option><option>Contact welfare officer</option><option>Rest and recovery planning</option></select></label><label className="block text-xs font-semibold text-slate-300">Optional note<textarea rows="3" value={supportNote} onChange={event => setSupportNote(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Share only what is helpful for your request." /></label><button className="rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Send confidential request</button></form>}</div><div className="space-y-4"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><Moon className="h-4 w-4 text-sky-300" />Self-care and recovery</h3><ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300"><li>• Take a protected rest break when operationally possible.</li><li>• Hydrate, eat regularly, and reduce stimulation before sleep.</li><li>• Ask a trusted colleague or supervisor to help rebalance workload.</li><li>• Seek qualified professional support if distress persists.</li></ul></div><div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5"><h3 className="text-sm font-bold text-amber-100">Immediate help</h3><p className="mt-2 text-xs leading-relaxed text-amber-100/80">If you or someone else is in immediate danger, contact local emergency services now. Do not wait for a check-in or dashboard alert.</p><a href="tel:112" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-200 px-3 py-2 text-xs font-black text-slate-950"><Phone className="h-3.5 w-3.5" /> Call 112</a></div>{requests.length > 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="text-sm font-bold text-white">Your requests</h3><ul className="mt-3 space-y-2">{requests.map(request => <li key={request.id} className="flex justify-between gap-3 text-xs text-slate-300"><span>{request.type}</span><span className="text-amber-300">{request.status}</span></li>)}</ul></div>}</div></div>}

      {section === 'welfare' && <div className="space-y-4">
        {!welfareAuthorized ? <form onSubmit={loginWelfare} className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7"><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300"><LockKeyhole className="h-6 w-6" /></div><h2 className="mt-4 text-center text-lg font-bold text-white">Authorized welfare access</h2><p className="mt-1 text-center text-xs text-slate-400">A separate demo role. Personal check-in answers and names are not shown here.</p>{loginError && <p className="mt-4 rounded-lg bg-rose-950/40 p-3 text-xs text-rose-200">{loginError}</p>}<label className="mt-5 block text-xs font-semibold text-slate-300">Role ID<input value={welfareUser} onChange={event => setWelfareUser(event.target.value)} autoComplete="username" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" /></label><label className="mt-3 block text-xs font-semibold text-slate-300">Passcode<input type="password" value={welfarePass} onChange={event => setWelfarePass(event.target.value)} autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" /></label><button className="mt-4 w-full rounded-xl bg-teal-400 px-4 py-3 text-xs font-black text-slate-950">Sign in to welfare dashboard</button><p className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-xs text-slate-400">Demo credentials: <strong className="text-white">welfare</strong> / <strong className="text-white">support2026</strong></p><p className="mt-3 text-[10px] leading-relaxed text-slate-500">This client-side demo gate is not production authentication or role-based security. A real deployment must enforce authorization on a secure backend.</p></form> : <WelfareDashboard pendingRequests={requests.filter(request => request.status === 'Pending').length} sharedRisk={profile.shareAggregate ? latestRecord?.risk : null} onLogout={() => setWelfareAuthorized(false)} />}
      </div>}
    </div>
  );
}

function ConsentGate({ onConsent }) {
  return <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5"><h2 className="text-base font-bold text-white">Consent is required</h2><p className="mt-2 text-xs leading-relaxed text-slate-300">This optional module stores personal and wellbeing information in this browser for demonstration only. No information is collected until you consent and submit a form. You can clear this data at any time from the profile settings.</p><button type="button" onClick={onConsent} className="mt-4 rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Consent and continue</button></div>;
}

function WelfareDashboard({ pendingRequests, sharedRisk, onLogout }) {
  const [showAudit, setShowAudit] = useState(false);
  const audit = readStored(STORAGE_KEYS.audit, []);
  const demoStats = {
    total: 248 + (sharedRisk ? 1 : 0),
    low: 151 + (sharedRisk === 'Low Risk' ? 1 : 0),
    moderate: 72 + (sharedRisk === 'Moderate Risk' ? 1 : 0),
    high: 25 + (sharedRisk === 'High Risk' ? 1 : 0),
    pending: 7 + pendingRequests,
    alerts: 4
  };
  const history = [38, 42, 39, 46, 50, 47, 55, 51, 58, 54, 61, 57];
  return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5"><div><span className="text-[10px] font-bold uppercase text-teal-300">Authorized welfare role</span><h2 className="mt-1 text-xl font-black text-white">Personnel welfare dashboard</h2><p className="mt-1 text-xs text-slate-400">Synthetic demonstration aggregates only. No personnel names, IDs, contacts, or individual answers are displayed.</p></div><button type="button" onClick={onLogout} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300">Sign out</button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"><Stat label="Registered personnel" value={demoStats.total} icon={Users} /><Stat label="Low risk" value={demoStats.low} tone="text-teal-300" /><Stat label="Moderate risk" value={demoStats.moderate} tone="text-amber-300" /><Stat label="High risk" value={demoStats.high} tone="text-rose-300" /><Stat label="Pending requests" value={demoStats.pending} tone="text-cyan-300" /><Stat label="Alerts to review" value={demoStats.alerts} tone="text-amber-300" icon={AlertTriangle} /></div><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white">Aggregate risk trend</h3><span className="text-[10px] text-slate-500">Illustrative sample</span></div><div className="mt-5 flex h-36 items-end gap-2" aria-label="Synthetic aggregate risk trend">{history.map((value, index) => <div key={index} title={`Period ${index + 1}: ${value}`} className="flex-1 rounded-t bg-gradient-to-t from-teal-700 to-teal-300" style={{ height: `${value}%` }} />)}</div><div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>12 periods ago</span><span>Current</span></div></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="text-sm font-bold text-white">Alerts requiring attention</h3><div className="mt-3 space-y-3"><div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" /><p className="text-xs text-amber-100">4 anonymous aggregate patterns may benefit from voluntary follow-up.</p></div><div className="flex gap-3 rounded-xl border border-teal-500/20 bg-teal-950/20 p-3"><BadgeCheck className="h-4 w-4 shrink-0 text-teal-300" /><p className="text-xs text-teal-100">No individual is automatically labelled or escalated by this demo.</p></div><p className="text-[10px] leading-relaxed text-slate-500">Support requests are counted, not opened or attributed to an individual. Synthetic dashboard values are not live operational data.</p></div></div></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-white">Audit-friendly activity log</h3><p className="mt-1 text-xs text-slate-400">Local demo events only; no wellbeing answers are included.</p></div><button type="button" onClick={() => setShowAudit(value => !value)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300">{showAudit ? 'Hide log' : 'View log'}</button></div>{showAudit && <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">{audit.length ? audit.map((entry, index) => <div key={`${entry.timestamp}-${index}`} className="flex justify-between gap-3 border-t border-slate-800 pt-2 text-[10px] text-slate-400"><span>{entry.action}</span><time>{new Date(entry.timestamp).toLocaleString()}</time></div>) : <p className="pt-3 text-xs text-slate-500">No local activity events yet.</p>}</div>}</div></div>;
}