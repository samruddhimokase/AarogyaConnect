export const INITIAL_DISTRICTS = ["Mumbai", "Thane", "Mumbai Suburban", "Pune", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur", "Sangli", "Satara"];

export const INITIAL_HOSPITALS = [
  {
    id: "hosp-101",
    name: "KEM Hospital & Research Centre",
    district: "Pune",
    address: "Rasta Peth, Pune, Maharashtra 411011",
    phone: "+91 20 2612 5600",
    rating: 4.8,
    reviewsCount: 342,
    bedsTotal: 120,
    bedsAvailable: 18,
    bedsOccupied: 102,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 94,
    doctors: [
      { name: "Dr. Rajesh Deshmukh", spec: "Cardiology", exp: "18 Yrs", availability: "Today 4:00 PM" },
      { name: "Dr. Ananya Joshi", spec: "Neurology", exp: "12 Yrs", availability: "Tomorrow 10:00 AM" }
    ],
    bedGrid: [
      { id: "B-101", type: "ICU", status: "occupied", patient: "P-4821", oxygen: true },
      { id: "B-102", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "B-103", type: "Ventilator", status: "occupied", patient: "P-8812", oxygen: true },
      { id: "B-104", type: "Ventilator", status: "available", patient: null, oxygen: true },
      { id: "B-105", type: "General Ward", status: "available", patient: null, oxygen: false },
      { id: "B-106", type: "General Ward", status: "occupied", patient: "P-3312", oxygen: true },
    ]
  },
  {
    id: "hosp-102",
    name: "Sahyadri Super Speciality Hospital",
    district: "Pune",
    address: "Deccan Gymkhana, Pune, Maharashtra 411004",
    phone: "+91 20 6721 3000",
    rating: 4.7,
    reviewsCount: 512,
    bedsTotal: 200,
    bedsAvailable: 34,
    bedsOccupied: 166,
    icuAvailable: 8,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 91,
    doctors: [
      { name: "Dr. Priya Kulkarni", spec: "Oncology", exp: "15 Yrs", availability: "Today 2:30 PM" },
      { name: "Dr. Vikramaditya Patil", spec: "Orthopedics", exp: "20 Yrs", availability: "Today 6:00 PM" }
    ],
    bedGrid: [
      { id: "S-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "S-202", type: "ICU", status: "occupied", patient: "P-9912", oxygen: true },
      { id: "S-203", type: "General Ward", status: "available", patient: null, oxygen: false },
      { id: "S-204", type: "General Ward", status: "available", patient: null, oxygen: true }
    ]
  },
  {
    id: "hosp-103",
    name: "Lilavati Hospital & Medical Research Centre",
    district: "Mumbai",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 22 2675 1000",
    rating: 4.9,
    reviewsCount: 890,
    bedsTotal: 300,
    bedsAvailable: 42,
    bedsOccupied: 258,
    icuAvailable: 12,
    ventilatorsAvailable: 8,
    bloodGroupAvailable: ["A+", "B+", "B-", "O+", "AB+", "AB-"],
    pmjayEmpaneled: false,
    mjpjayEmpaneled: true,
    careScore: 96,
    doctors: [
      { name: "Dr. Sameer Mehta", spec: "Cardiothoracic", exp: "22 Yrs", availability: "Tomorrow 11:00 AM" }
    ],
    bedGrid: [
      { id: "L-301", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "L-302", type: "Ventilator", status: "occupied", patient: "P-1029", oxygen: true }
    ]
  },

  // ── Thane Region ──
  {
    id: "hosp-118",
    name: "MGM Hospital",
    district: "Thane",
    city: "Vashi",
    address: "Sector 3, Vashi, Navi Mumbai, Maharashtra 400703",
    phone: "+91 22 2778 8000",
    rating: 4.3,
    reviewsCount: 280,
    specialty: "General & Multispecialty",
    bedsTotal: 150,
    bedsAvailable: 22,
    bedsOccupied: 128,
    icuAvailable: 5,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 82,
    doctors: [
      { name: "Dr. Kavita Nair", spec: "General Medicine", exp: "14 Yrs", availability: "Today 3:00 PM" }
    ],
    bedGrid: [
      { id: "MGM-101", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "MGM-102", type: "General Ward", status: "occupied", patient: "P-2211", oxygen: false }
    ]
  },
  {
    id: "hosp-119",
    name: "Terna Speciality Hospital",
    district: "Thane",
    city: "Nerul",
    address: "Sector 12, Nerul, Navi Mumbai, Maharashtra 400706",
    phone: "+91 22 2770 8000",
    rating: 4.2,
    reviewsCount: 210,
    specialty: "Multispecialty",
    bedsTotal: 120,
    bedsAvailable: 18,
    bedsOccupied: 102,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 80,
    doctors: [
      { name: "Dr. Suresh Bhosale", spec: "Internal Medicine", exp: "10 Yrs", availability: "Tomorrow 9:00 AM" }
    ],
    bedGrid: [
      { id: "TER-101", type: "ICU", status: "occupied", patient: "P-3301", oxygen: true },
      { id: "TER-102", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },

  // ── Mumbai Suburban ──
  {
    id: "hosp-120",
    name: "Criticare Hospital",
    district: "Mumbai Suburban",
    city: "Andheri West",
    address: "Andheri West, Mumbai, Maharashtra 400053",
    phone: "+91 22 6140 0000",
    rating: 4.4,
    reviewsCount: 320,
    specialty: "Emergency & Critical Care",
    bedsTotal: 100,
    bedsAvailable: 14,
    bedsOccupied: 86,
    icuAvailable: 6,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 86,
    doctors: [
      { name: "Dr. Neha Sharma", spec: "Critical Care", exp: "12 Yrs", availability: "Today 5:00 PM" }
    ],
    bedGrid: [
      { id: "CRC-101", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "CRC-102", type: "Ventilator", status: "occupied", patient: "P-7721", oxygen: true }
    ]
  },

  // ── Pune / Pimpri-Chinchwad Region ──
  {
    id: "hosp-121",
    name: "Sahyadri Super Speciality Hospital",
    district: "Pune",
    city: "Pune",
    address: "Karve Road, Pune, Maharashtra 411004",
    phone: "+91 20 6721 3000",
    rating: 4.6,
    reviewsCount: 512,
    specialty: "Cardiology and critical care",
    bedsTotal: 200,
    bedsAvailable: 28,
    bedsOccupied: 172,
    icuAvailable: 9,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 91,
    doctors: [
      { name: "Dr. Priya Kulkarni", spec: "Cardiology", exp: "15 Yrs", availability: "Today 2:30 PM" },
      { name: "Dr. Vikramaditya Patil", spec: "Critical Care", exp: "20 Yrs", availability: "Today 6:00 PM" }
    ],
    bedGrid: [
      { id: "SAH-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "SAH-202", type: "ICU", status: "occupied", patient: "P-9912", oxygen: true },
      { id: "SAH-203", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-122",
    name: "Deenanath Mangeshkar Hospital",
    district: "Pune",
    city: "Pune",
    address: "Erandvane, Pune, Maharashtra 411004",
    phone: "+91 20 4015 1000",
    rating: 4.8,
    reviewsCount: 640,
    specialty: "Oncology and multidisciplinary",
    bedsTotal: 350,
    bedsAvailable: 40,
    bedsOccupied: 310,
    icuAvailable: 14,
    ventilatorsAvailable: 8,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 96,
    doctors: [
      { name: "Dr. Arun Borkar", spec: "Oncology", exp: "22 Yrs", availability: "Today 11:00 AM" },
      { name: "Dr. Shilpa Marathe", spec: "Hematology", exp: "18 Yrs", availability: "Tomorrow 9:00 AM" }
    ],
    bedGrid: [
      { id: "DMH-201", type: "ICU", status: "occupied", patient: "P-4401", oxygen: true },
      { id: "DMH-202", type: "General Ward", status: "available", patient: null, oxygen: false },
      { id: "DMH-203", type: "Ventilator", status: "available", patient: null, oxygen: true }
    ]
  },
  {
    id: "hosp-123",
    name: "Ruby Hall Clinic",
    district: "Pune",
    city: "Pune",
    address: "40 Sassoon Road, Pune, Maharashtra 411001",
    phone: "+91 20 6645 5500",
    rating: 4.6,
    reviewsCount: 580,
    specialty: "Cardiology & Emergency Care",
    bedsTotal: 280,
    bedsAvailable: 35,
    bedsOccupied: 245,
    icuAvailable: 12,
    ventilatorsAvailable: 6,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 92,
    doctors: [
      { name: "Dr. Sandip Deshpande", spec: "Cardiology", exp: "17 Yrs", availability: "Today 4:00 PM" }
    ],
    bedGrid: [
      { id: "RHC-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "RHC-202", type: "General Ward", status: "occupied", patient: "P-5512", oxygen: false }
    ]
  },
  {
    id: "hosp-124",
    name: "Jehangir Hospital",
    district: "Pune",
    city: "Pune",
    address: "32 Sassoon Road, Pune, Maharashtra 411001",
    phone: "+91 20 6681 0000",
    rating: 4.6,
    reviewsCount: 490,
    specialty: "Multispecialty & Pediatrics",
    bedsTotal: 250,
    bedsAvailable: 30,
    bedsOccupied: 220,
    icuAvailable: 10,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 90,
    doctors: [
      { name: "Dr. Rekha Iyer", spec: "Pediatrics", exp: "14 Yrs", availability: "Today 10:00 AM" }
    ],
    bedGrid: [
      { id: "JHG-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "JHG-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-125",
    name: "KEM Hospital Pune",
    district: "Pune",
    city: "Pune",
    address: "Rasta Peth, Pune, Maharashtra 411011",
    phone: "+91 20 2612 5600",
    rating: 4.4,
    reviewsCount: 410,
    specialty: "Charitable & Multispecialty",
    bedsTotal: 500,
    bedsAvailable: 60,
    bedsOccupied: 440,
    icuAvailable: 18,
    ventilatorsAvailable: 10,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 85,
    doctors: [
      { name: "Dr. Rajesh Deshmukh", spec: "General Surgery", exp: "18 Yrs", availability: "Tomorrow 8:00 AM" }
    ],
    bedGrid: [
      { id: "KEM-201", type: "ICU", status: "occupied", patient: "P-1100", oxygen: true },
      { id: "KEM-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-126",
    name: "Columbia Asia Hospital (Manipal)",
    district: "Pune",
    city: "Kharadi",
    address: "Kharadi, Pune, Maharashtra 411014",
    phone: "+91 20 6706 0600",
    rating: 4.5,
    reviewsCount: 360,
    specialty: "Multispecialty",
    bedsTotal: 180,
    bedsAvailable: 25,
    bedsOccupied: 155,
    icuAvailable: 8,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 88,
    doctors: [
      { name: "Dr. Mohan Rane", spec: "Orthopedics", exp: "16 Yrs", availability: "Today 1:00 PM" }
    ],
    bedGrid: [
      { id: "COL-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "COL-202", type: "General Ward", status: "occupied", patient: "P-2202", oxygen: false }
    ]
  },
  {
    id: "hosp-127",
    name: "Manipal Hospital, Baner",
    district: "Pune",
    city: "Baner",
    address: "Baner Road, Pune, Maharashtra 411045",
    phone: "+91 20 6793 0000",
    rating: 4.7,
    reviewsCount: 440,
    specialty: "Advanced Surgery & Critical Care",
    bedsTotal: 220,
    bedsAvailable: 30,
    bedsOccupied: 190,
    icuAvailable: 11,
    ventilatorsAvailable: 6,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 93,
    doctors: [
      { name: "Dr. Anand Gokhale", spec: "Surgical Oncology", exp: "20 Yrs", availability: "Today 2:00 PM" }
    ],
    bedGrid: [
      { id: "MAN-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "MAN-202", type: "Ventilator", status: "occupied", patient: "P-8812", oxygen: true }
    ]
  },
  {
    id: "hosp-128",
    name: "Sancheti Institute for Orthopaedics & Rehabilitation",
    district: "Pune",
    city: "Pune",
    address: "16 Shivajinagar, Pune, Maharashtra 411005",
    phone: "+91 20 2553 5000",
    rating: 4.8,
    reviewsCount: 520,
    specialty: "Orthopedics & Joint Replacement",
    bedsTotal: 160,
    bedsAvailable: 20,
    bedsOccupied: 140,
    icuAvailable: 6,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 95,
    doctors: [
      { name: "Dr. Parag Sancheti", spec: "Orthopedics", exp: "25 Yrs", availability: "Tomorrow 10:00 AM" }
    ],
    bedGrid: [
      { id: "SAN-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "SAN-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-129",
    name: "Noble Hospital",
    district: "Pune",
    city: "Hadapsar",
    address: "153 Magarpatta Road, Hadapsar, Pune, Maharashtra 411013",
    phone: "+91 20 6760 0000",
    rating: 4.3,
    reviewsCount: 295,
    specialty: "Multispecialty & Trauma",
    bedsTotal: 130,
    bedsAvailable: 16,
    bedsOccupied: 114,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 83,
    doctors: [
      { name: "Dr. Ravi Thorat", spec: "Trauma Surgery", exp: "11 Yrs", availability: "Today 6:00 PM" }
    ],
    bedGrid: [
      { id: "NOB-201", type: "ICU", status: "occupied", patient: "P-3309", oxygen: true },
      { id: "NOB-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-130",
    name: "Inamdar Multispecialty Hospital",
    district: "Pune",
    city: "Wanowrie",
    address: "Sr. No. 15, Fatima Nagar, Wanowrie, Pune, Maharashtra 411040",
    phone: "+91 20 2683 8888",
    rating: 4.4,
    reviewsCount: 330,
    specialty: "Multispecialty",
    bedsTotal: 150,
    bedsAvailable: 20,
    bedsOccupied: 130,
    icuAvailable: 7,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 85,
    doctors: [
      { name: "Dr. Sujit Inamdar", spec: "Gastroenterology", exp: "13 Yrs", availability: "Today 3:30 PM" }
    ],
    bedGrid: [
      { id: "INA-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "INA-202", type: "General Ward", status: "occupied", patient: "P-4488", oxygen: false }
    ]
  },
  {
    id: "hosp-131",
    name: "Jupiter Hospital, Pune",
    district: "Pune",
    city: "Baner",
    address: "Eastern Express Highway, Baner, Pune, Maharashtra 411045",
    phone: "+91 20 6626 0000",
    rating: 4.7,
    reviewsCount: 475,
    specialty: "Multispecialty & Organ Transplant",
    bedsTotal: 200,
    bedsAvailable: 26,
    bedsOccupied: 174,
    icuAvailable: 10,
    ventilatorsAvailable: 6,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 94,
    doctors: [
      { name: "Dr. Rajendra Kulkarni", spec: "Transplant Surgery", exp: "21 Yrs", availability: "Tomorrow 11:00 AM" }
    ],
    bedGrid: [
      { id: "JUP-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "JUP-202", type: "Ventilator", status: "occupied", patient: "P-9901", oxygen: true }
    ]
  },
  {
    id: "hosp-132",
    name: "Aditya Birla Memorial Hospital",
    district: "Pune",
    city: "Pimpri-Chinchwad",
    address: "Thergaon, Pune-Mumbai Bypass Road, Pimpri-Chinchwad, Maharashtra 411033",
    phone: "+91 20 7125 0000",
    rating: 4.6,
    reviewsCount: 390,
    specialty: "Multispecialty & Oncology",
    bedsTotal: 180,
    bedsAvailable: 22,
    bedsOccupied: 158,
    icuAvailable: 8,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 90,
    doctors: [
      { name: "Dr. Swati Bapat", spec: "Oncology", exp: "16 Yrs", availability: "Today 12:00 PM" }
    ],
    bedGrid: [
      { id: "ABM-201", type: "ICU", status: "occupied", patient: "P-7700", oxygen: true },
      { id: "ABM-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-133",
    name: "Yashwantrao Chavan Memorial Hospital (YCM)",
    district: "Pune",
    city: "Pimpri",
    address: "Pimpri, Pune, Maharashtra 411018",
    phone: "+91 20 2742 2000",
    rating: 4.1,
    reviewsCount: 220,
    specialty: "Government Public Health",
    bedsTotal: 600,
    bedsAvailable: 80,
    bedsOccupied: 520,
    icuAvailable: 20,
    ventilatorsAvailable: 12,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 76,
    doctors: [
      { name: "Dr. Ganesh Pawar", spec: "General Medicine", exp: "9 Yrs", availability: "Today 9:00 AM" }
    ],
    bedGrid: [
      { id: "YCM-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "YCM-202", type: "General Ward", status: "occupied", patient: "P-1122", oxygen: false }
    ]
  },
  {
    id: "hosp-134",
    name: "Vitalife Multispecialty Hospital",
    district: "Pune",
    city: "Hinjawadi",
    address: "Hinjawadi Phase 1, Pune, Maharashtra 411057",
    phone: "+91 20 7720 7720",
    rating: 4.2,
    reviewsCount: 190,
    specialty: "Emergency & General",
    bedsTotal: 80,
    bedsAvailable: 12,
    bedsOccupied: 68,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: false,
    mjpjayEmpaneled: true,
    careScore: 78,
    doctors: [
      { name: "Dr. Namita Ghosh", spec: "Emergency Medicine", exp: "8 Yrs", availability: "Today 7:00 PM" }
    ],
    bedGrid: [
      { id: "VIT-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "VIT-202", type: "General Ward", status: "occupied", patient: "P-5566", oxygen: false }
    ]
  },
  {
    id: "hosp-135",
    name: "Motherhood Hospital, Pune",
    district: "Pune",
    city: "Kalyani Nagar",
    address: "Kalyani Nagar, Pune, Maharashtra 411006",
    phone: "+91 20 7166 3000",
    rating: 4.5,
    reviewsCount: 380,
    specialty: "Mother & Child Care",
    bedsTotal: 100,
    bedsAvailable: 15,
    bedsOccupied: 85,
    icuAvailable: 5,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 88,
    doctors: [
      { name: "Dr. Pooja Jain", spec: "Obstetrics & Gynecology", exp: "13 Yrs", availability: "Today 11:00 AM" }
    ],
    bedGrid: [
      { id: "MOT-201", type: "ICU", status: "occupied", patient: "P-3345", oxygen: true },
      { id: "MOT-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },

  // ── Nagpur / Vidarbha Region ──
  {
    id: "hosp-136",
    name: "Wockhardt Hospitals",
    district: "Nagpur",
    city: "Nagpur",
    address: "Trimurti Nagar, Nagpur, Maharashtra 440022",
    phone: "+91 712 6649 111",
    rating: 4.5,
    reviewsCount: 350,
    specialty: "Emergency and cardiac care",
    bedsTotal: 160,
    bedsAvailable: 22,
    bedsOccupied: 138,
    icuAvailable: 8,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 88,
    doctors: [
      { name: "Dr. Sunil Nair", spec: "Cardiology", exp: "16 Yrs", availability: "Today 3:00 PM" }
    ],
    bedGrid: [
      { id: "WOC-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "WOC-202", type: "General Ward", status: "occupied", patient: "P-6612", oxygen: false }
    ]
  },
  {
    id: "hosp-137",
    name: "Care Hospital, Nagpur",
    district: "Nagpur",
    city: "Nagpur",
    address: "Dhantoli, Nagpur, Maharashtra 440012",
    phone: "+91 712 6627 000",
    rating: 4.4,
    reviewsCount: 290,
    specialty: "Cardiology & Nephrology",
    bedsTotal: 140,
    bedsAvailable: 18,
    bedsOccupied: 122,
    icuAvailable: 7,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 85,
    doctors: [
      { name: "Dr. Meera Wankhede", spec: "Nephrology", exp: "14 Yrs", availability: "Today 4:00 PM" }
    ],
    bedGrid: [
      { id: "CAR-201", type: "ICU", status: "occupied", patient: "P-1190", oxygen: true },
      { id: "CAR-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-138",
    name: "Kingsway Hospital",
    district: "Nagpur",
    city: "Nagpur",
    address: "Kingsway, Nagpur, Maharashtra 440001",
    phone: "+91 712 2524 200",
    rating: 4.6,
    reviewsCount: 340,
    specialty: "Multispecialty & Critical Care",
    bedsTotal: 200,
    bedsAvailable: 28,
    bedsOccupied: 172,
    icuAvailable: 10,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 90,
    doctors: [
      { name: "Dr. Pramod Chandra", spec: "Critical Care", exp: "17 Yrs", availability: "Today 5:00 PM" }
    ],
    bedGrid: [
      { id: "KIN-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "KIN-202", type: "General Ward", status: "occupied", patient: "P-2231", oxygen: false }
    ]
  },
  {
    id: "hosp-139",
    name: "New Era Hospital",
    district: "Nagpur",
    city: "Nagpur",
    address: "Ramdaspeth, Nagpur, Maharashtra 440010",
    phone: "+91 712 2448 111",
    rating: 4.3,
    reviewsCount: 245,
    specialty: "Neurosciences & Trauma",
    bedsTotal: 120,
    bedsAvailable: 15,
    bedsOccupied: 105,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 82,
    doctors: [
      { name: "Dr. Ashok Thakur", spec: "Neurology", exp: "15 Yrs", availability: "Tomorrow 10:00 AM" }
    ],
    bedGrid: [
      { id: "NEE-201", type: "ICU", status: "occupied", patient: "P-4491", oxygen: true },
      { id: "NEE-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-140",
    name: "Orange City Hospital & Research Institute",
    district: "Nagpur",
    city: "Nagpur",
    address: "Wadi, Nagpur, Maharashtra 440023",
    phone: "+91 712 6615 000",
    rating: 4.4,
    reviewsCount: 310,
    specialty: "Critical Care & Polytrauma",
    bedsTotal: 150,
    bedsAvailable: 20,
    bedsOccupied: 130,
    icuAvailable: 8,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 85,
    doctors: [
      { name: "Dr. Rahul Kale", spec: "Trauma & Critical Care", exp: "13 Yrs", availability: "Today 2:00 PM" }
    ],
    bedGrid: [
      { id: "OCH-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "OCH-202", type: "Ventilator", status: "occupied", patient: "P-8821", oxygen: true }
    ]
  },
  {
    id: "hosp-141",
    name: "AIIMS Nagpur",
    district: "Nagpur",
    city: "Nagpur",
    address: "Plot No. 2, Sector 20, MIHAN, Nagpur, Maharashtra 441108",
    phone: "+91 712 2985 100",
    rating: 4.8,
    reviewsCount: 490,
    specialty: "Super Specialty & Public Healthcare",
    bedsTotal: 960,
    bedsAvailable: 100,
    bedsOccupied: 860,
    icuAvailable: 40,
    ventilatorsAvailable: 20,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 96,
    doctors: [
      { name: "Dr. Anjali Singh", spec: "Cardiology", exp: "20 Yrs", availability: "Today 10:00 AM" },
      { name: "Dr. Vivek Pande", spec: "Oncology", exp: "18 Yrs", availability: "Tomorrow 9:00 AM" }
    ],
    bedGrid: [
      { id: "AII-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "AII-202", type: "Ventilator", status: "occupied", patient: "P-3301", oxygen: true },
      { id: "AII-203", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-142",
    name: "Government Medical College and Hospital (GMCH) Nagpur",
    district: "Nagpur",
    city: "Nagpur",
    address: "Medical Square, Nagpur, Maharashtra 440003",
    phone: "+91 712 2720 166",
    rating: 4.1,
    reviewsCount: 190,
    specialty: "Tertiary Care & Research",
    bedsTotal: 1200,
    bedsAvailable: 130,
    bedsOccupied: 1070,
    icuAvailable: 50,
    ventilatorsAvailable: 25,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 74,
    doctors: [
      { name: "Dr. Surekha Kapse", spec: "General Medicine", exp: "12 Yrs", availability: "Today 8:00 AM" }
    ],
    bedGrid: [
      { id: "GMC-201", type: "ICU", status: "occupied", patient: "P-7711", oxygen: true },
      { id: "GMC-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-143",
    name: "Lata Mangeshkar Hospital",
    district: "Nagpur",
    city: "Hingna",
    address: "Hingna Road, Nagpur, Maharashtra 440019",
    phone: "+91 712 2745 100",
    rating: 4.2,
    reviewsCount: 210,
    specialty: "Multispecialty",
    bedsTotal: 120,
    bedsAvailable: 16,
    bedsOccupied: 104,
    icuAvailable: 5,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 79,
    doctors: [
      { name: "Dr. Sunita Borkar", spec: "Gynecology", exp: "10 Yrs", availability: "Today 12:00 PM" }
    ],
    bedGrid: [
      { id: "LAT-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "LAT-202", type: "General Ward", status: "occupied", patient: "P-4432", oxygen: false }
    ]
  },
  {
    id: "hosp-144",
    name: "Alexis Multispecialty Hospital",
    district: "Nagpur",
    city: "Nari",
    address: "Nari Road, Nagpur, Maharashtra 440026",
    phone: "+91 712 2250 022",
    rating: 4.6,
    reviewsCount: 360,
    specialty: "Oncology & Cardiac Sciences",
    bedsTotal: 175,
    bedsAvailable: 24,
    bedsOccupied: 151,
    icuAvailable: 9,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 89,
    doctors: [
      { name: "Dr. Rajiv Lunawat", spec: "Cardiac Surgery", exp: "19 Yrs", availability: "Today 1:00 PM" }
    ],
    bedGrid: [
      { id: "ALE-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "ALE-202", type: "Ventilator", status: "occupied", patient: "P-9912", oxygen: true }
    ]
  },
  {
    id: "hosp-145",
    name: "Unity Hospital",
    district: "Nagpur",
    city: "Sadar",
    address: "Sadar, Nagpur, Maharashtra 440001",
    phone: "+91 712 2540 000",
    rating: 4.2,
    reviewsCount: 175,
    specialty: "Emergency & Surgery",
    bedsTotal: 90,
    bedsAvailable: 12,
    bedsOccupied: 78,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: false,
    mjpjayEmpaneled: true,
    careScore: 78,
    doctors: [
      { name: "Dr. Ravi Deshmukh", spec: "General Surgery", exp: "9 Yrs", availability: "Today 5:30 PM" }
    ],
    bedGrid: [
      { id: "UNI-201", type: "ICU", status: "occupied", patient: "P-2211", oxygen: true },
      { id: "UNI-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },

  // ── Nashik / North Maharashtra Region ──
  {
    id: "hosp-146",
    name: "Wockhardt Hospitals, Nashik",
    district: "Nashik",
    city: "Nashik",
    address: "Near Gangapur Road, Nashik, Maharashtra 422013",
    phone: "+91 253 6649 100",
    rating: 4.5,
    reviewsCount: 310,
    specialty: "Cardiology & Neurology",
    bedsTotal: 120,
    bedsAvailable: 18,
    bedsOccupied: 102,
    icuAvailable: 6,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 87,
    doctors: [
      { name: "Dr. Vilas Bhosle", spec: "Neurology", exp: "14 Yrs", availability: "Today 3:00 PM" }
    ],
    bedGrid: [
      { id: "WNK-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "WNK-202", type: "General Ward", status: "occupied", patient: "P-3312", oxygen: false }
    ]
  },
  {
    id: "hosp-147",
    name: "Sahyadri Hospital, Nashik",
    district: "Nashik",
    city: "Nashik",
    address: "Gangapur Road, Nashik, Maharashtra 422005",
    phone: "+91 253 6611 000",
    rating: 4.4,
    reviewsCount: 270,
    specialty: "Multispecialty",
    bedsTotal: 140,
    bedsAvailable: 20,
    bedsOccupied: 120,
    icuAvailable: 6,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 84,
    doctors: [
      { name: "Dr. Kalpana More", spec: "Internal Medicine", exp: "11 Yrs", availability: "Tomorrow 9:00 AM" }
    ],
    bedGrid: [
      { id: "SNK-201", type: "ICU", status: "occupied", patient: "P-6621", oxygen: true },
      { id: "SNK-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-148",
    name: "Apollo Hospitals, Nashik",
    district: "Nashik",
    city: "Nashik",
    address: "Vadala Naka, Nashik, Maharashtra 422011",
    phone: "+91 253 6601 066",
    rating: 4.5,
    reviewsCount: 395,
    specialty: "Critical Care & Oncology",
    bedsTotal: 160,
    bedsAvailable: 22,
    bedsOccupied: 138,
    icuAvailable: 8,
    ventilatorsAvailable: 4,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 88,
    doctors: [
      { name: "Dr. Deepak Goyal", spec: "Oncology", exp: "17 Yrs", availability: "Today 11:00 AM" }
    ],
    bedGrid: [
      { id: "APO-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "APO-202", type: "General Ward", status: "occupied", patient: "P-7700", oxygen: false }
    ]
  },
  {
    id: "hosp-149",
    name: "Bhojraj Hospital",
    district: "Nashik",
    city: "Nashik",
    address: "Old Gangapur Naka, Nashik, Maharashtra 422005",
    phone: "+91 253 2312 000",
    rating: 4.1,
    reviewsCount: 155,
    specialty: "Surgery & Gynecology",
    bedsTotal: 80,
    bedsAvailable: 10,
    bedsOccupied: 70,
    icuAvailable: 3,
    ventilatorsAvailable: 1,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 75,
    doctors: [
      { name: "Dr. Geeta Bhojraj", spec: "Gynecology", exp: "12 Yrs", availability: "Today 2:00 PM" }
    ],
    bedGrid: [
      { id: "BHO-201", type: "General Ward", status: "available", patient: null, oxygen: false },
      { id: "BHO-202", type: "General Ward", status: "occupied", patient: "P-4401", oxygen: false }
    ]
  },
  {
    id: "hosp-150",
    name: "Vasantrao Pawar Medical College Hospital",
    district: "Nashik",
    city: "Adgaon",
    address: "Adgaon, Nashik, Maharashtra 422003",
    phone: "+91 253 2301 000",
    rating: 4.3,
    reviewsCount: 195,
    specialty: "Multispecialty & Teaching",
    bedsTotal: 350,
    bedsAvailable: 45,
    bedsOccupied: 305,
    icuAvailable: 14,
    ventilatorsAvailable: 7,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 80,
    doctors: [
      { name: "Dr. Sanjay Pawar", spec: "General Medicine", exp: "10 Yrs", availability: "Today 8:00 AM" }
    ],
    bedGrid: [
      { id: "VPM-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "VPM-202", type: "General Ward", status: "occupied", patient: "P-2211", oxygen: false }
    ]
  },
  {
    id: "hosp-151",
    name: "Ashwini Hospital",
    district: "Nashik",
    city: "Nashik",
    address: "Nashik Road, Nashik, Maharashtra 422101",
    phone: "+91 253 2466 000",
    rating: 4.4,
    reviewsCount: 230,
    specialty: "Orthopedics & Trauma",
    bedsTotal: 100,
    bedsAvailable: 14,
    bedsOccupied: 86,
    icuAvailable: 5,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 83,
    doctors: [
      { name: "Dr. Manoj Thakkar", spec: "Orthopedics", exp: "13 Yrs", availability: "Today 4:30 PM" }
    ],
    bedGrid: [
      { id: "ASH-201", type: "ICU", status: "occupied", patient: "P-5510", oxygen: true },
      { id: "ASH-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-152",
    name: "Niramay Hospital",
    district: "Nashik",
    city: "Nashik",
    address: "College Road, Nashik, Maharashtra 422005",
    phone: "+91 253 2319 000",
    rating: 4.2,
    reviewsCount: 165,
    specialty: "Multispecialty",
    bedsTotal: 90,
    bedsAvailable: 12,
    bedsOccupied: 78,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 78,
    doctors: [
      { name: "Dr. Preeti Deshpande", spec: "Internal Medicine", exp: "8 Yrs", availability: "Tomorrow 10:00 AM" }
    ],
    bedGrid: [
      { id: "NIR-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "NIR-202", type: "General Ward", status: "occupied", patient: "P-6601", oxygen: false }
    ]
  },

  // ── Chhatrapati Sambhajinagar / Marathwada Region ──
  {
    id: "hosp-153",
    name: "MGM Medical College & Hospital",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "MGM Campus, N-6 CIDCO, Chhatrapati Sambhajinagar, Maharashtra 431003",
    phone: "+91 240 2484 849",
    rating: 4.5,
    reviewsCount: 305,
    specialty: "Multispecialty & Research",
    bedsTotal: 400,
    bedsAvailable: 50,
    bedsOccupied: 350,
    icuAvailable: 16,
    ventilatorsAvailable: 8,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 87,
    doctors: [
      { name: "Dr. Babasaheb Gaikwad", spec: "General Surgery", exp: "18 Yrs", availability: "Today 10:00 AM" }
    ],
    bedGrid: [
      { id: "MGM-301", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "MGM-302", type: "General Ward", status: "occupied", patient: "P-8801", oxygen: false }
    ]
  },
  {
    id: "hosp-154",
    name: "United CIIGMA Hospital",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "Osmanpura, Chhatrapati Sambhajinagar, Maharashtra 431005",
    phone: "+91 240 2354 000",
    rating: 4.6,
    reviewsCount: 360,
    specialty: "Cardiology, Neuro & Critical Care",
    bedsTotal: 180,
    bedsAvailable: 24,
    bedsOccupied: 156,
    icuAvailable: 9,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 91,
    doctors: [
      { name: "Dr. Amol Kulkarni", spec: "Neurology", exp: "16 Yrs", availability: "Today 2:00 PM" }
    ],
    bedGrid: [
      { id: "UCH-301", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "UCH-302", type: "Ventilator", status: "occupied", patient: "P-4401", oxygen: true }
    ]
  },
  {
    id: "hosp-155",
    name: "Kamalnayan Bajaj Hospital",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "Bajaj Nagar, Chhatrapati Sambhajinagar, Maharashtra 431003",
    phone: "+91 240 6604 444",
    rating: 4.6,
    reviewsCount: 420,
    specialty: "Cardiac Sciences & Oncology",
    bedsTotal: 200,
    bedsAvailable: 26,
    bedsOccupied: 174,
    icuAvailable: 10,
    ventilatorsAvailable: 6,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 92,
    doctors: [
      { name: "Dr. Neeraj Bajaj", spec: "Cardiology", exp: "20 Yrs", availability: "Today 3:00 PM" }
    ],
    bedGrid: [
      { id: "KBH-301", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "KBH-302", type: "General Ward", status: "occupied", patient: "P-3312", oxygen: false }
    ]
  },
  {
    id: "hosp-156",
    name: "Government Medical College and Hospital, Aurangabad",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "Ghati, Chhatrapati Sambhajinagar, Maharashtra 431001",
    phone: "+91 240 2334 444",
    rating: 4.0,
    reviewsCount: 160,
    specialty: "Public Healthcare",
    bedsTotal: 800,
    bedsAvailable: 90,
    bedsOccupied: 710,
    icuAvailable: 30,
    ventilatorsAvailable: 15,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 72,
    doctors: [
      { name: "Dr. Srikant Kale", spec: "General Medicine", exp: "11 Yrs", availability: "Today 8:00 AM" }
    ],
    bedGrid: [
      { id: "GMA-301", type: "ICU", status: "occupied", patient: "P-5500", oxygen: true },
      { id: "GMA-302", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-157",
    name: "Dhoot Hospital",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "Jalna Road, Chhatrapati Sambhajinagar, Maharashtra 431001",
    phone: "+91 240 2339 000",
    rating: 4.4,
    reviewsCount: 240,
    specialty: "Multispecialty",
    bedsTotal: 130,
    bedsAvailable: 17,
    bedsOccupied: 113,
    icuAvailable: 6,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 83,
    doctors: [
      { name: "Dr. Vinay Dhoot", spec: "General Medicine", exp: "12 Yrs", availability: "Today 12:00 PM" }
    ],
    bedGrid: [
      { id: "DHO-301", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "DHO-302", type: "General Ward", status: "occupied", patient: "P-1101", oxygen: false }
    ]
  },
  {
    id: "hosp-158",
    name: "Hedgewar Rugnalaya",
    district: "Chhatrapati Sambhajinagar",
    city: "Aurangabad",
    address: "Garkheda, Chhatrapati Sambhajinagar, Maharashtra 431009",
    phone: "+91 240 2486 000",
    rating: 4.3,
    reviewsCount: 185,
    specialty: "General & Charitable",
    bedsTotal: 100,
    bedsAvailable: 14,
    bedsOccupied: 86,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 79,
    doctors: [
      { name: "Dr. Yashwant Munde", spec: "General Medicine", exp: "9 Yrs", availability: "Today 10:00 AM" }
    ],
    bedGrid: [
      { id: "HED-301", type: "ICU", status: "occupied", patient: "P-7712", oxygen: true },
      { id: "HED-302", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },

  // ── Kolhapur & Western Maharashtra ──
  {
    id: "hosp-159",
    name: "CPR Government Hospital",
    district: "Kolhapur",
    city: "Kolhapur",
    address: "CPR Chowk, Kolhapur, Maharashtra 416002",
    phone: "+91 231 2644 000",
    rating: 4.1,
    reviewsCount: 145,
    specialty: "Public Healthcare",
    bedsTotal: 600,
    bedsAvailable: 70,
    bedsOccupied: 530,
    icuAvailable: 22,
    ventilatorsAvailable: 12,
    bloodGroupAvailable: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 73,
    doctors: [
      { name: "Dr. Shivaji Jadhav", spec: "General Medicine", exp: "10 Yrs", availability: "Today 8:00 AM" }
    ],
    bedGrid: [
      { id: "CPR-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "CPR-202", type: "General Ward", status: "occupied", patient: "P-3309", oxygen: false }
    ]
  },
  {
    id: "hosp-160",
    name: "Appasaheb Birnale Hospital",
    district: "Kolhapur",
    city: "Kolhapur",
    address: "Rajarampuri, Kolhapur, Maharashtra 416008",
    phone: "+91 231 2663 000",
    rating: 4.2,
    reviewsCount: 175,
    specialty: "Multispecialty",
    bedsTotal: 100,
    bedsAvailable: 13,
    bedsOccupied: 87,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 78,
    doctors: [
      { name: "Dr. Pravin Birnale", spec: "General Surgery", exp: "11 Yrs", availability: "Today 11:00 AM" }
    ],
    bedGrid: [
      { id: "APP-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "APP-202", type: "General Ward", status: "occupied", patient: "P-6601", oxygen: false }
    ]
  },
  {
    id: "hosp-161",
    name: "Aster Aadhar Hospital",
    district: "Kolhapur",
    city: "Kolhapur",
    address: "E Ward, Kolhapur, Maharashtra 416005",
    phone: "+91 231 2666 666",
    rating: 4.7,
    reviewsCount: 420,
    specialty: "Cardiology, Orthopedics & Critical Care",
    bedsTotal: 200,
    bedsAvailable: 28,
    bedsOccupied: 172,
    icuAvailable: 10,
    ventilatorsAvailable: 5,
    bloodGroupAvailable: ["A+", "A-", "B+", "O+", "O-", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 93,
    doctors: [
      { name: "Dr. Sachin Patil", spec: "Cardiology", exp: "17 Yrs", availability: "Today 2:30 PM" }
    ],
    bedGrid: [
      { id: "AST-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "AST-202", type: "Ventilator", status: "occupied", patient: "P-7701", oxygen: true }
    ]
  },
  {
    id: "hosp-162",
    name: "Dhanwantari Hospital",
    district: "Kolhapur",
    city: "Kolhapur",
    address: "Tarabai Park, Kolhapur, Maharashtra 416003",
    phone: "+91 231 2655 000",
    rating: 4.3,
    reviewsCount: 195,
    specialty: "Surgery",
    bedsTotal: 80,
    bedsAvailable: 10,
    bedsOccupied: 70,
    icuAvailable: 3,
    ventilatorsAvailable: 1,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: false,
    careScore: 80,
    doctors: [
      { name: "Dr. Dattatray More", spec: "General Surgery", exp: "13 Yrs", availability: "Today 4:00 PM" }
    ],
    bedGrid: [
      { id: "DHA-201", type: "ICU", status: "occupied", patient: "P-4490", oxygen: true },
      { id: "DHA-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  },
  {
    id: "hosp-163",
    name: "Siddhivinayak Hospital",
    district: "Sangli",
    city: "Sangli",
    address: "Vishrambag, Sangli, Maharashtra 416415",
    phone: "+91 233 2300 000",
    rating: 4.4,
    reviewsCount: 215,
    specialty: "Cancer Care & Multispecialty",
    bedsTotal: 120,
    bedsAvailable: 16,
    bedsOccupied: 104,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+", "O-"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 84,
    doctors: [
      { name: "Dr. Ramesh Patil", spec: "Oncology", exp: "14 Yrs", availability: "Today 1:00 PM" }
    ],
    bedGrid: [
      { id: "SID-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "SID-202", type: "General Ward", status: "occupied", patient: "P-2210", oxygen: false }
    ]
  },
  {
    id: "hosp-164",
    name: "Prakash Hospital",
    district: "Sangli",
    city: "Islampur",
    address: "Main Road, Islampur, Sangli, Maharashtra 415409",
    phone: "+91 233 2221 000",
    rating: 4.2,
    reviewsCount: 130,
    specialty: "General Care",
    bedsTotal: 60,
    bedsAvailable: 8,
    bedsOccupied: 52,
    icuAvailable: 2,
    ventilatorsAvailable: 1,
    bloodGroupAvailable: ["A+", "B+", "O+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 76,
    doctors: [
      { name: "Dr. Anil Prakash", spec: "General Medicine", exp: "9 Yrs", availability: "Today 10:00 AM" }
    ],
    bedGrid: [
      { id: "PRA-201", type: "ICU", status: "available", patient: null, oxygen: true },
      { id: "PRA-202", type: "General Ward", status: "occupied", patient: "P-5501", oxygen: false }
    ]
  },
  {
    id: "hosp-165",
    name: "Vigyan Hospital",
    district: "Satara",
    city: "Satara",
    address: "Shivaji Road, Satara, Maharashtra 415001",
    phone: "+91 2162 232 000",
    rating: 4.3,
    reviewsCount: 170,
    specialty: "Multispecialty",
    bedsTotal: 100,
    bedsAvailable: 14,
    bedsOccupied: 86,
    icuAvailable: 5,
    ventilatorsAvailable: 2,
    bloodGroupAvailable: ["A+", "B+", "O+", "AB+"],
    pmjayEmpaneled: true,
    mjpjayEmpaneled: true,
    careScore: 81,
    doctors: [
      { name: "Dr. Madhav Kadam", spec: "Internal Medicine", exp: "10 Yrs", availability: "Today 11:00 AM" }
    ],
    bedGrid: [
      { id: "VIG-201", type: "ICU", status: "occupied", patient: "P-8810", oxygen: true },
      { id: "VIG-202", type: "General Ward", status: "available", patient: null, oxygen: false }
    ]
  }
];
