import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, BarChart3, Check, ChevronRight,
  ClipboardCheck, Clock3, HeartHandshake, LockKeyhole, Moon, Phone,
  ShieldCheck, Sparkles, Users
} from 'lucide-react';

const STORAGE_KEYS = {
  consent: 'aarogya_wellness_consent',
  profile: 'aarogya_wellness_profile',
  checkIns: 'aarogya_wellness_checkins',
  requests: 'aarogya_wellness_requests',
  audit: 'aarogya_wellness_audit',
  alerts: 'aarogya_wellness_alerts'
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
  personnelId: '',
  name: '',
  age: '',
  department: '',
  rank: '',
  yearsOfService: '',
  dutyLocation: '',
  deploymentHistory: '',
  currentDeploymentDuration: '',
  dutySchedule: '08:00-16:00',
  shiftType: 'Day',
  nightDutyFrequency: '',
  overtimeExtendedDuty: '',
  leavePattern: '',
  transferFrequency: '',
  trainingCommitments: '',
  workloadLevel: 'Moderate',
  shareAggregate: false,
  consentStatus: 'Voluntary'
};

const initialCheckIn = {
  stress: 3,
  sleep: 3,
  fatigue: 3,
  workload: 3,
  mood: 3,
  anxiety: 3,
  exhaustion: 3,
  overtime: 1,
  nightDuty: 1,
  balance: 3
};

const profileFields = [
  ['personnelId', 'Personnel ID (optional)', 'text'],
  ['name', 'Name (optional)', 'text'],
  ['age', 'Age (optional)', 'number'],
  ['department', 'Department / Force (optional)', 'text'],
  ['rank', 'Rank / Role (optional)', 'text'],
  ['yearsOfService', 'Years of service (optional)', 'number'],
  ['dutyLocation', 'Duty location (optional)', 'text'],
  ['deploymentHistory', 'Deployment history (optional)', 'text'],
  ['currentDeploymentDuration', 'Current deployment duration (days) (optional)', 'number'],
  ['dutySchedule', 'Duty schedule (optional)', 'text'],
  ['nightDutyFrequency', 'Night duty frequency (optional)', 'number'],
  ['overtimeExtendedDuty', 'Overtime / extended duty (optional)', 'number'],
  ['leavePattern', 'Leave pattern (optional)', 'text'],
  ['transferFrequency', 'Transfer frequency (optional)', 'number'],
  ['trainingCommitments', 'Training commitments (optional)', 'text'],
  ['workloadLevel', 'Workload level (optional)', 'select']
];

const questions = [
  { key: 'stress', label: 'How stressful has work felt?', low: 'Low', high: 'Very high' },
  { key: 'sleep', label: 'How restorative was your sleep?', low: 'Poor', high: 'Very good', reverse: true },
  { key: 'fatigue', label: 'How fatigued do you feel?', low: 'Not fatigued', high: 'Very fatigued' },
  { key: 'workload', label: 'How manageable is your workload?', low: 'Manageable', high: 'Overwhelming' },
  { key: 'mood', label: 'How has your mood been?', low: 'Very low', high: 'Positive', reverse: true },
  { key: 'anxiety', label: 'How much worry or tension have you felt?', low: 'Very little', high: 'A lot' },
  { key: 'exhaustion', label: 'How physically exhausted do you feel?', low: 'Not exhausted', high: 'Very exhausted' },
  { key: 'balance', label: 'How is your work-life balance?', low: 'Very difficult', high: 'Good', reverse: true },
  { key: 'nightDuty', label: 'How often have recent duty patterns included night shifts?', low: 'Rarely', high: 'Very often' },
  { key: 'overtime', label: 'How much overtime or extended duty have you had recently?', low: 'Minimal', high: 'Very high' }
];

