from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from random import Random
from typing import Any


RNG = Random(42)

DISTRICTS = [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Mangaluru",
    "Hubballi-Dharwad",
    "Belagavi",
    "Kalaburagi",
    "Ballari",
    "Vijayapura",
    "Tumakuru",
    "Shivamogga",
    "Udupi",
    "Mysuru City",
    "Ramanagara",
    "Chikkamagaluru",
    "Davanagere",
]

POLICE_STATIONS = [
    {"id": "PS-1001", "name": "MG Road PS", "district": "Bengaluru Urban"},
    {"id": "PS-1002", "name": "Koramangala PS", "district": "Bengaluru Urban"},
    {"id": "PS-1003", "name": "Mysuru North PS", "district": "Mysuru"},
    {"id": "PS-1004", "name": "Mangaluru City PS", "district": "Mangaluru"},
    {"id": "PS-1005", "name": "Hubballi Town PS", "district": "Hubballi-Dharwad"},
    {"id": "PS-1006", "name": "Belagavi Rural PS", "district": "Belagavi"},
    {"id": "PS-1007", "name": "Kalaburagi North PS", "district": "Kalaburagi"},
    {"id": "PS-1008", "name": "Ballari City PS", "district": "Ballari"},
    {"id": "PS-1009", "name": "Vijayapura Town PS", "district": "Vijayapura"},
    {"id": "PS-1010", "name": "Tumakuru East PS", "district": "Tumakuru"},
]

COURTS = [
    "JMFC Bengaluru",
    "JMFC Mysuru",
    "Sessions Court Mangaluru",
    "JMFC Hubballi",
    "Sessions Court Belagavi",
]

CRIME_HEADS = [
    {"id": "H01", "name": "Offences Against Property"},
    {"id": "H02", "name": "Offences Against Body"},
    {"id": "H03", "name": "Cyber Crime"},
    {"id": "H04", "name": "Economic Offences"},
    {"id": "H05", "name": "Public Order Offences"},
]

CRIME_SUBHEADS = [
    {"id": "S01", "headId": "H01", "name": "Theft"},
    {"id": "S02", "headId": "H01", "name": "Burglary"},
    {"id": "S03", "headId": "H02", "name": "Assault"},
    {"id": "S04", "headId": "H02", "name": "Homicide"},
    {"id": "S05", "headId": "H03", "name": "UPI Fraud"},
    {"id": "S06", "headId": "H03", "name": "Phishing"},
    {"id": "S07", "headId": "H04", "name": "Forgery"},
    {"id": "S08", "headId": "H04", "name": "Money Laundering"},
    {"id": "S09", "headId": "H05", "name": "Narcotics"},
    {"id": "S10", "headId": "H05", "name": "Public Disturbance"},
]

USERS = [
    {
        "id": "USR-1",
        "name": "R. Sharma",
        "email": "r.sharma@ksp.gov.in",
        "role": "SCRB Administrator",
        "district": "Bengaluru Urban",
        "designation": "Deputy Inspector General",
        "phone": "+91 98450 12345",
        "password": "admin123",
    },
    {
        "id": "USR-2",
        "name": "A. Rao",
        "email": "a.rao@ksp.gov.in",
        "role": "Analyst",
        "district": "Mysuru",
        "designation": "Crime Analyst",
        "phone": "+91 98450 23456",
        "password": "analyst123",
    },
]

STATUS_SEQUENCE = ["Open", "Under Investigation", "Closed", "Pending"]
PRIORITIES = ["Low", "Medium", "High", "Critical"]
GENDERS = ["Male", "Female", "Other"]


