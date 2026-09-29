// AarogyaConnect - Government Healthcare Schemes (PM-JAY & MJPJAY)
export const INITIAL_SCHEMES = [
  {
    id: "sch-1",
    name: "Ayushman Bharat PM-JAY",
    shortName: "PM-JAY",
    govt: "Central Govt of India",
    coverage: "₹ 5,00,000 / family / year",
    cashless: "100% Cashless across empaneled public & private hospitals",
    eligibility: "Identified families as per SECC 2011 rural and urban occupational criteria, active Antyodaya Anna Yojana (AAY) / PHH ration card holders.",
    eligibilityCriteria: [
      "Rural households with single female earner or landless manual laborers",
      "Urban families categorized in 11 occupational categories (driver, vendor, laborer, security guard, etc.)",
      "Valid Aadhaar Card linked with Ration Card",
      "No family member in permanent government employment"
    ],
    documentsRequired: [
      "Aadhaar Card (all family members)",
      "Ration Card (Yellow / Orange / BPL)",
      "Income Certificate (if applicable)",
      "Doctor's diagnosis / referral slip from PHC/Govt Hospital"
    ],
    benefits: "Secondary & Tertiary care hospitalization, 1,929 specialized medical & surgical procedures covered, pre-hospitalization (3 days) & post-hospitalization (15 days) medicines covered.",
    helpline: "14555 / 1800-111-565",
    portalUrl: "https://pmjay.gov.in",
    badge: "National Health Authority"
  },
  {
    id: "sch-2",
    name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
    shortName: "MJPJAY",
    govt: "Government of Maharashtra",
    coverage: "₹ 1,50,000 to ₹ 5,00,000 / family / year",
    cashless: "Cashless secondary & tertiary surgeries in Maharashtra",
    eligibility: "All Maharashtra resident families holding valid Yellow, Orange (up to ₹1 Lakh annual income), or White ration cards in identified agrarian-distress districts.",
    eligibilityCriteria: [
      "Permanent resident of Maharashtra State",
      "Yellow or Orange Ration card issued by Govt of Maharashtra",
      "Farmers from 14 agrarian crisis districts (Amravati, Aurangabad, Wardha, etc.) with White Ration Card",
      "Valid photo identification (Aadhaar / Voter ID / Driving License)"
    ],
    documentsRequired: [
      "Maharashtra Domicile Certificate or Birth Certificate",
      "Ration Card (Yellow / Orange)",
      "Aadhaar Card",
      "Aarogya Mitra referral from district civil hospital"
    ],
    benefits: "996 specialized surgical procedures, renal transplants (up to ₹3 Lakh), oncology therapies, cardiac surgeries, poly-trauma care, pediatric cardiac interventions, ICU stays.",
    helpline: "155388 / 1800-120-8040",
    portalUrl: "https://www.jeevandayee.gov.in",
    badge: "Govt of Maharashtra Mission"
  }
];
