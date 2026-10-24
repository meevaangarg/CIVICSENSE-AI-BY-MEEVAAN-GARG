export interface CivicIncident {
  id: string;
  trackingCode: string;
  title: string;
  category: 'Solid Waste' | 'Road Hazard' | 'Water & Drainage' | 'Air Quality';
  department: 'MCD' | 'PWD' | 'DJB' | 'DPCC';
  ward: string;
  location: string;
  coordinates: [number, number]; // [lat, lon]
  severity: 1 | 2 | 3 | 4 | 5;
  status: 'Reported' | 'Triaged' | 'Dispatched' | 'Resolved' | 'Verified';
  citizenReportsCount: number;
  reportedAgo: string;
  slaHours: number;
  description: string;
  audioTranscriptHindi?: string;
  audioTranscriptEnglish?: string;
  imageUrl: string;
  resolvedImageUrl?: string;
  requiredEquipment: string[];
  estimatedCostInr: number;
  rootCauseAnalysis: string;
  verificationStatus?: 'Pending' | 'Verified Authenticated' | 'Flagged Fraudulent';
}

export const INITIAL_INCIDENTS: CivicIncident[] = [
  {
    id: 'inc-001',
    trackingCode: 'MCD-2026-DEL-0891',
    title: 'Overflowing Secondary Dhalao Spilling Onto Main Road',
    category: 'Solid Waste',
    department: 'MCD',
    ward: 'Ward 142-S (Lajpat Nagar IV)',
    location: 'Near Central Market Roundabout, F-Block',
    coordinates: [28.5672, 77.2435],
    severity: 5,
    status: 'Dispatched',
    citizenReportsCount: 23,
    reportedAgo: '3 hours ago',
    slaHours: 12,
    description: 'Massive garbage heap overflowing from municipal concrete bin, obstructing 40% of the two-lane carriage way. Severe foul odor and stray cattle hazard creating blind traffic risk.',
    audioTranscriptHindi: 'Bhai yahan kudedan pura sadak pe fail gaya hai, gaadiyon ka nikalna mushkil ho raha hai aur badboo itni hai ki log pareshan hain.',
    audioTranscriptEnglish: 'The waste bin has completely spilled onto the road, making vehicle passage difficult and causing severe stench for nearby residents.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    resolvedImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    requiredEquipment: ['1x JCB Backhoe Loader', '2x 5-ton Covered Tipper Trucks', 'Bleaching Powder Sprayer'],
    estimatedCostInr: 14500,
    rootCauseAnalysis: 'The nearest primary compacting station at Okhla is currently operating at 120% capacity, causing private cart operators to dump here instead.',
    verificationStatus: 'Verified Authenticated'
  },
  {
    id: 'inc-002',
    trackingCode: 'PWD-2026-DEL-1044',
    title: 'Severe Arterial Pothole Cluster Post Monsoon Burst',
    category: 'Road Hazard',
    department: 'PWD',
    ward: 'Ward 88-N (Ring Road Kashmere Gate)',
    location: 'Underneath ISBT Flyover Loop, North Delhi',
    coordinates: [28.6692, 77.2315],
    severity: 4,
    status: 'Triaged',
    citizenReportsCount: 16,
    reportedAgo: '5 hours ago',
    slaHours: 24,
    description: 'Sub-base soil erosion causing 3 consecutive deep craters (approx 18cm depth) on the high-speed descent loop. High risk of two-wheeler skids and nocturnal accidents.',
    audioTranscriptHindi: 'ISBT flyover ke niche sadak par teen bade gaddhe ban gaye hain, kal raat do scooty wale gir gaye the.',
    audioTranscriptEnglish: 'Three large craters have formed beneath the ISBT flyover loop; two scooters had accidents last night.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    requiredEquipment: ['Cold Bitumen Premix 2.5 Tons', 'Plate Compactor', 'Reflective Hazard Cones'],
    estimatedCostInr: 28000,
    rootCauseAnalysis: 'Stormwater drainage curb was damaged during fiber optic cable trenching, diverting runoff straight across the asphalt foundation.',
    verificationStatus: 'Pending'
  },
  {
    id: 'inc-003',
    trackingCode: 'DJB-2026-DEL-0412',
    title: 'Underground Potable Water Main Rupture with Road Submersion',
    category: 'Water & Drainage',
    department: 'DJB',
    ward: 'Ward 156-S (Hauz Khas Village Road)',
    location: 'Opposite Deer Park Gate 2',
    coordinates: [28.5494, 77.1956],
    severity: 5,
    status: 'Dispatched',
    citizenReportsCount: 31,
    reportedAgo: '1 hour ago',
    slaHours: 6,
    description: 'Pressurized 400mm potable feeder pipeline fractured, releasing clean drinking water at high pressure. Complete road submergence across 150-meter stretch.',
    audioTranscriptHindi: 'Water supply pipeline fat gayi hai, sara peene ka paani gali mein beh raha hai aur gharon mein paani nahi aa raha.',
    audioTranscriptEnglish: 'Water supply pipeline has ruptured, potable water is gushing across the road and residential supply is cut off.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
    requiredEquipment: ['Hydraulic Pipe Clamp 400mm', 'High-Capacity Sludge Pump', 'Welding Generator Unit'],
    estimatedCostInr: 42000,
    rootCauseAnalysis: 'Cast-iron pipe laid in 1988 failed due to fatigue corrosion combined with recent heavy road transport loads.',
    verificationStatus: 'Pending'
  },
  {
    id: 'inc-004',
    trackingCode: 'DPCC-2026-DEL-0219',
    title: 'Open Biomass and Plastic Waste Burning in Vacant Plot',
    category: 'Air Quality',
    department: 'DPCC',
    ward: 'Ward 210-E (Anand Vihar)',
    location: 'Plot 44, Behind Kaushambi Border Bus Stand',
    coordinates: [28.6469, 77.3160],
    severity: 4,
    status: 'Reported',
    citizenReportsCount: 12,
    reportedAgo: '45 minutes ago',
    slaHours: 4,
    description: 'Uncontrolled night burning of horticultural and packaging scrap generating dense acrid smoke plume. Local air sensor showing PM2.5 spike beyond 680 ug/m3.',
    audioTranscriptHindi: 'Border ke paas khali plot mein kachra jalaya ja raha hai, dhuan itna zyada hai ki saans lena mushkil ho gaya hai.',
    audioTranscriptEnglish: 'Trash is being burned in an open plot near the border; dense smoke is causing acute breathing difficulty.',
    imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=800&q=80',
    requiredEquipment: ['Mobile Anti-Smog Gun', 'MCD Enforcement Squad', 'Water Bowsers'],
    estimatedCostInr: 9500,
    rootCauseAnalysis: 'Informal scrap salvagers stripping wiring insulation and burning packaging residue instead of paying commercial recycling transit fees.',
    verificationStatus: 'Pending'
  },
  {
    id: 'inc-005',
    trackingCode: 'MCD-2026-DEL-0943',
    title: 'Open Deep Stormwater Drain Without Safety Slabs',
    category: 'Water & Drainage',
    department: 'MCD',
    ward: 'Ward 42-W (Punjabi Bagh West)',
    location: 'Road 34, Outside Government Primary School',
    coordinates: [28.6658, 77.1294],
    severity: 5,
    status: 'Triaged',
    citizenReportsCount: 28,
    reportedAgo: '6 hours ago',
    slaHours: 12,
    description: 'Four concrete cover slabs over a 6-foot deep stormwater drain have collapsed. Direct danger to primary schoolchildren during morning arrival and evening departure.',
    audioTranscriptHindi: 'School ke theek samne naale ke patle toot gaye hain, 6 foot gehra naala khula pada hai, koi bhi bacha gir sakta hai.',
    audioTranscriptEnglish: 'Drain cover slabs in front of the school are broken; 6-foot deep drain is wide open and hazardous for school children.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    requiredEquipment: ['4x Reinforced Concrete Slabs (1.5m x 0.8m)', 'Hydraulic Mobile Crane', 'Barricading Tape'],
    estimatedCostInr: 18500,
    rootCauseAnalysis: 'Heavy delivery lorries illegally mounting pedestrian footpath at night to bypass road congestion.',
    verificationStatus: 'Pending'
  }
];

