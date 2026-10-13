import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, Lock, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const SafetyCenter: React.FC = () => {
  const { t } = useLanguage();

  const emergencyContacts = [
    {
      name: 'FIA Cyber Crime Wing (Federal Investigation Agency)',
      number: '1991 / 9911',
      desc: 'National cybersecurity law enforcement helpline for financial fraud, hacking, and blackmail.',
      url: 'https://fia.gov.pk/enquiry_trace'
    },
    {
      name: 'PTA Consumer Complaints (Telecom Authority)',
      number: '0800-55055',
      desc: 'Report spam, smishing SMS senders, unauthorized SIMs, and scam robocalls.',
      url: 'https://complaint.pta.gov.pk'
    },
    {
      name: 'BISP Official Helpline (Benazir Income Support)',
      number: '0800-26477 (SMS: 8171)',
      desc: 'The ONLY verified shortcode for poverty relief grants. Never trust 03XX mobile messages.',
      url: 'https://bisp.gov.pk'
    },
    {
      name: 'State Bank of Pakistan (Banking Mohtasib)',
      number: '021-99217334',
      desc: 'Dispute resolution and complaint ombudsman for commercial banking fraud.',
      url: 'https://www.bankingmohtasib.gov.pk'
    },
    {
      name: 'JazzCash Official Support',
      number: '4444 (or 021-111-124-444)',
      desc: 'Lock mobile wallet immediately if unauthorized access or OTP compromise occurs.'
    },
    {
      name: 'EasyPaisa Official Support',
      number: '3737 (or 042-111-003-737)',
      desc: 'Telenor Microfinance Bank hotline to freeze wallet upon fraud detection.'
    }
  ];

  const safetyGuides = [
    {
      id: 'otp',
      title: t('guideOtpTitle'),
      body: t('guideOtpBody'),
      points: [
        'No bank employee, military officer, or lottery host has legitimate authority to request your OTP.',
        'If you receive an unsolicited OTP, your password may already be compromised; change your password immediately.',
        'Never enter an OTP on a website link sent directly via SMS.'
      ]
    },
    {
      id: 'bisp',
      title: t('guideBispTitle'),
      body: t('guideBispBody'),
      points: [
        'Legitimate government relief allocations are broadcast exclusively from shortcode 8171.',
        'You never have to pay a "processing fee", "courier fee", or "card fee" to withdraw official assistance.',
        'Never visit personal unverified addresses or send EasyPaisa/JazzCash fees to claim funds.'
      ]
    },
    {
      id: 'bank',
      title: t('guideBankTitle'),
      body: t('guideBankBody'),
      points: [
        'Banks never impose abrupt 2-hour deadlines claiming your debit card or online portal is about to be blocked.',
        'Always check the sender ID: official banks use registered branded SMS headers (e.g. "HBL", "MEEZAN", "UBL"), not standard 03XX mobile numbers.',
        'Inspect URL endings carefully: a domain ending in .online or .xyz is not an official commercial bank.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          {t('safetyTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t('safetySubtitle')}
        </p>
      </div>

      {/* Verified Emergency Contacts Directory in Clay Card */}
      <div className="clay-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs">
            <PhoneCall className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">
            {t('emergencyContactsTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {emergencyContacts.map((c, i) => (
            <div
              key={i}
              className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-1.5 shadow-2xs hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{c.name}</span>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-emerald-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <div className="text-xs font-mono font-extrabold text-emerald-900">
                {c.number}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* In-Depth Defense Protocols in Clay Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {safetyGuides.map(g => (
          <div
            key={g.id}
            className="p-6 clay-card space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 shadow-xs border border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 mb-1.5">
                {g.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                {g.body}
              </p>
              <ul className="space-y-1.5">
                {g.points.map((pt, idx) => (
                  <li key={idx} className="text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed font-medium">
                    <span className="text-emerald-700 font-extrabold">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Response Protocol in Clay Banner */}
      <div className="p-6 clay-banner-elevated space-y-3 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="text-sm font-extrabold">Already clicked a suspicious link or provided an OTP? Immediate Action Protocol:</span>
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-amber-950 font-medium leading-relaxed pt-1">
          <li><strong>Freeze your card / account:</strong> Open your mobile banking app and immediately freeze debit/credit cards.</li>
          <li><strong>Change account passwords:</strong> Immediately reset passwords for email, banking, and social accounts from a separate clean device.</li>
          <li><strong>Report to Bank Helpline:</strong> Call the official 24/7 bank hotline to flag the fraudulent transaction before settlement.</li>
          <li><strong>File FIA Complaint:</strong> Lodge a formal report with the FIA Cyber Crime Wing via national helpline 1991.</li>
        </ol>
      </div>
    </div>
  );
};
