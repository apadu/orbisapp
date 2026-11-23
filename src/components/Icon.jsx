/**
 * Line icons in the Atlas style (stroke, currentColor). Used instead of emoji in the
 * site's own chrome; emoji stay only where they are content (flags).
 */
const PATHS = {
  globe:  <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7.5h14M5 16.5h14" /></>,
  list:   <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M8 9h8M8 12h8M8 15h5" /></>,
  flag:   <><path d="M6 21V4" /><path d="M6 5h11l-2.5 3.5L17 12H6" /></>,
  map:    <><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" /><path d="M9 4v14M15 6v14" /></>,
  arrow:  <path d="M5 12h14M13 6l6 6-6 6" />,
  dice:   <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="15" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" /><circle cx="9" cy="15" r="1" fill="currentColor" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  flame:  <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4" />,
  check:  <path d="m5 12 4.5 4.5L19 7" />,
  image:  <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m4 18 5-5 4 4 2.5-2.5L20 18" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  book:   <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></>,
  pin:      <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  borders:  <><path d="M3 6l6-2 3 3v13l-3-3-6 2z" /><path d="M12 7l4-2 5 2v13l-5-2-4 2" /></>,
  eyeOff:   <><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a15.4 15.4 0 0 1-2.6 3.2M6.6 6.6C4.3 8.1 3 12 3 12s4 6 9 6c1.6 0 3-.4 4.3-1.1" /></>,
  focus:    <><circle cx="12" cy="12" r="3" /><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /></>,
  wave:     <><path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /></>,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 4" /><circle cx="12" cy="17.2" r=".6" fill="currentColor" /></>,
  shape:    <path d="M8 3l5 2 4-1 3 5-2 4 2 4-4 4-5-1-4 2-3-5 1-4-2-4z" />,
  building: <><path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7" /><path d="M2.5 10 12 4l9.5 6z" /></>,
  landmark: <><path d="M4 21h16M6 18h12M7 18V9M12 18V9M17 18V9" /><path d="M5 9h14L12 4z" /></>,
  ruler:    <><rect x="2.5" y="8" width="19" height="8" rx="1" /><path d="M6 8v3M9.5 8v4M13 8v3M16.5 8v4" /></>,
  swap:     <><path d="M7 4 3 8l4 4M3 8h14" /><path d="m17 12 4 4-4 4M21 16H7" /></>,
  meridian: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M4.5 7.5c4 1.5 11 1.5 15 0" opacity=".5" /></>,
  clock:    <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  coin:     <><circle cx="12" cy="12" r="9" /><path d="M14.8 9.2c-.6-.8-1.6-1.2-2.8-1.2-1.7 0-2.8.9-2.8 2s1.1 1.6 2.8 2 2.8.9 2.8 2-1.1 2-2.8 2c-1.2 0-2.3-.5-2.9-1.3M12 6.5v11" /></>,
  speech:   <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  mountain: <><path d="M2 20 9 7l4 7 2-3 7 9z" /><path d="m7.5 10 1.5 1.5L10.5 10" /></>,
  river:    <path d="M7 3c4 3-3 6 1 9s-3 6 1 9M15 3c4 3-3 6 1 9s-3 6 1 9" />,
  palette:  <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.5-1.7-.3-1.4.6-2.3 2-2.3H18a3 3 0 0 0 3-3c0-6-4-11-9-11z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10" cy="7" r="1" fill="currentColor" /><circle cx="15" cy="7.5" r="1" fill="currentColor" /></>,
  smile:    <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" /><circle cx="9" cy="10" r=".7" fill="currentColor" /><circle cx="15" cy="10" r=".7" fill="currentColor" /></>,
  letters:  <><path d="m3 18 4-12 4 12M4.4 14h5.2" /><path d="M14 18v-7m0 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0" /></>,
  copy:     <><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></>,
  shuffle:  <><path d="M3 6h4l10 12h4M3 18h4l3-3.6M14 9.6 17 6h4" /><path d="m18 3 3 3-3 3M18 15l3 3-3 3" /></>,
  people:   <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c2.8 0 5 2.2 5 5" /></>,
  person:   <><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></>,
  expand:   <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6" />,
  shrink:   <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  lock:     <><rect x="5" y="11" width="14" height="10" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  island:   <><path d="M3 19c3 0 3-1.5 6-1.5s3 1.5 6 1.5 3-1.5 6-1.5" /><path d="M12 16V8M12 8c-2-3-6-3-7-1M12 8c2-3 6-3 7-1M12 8c-1-2-1-4 1-5" /></>,
  stars:    <><circle cx="12" cy="12" r="8" strokeDasharray="1.5 3.2" /><path d="m12 9 .9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" /></>,
  shield:   <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></>,
  briefcase:<><rect x="3" y="7" width="18" height="13" rx="1.5" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18" /></>,
  history:  <><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" /><path d="M3 4v4h4M12 8v4l3 2" /></>,
  puzzle:   <path d="M9 4h3a2 2 0 1 1 4 0h3v5a2 2 0 1 0 0 4v6h-5a2 2 0 1 0-4 0H4v-5a2 2 0 1 0 0-4V4z" />,
  equator:  <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" strokeWidth="2.6" /><path d="M6 6.5h12M6 17.5h12" opacity=".5" /></>,
  crown:    <><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" /><path d="M5 19h14" /></>,
  car:      <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3zM5 11h14" /><circle cx="7.5" cy="16" r="1" /><circle cx="16.5" cy="16" r="1" /></>,
  scroll:   <><path d="M7 4h11a2 2 0 0 1 2 2v1h-4" /><path d="M16 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h10v1a2 2 0 0 0 2 2" /><path d="M7 4a2 2 0 0 0-2 2v11M9 9h4M9 12.5h4" /></>,
  sword:    <><path d="M14.5 3H21v6.5L10 20.5 3.5 14z" /><path d="M5 13l6 6M3 21l3-3" /></>,
  snow:     <path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11M9 3.5l3 2 3-2M9 20.5l3-2 3 2" />,
  drop:     <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" />,
  scale:    <><path d="M12 3v18M7 21h10M4 7h16" /><path d="M4 7l-2.5 6a3 3 0 0 0 5 0zM20 7l-2.5 6a3 3 0 0 0 5 0z" /></>,
  checkx:   <><path d="m3 12 3 3 5-6" /><path d="m14 8 7 8M21 8l-7 8" /></>,
  grid:     <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>,
  link:     <><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  chart:    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  bolt:     <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  home:     <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
  user:     <><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></>,
  cycle: <><path d="M20 12a8 8 0 0 1-13.7 5.6" /><path d="M4 12a8 8 0 0 1 13.7-5.6" /><path d="M17.5 2.5v4h-4" /><path d="M6.5 21.5v-4h4" /></>,
  layers:   <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
  trophy:   <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />,
  close:    <path d="M6 6l12 12M18 6 6 18" />,
  moon:     <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />,
  spiral:   <path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3 3 0 1 1 15 9a4.5 4.5 0 1 1-6.4 6.4A6 6 0 1 1 18 6.8" />,
  star:     <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  sort:     <path d="M4 20h3V14H4zM10.5 20h3V9h-3zM17 20h3V4h-3z" />,
  tripoint: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M12 13 7 3.5M12 13l8.5-3M12 13l-1.5 7.5" /><circle cx="12" cy="13" r="1.8" fill="currentColor" /></>,
}

export default function Icon({ name, size = 20, strokeWidth = 1.75, className = '', title }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined} aria-label={title}>
      {PATHS[name]}
    </svg>
  )
}

/** Icon for each section of the site */
export const SECTION_ICON = { globe: 'globe', nameall: 'list', quizzes: 'flag', countries: 'map' }
