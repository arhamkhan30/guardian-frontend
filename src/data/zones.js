export function scoreToColor(score) {
  if (score >= 8) return { fill: '#16a34a', stroke: '#15803d', label: 'Safe', textBg: '#dcfce7', textColor: '#14532d', emoji: '✓' }
  if (score >= 6) return { fill: '#65a30d', stroke: '#4d7c0f', label: 'Mostly Safe', textBg: '#ecfccb', textColor: '#365314', emoji: '~' }
  if (score >= 4) return { fill: '#d97706', stroke: '#b45309', label: 'Caution', textBg: '#fef3c7', textColor: '#78350f', emoji: '!' }
  if (score >= 2) return { fill: '#dc2626', stroke: '#b91c1c', label: 'High Risk', textBg: '#fee2e2', textColor: '#7f1d1d', emoji: '!!' }
  return { fill: '#7f1d1d', stroke: '#450a0a', label: 'Avoid', textBg: '#fca5a5', textColor: '#450a0a', emoji: '✕' }
}

export const PULSE_TYPES = {
  safe:       { label: 'Safe here',      icon: '●', color: '#16a34a', bg: '#dcfce7' },
  caution:    { label: 'Use caution',    icon: '◆', color: '#d97706', bg: '#fef3c7' },
  incident:   { label: 'Incident',       icon: '▲', color: '#dc2626', bg: '#fee2e2' },
  lights_out: { label: 'Lights out',     icon: '◇', color: '#7c3aed', bg: '#ede9fe' },
  help:       { label: 'Help needed',    icon: '★', color: '#e11d48', bg: '#ffe4e6' },
}

export const INITIAL_ZONES = [
  {
    id: 'z1', name: 'Central Market', lat: 0.001, lng: 0.001, radius: 250,
    hourlyScore: [3,3,2,2,2,3,6,8,9,9,9,9,9,8,8,8,7,6,5,4,3,3,3,3],
    tags: ['Crowded daytime','Dark alleys','Busy evenings'],
    type: 'market',
    reviews: [
      { name: 'Ananya S.', text: 'Great during day. Avoid the back lanes after 9 PM – very dark.', time: '11 PM · Yesterday', upvotes: 24 },
      { name: 'Priya M.', text: 'Morning hours totally fine. Police post is close by.', time: '8 AM · Today', upvotes: 11 },
    ]
  },
  {
    id: 'z2', name: 'University Area', lat: 0.007, lng: -0.005, radius: 300,
    hourlyScore: [6,6,5,5,5,6,7,8,9,9,9,9,8,8,8,8,8,7,6,6,5,5,5,6],
    tags: ['Well-lit','Active community','Security present'],
    type: 'institution',
    reviews: [
      { name: 'Divya K.', text: 'Very safe. Security patrols every hour. Never felt unsafe here.', time: '10 PM · Today', upvotes: 38 },
    ]
  },
  {
    id: 'z3', name: 'Bus Terminal', lat: -0.004, lng: 0.006, radius: 220,
    hourlyScore: [3,3,2,2,2,3,5,7,8,8,8,7,7,7,6,6,5,5,4,3,3,3,3,3],
    tags: ['High footfall','Auto harassment','Avoid late night'],
    type: 'transport',
    reviews: [
      { name: 'Meera T.', text: 'Auto drivers very pushy at night. Stay near the main gate.', time: '9 PM · 2 days ago', upvotes: 17 },
      { name: 'Sneha R.', text: 'Crowded but safe during peak hours.', time: '6 PM · Yesterday', upvotes: 9 },
    ]
  },
  {
    id: 'z4', name: 'Residential Colony', lat: 0.005, lng: 0.009, radius: 280,
    hourlyScore: [7,7,7,7,7,7,8,8,9,9,9,9,9,9,8,8,8,8,7,7,6,6,7,7],
    tags: ['Quiet lanes','Watchful neighbours','Safe at night'],
    type: 'residential',
    reviews: [
      { name: 'Radha P.', text: 'Best area in the city. Neighbours look out for everyone.', time: '10 PM · 3 days ago', upvotes: 41 },
    ]
  },
  {
    id: 'z5', name: 'Riverside Park', lat: 0.010, lng: 0.003, radius: 350,
    hourlyScore: [2,2,2,2,2,2,5,7,8,8,8,8,7,7,6,5,4,3,2,2,2,2,2,2],
    tags: ['No lighting','Isolated','Avoid after dark'],
    type: 'open',
    reviews: [
      { name: 'Pooja V.', text: 'Beautiful for morning walks. Zero lighting after 6 PM. Do not go alone at night.', time: '7 PM · Today', upvotes: 52 },
      { name: 'Aruna D.', text: 'Morning is lovely. Evenings are a risk.', time: '6 AM · Yesterday', upvotes: 27 },
    ]
  },
  {
    id: 'z6', name: 'Old Town Quarter', lat: -0.007, lng: -0.003, radius: 260,
    hourlyScore: [3,3,3,3,3,4,5,7,8,8,9,8,8,7,7,6,5,4,3,3,3,3,3,3],
    tags: ['Narrow streets','Mixed safety','Daytime fine'],
    type: 'market',
    reviews: [
      { name: 'Lakshmi B.', text: 'Fine during day but the lanes near the temple are deserted at night.', time: '9 PM · 4 days ago', upvotes: 14 },
    ]
  },
  {
    id: 'z7', name: 'Hospital District', lat: -0.003, lng: 0.010, radius: 200,
    hourlyScore: [7,7,7,7,7,7,8,8,9,9,9,9,9,9,8,8,8,8,8,8,7,7,7,7],
    tags: ['24/7 activity','Well-lit','Security'],
    type: 'institution',
    reviews: [
      { name: 'Dr. Swathi R.', text: 'Always people around, security guards present round the clock.', time: '2 AM · Today', upvotes: 33 },
    ]
  },
]

export const INITIAL_PULSES = [
  { id: 'p1', type: 'safe',       lat: 0.005,  lng: 0.009,  text: 'Police van parked here. Very calm.',             time: '3 min ago',  anonymous: true },
  { id: 'p2', type: 'incident',   lat: 0.010,  lng: 0.003,  text: 'Group of men loitering near river steps.',        time: '11 min ago', anonymous: true },
  { id: 'p3', type: 'lights_out', lat: -0.007, lng: -0.003, text: 'Street light near junction is broken.',           time: '30 min ago', anonymous: false, name: 'Sneha R.' },
  { id: 'p4', type: 'caution',    lat: -0.004, lng: 0.006,  text: 'Auto drivers being aggressive at stand exit.',    time: '1h ago',     anonymous: true },
  { id: 'p5', type: 'safe',       lat: -0.003, lng: 0.010,  text: 'Hospital security just did round. All clear.',    time: '2h ago',     anonymous: false, name: 'Dr. Swathi R.' },
]
