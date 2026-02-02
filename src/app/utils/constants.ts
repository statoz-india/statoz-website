// Brand Colors
export const COLORS = {
  primary: {
    purple: '#c27aff',
    cyan: '#5cdfff',
    blue: '#155dfc',
    darkPurple: '#9810fa',
    pink: '#e60076',
    orange: '#ff8c00',
    gold: '#FFB800',
  },
  background: {
    dark: '#0D111A',
    darker: '#08090F',
    card: 'rgba(20,25,35,0.8)',
    cardHover: 'rgba(20,25,35,0.95)',
  },
  border: {
    default: '#1A1F2E',
    accent: '#5cdfff',
    glow: 'rgba(92,223,255,0.3)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#B8C5D6',
    muted: '#6B7A8F',
    accent: '#5cdfff',
  },
} as const;

// Gradient Combinations
export const GRADIENTS = {
  primary: 'from-[#9810fa] to-[#155dfc]',
  purple: 'from-[#7C86FF] to-[#ad46ff]',
  gold: 'from-[#FFB800] to-[#ff8c00]',
  cyan: 'from-[#00d4ff] to-[#0095ff]',
  pink: 'from-[#9810fa] to-[#e60076]',
  orange: 'from-[#d08700] to-[#f54900]',
  green: 'from-[#00a63e] to-[#096]',
  stats: 'from-[rgba(89,22,139,0.2)] to-[rgba(28,57,142,0.2)]',
  waitlist: 'from-[rgba(89,22,139,0.5)] to-[rgba(28,57,142,0.5)]',
} as const;

// Feature Pills Data
export const HERO_FEATURES = [
  { icon: 'Trophy', label: 'Real Prizes' },
  { icon: 'Award', label: 'Epic Rewards' },
  { icon: 'Shield', label: 'Free to Play' },
  { icon: 'Radio', label: 'Live Matches' },
] as const;

// Stats Data
export const STATS_DATA = [
  { icon: 'Trophy', value: '50+', label: 'Daily Matches' },
  { icon: 'Gamepad2', value: '11', label: 'Arcade Games' },
  { icon: 'Gift', value: '100%', label: 'Free to Play' },
  { icon: 'Clock', value: '₹5K+', label: 'Prize Pool' },
] as const;

// How It Works Steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    icon: 'UserPlus',
    title: 'SIGN UP FREE',
    description: 'Create your profile in 30 seconds. Choose a username and start playing instantly.',
    color: '#7C86FF'
  },
  {
    step: '02',
    icon: 'Target',
    title: 'PICK MATCHES',
    description: 'Select from live football matches worldwide and place your predictions.',
    color: '#E60076'
  },
  {
    step: '03',
    icon: 'Trophy',
    title: 'EARN XP',
    description: 'Correct predictions earn XP. Build streaks and climb the leaderboard.',
    color: '#FFB800'
  },
  {
    step: '04',
    icon: 'Crown',
    title: 'WIN REWARDS',
    description: 'Top performers win prizes, exclusive rewards, and bragging rights.',
    color: '#00D3F2'
  }
] as const;

// Features Data
export const FEATURES_DATA = [
  {
    icon: 'Target',
    title: 'PREDICT & WIN',
    description: 'Make accurate predictions on live football matches. Top predictors earn XP and climb the leaderboard.',
    gradient: GRADIENTS.purple
  },
  {
    icon: 'Swords',
    title: '1v1 BATTLES',
    description: 'Challenge players in head-to-head prediction duels. Compete in skill-based arcade games.',
    gradient: GRADIENTS.purple
  },
  {
    icon: 'Trophy',
    title: 'LEADERBOARDS',
    description: 'Compete globally and prove your prediction skills. Top players win weekly prizes.',
    gradient: GRADIENTS.gold
  },
  {
    icon: 'Users',
    title: 'PRIVATE LEAGUES',
    description: 'Create leagues with friends. Compete, share predictions, and track scores together.',
    gradient: GRADIENTS.purple
  },
  {
    icon: 'TrendingUp',
    title: 'DYNAMIC ODDS',
    description: 'Real-time odds that adjust live. No deposits required—pure skill and strategy.',
    gradient: GRADIENTS.purple
  },
  {
    icon: 'Gift',
    title: 'DAILY REWARDS',
    description: 'Earn points for real prizes. Daily achievements and exclusive giveaways await.',
    gradient: GRADIENTS.purple
  }
] as const;

// Tournaments Data
export const TOURNAMENTS_DATA = [
  {
    id: 't20-world-cup',
    title: 'ICC T20 WORLD CUP 2026',
    sport: 'Cricket',
    date: 'February - March 2026',
    location: 'India & Sri Lanka',
    description: 'The biggest T20 cricket tournament returns. Predict match outcomes, player performances, and tournament winners across 55+ matches.',
    imageUrl: 'https://images.unsplash.com/photo-1728659964407-ed9a942ec2de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwc3RhZGl1bSUyMG5pZ2h0JTIwbGlnaHRzfGVufDF8fHx8MTc2OTg0MDUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: GRADIENTS.purple,
    accentColor: '#7C86FF',
    stats: [
      { label: 'Teams', value: '20' },
      { label: 'Matches', value: '55+' },
      { label: 'Prediction Types', value: '15+' }
    ]
  },
  {
    id: 'ipl-26',
    title: 'IPL 2026',
    sport: 'Cricket',
    date: 'March - May 2026',
    location: 'India',
    description: 'The world\'s most electrifying cricket league is back. Challenge friends, compete in 1v1 prediction battles, and dominate the leaderboards.',
    imageUrl: 'https://images.unsplash.com/photo-1652513842544-ca66b676757a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJUEwlMjBjcmlja2V0JTIwbWF0Y2glMjBzdGFkaXVtfGVufDF8fHx8MTc2OTg0MDUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: GRADIENTS.gold,
    accentColor: '#FFB800',
    stats: [
      { label: 'Teams', value: '10' },
      { label: 'Matches', value: '74' },
      { label: 'Daily Games', value: '100+' }
    ]
  },
  {
    id: 'fifa-2026',
    title: 'FIFA WORLD CUP 2026',
    sport: 'Football',
    date: 'June - July 2026',
    location: 'USA, Canada, Mexico',
    description: 'The ultimate football championship across North America. Predict every match, create tournament brackets, and win epic rewards.',
    imageUrl: 'https://images.unsplash.com/photo-1624295019913-0420eae31f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGSUZBJTIwd29ybGQlMjBjdXAlMjBzb2NjZXIlMjBzdGFkaXVtfGVufDF8fHx8MTc2OTg0MDUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: GRADIENTS.cyan,
    accentColor: '#00d4ff',
    stats: [
      { label: 'Teams', value: '48' },
      { label: 'Matches', value: '104' },
      { label: 'Prize Pool', value: 'MASSIVE' }
    ]
  }
] as const;