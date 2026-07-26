export const districts = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", "Hubballi",
  "Belagavi", "Kalaburagi", "Ballari", "Vijayapura", "Tumakuru", "Shivamogga", "Udupi",
];

export const crimeCategories = [
  "Theft", "Assault", "Cybercrime", "Homicide", "Fraud", "Narcotics", "Kidnapping", "Vandalism",
];

export const statusColors = {
  Open: "bg-warning/15 text-warning border-warning/30",
  Closed: "bg-success/15 text-success border-success/30",
  "Under Investigation": "bg-primary/10 text-primary border-primary/30",
  Pending: "bg-muted text-muted-foreground border-border",
} as const;

export const summaryStats = {
  todayCases: 128,
  openCases: 3421,
  solvedCases: 8712,
  pending: 942,
};

export const crimeTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  cases: 400 + Math.round(Math.random() * 300),
  solved: 250 + Math.round(Math.random() * 200),
}));

export const districtComparison = districts.slice(0, 8).map((d) => ({
  district: d,
  cases: 200 + Math.round(Math.random() * 800),
}));

export const crimeDistribution = crimeCategories.map((c) => ({
  name: c,
  value: 50 + Math.round(Math.random() * 300),
}));

export const firs = Array.from({ length: 24 }, (_, i) => ({
  id: `FIR-${2026}-${1000 + i}`,
  title: `${crimeCategories[i % crimeCategories.length]} reported at ${districts[i % districts.length]}`,
  district: districts[i % districts.length],
  category: crimeCategories[i % crimeCategories.length],
  status: (["Open","Under Investigation","Closed","Pending"] as const)[i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  officer: ["Insp. R. Kumar","SI. A. Rao","Insp. M. Shetty","SI. P. Naik"][i % 4],
}));

export const victims = Array.from({ length: 20 }, (_, i) => ({
  id: `VIC-${5000+i}`,
  name: ["Ramesh K","Suma R","Anil J","Priya S","Vikram N","Divya P"][i % 6] + ` ${i}`,
  age: 18 + (i * 3) % 50,
  gender: i % 2 === 0 ? "Male" : "Female",
  district: districts[i % districts.length],
  linkedFIR: `FIR-2026-${1000 + i}`,
}));

export const accused = Array.from({ length: 20 }, (_, i) => ({
  id: `ACC-${8000+i}`,
  name: ["Rakesh B","Manoj D","Farhan A","Suresh L","Kiran V"][i % 5] + ` ${i}`,
  age: 20 + (i * 2) % 40,
  district: districts[i % districts.length],
  status: (["Arrested","Wanted","Bailed","Convicted"] as const)[i % 4],
  repeat: i % 3 === 0,
}));

export const arrests = Array.from({ length: 15 }, (_, i) => ({
  id: `ARR-${3000+i}`,
  accused: `Rakesh B ${i}`,
  fir: `FIR-2026-${1000 + i}`,
  date: new Date(Date.now() - i * 172800000).toISOString().slice(0,10),
  officer: "Insp. R. Kumar",
  district: districts[i % districts.length],
}));

export const chargeSheets = Array.from({ length: 12 }, (_, i) => ({
  id: `CS-${4000+i}`,
  fir: `FIR-2026-${1000 + i}`,
  filedOn: new Date(Date.now() - i * 259200000).toISOString().slice(0,10),
  court: ["JMFC Bengaluru","Sessions Mysuru","JMFC Hubballi"][i % 3],
  status: (["Filed","Pending","Accepted"] as const)[i % 3],
}));

export const hotspots = districts.slice(0, 6).map((d, i) => ({
  district: d,
  risk: 60 + Math.round(Math.random() * 40),
  cases: 100 + Math.round(Math.random() * 400),
  trend: i % 2 === 0 ? "up" : "down",
}));

export const crimeMapMarkers = [
  { id: 1, lat: 12.9716, lng: 77.5946, title: "Theft — MG Road", type: "Theft" },
  { id: 2, lat: 12.2958, lng: 76.6394, title: "Assault — Mysuru", type: "Assault" },
  { id: 3, lat: 12.9141, lng: 74.856, title: "Fraud — Mangaluru", type: "Fraud" },
  { id: 4, lat: 15.3647, lng: 75.124, title: "Cybercrime — Hubballi", type: "Cybercrime" },
  { id: 5, lat: 15.8497, lng: 74.4977, title: "Narcotics — Belagavi", type: "Narcotics" },
  { id: 6, lat: 17.3297, lng: 76.8343, title: "Homicide — Kalaburagi", type: "Homicide" },
  { id: 7, lat: 15.1394, lng: 76.9214, title: "Theft — Ballari", type: "Theft" },
];

export const predictions = {
  riskScore: 78,
  confidence: 92,
  trend: Array.from({ length: 8 }, (_, i) => ({ week: `W${i+1}`, risk: 40 + Math.round(Math.random()*50) })),
  highRiskAreas: districts.slice(0, 5).map((d) => ({ district: d, score: 70 + Math.round(Math.random()*25) })),
  categoryPrediction: crimeCategories.slice(0,5).map(c => ({ category: c, probability: Math.round(50 + Math.random()*45) })),
};

export const aiInsights = [
  { title: "Cluster detected — Cybercrime spike", desc: "12% surge in Bengaluru Urban tied to UPI fraud pattern.", confidence: 91, type: "Pattern" },
  { title: "Repeat offender resurfacing", desc: "Suspect ACC-8012 linked to 3 new FIRs in past 30 days.", confidence: 87, type: "Behavior" },
  { title: "Correlation: Narcotics ↔ Highway routes", desc: "Strong link between narcotics seizures and NH-48 corridor.", confidence: 84, type: "Correlation" },
  { title: "Emerging trend — Weekend assaults", desc: "Assault incidents 22% higher on weekends across 4 districts.", confidence: 79, type: "Trend" },
];

export const notifications = Array.from({ length: 10 }, (_, i) => ({
  id: `N-${i}`,
  title: ["New FIR filed","AI Alert","Charge sheet accepted","Suspect arrested","System warning"][i % 5],
  message: "Details for notification " + i,
  time: `${i+1}h ago`,
  priority: (["High","Medium","Low"] as const)[i % 3],
  read: i > 4,
}));

export const auditLogs = Array.from({ length: 15 }, (_, i) => ({
  id: `A-${i}`,
  user: ["admin","insp.kumar","analyst01","viewer42"][i % 4],
  action: ["Login","Updated FIR","Deleted record","Exported report","Viewed dashboard"][i % 5],
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  severity: (["Info","Warning","Critical"] as const)[i % 3],
}));

export const graphNodes = [
  { id: "s1", type: "input", data: { label: "Suspect: Rakesh B" }, position: { x: 0, y: 0 } },
  { id: "s2", data: { label: "Suspect: Manoj D" }, position: { x: 250, y: -80 } },
  { id: "v1", data: { label: "Victim: Suma R" }, position: { x: 250, y: 120 } },
  { id: "l1", data: { label: "Location: MG Road" }, position: { x: 500, y: 0 } },
  { id: "c1", data: { label: "Case: FIR-2026-1002" }, position: { x: 500, y: 180 } },
  { id: "o1", type: "output", data: { label: "Org: NH-48 Ring" }, position: { x: 750, y: 60 } },
];

export const graphEdges = [
  { id: "e1", source: "s1", target: "l1", label: "seen at" },
  { id: "e2", source: "s1", target: "v1", label: "accused of" },
  { id: "e3", source: "s2", target: "l1", label: "seen at" },
  { id: "e4", source: "v1", target: "c1", label: "victim in" },
  { id: "e5", source: "s1", target: "c1", label: "named in" },
  { id: "e6", source: "s2", target: "o1", label: "member" },
  { id: "e7", source: "s1", target: "o1", label: "member" },
];

export const healthServices = [
  { name: "Authentication", status: "healthy" },
  { name: "Data Store", status: "healthy" },
  { name: "NoSQL", status: "healthy" },
  { name: "Cache", status: "warning" },
  { name: "Signals", status: "healthy" },
  { name: "Circuits", status: "healthy" },
  { name: "Cron", status: "healthy" },
  { name: "AppSail", status: "warning" },
  { name: "AI Engine", status: "healthy" },
  { name: "Graph Engine", status: "healthy" },
  { name: "Report Engine", status: "offline" },
] as const;

export const reports = Array.from({ length: 8 }, (_, i) => ({
  id: `RPT-${i+1}`,
  name: ["Monthly Crime Summary","District Report","AI Predictions","Hotspot Analysis"][i % 4] + ` — ${["Jan","Feb","Mar","Apr"][i%4]}`,
  createdOn: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
  by: "SCRB Admin",
  size: `${(1 + Math.random()*4).toFixed(1)} MB`,
}));