@dataclass
class MockDataStore:
    users: list[dict[str, Any]] = field(default_factory=list)
    cases: list[dict[str, Any]] = field(default_factory=list)
    victims: list[dict[str, Any]] = field(default_factory=list)
    accused: list[dict[str, Any]] = field(default_factory=list)
    employees: list[dict[str, Any]] = field(default_factory=list)
    arrests: list[dict[str, Any]] = field(default_factory=list)
    chargesheets: list[dict[str, Any]] = field(default_factory=list)
    notifications: list[dict[str, Any]] = field(default_factory=list)
    audit_logs: list[dict[str, Any]] = field(default_factory=list)
    reports: list[dict[str, Any]] = field(default_factory=list)
    alerts: list[dict[str, Any]] = field(default_factory=list)
    ai_insights: list[dict[str, Any]] = field(default_factory=list)
    graph: dict[str, Any] = field(default_factory=dict)
    dashboard_summary: dict[str, Any] = field(default_factory=dict)
    hotspots: list[dict[str, Any]] = field(default_factory=list)
    predictions: dict[str, Any] = field(default_factory=dict)
    health_services: list[dict[str, Any]] = field(default_factory=list)
    districts: list[str] = field(default_factory=list)
    police_stations: list[dict[str, Any]] = field(default_factory=list)
    courts: list[str] = field(default_factory=list)
    crime_heads: list[dict[str, Any]] = field(default_factory=list)
    crime_subheads: list[dict[str, Any]] = field(default_factory=list)
    current_user_email: str = "r.sharma@ksp.gov.in"
    case_counter: int = 2000
    victim_counter: int = 5000
    accused_counter: int = 8000

    @classmethod
    def create(cls) -> "MockDataStore":
        store = cls()
        store.users = deepcopy(USERS)
        store.districts = deepcopy(DISTRICTS)
        store.police_stations = deepcopy(POLICE_STATIONS)
        store.courts = deepcopy(COURTS)
        store.crime_heads = deepcopy(CRIME_HEADS)
        store.crime_subheads = deepcopy(CRIME_SUBHEADS)
        store.cases = _build_cases()
        store.victims = _build_victims(store.cases)
        store.accused = _build_accused(store.cases)
        store.employees = _build_employees()
        store.arrests = _build_arrests(store.cases)
        store.chargesheets = _build_chargesheets(store.cases)
        store.notifications = _build_notifications()
        store.audit_logs = _build_audit_logs()
        store.reports = _build_reports()
        store.alerts = _build_alerts()
        store.ai_insights = _build_ai_insights()
        store.graph = _build_graph()
        store.dashboard_summary = _build_dashboard_summary(store.cases)
        store.hotspots = _build_hotspots(store.cases)
        store.predictions = _build_predictions()
        store.health_services = _build_health_services()
        store.case_counter = 2000 + len(store.cases)
        store.victim_counter = 5000 + len(store.victims)
        store.accused_counter = 8000 + len(store.accused)
        return store

    def get_current_user(self) -> dict[str, Any]:
        return deepcopy(next(user for user in self.users if user["email"] == self.current_user_email))

    def list_cases(self) -> list[dict[str, Any]]:
        return deepcopy(self.cases)

    def get_case(self, case_id: str) -> dict[str, Any] | None:
        case = next((item for item in self.cases if item["id"] == case_id), None)
        return deepcopy(case) if case else None

    def create_case(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.case_counter += 1
        case = {
            "id": payload.get("id") or f"FIR-2026-{self.case_counter}",
            "title": payload.get("title") or "New FIR registered",
            "district": payload.get("district") or self.districts[0],
            "category": payload.get("category") or "Theft",
            "status": payload.get("status") or "Open",
            "date": payload.get("date") or date.today().isoformat(),
            "officer": payload.get("officer") or "SI. A. Rao",
            "station": payload.get("station") or "MG Road PS",
            "time": payload.get("time") or "09:00",
            "description": payload.get("description") or "Case recorded in mock repository",
            "victim": payload.get("victim") or "Unknown",
            "accused": payload.get("accused") or "Unknown",
            "evidence": payload.get("evidence") or "Pending evidence capture",
            "priority": payload.get("priority") or "Medium",
        }
        self.cases.insert(0, case)
        self.dashboard_summary = _build_dashboard_summary(self.cases)
        self.hotspots = _build_hotspots(self.cases)
        return deepcopy(case)

    def update_case(self, case_id: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        for index, case in enumerate(self.cases):
            if case["id"] == case_id:
                self.cases[index] = {**case, **{k: v for k, v in payload.items() if v is not None}}
                self.dashboard_summary = _build_dashboard_summary(self.cases)
                self.hotspots = _build_hotspots(self.cases)
                return deepcopy(self.cases[index])
        return None

    def delete_case(self, case_id: str) -> bool:
        before = len(self.cases)
        self.cases = [case for case in self.cases if case["id"] != case_id]
        if len(self.cases) != before:
            self.dashboard_summary = _build_dashboard_summary(self.cases)
            self.hotspots = _build_hotspots(self.cases)
            return True
        return False

    def list_victims(self) -> list[dict[str, Any]]:
        return deepcopy(self.victims)

    def create_victim(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.victim_counter += 1
        victim = {
            "id": payload.get("id") or f"VIC-{self.victim_counter}",
            "name": payload.get("name") or "New Victim",
            "age": int(payload.get("age") or 0),
            "gender": payload.get("gender") or "Unknown",
            "district": payload.get("district") or self.districts[0],
            "linkedFIR": payload.get("linkedFIR") or self.cases[0]["id"],
        }
        self.victims.insert(0, victim)
        return deepcopy(victim)

    def list_accused(self) -> list[dict[str, Any]]:
        return deepcopy(self.accused)

    def create_accused(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.accused_counter += 1
        accused = {
            "id": payload.get("id") or f"ACC-{self.accused_counter}",
            "name": payload.get("name") or "New Accused",
            "age": int(payload.get("age") or 0),
            "district": payload.get("district") or self.districts[0],
            "status": payload.get("status") or "Wanted",
            "repeat": bool(payload.get("repeat", False)),
        }
        self.accused.insert(0, accused)
        return deepcopy(accused)

    def list_employees(self) -> list[dict[str, Any]]:
        return deepcopy(self.employees)

    def list_arrests(self) -> list[dict[str, Any]]:
        return deepcopy(self.arrests)

    def list_chargesheets(self) -> list[dict[str, Any]]:
        return deepcopy(self.chargesheets)

    def list_reports(self) -> list[dict[str, Any]]:
        return deepcopy(self.reports)

    def list_notifications(self) -> list[dict[str, Any]]:
        return deepcopy(self.notifications)

    def list_audit_logs(self) -> list[dict[str, Any]]:
        return deepcopy(self.audit_logs)

    def list_alerts(self) -> list[dict[str, Any]]:
        return deepcopy(self.alerts)

    def list_ai_insights(self) -> list[dict[str, Any]]:
        return deepcopy(self.ai_insights)

    def list_health_services(self) -> list[dict[str, Any]]:
        return deepcopy(self.health_services)

    def get_dashboard_summary(self) -> dict[str, Any]:
        return deepcopy(self.dashboard_summary)

    def get_hotspots(self) -> list[dict[str, Any]]:
        return deepcopy(self.hotspots)

    def get_recent_cases(self, limit: int = 8) -> list[dict[str, Any]]:
        return deepcopy(self.cases[:limit])

    def get_predictions(self) -> dict[str, Any]:
        return deepcopy(self.predictions)

    def get_bootstrap(self) -> dict[str, Any]:
        return {
            "user": self.get_current_user(),
            "districts": deepcopy(self.districts),
            "healthServices": self.list_health_services(),
            "recentCases": self.get_recent_cases(8),
            "reports": self.list_reports(),
            "notifications": self.list_notifications(),
        }

    def get_graph(self) -> dict[str, Any]:
        return deepcopy(self.graph)

    def login(self, email: str, password: str) -> dict[str, Any] | None:
        user = next((item for item in self.users if item["email"].lower() == email.lower() and item["password"] == password), None)
        return deepcopy(user) if user else None

    def list_districts(self) -> list[str]:
        return deepcopy(self.districts)

    def list_police_stations(self) -> list[dict[str, Any]]:
        return deepcopy(self.police_stations)

    def list_courts(self) -> list[str]:
        return deepcopy(self.courts)

    def list_crime_heads(self) -> list[dict[str, Any]]:
        return deepcopy(self.crime_heads)

    def list_crime_subheads(self) -> list[dict[str, Any]]:
        return deepcopy(self.crime_subheads)

def _days_ago(days: int) -> str:
    return (datetime.utcnow() - timedelta(days=days)).date().isoformat()


def _build_cases() -> list[dict[str, Any]]:
    templates = [
        ("Theft", "Open", "SI. A. Rao", "MG Road PS", "Vehicle theft near commercial corridor"),
        ("Cybercrime", "Under Investigation", "Insp. R. Kumar", "Koramangala PS", "UPI fraud complaint involving multiple accounts"),
        ("Assault", "Closed", "SI. P. Naik", "Mysuru North PS", "Night-time assault during public event"),
        ("Narcotics", "Pending", "Insp. M. Shetty", "Mangaluru City PS", "Seizure along highway checkpoint"),
        ("Fraud", "Open", "SI. A. Rao", "Hubballi Town PS", "Land document forgery case"),
        ("Homicide", "Under Investigation", "Insp. R. Kumar", "Belagavi Rural PS", "Murder inquiry with witness statements"),
    ]
    cases: list[dict[str, Any]] = []
    for index in range(36):
        crime, status, officer, station, description = templates[index % len(templates)]
        district = DISTRICTS[index % len(DISTRICTS)]
        cases.append(
            {
                "id": f"FIR-2026-{1000 + index}",
                "title": f"{crime} reported at {district}",
                "district": district,
                "category": crime,
                "status": status,
                "date": _days_ago(index),
                "officer": officer,
                "station": station,
                "time": f"{8 + (index % 10):02d}:{(index * 7) % 60:02d}",
                "description": description,
                "victim": f"Victim {index + 1}",
                "accused": f"Accused {index + 1}",
                "evidence": "CCTV clips, statement notes, seizure memo",
                "priority": PRIORITIES[index % len(PRIORITIES)],
            }
        )
    return cases


def _build_victims(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    victims: list[dict[str, Any]] = []
    names = ["Ramesh K", "Suma R", "Anil J", "Priya S", "Vikram N", "Divya P", "Naveen H", "Shilpa M"]
    for index in range(24):
        victims.append(
            {
                "id": f"VIC-{5000 + index}",
                "name": f"{names[index % len(names)]} {index}",
                "age": 19 + (index * 3) % 42,
                "gender": GENDERS[index % len(GENDERS)],
                "district": DISTRICTS[index % len(DISTRICTS)],
                "linkedFIR": cases[index % len(cases)]["id"],
            }
        )
    return victims


def _build_accused(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    accused: list[dict[str, Any]] = []
    names = ["Rakesh B", "Manoj D", "Farhan A", "Suresh L", "Kiran V", "Mahesh P"]
    statuses = ["Arrested", "Wanted", "Bailed", "Convicted"]
    for index in range(24):
        accused.append(
            {
                "id": f"ACC-{8000 + index}",
                "name": f"{names[index % len(names)]} {index}",
                "age": 21 + (index * 2) % 35,
                "district": DISTRICTS[index % len(DISTRICTS)],
                "status": statuses[index % len(statuses)],
                "repeat": index % 3 == 0,
                "linkedFIR": cases[index % len(cases)]["id"],
            }
        )
    return accused


def _build_employees() -> list[dict[str, Any]]:
    roles = ["Inspector", "Sub-Inspector", "Constable", "Head Constable"]
    return [
        {
            "id": f"EMP-{200 + index}",
            "name": f"Officer {index + 1}",
            "district": DISTRICTS[index % len(DISTRICTS)],
            "station": POLICE_STATIONS[index % len(POLICE_STATIONS)]["name"],
            "rank": roles[index % len(roles)],
            "designation": ["Investigating Officer", "Station House Officer", "Analyst", "Patrol Lead"][index % 4],
            "status": ["Active", "On Duty", "On Leave"][index % 3],
        }
        for index in range(28)
    ]


def _build_arrests(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    arrests: list[dict[str, Any]] = []
    for index in range(18):
        arrests.append(
            {
                "id": f"ARR-{3000 + index}",
                "accused": f"Accused {index + 1}",
                "fir": cases[index % len(cases)]["id"],
                "date": _days_ago(index * 2),
                "officer": ["Insp. R. Kumar", "SI. A. Rao", "SI. P. Naik"][index % 3],
                "district": DISTRICTS[index % len(DISTRICTS)],
            }
        )
    return arrests


def _build_chargesheets(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    statuses = ["Filed", "Pending", "Accepted"]
    return [
        {
            "id": f"CS-{4000 + index}",
            "fir": cases[index % len(cases)]["id"],
            "filedOn": _days_ago(index * 3),
            "court": COURTS[index % len(COURTS)],
            "status": statuses[index % len(statuses)],
        }
        for index in range(16)
    ]


def _build_notifications() -> list[dict[str, Any]]:
    titles = ["New FIR filed", "AI Alert", "Charge sheet accepted", "Suspect arrested", "System warning"]
    return [
        {
            "id": f"N-{index}",
            "title": titles[index % len(titles)],
            "message": f"Notification {index} generated by the mock backend",
            "time": f"{index + 1}h ago",
            "priority": ["High", "Medium", "Low"][index % 3],
            "read": index > 4,
        }
        for index in range(12)
    ]


def _build_audit_logs() -> list[dict[str, Any]]:
    actions = ["Login", "Updated FIR", "Deleted record", "Exported report", "Viewed dashboard"]
    users = ["admin", "insp.kumar", "analyst01", "viewer42"]
    severities = ["Info", "Warning", "Critical"]
    return [
        {
            "id": f"A-{index}",
            "user": users[index % len(users)],
            "action": actions[index % len(actions)],
            "timestamp": (datetime.utcnow() - timedelta(hours=index)).isoformat(),
            "severity": severities[index % len(severities)],
        }
        for index in range(18)
    ]


def _build_reports() -> list[dict[str, Any]]:
    names = ["Monthly Crime Summary", "District Report", "AI Predictions", "Hotspot Analysis"]
    return [
        {
            "id": f"RPT-{index + 1}",
            "name": f"{names[index % len(names)]} — {['Jan', 'Feb', 'Mar', 'Apr'][index % 4]}",
            "createdOn": _days_ago(index),
            "by": "SCRB Admin",
            "size": f"{(1.2 + RNG.random() * 4.2):.1f} MB",
        }
        for index in range(10)
    ]


def _build_alerts() -> list[dict[str, Any]]:
    return [
        {
            "id": f"AL-{index}",
            "title": title,
            "severity": ["High", "Medium", "Low"][index % 3],
            "district": DISTRICTS[index % len(DISTRICTS)],
            "message": message,
            "timestamp": (datetime.utcnow() - timedelta(hours=index * 2)).isoformat(),
        }
        for index, (title, message) in enumerate(
            [
                ("Cybercrime spike", "Bengaluru Urban UPI fraud incidents are trending up."),
                ("Repeat offender resurfacing", "Linked FIRs suggest possible coordinated activity."),
                ("Narcotics corridor", "High-risk movement detected along NH-48."),
                ("Weekend assault trend", "Assault cases increase on Friday and Saturday evenings."),
            ]
        )
    ]


def _build_ai_insights() -> list[dict[str, Any]]:
    return [
        {
            "title": "Cluster detected — Cybercrime spike",
            "desc": "12% surge in Bengaluru Urban tied to UPI fraud pattern.",
            "confidence": 91,
            "type": "Pattern",
        },
        {
            "title": "Repeat offender resurfacing",
            "desc": "Suspect ACC-8012 linked to 3 new FIRs in past 30 days.",
            "confidence": 87,
            "type": "Behavior",
        },
        {
            "title": "Correlation: Narcotics ↔ Highway routes",
            "desc": "Strong link between narcotics seizures and NH-48 corridor.",
            "confidence": 84,
            "type": "Correlation",
        },
        {
            "title": "Emerging trend — Weekend assaults",
            "desc": "Assault incidents 22% higher on weekends across 4 districts.",
            "confidence": 79,
            "type": "Trend",
        },
    ]


def _build_graph() -> dict[str, Any]:
    return {
        "nodes": [
            {"id": "s1", "type": "input", "data": {"label": "Suspect: Rakesh B"}, "position": {"x": 0, "y": 0}},
            {"id": "s2", "data": {"label": "Suspect: Manoj D"}, "position": {"x": 250, "y": -80}},
            {"id": "v1", "data": {"label": "Victim: Suma R"}, "position": {"x": 250, "y": 120}},
            {"id": "l1", "data": {"label": "Location: MG Road"}, "position": {"x": 500, "y": 0}},
            {"id": "c1", "data": {"label": "Case: FIR-2026-1002"}, "position": {"x": 500, "y": 180}},
            {"id": "o1", "type": "output", "data": {"label": "Org: NH-48 Ring"}, "position": {"x": 750, "y": 60}},
        ],
        "edges": [
            {"id": "e1", "source": "s1", "target": "l1", "label": "seen at"},
            {"id": "e2", "source": "s1", "target": "v1", "label": "accused of"},
            {"id": "e3", "source": "s2", "target": "l1", "label": "seen at"},
            {"id": "e4", "source": "v1", "target": "c1", "label": "victim in"},
            {"id": "e5", "source": "s1", "target": "c1", "label": "named in"},
            {"id": "e6", "source": "s2", "target": "o1", "label": "member"},
            {"id": "e7", "source": "s1", "target": "o1", "label": "member"},
        ],
    }


def _build_dashboard_summary(cases: list[dict[str, Any]]) -> dict[str, Any]:
    open_cases = len([case for case in cases if case["status"] in {"Open", "Under Investigation", "Pending"}])
    closed_cases = len([case for case in cases if case["status"] == "Closed"])
    return {
        "todayCases": 128,
        "openCases": 3421 if open_cases < 20 else open_cases * 8,
        "solvedCases": 8712 if closed_cases < 10 else closed_cases * 17,
        "pending": 942,
        "weeklyTrends": [
            {"week": f"W{index + 1}", "cases": 40 + RNG.randint(5, 60), "solved": 25 + RNG.randint(5, 40)}
            for index in range(8)
        ],
        "monthlyTrends": [
            {"month": month, "cases": 400 + RNG.randint(0, 300), "solved": 250 + RNG.randint(0, 200)}
            for month in ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        ],
        "casesByDistrict": [
            {"district": district, "cases": 200 + RNG.randint(0, 800)} for district in DISTRICTS[:8]
        ],
        "casesByCrimeHead": [
            {"name": item["name"], "value": 50 + RNG.randint(0, 300)} for item in CRIME_HEADS
        ],
        "heatmapData": [
            {"lat": 12.9716 + index * 0.2, "lng": 77.5946 + index * 0.2, "value": 10 + RNG.randint(0, 90)}
            for index in range(12)
        ],
        "officerPerformance": [
            {"officer": f"Officer {index + 1}", "solved": 8 + RNG.randint(0, 16), "pending": 1 + RNG.randint(0, 8)}
            for index in range(10)
        ],
    }


def _build_hotspots(cases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    hotspots: list[dict[str, Any]] = []
    for index, district in enumerate(DISTRICTS[:8]):
        district_cases = len([case for case in cases if case["district"] == district])
        hotspots.append(
            {
                "district": district,
                "risk": 60 + RNG.randint(0, 40),
                "cases": max(district_cases, 12) * 5 + index * 7,
                "trend": "up" if index % 2 == 0 else "down",
            }
        )
    return hotspots


def _build_predictions() -> dict[str, Any]:
    return {
        "riskScore": 78,
        "confidence": 92,
        "trend": [{"week": f"W{index + 1}", "risk": 40 + RNG.randint(0, 50)} for index in range(8)],
        "highRiskAreas": [
            {"district": district, "score": 70 + RNG.randint(0, 25)} for district in DISTRICTS[:5]
        ],
        "categoryPrediction": [
            {"category": item["name"], "probability": 50 + RNG.randint(0, 45)} for item in CRIME_HEADS
        ],
    }


def _build_health_services() -> list[dict[str, Any]]:
    return [
        {"name": "Authentication", "status": "healthy"},
        {"name": "Data Store", "status": "healthy"},
        {"name": "NoSQL", "status": "healthy"},
        {"name": "Cache", "status": "warning"},
        {"name": "Signals", "status": "healthy"},
        {"name": "Circuits", "status": "healthy"},
        {"name": "Cron", "status": "healthy"},
        {"name": "AppSail", "status": "warning"},
        {"name": "AI Engine", "status": "healthy"},
        {"name": "Graph Engine", "status": "healthy"},
        {"name": "Report Engine", "status": "offline"},
    ]


DATA_STORE = MockDataStore.create()
