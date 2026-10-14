import React from 'react';

export const STICKER_IMAGES = {
  heroShield: '/assets/images/clay_hero_shield_1791888744791.jpg',
  phishingBlocked: '/assets/images/clay_phishing_hook_1791888744609.jpg',
  aiRobotDetective: '/assets/images/clay_ai_robot_1791888745395.jpg',
  securitySeal: '/assets/images/clay_security_badge_1791888745832.jpg',
  scannerPhone: '/assets/images/clay_scanner_phone_1791888746206.jpg',
};

interface ClayStickerProps {
  imageSrc: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rotation?: number; // e.g. -4, 3, etc.
  className?: string;
  badgeText?: string;
  tapeTop?: boolean;
}

export const ClaySticker: React.FC<ClayStickerProps> = ({
  imageSrc,
  alt,
  size = 'md',
  rotation = 0,
  className = '',
  badgeText,
  tapeTop = false,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
    xl: 'w-48 h-48 sm:w-60 sm:h-60',
  };

  return (
    <div
      className={`relative inline-block select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Optional Washi Tape Strip */}
      {tapeTop && (
        <div className="clay-tape -top-2 left-1/2 -translate-x-1/2 -rotate-3 rounded-xs" />
      )}

      {/* Die-Cut Clay Sticker Container */}
      <div className="clay-sticker overflow-hidden group">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800">
          {!imgFailed ? (
            <img
              src={imageSrc}
              alt={alt}
              onError={() => setImgFailed(true)}
              referrerPolicy="no-referrer"
              className={`${sizeMap[size]} object-cover object-center transition-transform duration-300 group-hover:scale-105`}
            />
          ) : (
            <div className={`${sizeMap[size]} flex flex-col items-center justify-center p-2 bg-gradient-to-br from-emerald-500/20 via-sky-500/20 to-indigo-500/20 text-emerald-800 dark:text-emerald-400 text-center font-bold`}>
              <span className="text-2xl sm:text-3xl">🛡️</span>
              <span className="text-[9px] uppercase tracking-wider mt-1 opacity-80">{badgeText || 'ScamShield'}</span>
            </div>
          )}
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none rounded-2xl" />
        </div>

        {badgeText && (
          <div className="absolute -bottom-2 -right-1 clay-sticker-tag bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[10px] font-black uppercase tracking-wider shadow-sm">
            {badgeText}
          </div>
        )}
      </div>
    </div>
  );
};

interface ClayStampProps {
  text: string;
  variant?: 'danger' | 'success' | 'warning' | 'info';
  rotation?: number;
  className?: string;
}

export const ClayStamp: React.FC<ClayStampProps> = ({
  text,
  variant = 'danger',
  rotation = -4,
  className = '',
}) => {
  const variantStyles = {
    danger: 'text-rose-600 border-rose-500 bg-rose-50/70',
    success: 'text-emerald-700 border-emerald-600 bg-emerald-50/70',
    warning: 'text-amber-700 border-amber-500 bg-amber-50/70',
    info: 'text-sky-700 border-sky-500 bg-sky-50/70',
  };

  return (
    <span
      className={`clay-stamp text-[10px] sm:text-xs font-black uppercase tracking-widest ${variantStyles[variant]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span>●</span>
      <span>{text}</span>
      <span>●</span>
    </span>
  );
};