const getRiskBand = (score) => {
  if (score < 35) return 'Low Risk';
  if (score < 65) return 'Moderate Risk';
  return 'High Risk';
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function assessRisk(values, profile = {}) {
  const nightDuty = Number(profile.nightDutyFrequency || values.nightDuty || 0);
  const overtime = Number(profile.overtimeExtendedDuty || values.overtime || 0);
  const deploymentDays = Number(profile.currentDeploymentDuration || 0);
  const leaveGap = Number(profile.leavePattern || 0);
  const transferFrequency = Number(profile.transferFrequency || 0);
  const workloadLevel = Number(profile.workloadLevel === 'High' ? 5 : profile.workloadLevel === 'Moderate' ? 3 : profile.workloadLevel === 'Low' ? 2 : 1) || 3;

  const stressRisk = clamp(18 + ((Number(values.stress) || 3) - 1) * 18 + ((Number(values.workload) || 3) - 1) * 14 + ((Number(values.anxiety) || 3) - 1) * 16 + (nightDuty >= 3 ? 10 : 0), 0, 100);
  const burnoutRisk = clamp(16 + ((Number(values.fatigue) || 3) - 1) * 20 + ((Number(values.sleep) || 3) - 1) * 12 + ((Number(values.exhaustion) || 3) - 1) * 12 + (overtime >= 2 ? 14 : 0) + (deploymentDays > 120 ? 12 : deploymentDays > 60 ? 8 : 0), 0, 100);
  const fatigueRisk = clamp(20 + ((Number(values.fatigue) || 3) - 1) * 17 + ((Number(values.sleep) || 3) - 1) * 15 + ((Number(values.exhaustion) || 3) - 1) * 13 + (nightDuty >= 2 ? 12 : 0), 0, 100);
  const sleepRisk = clamp(18 + (6 - (Number(values.sleep) || 3)) * 18 + ((Number(values.stress) || 3) - 1) * 12 + (nightDuty >= 2 ? 12 : 0) + (leaveGap >= 2 ? 12 : 0), 0, 100);
  const workloadRisk = clamp(16 + ((Number(values.workload) || 3) - 1) * 22 + (workloadLevel >= 4 ? 18 : workloadLevel >= 3 ? 10 : 0) + (overtime >= 3 ? 14 : 0) + (transferFrequency >= 2 ? 8 : 0), 0, 100);

  const score = Math.round((stressRisk + burnoutRisk + fatigueRisk + sleepRisk + workloadRisk) / 5);

  const factors = [];
  if ((Number(values.stress) || 3) >= 4) factors.push('High stress');
  if ((Number(values.sleep) || 3) <= 2) factors.push('Poor sleep');
  if ((Number(values.fatigue) || 3) >= 4 || (Number(values.exhaustion) || 3) >= 4) factors.push('High fatigue');
  if ((Number(values.workload) || 3) >= 4) factors.push('High workload');
  if ((Number(values.nightDuty) || 1) >= 3 || nightDuty >= 3) factors.push('Frequent night shifts');
  if ((Number(values.overtime) || 1) >= 3 || overtime >= 2) factors.push('Extended duty or overtime');
  if (deploymentDays > 90) factors.push('Long deployment duration');
  if (leaveGap >= 2) factors.push('Leave gaps');
  if (transferFrequency >= 2) factors.push('Transfer frequency');
  if ((Number(values.mood) || 3) <= 2) factors.push('Moody or low morale');
  if (!factors.length) factors.push('No single elevated factor stood out in this check-in');

  const risk = getRiskBand(score);
  const recommendations = [];
  if (sleepRisk >= 60) recommendations.push('Sleep recovery');
  if (workloadRisk >= 60) recommendations.push('Workload review');
  if (stressRisk >= 60) recommendations.push('Short recovery break');
  if (fatigueRisk >= 60) recommendations.push('Breathing and relaxation exercise');
  if (overtime >= 2 || nightDuty >= 3) recommendations.push('Shift adjustment discussion');
  if (risk === 'High Risk') recommendations.push('Counselling');
  if (risk === 'High Risk' || fatigueRisk >= 75 || sleepRisk >= 75) recommendations.push('Welfare officer support');
  if (risk === 'High Risk' && recommendations.length > 0) recommendations.push('Healthcare professional support');
  if (!recommendations.length) recommendations.push('Continue current recovery habits and review after the next duty cycle');

  const earlyWarning = risk === 'High Risk' || stressRisk >= 70 || fatigueRisk >= 70 || sleepRisk >= 70 || workloadRisk >= 70;

  return {
    score,
    risk,
    factors,
    recommendations: recommendations.slice(0, 5),
    earlyWarning,
    subRisks: {
      stressRisk: Math.round(stressRisk),
      burnoutRisk: Math.round(burnoutRisk),
      fatigueRisk: Math.round(fatigueRisk),
      sleepRisk: Math.round(sleepRisk),
      workloadRisk: Math.round(workloadRisk)
    },
    explanation: 'This is a preventive welfare-support assessment and not a medical diagnosis.'
  };
}

function buildAlerts(checkIns, assessment) {
  if (!checkIns.length) return [];
  const alerts = [];
  const latest = checkIns[0];
  const highRiskCount = checkIns.filter((entry) => entry.risk === 'High Risk').length;
  const risingStress = checkIns.length >= 2 && checkIns[0].values.stress >= checkIns[1].values.stress + 1;
  const fatigueHigh = latest.values.fatigue >= 4 || latest.values.exhaustion >= 4;
  const sleepDecline = checkIns.length >= 2 && checkIns[0].values.sleep <= checkIns[1].values.sleep - 1;
  const heavyWorkload = latest.values.workload >= 4 || latest.values.overtime >= 3;
  const multiFactor = assessment && Object.values(assessment.subRisks).filter((value) => value >= 70).length >= 2;

  if (highRiskCount >= 2) {
    alerts.push({
      level: 'High',
      reason: 'Risk remained high for multiple check-ins',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Arrange welfare review and a short recovery plan',
      status: 'New'
    });
  }

  if (risingStress) {
    alerts.push({
      level: 'Moderate',
      reason: 'Stress is continuously increasing',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Offer counselling and stress-relief support',
      status: 'In Review'
    });
  }

  if (fatigueHigh) {
    alerts.push({
      level: 'Moderate',
      reason: 'Fatigue remains high',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Recommend rest, hydration, and a reduced duty load where feasible',
      status: 'Support Provided'
    });
  }

  if (sleepDecline) {
    alerts.push({
      level: 'High',
      reason: 'Sleep quality continuously decreases',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Review shift pattern and recovery support',
      status: 'New'
    });
  }

  if (heavyWorkload) {
    alerts.push({
      level: 'Moderate',
      reason: 'Workload remains excessive',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Schedule a workload review and discuss rest allocation',
      status: 'In Review'
    });
  }

  if (multiFactor) {
    alerts.push({
      level: 'High',
      reason: 'Multiple risk factors occurred together',
      dateTime: new Date(latest.timestamp).toLocaleString(),
      recommendedAction: 'Escalate to authorised welfare support and review duty management',
      status: 'New'
    });
  }

  return alerts.slice(0, 6);
}

function buildRecoveryPlan(values, assessment, recentRiskCount = 0) {
  const immediate = [
    { title: '2–5 minute breathing exercise', detail: 'Practice box breathing: inhale for 4, hold for 4, exhale for 6, repeat slowly.' },
    { title: 'Guided relaxation', detail: 'Take a brief sensory break with reduced screen and noise exposure.' },
    { title: 'Hydration reminder', detail: 'Drink water and pause before the next duty block.' },
    { title: 'Stretching and movement', detail: 'Do a short shoulder, neck, and lower-back reset to reduce physical fatigue.' },
    { title: 'Quiet rest break', detail: 'Take a short protected break when operations allow.' },
    { title: 'Mindfulness reset', detail: 'Focus on one breath, one sound, and one sensation to settle the nervous system.' }
  ];

  const sleepSupport = [
    'Track your sleep duration and aim for a consistent sleep schedule after night shifts.',
    'Protect a short recovery window before the next duty cycle when possible.',
    'Use a dark, quiet, and low-stimulation sleep environment to support recovery.',
    'Reduce unnecessary late-night disruption after extended duty or overtime.'
  ];

  const workloadSupport = [
    'Check whether your current workload is sustainable over the next several duty cycles.',
    'Take short breaks during prolonged duty when operationally possible.',
    'Discuss workload concerns with an authorized welfare officer if stress remains elevated.',
    'Reduce unnecessary overtime stacking when your recovery needs are high.'
  ];

  const personalized = [];
  if ((values.sleep || 3) <= 2) personalized.push('Improve sleep by protecting a regular sleep schedule and reducing late-night disruption.');
  if ((values.workload || 3) >= 4 || (values.overtime || 1) >= 3) personalized.push('Reduce unnecessary workload where possible and review shift intensity with a welfare officer.');
  if ((values.stress || 3) >= 4 || (values.anxiety || 3) >= 4) personalized.push('Use guided breathing and take a short recovery break before the next duty block.');
  if ((values.fatigue || 3) >= 4 || (values.exhaustion || 3) >= 4) personalized.push('Focus on recovery, hydration, and reduced exertion until your fatigue improves.');
  if ((values.balance || 3) <= 2 || (values.mood || 3) <= 2) personalized.push('Speak with a welfare officer or counsellor for confidential support and practical recovery guidance.');
  if (assessment?.risk === 'High Risk' || recentRiskCount >= 2) personalized.push('Seek professional medical or wellbeing support when appropriate and do not ignore continued strain.');
  if (!personalized.length) personalized.push('Continue your current recovery habits and review after a few duty cycles.');

  return {
    immediate,
    sleepSupport,
    workloadSupport,
    personalized,
    escalation: assessment?.risk === 'High Risk' || recentRiskCount >= 2,
    note: 'This is a preventive welfare-support assessment and not a medical diagnosis.'
  };
}

function buildSupportRecommendations(checkIns, profile, immediateHelpRequested = false, requestedSupportType = null) {
  const latest = checkIns[0]?.values;
  const previous = checkIns[1]?.values;
  const recent = checkIns.slice(0, 3).map((record) => record.values);
  const requestedCounselling = ['Counselling request', 'Confidential support request'].includes(requestedSupportType);
  const requestedHealthcare = requestedSupportType === 'Healthcare professional consultation';
  const requestedWelfare = ['Contact welfare officer', 'Workload review'].includes(requestedSupportType);
  const requestedRecovery = requestedSupportType === 'Rest and recovery planning';
  const showEmergency = immediateHelpRequested || requestedSupportType === 'Emergency support';

  if (!latest && !requestedSupportType && !showEmergency) return [];

  const highStress = Number(latest?.stress) >= 4;
  const moderateStress = Number(latest?.stress) === 3;
  const elevatedAnxiety = Number(latest?.anxiety) >= 4;
  const lowMood = recent.length >= 2 && recent.slice(0, 2).every((entry) => Number(entry.mood) <= 2);
  const repeatedStress = recent.length >= 2 && recent.slice(0, 2).every((entry) => Number(entry.stress) >= 3);
  const highFatigue = Number(latest?.fatigue) >= 4;
  const highExhaustion = Number(latest?.exhaustion) >= 4;
  const persistentPoorSleep = recent.length >= 2 && recent.slice(0, 2).every((entry) => Number(entry.sleep) <= 2);
  const recoveryNotImproving = Boolean(previous && (
    (Number(latest.sleep) <= 2 && Number(latest.sleep) <= Number(previous.sleep)) ||
    (Number(latest.fatigue) >= 3 && Number(latest.fatigue) >= Number(previous.fatigue))
  ));
  const highWorkload = Number(latest?.workload) >= 4 || profile.workloadLevel === 'High' || profile.workloadLevel === 'Very High';
  const excessiveOvertime = Number(latest?.overtime) >= 4 || Number(profile.overtimeExtendedDuty) >= 2;
  const repeatedNightDuty = Number(latest?.nightDuty) >= 4 || Number(profile.nightDutyFrequency) >= 3 || (
    recent.length >= 2 && recent.slice(0, 2).every((entry) => Number(entry.nightDuty) >= 3)
  );
  const deploymentPressure = Number(profile.currentDeploymentDuration) > 90;
  const poorSleep = Number(latest?.sleep) <= 2;
  const moderateFatigue = Number(latest?.fatigue) >= 3;
  const workloadElevated = Number(latest?.workload) >= 3;
  const recoveryDeclining = Boolean(previous && (
    Number(latest.sleep) < Number(previous.sleep) || Number(latest.fatigue) > Number(previous.fatigue)
  ));

  const recommendations = [];
  if (showEmergency) {
    recommendations.push({
      id: 'emergency',
      title: 'Emergency Support',
      supportType: 'Emergency support',
      status: 'Immediate',
      message: 'Emergency support was explicitly selected. If you may be in immediate danger, contact local emergency services now.',
      explanation: 'you explicitly requested immediate help'
    });
  }

  if (highFatigue || highExhaustion || persistentPoorSleep || recoveryNotImproving || requestedHealthcare) {
    const reason = highFatigue ? 'high fatigue was reported'
      : highExhaustion ? 'physical exhaustion was reported'
        : persistentPoorSleep ? 'poor sleep has continued across multiple check-ins'
          : recoveryNotImproving ? 'recovery has not improved across repeated check-ins'
            : 'you requested healthcare support';
    recommendations.push({
      id: 'healthcare',
      title: 'Medical / Healthcare Support',
      supportType: 'Healthcare professional consultation',
      status: highFatigue || highExhaustion || persistentPoorSleep || recoveryNotImproving ? 'Recommended' : 'Available Support',
      message: 'Healthcare consultation is recommended for persistent physical or wellbeing concerns.',
      explanation: `healthcare support is suggested because ${reason}`
    });
  }

  if (highStress || moderateStress || elevatedAnxiety || lowMood || repeatedStress || requestedCounselling) {
    const reason = repeatedStress ? 'your stress level has remained elevated across multiple check-ins'
      : highStress ? 'your stress level is high'
        : moderateStress ? 'your stress level is moderate'
          : lowMood ? 'low mood has been reported across multiple check-ins'
            : elevatedAnxiety ? 'elevated worry was reported'
              : 'you requested emotional support';
    recommendations.push({
      id: 'counselling',
      title: 'Counselling Support',
      supportType: 'Counselling request',
      status: highStress || elevatedAnxiety || lowMood || repeatedStress ? 'Recommended' : 'Suggested',
      message: 'Counselling support is recommended to help manage ongoing stress and emotional fatigue.',
      explanation: `counselling support is recommended because ${reason}`
    });
  }

  if (highWorkload || excessiveOvertime || repeatedNightDuty || deploymentPressure || requestedWelfare) {
    const reason = highWorkload ? 'workload is elevated'
      : excessiveOvertime ? 'overtime or extended duty is elevated'
        : repeatedNightDuty ? 'night-duty patterns are elevated'
          : deploymentPressure ? 'deployment duration is extended'
            : 'you requested workplace or welfare assistance';
    recommendations.push({
      id: 'welfare',
      title: 'Welfare Officer Support',
      supportType: 'Contact welfare officer',
      status: highWorkload || excessiveOvertime || repeatedNightDuty || deploymentPressure ? 'Recommended' : 'Available Support',
      message: 'Contacting a Welfare Officer is recommended for workload, duty or welfare-related support.',
      explanation: `Welfare Officer support is recommended because ${reason}`
    });
  }

  if (moderateFatigue || poorSleep || workloadElevated || recoveryDeclining || requestedRecovery) {
    const reason = recoveryDeclining ? 'recovery indicators are declining'
      : poorSleep ? 'poor sleep was reported'
        : moderateFatigue ? 'fatigue is elevated'
          : workloadElevated ? 'workload is temporarily elevated'
            : 'you requested a recovery plan';
    recommendations.push({
      id: 'recovery',
      title: 'Rest & Recovery',
      supportType: 'Rest and recovery planning',
      status: recoveryDeclining || poorSleep || moderateFatigue ? 'Suggested' : 'Available Support',
      message: 'Rest and recovery planning is recommended based on your current wellbeing indicators.',
      explanation: `rest and recovery planning is recommended because ${reason}`
    });
  }

  return recommendations;
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
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="py-8 text-center text-xs text-slate-500">Complete a check-in to see your trend.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <div className="mt-5 flex h-28 items-end gap-2" role="img" aria-label={`${title} across ${points.length} check-ins`}>
        {points.map((record, index) => {
          const value = field === 'score'
            ? record.score
            : clamp(((record.values[field] || 3) / 5) * 100, 8, 100);
          return (
            <div
              key={`${record.timestamp}-${index}`}
              title={`${new Date(record.timestamp).toLocaleDateString()}: ${Math.round(value)}`}
              className={`min-w-2 flex-1 rounded-t ${color}`}
              style={{ height: `${Math.max(8, value)}%` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>Earlier</span><span>Most recent</span></div>
    </div>
  );
}

function ConsentGate({ onConsent }) {
  return (
    <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5">
      <h2 className="text-base font-bold text-white">Consent is required</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">This optional module stores personal and wellbeing information in this browser for demonstration only. No information is collected until you consent and submit a form. You can clear this data at any time.</p>
      <button type="button" onClick={onConsent} className="mt-4 rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Consent and continue</button>
    </div>
  );
}

function WelfareDashboard({ pendingRequests, sharedRisk, onLogout, role = 'Welfare Officer' }) {
  const [showAudit, setShowAudit] = useState(false);
  const audit = readStored(STORAGE_KEYS.audit, []);
  const alerts = buildAlerts(readStored(STORAGE_KEYS.checkIns, []), { subRisks: { stressRisk: 68, burnoutRisk: 62, fatigueRisk: 58, sleepRisk: 73, workloadRisk: 71 } });

  const demoStats = {
    total: 248 + (sharedRisk ? 1 : 0),
    low: 151 + (sharedRisk === 'Low Risk' ? 1 : 0),
    moderate: 72 + (sharedRisk === 'Moderate Risk' ? 1 : 0),
    high: 25 + (sharedRisk === 'High Risk' ? 1 : 0),
    pending: 7 + pendingRequests,
    alerts: alerts.length || 4
  };

  const history = [38, 42, 39, 46, 50, 47, 55, 51, 58, 54, 61, 57];

  const filterOptions = [
    ['Department', 'All departments'],
    ['Rank', 'All ranks'],
    ['Location', 'All locations'],
    ['Risk level', 'All risk levels'],
    ['Date range', 'Last 30 days'],
    ['Shift type', 'All shifts']
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <span className="text-[10px] font-bold uppercase text-teal-300">Authorized welfare role</span>
          <h2 className="mt-1 text-xl font-black text-white">Personnel welfare dashboard</h2>
          <p className="mt-1 text-xs text-slate-400">Anonymous aggregate analytics only. Names, IDs, and personal contact details are not displayed.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[10px] font-bold text-teal-200">{role}</span>
          <button type="button" onClick={onLogout} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300">Sign out</button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Stat label="Participating personnel" value={demoStats.total} icon={Users} />
        <Stat label="Low risk" value={demoStats.low} tone="text-teal-300" />
        <Stat label="Moderate risk" value={demoStats.moderate} tone="text-amber-300" />
        <Stat label="High risk" value={demoStats.high} tone="text-rose-300" />
        <Stat label="Pending support requests" value={demoStats.pending} tone="text-cyan-300" />
        <Stat label="Active alerts" value={demoStats.alerts} tone="text-amber-300" icon={AlertTriangle} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Filters</h3>
          <span className="text-[10px] text-slate-500">Aggregate anonymized view</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filterOptions.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
              <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</div>
              <div className="mt-2 font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Aggregate risk trend</h3>
            <span className="text-[10px] text-slate-500">Illustrative sample</span>
          </div>
          <div className="mt-5 flex h-36 items-end gap-2" aria-label="Synthetic aggregate risk trend">
            {history.map((value, index) => (
              <div key={index} title={`Period ${index + 1}: ${value}`} className="flex-1 rounded-t bg-gradient-to-t from-teal-700 to-teal-300" style={{ height: `${value}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>12 periods ago</span><span>Current</span></div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Risk distribution</h3>
            <span className="text-[10px] text-slate-500">Anonymized</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['Low risk', demoStats.low, 'bg-teal-400'],
              ['Moderate risk', demoStats.moderate, 'bg-amber-400'],
              ['High risk', demoStats.high, 'bg-rose-400']
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-[10px] text-slate-400"><span>{label}</span><span>{value}</span></div>
                <div className="h-2.5 rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / Math.max(demoStats.total, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Stress trends" value="Stable" tone="text-rose-300" icon={Activity} />
        <Stat label="Burnout trends" value="Elevated" tone="text-amber-300" icon={AlertTriangle} />
        <Stat label="Fatigue trends" value="Moderate" tone="text-yellow-300" icon={Clock3} />
        <Stat label="Workload trends" value="High" tone="text-cyan-300" icon={BarChart3} />
        <Stat label="Intervention status" value="Track" tone="text-teal-300" icon={ShieldCheck} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Active alert queue</h3>
          <button type="button" onClick={() => setShowAudit((value) => !value)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300">{showAudit ? 'Hide audit trail' : 'View audit'}</button>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((alert, index) => (
            <div key={`${alert.reason}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${alert.level === 'High' ? 'bg-rose-500/15 text-rose-200' : 'bg-amber-500/15 text-amber-200'}`}>{alert.level}</span>
                <span className="text-[10px] text-slate-500">{alert.status}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{alert.reason}</p>
              <p className="mt-1 text-[10px] text-slate-400">{alert.dateTime}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-300">Recommended action: {alert.recommendedAction}</p>
            </div>
          ))}
        </div>

        {showAudit && (
          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
            {audit.length ? audit.map((entry, index) => (
              <div key={`${entry.timestamp}-${index}`} className="flex justify-between gap-3 border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                <span>{entry.action}</span>
                <time>{new Date(entry.timestamp).toLocaleString()}</time>
              </div>
            )) : <p className="pt-3 text-xs text-slate-500">No local audit events yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function storeAudit(action) {
  const entries = readStored(STORAGE_KEYS.audit, []);
  entries.unshift({ action, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify(entries.slice(0, 100)));
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
  const [supportType, setSupportType] = useState(() => {
    const recommendations = buildSupportRecommendations(
      readStored(STORAGE_KEYS.checkIns, []),
      readStored(STORAGE_KEYS.profile, initialProfile)
    );
    return recommendations[0]?.supportType || 'Rest and recovery planning';
  });
  const [requestedSupportType, setRequestedSupportType] = useState(null);
  const [immediateHelpRequested, setImmediateHelpRequested] = useState(false);
  const [supportNote, setSupportNote] = useState('');
  const [welfareUser, setWelfareUser] = useState('');
  const [welfarePass, setWelfarePass] = useState('');
  const [welfareAuthorized, setWelfareAuthorized] = useState(false);
  const [welfareRole, setWelfareRole] = useState('Welfare Officer');
  const [loginError, setLoginError] = useState('');

  const visibleRecords = useMemo(() => {
    const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return checkIns.filter((record) => new Date(record.timestamp).getTime() >= cutoff);
  }, [checkIns, period]);

  const latestRecord = checkIns[0];
  const currentAssessment = latestAssessment || (latestRecord && { ...latestRecord, action: assessRisk(latestRecord.values, profile).recommendations[0] });
  const recentHighRisk = checkIns.slice(0, 3).filter((record) => record.risk === 'High Risk').length >= 2;
  const alerts = useMemo(() => buildAlerts(checkIns, currentAssessment || { subRisks: { stressRisk: 0, burnoutRisk: 0, fatigueRisk: 0, sleepRisk: 0, workloadRisk: 0 } }), [checkIns, currentAssessment]);
  const recoveryPlan = useMemo(() => buildRecoveryPlan(values, currentAssessment, checkIns.filter((record) => record.risk === 'High Risk').length), [values, currentAssessment, checkIns]);
  const supportRecommendations = useMemo(
    () => buildSupportRecommendations(checkIns, profile, immediateHelpRequested, requestedSupportType),
    [checkIns, profile, immediateHelpRequested, requestedSupportType]
  );

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
    const assessment = assessRisk(values, profile);
    const record = { ...assessment, values: { ...values }, timestamp: new Date().toISOString() };
    const updated = [record, ...checkIns].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.checkIns, JSON.stringify(updated));
    setCheckIns(updated);
    setLatestAssessment(record);
    const nextSupport = buildSupportRecommendations(updated, profile)[0];
    setSupportType(nextSupport?.supportType || 'Rest and recovery planning');
    setRequestedSupportType(null);
    setImmediateHelpRequested(false);
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
    const creds = {
      personnel: 'wellness2026',
      welfare: 'support2026',
      commander: 'ops2026',
      admin: 'admin2026',
      superadmin: 'admin2026'
    };

    const normalizedUser = welfareUser.trim().toLowerCase();
    const pass = creds[normalizedUser];
    if (pass && welfarePass === pass) {
      const roleMap = {
        personnel: 'Personnel',
        welfare: 'Welfare Officer',
        commander: 'Authorized Commander/Admin',
        admin: 'Super Admin',
        superadmin: 'Super Admin'
      };

      setWelfareRole(roleMap[normalizedUser] || 'Welfare Officer');
      setWelfareAuthorized(true);
      setLoginError('');
      storeAudit('welfare_demo_role_authenticated');
      return;
    }

    setLoginError('Demo access not recognized. Use one of the authorized demo credentials shown below.');
  };

  const revokeConsent = () => {
    for (const key of [STORAGE_KEYS.consent, STORAGE_KEYS.profile, STORAGE_KEYS.checkIns, STORAGE_KEYS.requests, STORAGE_KEYS.audit, STORAGE_KEYS.alerts]) {
      localStorage.removeItem(key);
    }
    setConsented(false);
    setProfile(initialProfile);
    setCheckIns([]);
    setRequests([]);
    setLatestAssessment(null);
    setSection('overview');
    storeAudit('consent_revoked_and_local_data_cleared');
  };

  const tabs = [
    ['overview', 'Overview', Activity],
    ['profile', 'Personnel profile', Users],
    ['checkin', 'Wellbeing check-in', ClipboardCheck],
    ['analytics', 'Duty analytics', BarChart3],
    ['prediction', 'Behavioral analytics', Sparkles],
    ['support', 'Support & recovery', HeartHandshake],
    ['trends', 'Progress tracking', Activity],
    ['welfare', 'Authorized dashboard', ShieldCheck]
  ];

  const selectSupportRequest = (type, note = '') => {
    setSupportType(type);
    setRequestedSupportType(type);
    setImmediateHelpRequested(type === 'Emergency support');
    setSupportNote(note || `Support requested: ${type}. Please contact the relevant officer for guidance and follow-up.`);
  };

  const trendMetrics = [
    { label: 'Deployment duration', value: profile.currentDeploymentDuration || 'Not set', color: 'bg-teal-400' },
    { label: 'Night duty frequency', value: profile.nightDutyFrequency || 'Not set', color: 'bg-sky-400' },
    { label: 'Overtime / extended duty', value: profile.overtimeExtendedDuty || 'Not set', color: 'bg-amber-400' },
    { label: 'Leave pattern', value: profile.leavePattern || 'Not set', color: 'bg-violet-400' },
    { label: 'Transfer frequency', value: profile.transferFrequency || 'Not set', color: 'bg-rose-400' },
    { label: 'Training commitments', value: profile.trainingCommitments || 'Not set', color: 'bg-emerald-400' }
  ];

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-300"><ShieldCheck className="h-4 w-4" /> PERSONNEL WELLNESS</div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Stress & Welfare Monitoring</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Private, voluntary check-ins, duty analytics, and supportive welfare guidance for personnel.</p>
        </div>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white md:self-center"><ArrowLeft className="h-4 w-4" /> AarogyaConnect</button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-2" role="tablist" aria-label="Personnel wellness sections">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={section === id} onClick={() => setSection(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${section === id ? 'bg-teal-400 text-slate-950' : 'border border-slate-800 bg-slate-900 text-slate-300 hover:text-white'}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4 text-xs text-cyan-100">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
        <p><strong>Privacy notice:</strong> This demonstration stores information only in this browser. It is designed for preventive welfare support, not disciplinary action. Transparent rule-based risk scoring is used and not medical diagnosis. A real deployment should use secure storage, strong authorization, and role-based access.</p>
      </div>

      {section === 'overview' && (
        <div className="space-y-5">
          {recentHighRisk && (
            <div className="flex gap-3 rounded-2xl border border-amber-500/50 bg-amber-950/30 p-4 text-amber-100">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <p className="text-sm font-bold">Early support reminder</p>
                <p className="mt-1 text-xs text-amber-100/80">Recent check-ins show repeated high-risk scores. Consider rest and recovery, confidential counselling, or contacting an authorized welfare officer. This is not a diagnosis or personnel label.</p>
                <button type="button" onClick={() => setSection('support')} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-200">View support options <ChevronRight className="h-3 w-3" /></button>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Latest stress risk" value={currentAssessment?.risk || 'Not assessed'} tone={currentAssessment?.risk === 'High Risk' ? 'text-rose-300' : currentAssessment?.risk === 'Moderate Risk' ? 'text-amber-300' : 'text-teal-300'} icon={Activity} />
            <Stat label="Latest score" value={currentAssessment ? `${currentAssessment.score}/100` : '--'} tone="text-white" icon={BarChart3} />
            <Stat label="Support requests" value={requests.filter((request) => request.status === 'Pending').length} tone="text-cyan-300" icon={HeartHandshake} />
          </div>

          {!consented ? (
            <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5 sm:p-7">
              <h2 className="text-lg font-bold text-white">Your wellbeing data stays voluntary</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">Before collecting any profile or wellbeing information, review and accept the privacy notice. You can withdraw consent at any time; doing so clears this module&apos;s locally stored profile, check-ins, and support requests.</p>
              <button type="button" onClick={acceptConsent} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300"><Check className="h-4 w-4" /> I consent to voluntary local demo storage</button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <button type="button" onClick={() => setSection('checkin')} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left hover:border-teal-500/50"><span><span className="block text-sm font-bold text-white">Start a check-in</span><span className="mt-1 block text-xs text-slate-400">A few quick questions, saved only after submit.</span></span><ChevronRight className="h-5 w-5 text-teal-300" /></button>
              <button type="button" onClick={() => setSection('support')} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left hover:border-teal-500/50"><span><span className="block text-sm font-bold text-white">Find confidential support</span><span className="mt-1 block text-xs text-slate-400">Counselling, recovery resources, and help contacts.</span></span><ChevronRight className="h-5 w-5 text-teal-300" /></button>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-bold text-white">A supportive tool, not a diagnosis</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">Risk bands summarize self-reported work and wellbeing factors to help guide optional support. They must not be used for fitness-for-duty, promotion, discipline, or clinical decisions.</p>
          </div>
        </div>
      )}

      {section === 'profile' && (
        <div className="space-y-4">
          {!consented ? (
            <ConsentGate onConsent={acceptConsent} />
          ) : (
            <form onSubmit={saveProfile} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Personnel duty & workload profile</h2>
                <p className="mt-1 text-xs text-slate-400">All fields below are optional and marked sensitive only where relevant. They are used only to support welfare planning and risk analysis for this demo.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profileFields.map(([key, label, type]) => {
                  if (type === 'select') {
                    return (
                      <label key={key} className="text-xs font-semibold text-slate-300">
                        {label}
                        <select value={profile[key]} onChange={(event) => setProfile((previous) => ({ ...previous, [key]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white">
                          <option>Low</option>
                          <option>Moderate</option>
                          <option>High</option>
                          <option>Very High</option>
                        </select>
                      </label>
                    );
                  }

                  return (
                    <label key={key} className="text-xs font-semibold text-slate-300">
                      {label}
                      <input type={type} value={profile[key]} onChange={(event) => setProfile((previous) => ({ ...previous, [key]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" />
                    </label>
                  );
                })}

                <label className="text-xs font-semibold text-slate-300 sm:col-span-2 lg:col-span-3">
                  <span>Shift type</span>
                  <select value={profile.shiftType} onChange={(event) => setProfile((previous) => ({ ...previous, shiftType: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white">
                    <option>Day</option>
                    <option>Night</option>
                    <option>Rotating</option>
                    <option>On call</option>
                  </select>
                </label>
              </div>

              <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                <input type="checkbox" checked={profile.shareAggregate} onChange={(event) => setProfile((previous) => ({ ...previous, shareAggregate: event.target.checked }))} className="mt-0.5 accent-teal-400" />
                <span>Allow my risk band to contribute to anonymous aggregate demo counts. No name or personnel ID is shown in the welfare dashboard.</span>
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Save profile</button>
                <button type="button" onClick={revokeConsent} className="rounded-xl border border-rose-500/40 px-4 py-3 text-xs font-bold text-rose-300">Withdraw consent & clear local data</button>
              </div>
            </form>
          )}
        </div>
      )}

      {section === 'checkin' && (
        <div className="space-y-4">
          {!consented ? (
            <ConsentGate onConsent={acceptConsent} />
          ) : (
            <form onSubmit={submitCheckIn} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Wellbeing check-in</h2>
                <p className="mt-1 text-xs text-slate-400">Choose 1 to 5. Your answers are not collected until you submit.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {questions.map((question) => (
                  <label key={question.key} className="block">
                    <span className="flex justify-between gap-3 text-xs font-semibold text-slate-200"><span>{question.label}</span><span className="text-teal-300">{values[question.key]}/5</span></span>
                    <input type="range" min="1" max="5" step="1" value={values[question.key]} onChange={(event) => setValues((previous) => ({ ...previous, [question.key]: Number(event.target.value) }))} className="mt-3 w-full accent-teal-400" />
                    <span className="flex justify-between text-[10px] text-slate-500"><span>{question.low}</span><span>{question.high}</span></span>
                  </label>
                ))}
              </div>

              <button className="mt-6 rounded-xl bg-teal-400 px-5 py-3 text-xs font-black text-slate-950">Submit check-in & see estimate</button>
            </form>
          )}
        </div>
      )}

      {section === 'analytics' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-bold text-white">Deployment & duty trend analysis</h2>
            <p className="mt-1 text-xs text-slate-400">Transparent trend review based on your provided duty data and check-ins. This dashboard is for preventive welfare support and not a disciplinary tool.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trendMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{metric.label}</p>
                  <span className={`h-2.5 w-2.5 rounded-full ${metric.color}`} />
                </div>
                <p className="mt-3 text-lg font-black text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-bold text-white">Workload trend</p>
              <div className="mt-4 flex h-28 items-end gap-2">
                {[40, 52, 48, 58, 60, 66, 64, 72].map((value, index) => (
                  <div key={index} className="min-w-2 flex-1 rounded-t bg-teal-400" style={{ height: `${value}%` }} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-bold text-white">Night shift / fatigue pattern</p>
              <div className="mt-4 flex h-28 items-end gap-2">
                {[44, 50, 56, 58, 65, 72, 76, 69].map((value, index) => (
                  <div key={index} className="min-w-2 flex-1 rounded-t bg-amber-400" style={{ height: `${value}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-white">Future Wearable Integration</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">Future wearable integration can be added with authorized, consented access to heart rate, sleep duration, activity level, and other wellness indicators. This is a placeholder architecture only and does not collect real biometric data in this demo.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-white">HRMS Integration</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">Mock/demo service layer: Personnel → HRMS / Duty Data → Analytics Engine → Risk Assessment → Welfare Recommendation → Authorized Dashboard.</p>
            </div>
          </div>
        </div>
      )}

      {section === 'prediction' && (
        <div className="space-y-4">
          {!consented ? (
            <ConsentGate onConsent={acceptConsent} />
          ) : currentAssessment ? (
            <>
              <div className={`rounded-2xl border p-5 sm:p-7 ${currentAssessment.risk === 'High Risk' ? 'border-rose-500/40 bg-rose-950/20' : currentAssessment.risk === 'Moderate Risk' ? 'border-amber-500/40 bg-amber-950/20' : 'border-teal-500/30 bg-teal-950/20'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explainable, rule-based behavioural risk estimate</span>
                    <h2 className="mt-2 text-2xl font-black text-white">{currentAssessment.risk}</h2>
                    <p className="mt-1 text-sm text-slate-300">Overall risk score: <strong className="text-white">{currentAssessment.score}/100</strong></p>
                  </div>
                  <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-teal-300/70 text-xl font-black text-white">{currentAssessment.score}</div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-300">Why this risk was detected</h3>
                    <ul className="mt-2 space-y-2">
                      {currentAssessment.factors.map((factor) => (
                        <li key={factor} className="flex gap-2 text-xs text-slate-300"><span className="text-teal-300">•</span>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-300">Recommended next action</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{currentAssessment.recommendations.join(', ')}</p>
                    <p className="mt-3 text-xs text-slate-400">Recent trend: {checkIns.length < 2 ? 'More check-ins are needed to show a trend.' : checkIns[0].score > checkIns[1].score ? 'Risk score increased since your prior check-in.' : checkIns[0].score < checkIns[1].score ? 'Risk score decreased since your prior check-in.' : 'Risk score is steady since your prior check-in.'}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {Object.entries(currentAssessment.subRisks).map(([key, value]) => {
                  const labelMap = {
                    stressRisk: 'Stress Risk',
                    burnoutRisk: 'Burnout Risk',
                    fatigueRisk: 'Fatigue Risk',
                    sleepRisk: 'Sleep/Recovery Risk',
                    workloadRisk: 'Workload Risk'
                  };
                  return (
                    <div key={key} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{labelMap[key]}</p>
                      <p className="mt-3 text-2xl font-black text-white">{value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs leading-relaxed text-slate-400">This is a preventive welfare-support assessment and not a medical diagnosis. Risk predictions are estimates and can contain errors. They should not be treated as diagnosis, and human welfare professionals must review significant cases. Personnel should not be stigmatized because of a risk score.</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <Activity className="mx-auto h-8 w-8 text-teal-300" />
              <p className="mt-3 text-sm font-bold text-white">No check-in yet</p>
              <button type="button" onClick={() => setSection('checkin')} className="mt-3 text-xs font-bold text-teal-300">Start a voluntary check-in</button>
            </div>
          )}
        </div>
      )}

      {section === 'trends' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Your wellbeing trends</h2>
              <p className="mt-1 text-xs text-slate-400">Personal history is visible only in this browser session.</p>
            </div>
            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1" aria-label="Trend period">
              {[['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']].map(([key, label]) => (
                <button type="button" key={key} onClick={() => setPeriod(key)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === key ? 'bg-teal-400 text-slate-950' : 'text-slate-400'}`}>{label}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[['Stress score', 'score', 'bg-rose-400'], ['Sleep quality', 'sleep', 'bg-sky-400'], ['Fatigue', 'fatigue', 'bg-amber-300'], ['Workload', 'workload', 'bg-teal-300']].map(([title, field, color]) => (
              <TrendBars key={field} title={title} records={visibleRecords} field={field} color={color} />
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-bold text-white">Risk-level history</h3>
            {visibleRecords.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleRecords.map((record, index) => (
                  <span key={`${record.timestamp}-${index}`} className={`rounded-lg border px-3 py-2 text-xs ${record.risk === 'High Risk' ? 'border-rose-500/40 text-rose-300' : record.risk === 'Moderate Risk' ? 'border-amber-500/40 text-amber-300' : 'border-teal-500/40 text-teal-300'}`}>
                    {new Date(record.timestamp).toLocaleDateString()} · {record.risk}
                  </span>
                ))}
              </div>
            ) : <p className="mt-3 text-xs text-slate-500">No check-ins in this period.</p>}
          </div>
        </div>
      )}

      {section === 'support' && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-teal-300" /><h2 className="text-lg font-bold text-white">Stress relief & recovery support</h2></div>
            <p className="mt-2 text-xs text-slate-400">These suggestions are preventive wellbeing support only. They are not medical diagnoses and are meant to reduce fatigue, improve recovery, and guide voluntary support when stress remains elevated.</p>

            {!consented ? (
              <div className="mt-5"><ConsentGate onConsent={acceptConsent} /></div>
            ) : (
              <form id="support-request-form" onSubmit={submitSupportRequest} className="mt-5 space-y-4">
                <label className="block text-xs font-semibold text-slate-300">Support type
                  <select value={supportType} onChange={(event) => {
                    const type = event.target.value;
                    setSupportType(type);
                    setRequestedSupportType(type);
                    setImmediateHelpRequested(type === 'Emergency support');
                  }} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white">
                    <option>Counselling request</option>
                    <option>Confidential support request</option>
                    <option>Contact welfare officer</option>
                    <option>Rest and recovery planning</option>
                    <option>Workload review</option>
                    <option>Healthcare professional consultation</option>
                    <option>Emergency support</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-slate-300">Optional note
                  <textarea rows="3" value={supportNote} onChange={(event) => setSupportNote(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Share only what is helpful for your request." /></label>

                <button className="rounded-xl bg-teal-400 px-4 py-3 text-xs font-bold text-slate-950">Send confidential request</button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-white">Recovery guidance</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
                {recoveryPlan.personalized.map((tip) => <li key={tip}>• {tip}</li>)}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-white">Recommended interventions</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
                {recoveryPlan.immediate.slice(0, 4).map((item) => <li key={item.title}>• {item.title}</li>)}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-white">Immediate Help</h3>
              {immediateHelpRequested ? (
                <div className="mt-3 rounded-xl border border-rose-500/50 bg-rose-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-rose-100">Emergency Support</h4>
                    <span className="rounded-full bg-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-200">Immediate</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-rose-100/90">If you may be in immediate danger, contact local emergency services now and reach a trusted on-duty person. This demo cannot dispatch emergency services; the request form only saves locally.</p>
                  <button type="button" onClick={() => selectSupportRequest('Emergency support', 'Immediate safety concern. Please contact me for urgent support.')} className="mt-3 rounded-lg bg-rose-400 px-3 py-2 text-xs font-bold text-slate-950">Request Emergency Support</button>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">Emergency support is not a routine recommendation. Select this only if you have an immediate safety concern.</p>
                  <button type="button" onClick={() => selectSupportRequest('Emergency support', 'Immediate safety concern. Please contact me for urgent support.')} className="mt-3 rounded-lg border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-200 hover:border-rose-400">I need immediate help</button>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">Recommended Support</h3>
                {supportRecommendations.length > 0 && <span className="text-[10px] text-slate-500">Rule-based, based on recent check-ins</span>}
              </div>
              {supportRecommendations.length > 0 ? (
                <>
                  <p className="mt-3 rounded-xl border border-teal-500/20 bg-teal-950/20 p-3 text-xs leading-relaxed text-teal-100">Based on your current wellbeing check-in, {supportRecommendations[0].explanation}.</p>
                  <div className="mt-3 space-y-3">
                    {supportRecommendations.filter((recommendation) => recommendation.id !== 'emergency').map((recommendation) => {
                      const actionLabel = recommendation.id === 'counselling' ? 'Request Counselling'
                        : recommendation.id === 'healthcare' ? 'Request Healthcare Support'
                          : recommendation.id === 'welfare' ? 'Contact Welfare Officer'
                            : 'Create Recovery Plan';
                      const note = recommendation.id === 'recovery'
                        ? recoveryPlan.personalized.join(' ')
                        : recommendation.message;
                      return (
                        <div key={recommendation.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-white">{recommendation.title}</h4>
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${recommendation.status === 'Recommended' ? 'bg-teal-500/15 text-teal-200' : 'bg-slate-700/60 text-slate-300'}`}>{recommendation.status}</span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-300">{recommendation.message}</p>
                          <button type="button" onClick={() => selectSupportRequest(recommendation.supportType, note)} className="mt-3 rounded-lg border border-teal-500/40 px-3 py-2 text-xs font-bold text-teal-200 hover:border-teal-300">{actionLabel}</button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-slate-400">No additional support escalation is indicated by the available check-ins. Continue with recovery guidance below; support remains available if you request it.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {section === 'welfare' && (
        <div className="space-y-4">
          {!welfareAuthorized ? (
            <form onSubmit={loginWelfare} className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300"><LockKeyhole className="h-6 w-6" /></div>
              <h2 className="mt-4 text-center text-lg font-bold text-white">Authorized welfare access</h2>
              <p className="mt-1 text-center text-xs text-slate-400">Separate demo role. Personal check-in answers and names are not shown here.</p>

              {loginError && <p className="mt-4 rounded-lg bg-rose-950/40 p-3 text-xs text-rose-200">{loginError}</p>}

              <label className="mt-5 block text-xs font-semibold text-slate-300">Role ID
                <input value={welfareUser} onChange={(event) => setWelfareUser(event.target.value)} autoComplete="username" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" />
              </label>

              <label className="mt-3 block text-xs font-semibold text-slate-300">Passcode
                <input type="password" value={welfarePass} onChange={(event) => setWelfarePass(event.target.value)} autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" />
              </label>

              <button className="mt-4 w-full rounded-xl bg-teal-400 px-4 py-3 text-xs font-black text-slate-950">Sign in to welfare dashboard</button>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-xs text-slate-400">
                Demo credentials: <strong className="text-white">personnel</strong> / <strong className="text-white">wellness2026</strong>, <strong className="text-white">welfare</strong> / <strong className="text-white">support2026</strong>, <strong className="text-white">commander</strong> / <strong className="text-white">ops2026</strong>, <strong className="text-white">admin</strong> or <strong className="text-white">superadmin</strong> / <strong className="text-white">admin2026</strong>
              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-slate-500">This client-side demo gate is not production authentication. A real deployment should enforce authorization on a secure backend.</p>
            </form>
          ) : (
            <WelfareDashboard pendingRequests={requests.filter((request) => request.status === 'Pending').length} sharedRisk={profile.shareAggregate ? latestAssessment?.risk : null} onLogout={() => setWelfareAuthorized(false)} role={welfareRole} />
          )}
        </div>
      )}
    </div>
  );
}
