import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const IOSCalendarToday = ({ size = 14, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="4" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="5" />
    <line x1="16" y1="2" x2="16" y2="5" />
    <text
      x="12"
      y="18"
      fontSize="9.5"
      fontWeight="bold"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
    >
      {new Date().getDate()}
    </text>
  </svg>
);

export const IOSCalendarUpcoming = ({ size = 14, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="12" height="15" rx="2.5" />
    <line x1="3" y1="8" x2="15" y2="8" />
    <circle cx="16.5" cy="15.5" r="4.5" />
    <polyline points="16.5 13.5 16.5 15.5 17.5 15.5" />
  </svg>
);

export const IOSCheckCircle = ({ size = 14, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="7.5 11.5 10.5 14.5 16.5 8.5" />
  </svg>
);

export const IOSList = ({ size = 14, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3" cy="6" r="1.5" fill="currentColor" />
    <circle cx="3" cy="12" r="1.5" fill="currentColor" />
    <circle cx="3" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

export const IOSAlertCircle = ({ size = 14, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
