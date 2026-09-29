// AarogyaConnect - Treatment Cost Breakdown & Procedure Database
export const INITIAL_PROCEDURES = [
  {
    id: "proc-1",
    name: "Coronary Angioplasty (Single Stent)",
    department: "Cardiology",
    description: "Percutaneous coronary intervention with drug-eluting stent (DES) insertion to clear blocked arteries.",
    stayDays: "2-3 Days",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 135000,
        doctorFee: 35000,
        otFee: 45000,
        roomFee: 15000,
        medicinesFee: 25000,
        diagnosticFee: 15000
      },
      "Semi-Private": {
        total: 175000,
        doctorFee: 45000,
        otFee: 55000,
        roomFee: 30000,
        medicinesFee: 28000,
        diagnosticFee: 17000
      },
      "Private Ward": {
        total: 230000,
        doctorFee: 65000,
        otFee: 70000,
        roomFee: 48000,
        medicinesFee: 30000,
        diagnosticFee: 17000
      },
      "ICU Recovery": {
        total: 280000,
        doctorFee: 75000,
        otFee: 80000,
        roomFee: 70000,
        medicinesFee: 35000,
        diagnosticFee: 20000
      }
    }
  },
  {
    id: "proc-2",
    name: "Total Knee Replacement (Unilateral)",
    department: "Orthopedics",
    description: "Surgical replacement of diseased knee joint with high-grade titanium/ceramic prosthesis and computerized alignment.",
    stayDays: "4-5 Days",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 160000,
        doctorFee: 40000,
        otFee: 50000,
        roomFee: 22000,
        medicinesFee: 32000,
        diagnosticFee: 16000
      },
      "Semi-Private": {
        total: 210000,
        doctorFee: 55000,
        otFee: 65000,
        roomFee: 42000,
        medicinesFee: 30000,
        diagnosticFee: 18000
      },
      "Private Ward": {
        total: 275000,
        doctorFee: 75000,
        otFee: 85000,
        roomFee: 60000,
        medicinesFee: 35000,
        diagnosticFee: 20000
      },
      "ICU Recovery": {
        total: 330000,
        doctorFee: 90000,
        otFee: 95000,
        roomFee: 85000,
        medicinesFee: 38000,
        diagnosticFee: 22000
      }
    }
  },
  {
    id: "proc-3",
    name: "Cataract Surgery (Phaco + Foldable IOL)",
    department: "Ophthalmology",
    description: "Micro-incision ultrasonic cataract extraction with premium foldable intraocular lens implantation.",
    stayDays: "Day Care (4-6 Hours)",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 28000,
        doctorFee: 9000,
        otFee: 10000,
        roomFee: 3000,
        medicinesFee: 3500,
        diagnosticFee: 2500
      },
      "Semi-Private": {
        total: 42000,
        doctorFee: 14000,
        otFee: 15000,
        roomFee: 5500,
        medicinesFee: 4500,
        diagnosticFee: 3000
      },
      "Private Ward": {
        total: 65000,
        doctorFee: 22000,
        otFee: 22000,
        roomFee: 9000,
        medicinesFee: 7000,
        diagnosticFee: 5000
      },
      "ICU Recovery": {
        total: 80000,
        doctorFee: 28000,
        otFee: 26000,
        roomFee: 12000,
        medicinesFee: 8000,
        diagnosticFee: 6000
      }
    }
  },
  {
    id: "proc-4",
    name: "Caesarean Section (C-Section Delivery)",
    department: "Obstetrics & Gynecology",
    description: "Planned or emergency lower segment cesarean section with pediatrician in attendance and neonatal nursery care.",
    stayDays: "3-4 Days",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 48000,
        doctorFee: 15000,
        otFee: 16000,
        roomFee: 7000,
        medicinesFee: 6500,
        diagnosticFee: 3500
      },
      "Semi-Private": {
        total: 75000,
        doctorFee: 24000,
        otFee: 23000,
        roomFee: 14000,
        medicinesFee: 8500,
        diagnosticFee: 5500
      },
      "Private Ward": {
        total: 110000,
        doctorFee: 38000,
        otFee: 32000,
        roomFee: 22000,
        medicinesFee: 11000,
        diagnosticFee: 7000
      },
      "ICU Recovery": {
        total: 145000,
        doctorFee: 48000,
        otFee: 42000,
        roomFee: 32000,
        medicinesFee: 13000,
        diagnosticFee: 10000
      }
    }
  },
  {
    id: "proc-5",
    name: "Laparoscopic Cholecystectomy (Gallbladder)",
    department: "General & GI Surgery",
    description: "Minimally invasive keyhole removal of gallstones and gallbladder with minimal recovery downtime.",
    stayDays: "2 Days",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 58000,
        doctorFee: 18000,
        otFee: 20000,
        roomFee: 8000,
        medicinesFee: 7000,
        diagnosticFee: 5000
      },
      "Semi-Private": {
        total: 85000,
        doctorFee: 26000,
        otFee: 28000,
        roomFee: 15000,
        medicinesFee: 9500,
        diagnosticFee: 6500
      },
      "Private Ward": {
        total: 125000,
        doctorFee: 40000,
        otFee: 38000,
        roomFee: 25000,
        medicinesFee: 13000,
        diagnosticFee: 9000
      },
      "ICU Recovery": {
        total: 160000,
        doctorFee: 50000,
        otFee: 46000,
        roomFee: 36000,
        medicinesFee: 16000,
        diagnosticFee: 12000
      }
    }
  },
  {
    id: "proc-6",
    name: "Hemodialysis (Single Session & Monthly)",
    department: "Nephrology",
    description: "High-flux hemodialysis with dialyzer reuse or single-use dialyzer, heparin infusion, and nephrologist rounds.",
    stayDays: "Day Care (4 Hours)",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 2200,
        doctorFee: 500,
        otFee: 900,
        roomFee: 400,
        medicinesFee: 250,
        diagnosticFee: 150
      },
      "Semi-Private": {
        total: 3200,
        doctorFee: 800,
        otFee: 1200,
        roomFee: 600,
        medicinesFee: 350,
        diagnosticFee: 250
      },
      "Private Ward": {
        total: 4500,
        doctorFee: 1200,
        otFee: 1600,
        roomFee: 900,
        medicinesFee: 450,
        diagnosticFee: 350
      },
      "ICU Recovery": {
        total: 7500,
        doctorFee: 2000,
        otFee: 2500,
        roomFee: 1800,
        medicinesFee: 700,
        diagnosticFee: 500
      }
    }
  },
  {
    id: "proc-7",
    name: "Brain Tumor Craniotomy (Microsurgical)",
    department: "Neurosurgery",
    description: "Precision neuro-navigation guided craniotomy for benign or malignant intracranial lesion excision.",
    stayDays: "6-8 Days",
    pmjayCovered: true,
    mjpjayCovered: true,
    costs: {
      "General Ward": {
        total: 260000,
        doctorFee: 75000,
        otFee: 85000,
        roomFee: 35000,
        medicinesFee: 40000,
        diagnosticFee: 25000
      },
      "Semi-Private": {
        total: 340000,
        doctorFee: 95000,
        otFee: 110000,
        roomFee: 55000,
        medicinesFee: 48000,
        diagnosticFee: 32000
      },
      "Private Ward": {
        total: 440000,
        doctorFee: 125000,
        otFee: 140000,
        roomFee: 85000,
        medicinesFee: 55000,
        diagnosticFee: 35000
      },
      "ICU Recovery": {
        total: 550000,
        doctorFee: 155000,
        otFee: 170000,
        roomFee: 115000,
        medicinesFee: 65000,
        diagnosticFee: 45000
      }
    }
  }
];
