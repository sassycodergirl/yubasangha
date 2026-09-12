// Small inline icons used across the site. Uniform 24x24 viewBox, currentColor,
// modelled on a standard icon set (Lucide-style) so they read as designed
// glyphs rather than rough line art.

function Svg({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  );
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
}

export function PlayIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M7.5 4.8v14.4a1 1 0 001.53.85l11.2-7.2a1 1 0 000-1.7L9.03 3.95a1 1 0 00-1.53.85z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function BroadcastIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7" />
      <path d="M5.3 5.3a9.6 9.6 0 000 13.4M18.7 5.3a9.6 9.6 0 010 13.4" />
    </Svg>
  );
}

export function MusicIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 17.5V6.2l10-1.7v11" />
      <circle cx="7" cy="17.5" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15.5" r="2.5" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function UsersIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9.5" cy="8" r="3" />
      <path d="M3.8 19a5.7 5.7 0 0111.4 0" />
      <path d="M15.8 5.3a3 3 0 010 5.7M17 19a5.5 5.5 0 00-3.1-5" />
    </Svg>
  );
}

export function ShareIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="5.5" r="2.3" />
      <circle cx="18" cy="18.5" r="2.3" />
      <path d="M8.1 10.8l7.8-4.1M8.1 13.2l7.8 4.1" />
    </Svg>
  );
}

export function ImageIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <path d="M4 16.5l4.8-4.8a1.3 1.3 0 011.9 0l2.6 2.6M13.5 16.5l3-3a1.3 1.3 0 011.9 0l1.6 1.6" />
    </Svg>
  );
}

export function CalendarIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5.2" width="17" height="15.3" rx="2.2" />
      <path d="M3.5 10h17M8 3v3.5M16 3v3.5" />
      <circle cx="8.3" cy="14.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.7" cy="14.2" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </Svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 12H4M11 5l-7 7 7 7" />
    </Svg>
  );
}

export function DiyaIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 14.5c0 3.3 3.8 5.5 8.5 5.5s8.5-2.2 8.5-5.5" />
      <path d="M2.5 14.5h19" />
      <path
        d="M12 11.2c-1.8-1.6-1.8-4-.2-6 1.6 2 1.6 4.4-.2 6z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function MouseIcon(props) {
  return (
    <Svg {...props}>
      <rect x="7.5" y="3" width="9" height="15" rx="4.5" />
      <path d="M12 6.5v3.5" strokeWidth="2" />
    </Svg>
  );
}

// -- Puja Schedule icon set --------------------------------------------

export function FlowerIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="6.6" r="2.7" />
      <circle cx="17.3" cy="9.3" r="2.7" />
      <circle cx="15.2" cy="15.4" r="2.7" />
      <circle cx="8.8" cy="15.4" r="2.7" />
      <circle cx="6.7" cy="9.3" r="2.7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function BhogIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 11.5a8 8 0 0016 0" />
      <path d="M3 11.5h18" />
      <path d="M9 4.5c0 1.1-1 1.3-1 2.4S9 8.3 9 8.3" />
      <path d="M13 4.5c0 1.1-1 1.3-1 2.4s1 1.4 1 1.4" />
    </Svg>
  );
}

export function TempleIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2.5l3.2 3.8H8.8L12 2.5z" />
      <path d="M6.5 8h11v11h-11z" />
      <path d="M6.5 19h11M9.5 19v-5h5v5" />
    </Svg>
  );
}

export function DhunuchiIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 20h10" />
      <path d="M9 20l1-6h4l1 6" />
      <path d="M12 14V9.5" />
      <path
        d="M12 9.5c-1.6-1.4-1.6-3.2-.2-5 1.4 1.8 1.4 3.6.2 5z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function ImmersionIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 4v9" />
      <path d="M9 6.3L12 4l3 2.3" />
      <path d="M3 15.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
      <path d="M3 19.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
    </Svg>
  );
}

export function ExpandIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </Svg>
  );
}

export function UserIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" />
    </Svg>
  );
}

export function VolumeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 9.5v5h3.5l4.5 3.5v-12L8.5 9.5H5z" />
      <path d="M16 9a4.2 4.2 0 010 6M18.3 6.5a7.8 7.8 0 010 11" />
    </Svg>
  );
}

export function VolumeMuteIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 9.5v5h3.5l4.5 3.5v-12L8.5 9.5H5z" />
      <path d="M16 10l4.5 4.5M20.5 10L16 14.5" />
    </Svg>
  );
}

// -- Pandal Map icon set -------------------------------------------------

export function EntryIcon(props) {
  return (
    <Svg {...props}>
      <path d="M13 4H6v16h7" />
      <path d="M11 12h9M17 8l3 4-3 4" />
    </Svg>
  );
}

export function ExitDoorIcon(props) {
  return (
    <Svg {...props}>
      <path d="M11 4h7v16h-7" />
      <path d="M13 12H4M8 8l-4 4 4 4" />
    </Svg>
  );
}

export function StarIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
    </Svg>
  );
}

export function DropletIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3s6 6.5 6 10.5a6 6 0 01-12 0C6 9.5 12 3 12 3z" />
    </Svg>
  );
}

export function FirstAidIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="6" width="17" height="14" rx="2" />
      <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" />
      <path d="M12 10v6M9 13h6" />
    </Svg>
  );
}

export function ForkKnifeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 3v7a2 2 0 002 2v9M7 3v6M9 3v6" />
      <path d="M17 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v10" />
    </Svg>
  );
}

export function BalloonIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3a5 5 0 015 5c0 3.5-3 6-4 7l1 1h-4l1-1c-1-1-4-3.5-4-7a5 5 0 015-5z" />
      <path d="M12 16v5" />
    </Svg>
  );
}

export function ParkingIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16V8h3a3 3 0 010 6h-3" />
    </Svg>
  );
}

export function WheelchairIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="16.5" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M11 6v5l5 2M11 11H7a4 4 0 104 4.5" />
      <path d="M13 11l2.5 8h3" />
    </Svg>
  );
}

export function CameraIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="7" width="17" height="12" rx="2" />
      <path d="M8 7l1.5-3h5L16 7" />
      <circle cx="12" cy="13" r="3.2" />
    </Svg>
  );
}

export function RunExitIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="14" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M10 21l2-6 3 2 2 4M9 14l1-4 4-1 2 3M6 10l4-1" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function MinusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

// -- Admin CMS icons ------------------------------------------------------

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function HomeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
    </Svg>
  );
}

export function GridIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </Svg>
  );
}

export function LayersIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3z" />
      <path d="M3.5 12l8.5 4.5L20.5 12" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </Svg>
  );
}

export function GearIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9L6.3 6.3" />
    </Svg>
  );
}

export function LogoutIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" />
      <path d="M15 16l4-4-4-4M19 12H9" />
    </Svg>
  );
}

// -- Footer social icons --------------------------------------------------

export function FacebookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M14 21v-7h2.4l.4-3H14V9.2c0-.9.3-1.5 1.6-1.5H17V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H8v3h2.6v7z" />
    </Svg>
  );
}

export function InstagramIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function XIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 4l14 16M19 4L5 20" />
    </Svg>
  );
}

// -- Contact page icon set ------------------------------------------------

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5.5 4h3l1.5 4.5-2 1.5a10.5 10.5 0 005.5 5.5l1.5-2 4.5 1.5v3a2 2 0 01-2.2 2A16 16 0 013.5 6.2 2 2 0 015.5 4z" />
    </Svg>
  );
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </Svg>
  );
}

export function PinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}