export const DELHI_AGENCIES = [
  {
    code: 'MCD',
    name: 'Municipal Corporation of Delhi',
    jurisdiction: 'Colony roads (<60ft), Sanitation, Solid Waste, Parks, Vector Control',
    contactDesk: '155305 / Toll-free Central Grievance',
    avgResolutionTime: '24.2 Hours',
    activeWardsCovered: 250,
    activeIncidents: 114
  },
  {
    code: 'PWD',
    name: 'Public Works Department (Delhi Govt)',
    jurisdiction: 'Major arterial roads (>60ft), Flyovers, Underpasses, Master Storm Drains',
    contactDesk: '1800-11-0093 / PWD Control Room',
    avgResolutionTime: '18.6 Hours',
    activeWardsCovered: 70,
    activeIncidents: 42
  },
  {
    code: 'DJB',
    name: 'Delhi Jal Board',
    jurisdiction: 'Potable Water Pipelines, Sewage Trunk Lines, Water Treatment Facilities',
    contactDesk: '1916 / Water Emergency Helpline',
    avgResolutionTime: '12.4 Hours',
    activeWardsCovered: 250,
    activeIncidents: 36
  },
  {
    code: 'DPCC',
    name: 'Delhi Pollution Control Committee',
    jurisdiction: 'Air Pollution Hotspots, Industrial Effluents, Biomass & Construction Dust',
    contactDesk: 'Green Delhi App & CAQM Portal',
    avgResolutionTime: '8.1 Hours',
    activeWardsCovered: 11,
    activeIncidents: 19
  }
];
