import React, { lazy, Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, Activity, Shield, PhoneCall, Navigation, Search, MapPin, Calendar, 
  Clock, FileText, CheckCircle, AlertTriangle, ChevronRight, Mic, MicOff, 
  Video, VideoOff, MessageSquare, Plus, Edit, Trash2, Database, Download, 
  ExternalLink, Info, Filter, ArrowRight, RefreshCw, X, Award, Stethoscope, 
  Sliders, Globe, Building2, UserCheck, ShieldAlert, Cpu, Sparkles, Send,
  Layers, Volume2, Play, Lock, Eye, Check, AlertCircle, Phone, Droplet,
  Bookmark, BookmarkCheck, Share2, Compass, Ambulance, Star, Printer, Menu,
  LogIn, LogOut, CheckSquare, Zap
} from 'lucide-react';

import { INITIAL_DISTRICTS, INITIAL_HOSPITALS } from './data/hospitals.js';
import { INITIAL_BLOOD_BANKS } from './data/bloodBanks.js';
import { INITIAL_DOCTORS } from './data/doctors.js';
import { INITIAL_PROCEDURES } from './data/procedures.js';
import { INITIAL_SCHEMES } from './data/schemes.js';
import { INITIAL_INSURERS } from './data/insurers.js';
import { INITIAL_REVIEWS } from './data/reviews.js';
import { STATIC_TRANSLATIONS, TRANSLATIONS } from './data/translations.js';
const AmbulanceRouteMap = lazy(() => import('./components/AmbulanceRouteMap.jsx'));

// ==========================================
// 1. BACKEND SERVICE & PERSISTENCE ENGINE
// ==========================================

class BackendService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    const DATA_VERSION = 'v3_production';
    if (localStorage.getItem('aarogya_data_version') !== DATA_VERSION) {
      localStorage.setItem('aarogya_hospitals', JSON.stringify(INITIAL_HOSPITALS));
      localStorage.setItem('aarogya_blood_banks', JSON.stringify(INITIAL_BLOOD_BANKS));
      localStorage.setItem('aarogya_doctors', JSON.stringify(INITIAL_DOCTORS));
      localStorage.setItem('aarogya_procedures', JSON.stringify(INITIAL_PROCEDURES));
      localStorage.setItem('aarogya_schemes', JSON.stringify(INITIAL_SCHEMES));
      localStorage.setItem('aarogya_insurers', JSON.stringify(INITIAL_INSURERS));
      localStorage.setItem('aarogya_reviews', JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem('aarogya_data_version', DATA_VERSION);
    }

    if (!localStorage.getItem('aarogya_user')) {
      localStorage.setItem('aarogya_user', JSON.stringify({
        name: "Aarav Sharma",
        phone: "+91 98230 11223",
        email: "aarav.sharma@example.com",
        abhaId: "91-4829-1029-4481",
        age: 34,
        gender: "Male",
        bloodGroup: "O+",
        district: "Pune",
        state: "Maharashtra",
        emergencyContact: "+91 98230 99887",
        role: "PATIENT"
      }));
    }

    if (!localStorage.getItem('aarogya_appointments')) {
      localStorage.setItem('aarogya_appointments', JSON.stringify([
        {
          id: "apt-101",
          doctorId: "doc-101",
          doctor: "Dr. Rajesh Deshmukh",
          specialty: "Cardiology",
          hospital: "KEM Hospital & Research Centre",
          date: "2026-09-28",
          time: "04:00 PM",
          status: "Confirmed",
          patientName: "Aarav Sharma",
          type: "In-Person Consultation",
          symptoms: "Mild exertional palpitations"
        }
      ]));
    }

    if (!localStorage.getItem('aarogya_bookings')) {
      localStorage.setItem('aarogya_bookings', JSON.stringify([
        {
          id: "BED-MH-2026-4412",
          hospitalId: "hosp-101",
          hospitalName: "KEM Hospital & Research Centre",
          bedType: "ICU Bed",
          bedNumber: "B-102",
          patientName: "Aarav Sharma",
          age: 34,
          status: "CONFIRMED",
          bookingTime: "Today, 11:30 AM",
          qrToken: "MH-KEM-ICU-B102-QR",
          urgency: "Urgent"
        }
      ]));
    }

    if (!localStorage.getItem('aarogya_blood_requests')) {
      localStorage.setItem('aarogya_blood_requests', JSON.stringify([]));
    }

    if (!localStorage.getItem('aarogya_emergency_sos')) {
      localStorage.setItem('aarogya_emergency_sos', JSON.stringify([
        {
          id: "SOS-8821",
          patientName: "Aarav Sharma",
          category: "Cardiac Emergency",
          district: "Pune",
          timestamp: "2026-09-25 14:10",
          status: "Dispatched",
          ambulanceAssigned: "MH 12 AB 9001 (ALS)"
        }
      ]));
    }

    if (!localStorage.getItem('aarogya_saved_hospitals')) {
      localStorage.setItem('aarogya_saved_hospitals', JSON.stringify(["hosp-101", "hosp-102"]));
    }

    if (!localStorage.getItem('aarogya_saved_doctors')) {
      localStorage.setItem('aarogya_saved_doctors', JSON.stringify(["doc-101", "doc-103"]));
    }
  }

  getHospitals() {
    return JSON.parse(localStorage.getItem('aarogya_hospitals') || "[]");
  }

  saveHospitals(hospitals) {
    localStorage.setItem('aarogya_hospitals', JSON.stringify(hospitals));
  }

  getBloodBanks() {
    return JSON.parse(localStorage.getItem('aarogya_blood_banks') || "[]");
  }

  saveBloodBanks(list) {
    localStorage.setItem('aarogya_blood_banks', JSON.stringify(list));
  }

  getDoctors() {
    return JSON.parse(localStorage.getItem('aarogya_doctors') || "[]");
  }

  getProcedures() {
    return JSON.parse(localStorage.getItem('aarogya_procedures') || "[]");
  }

  getSchemes() {
    return JSON.parse(localStorage.getItem('aarogya_schemes') || "[]");
  }

  getInsurers() {
    return JSON.parse(localStorage.getItem('aarogya_insurers') || "[]");
  }

  getReviews() {
    return JSON.parse(localStorage.getItem('aarogya_reviews') || "[]");
  }

  saveReviews(list) {
    localStorage.setItem('aarogya_reviews', JSON.stringify(list));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('aarogya_user') || "{}");
  }

  updateUser(userData) {
    localStorage.setItem('aarogya_user', JSON.stringify(userData));
  }

  getAppointments() {
    return JSON.parse(localStorage.getItem('aarogya_appointments') || "[]");
  }

  addAppointment(apt) {
    const list = this.getAppointments();
    const newApt = { ...apt, id: `apt-${Date.now()}` };
    list.unshift(newApt);
    localStorage.setItem('aarogya_appointments', JSON.stringify(list));
    return newApt;
  }

  getBookings() {
    return JSON.parse(localStorage.getItem('aarogya_bookings') || "[]");
  }

  addBedBooking(booking) {
    const list = this.getBookings();
    const newBooking = {
      ...booking,
      id: `BED-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "CONFIRMED",
      qrToken: `MH-BED-${Math.floor(100000 + Math.random() * 900000)}`
    };
    list.unshift(newBooking);
    localStorage.setItem('aarogya_bookings', JSON.stringify(list));

    // Decrement bed count
    const hospitals = this.getHospitals();
    const hosp = hospitals.find(h => h.id === booking.hospitalId);
    if (hosp && hosp.bedsAvailable > 0) {
      hosp.bedsAvailable -= 1;
      hosp.bedsOccupied += 1;
      if (booking.bedType === 'ICU' && hosp.icuAvailable > 0) {
        hosp.icuAvailable -= 1;
      }
      this.saveHospitals(hospitals);
    }
    return newBooking;
  }

  cancelBooking(bookingId) {
    const list = this.getBookings();
    const updated = list.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b);
    localStorage.setItem('aarogya_bookings', JSON.stringify(updated));
    return updated;
  }

  getBloodRequests() {
    return JSON.parse(localStorage.getItem('aarogya_blood_requests') || "[]");
  }

  addBloodRequest(req) {
    const list = this.getBloodRequests();
    const newReq = {
      ...req,
      id: `BLD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      status: "PENDING_VERIFICATION"
    };
    list.unshift(newReq);
    localStorage.setItem('aarogya_blood_requests', JSON.stringify(list));
    return newReq;
  }

  getEmergencySOSList() {
    return JSON.parse(localStorage.getItem('aarogya_emergency_sos') || "[]");
  }

  addEmergencySOS(sos) {
    const list = this.getEmergencySOSList();
    const newSOS = {
      ...sos,
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString(),
      status: "DISPATCHED"
    };
    list.unshift(newSOS);
    localStorage.setItem('aarogya_emergency_sos', JSON.stringify(list));
    return newSOS;
  }

  getSavedHospitals() {
    return JSON.parse(localStorage.getItem('aarogya_saved_hospitals') || "[]");
  }

  toggleSaveHospital(hospId) {
    let saved = this.getSavedHospitals();
    if (saved.includes(hospId)) {
      saved = saved.filter(id => id !== hospId);
    } else {
      saved.push(hospId);
    }
    localStorage.setItem('aarogya_saved_hospitals', JSON.stringify(saved));
    return saved;
  }

  getSavedDoctors() {
    return JSON.parse(localStorage.getItem('aarogya_saved_doctors') || "[]");
  }

  toggleSaveDoctor(docId) {
    let saved = this.getSavedDoctors();
    if (saved.includes(docId)) {
      saved = saved.filter(id => id !== docId);
    } else {
      saved.push(docId);
    }
    localStorage.setItem('aarogya_saved_doctors', JSON.stringify(saved));
    return saved;
  }
}

const api = new BackendService();

const LOCALIZED_ATTRIBUTES = new Set(['aria-label', 'placeholder', 'title', 'alt']);

function localizeText(text, language) {
  const content = text.trim();
  if (!content || language === 'EN') return text;

  const translation = STATIC_TRANSLATIONS[content]?.[language];
  if (!translation) return text;

  const leadingWhitespace = text.match(/^\s*/)?.[0] || '';
  const trailingWhitespace = text.match(/\s*$/)?.[0] || '';
  return `${leadingWhitespace}${translation}${trailingWhitespace}`;
}

function localizeNode(node, language) {
  if (typeof node === 'string') return localizeText(node, language);
  if (Array.isArray(node)) {
    return React.Children.toArray(node).map(child => localizeNode(child, language));
  }
  if (!React.isValidElement(node)) return node;

  const props = { ...node.props };
  for (const [name, value] of Object.entries(props)) {
    if (name === 'children') {
      props.children = localizeNode(value, language);
    } else if (LOCALIZED_ATTRIBUTES.has(name) && typeof value === 'string') {
      props[name] = localizeText(value, language);
    }
  }

  return React.cloneElement(node, props);
}

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  // Navigation & Language
  const [lang, setLang] = useState(() => {
    const savedLanguage = localStorage.getItem('aarogya_lang');
    return TRANSLATIONS[savedLanguage] ? savedLanguage : 'EN';
  });
  const [activeTab, setActiveTab] = useState('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States from API
  const [user, setUser] = useState(() => api.getUser());
  const [hospitals, setHospitals] = useState(() => api.getHospitals());
  const [bloodBanks, setBloodBanks] = useState(() => api.getBloodBanks());
  const [doctors, setDoctors] = useState(() => api.getDoctors());
  const [procedures] = useState(() => api.getProcedures());
  const [schemes] = useState(() => api.getSchemes());
  const [insurers] = useState(() => api.getInsurers());
  const [reviews, setReviews] = useState(() => api.getReviews());
  const [appointments, setAppointments] = useState(() => api.getAppointments());
  const [bookings, setBookings] = useState(() => api.getBookings());
  const [savedHospitalIds, setSavedHospitalIds] = useState(() => api.getSavedHospitals());
  const [savedDoctorIds, setSavedDoctorIds] = useState(() => api.getSavedDoctors());
  const [emergencySOSLog, setEmergencySOSLog] = useState(() => api.getEmergencySOSList());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [bloodSearchQuery, setBloodSearchQuery] = useState('');
  const [activeVoiceTarget, setActiveVoiceTarget] = useState(null); // 'global', 'hospitals', 'doctors', 'blood', 'assistant', 'symptoms'
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [filterIcuOnly, setFilterIcuOnly] = useState(false);
  const [filterPmjayOnly, setFilterPmjayOnly] = useState(false);
  const [filterMjpjayOnly, setFilterMjpjayOnly] = useState(false);
  const [sortBy, setSortBy] = useState('careScore'); // 'careScore', 'rating', 'beds', 'reviews'
  
  // Selection & Details
  const [selectedHospitalForDetails, setSelectedHospitalForDetails] = useState(null);
  const [hospitalDetailTab, setHospitalDetailTab] = useState('overview'); // 'overview', 'beds', 'doctors', 'costs', 'facilities', 'schemes', 'reviews'
  const [comparisonList, setComparisonList] = useState([]);

  // Blood Bank Filter States
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [bloodDistrictFilter, setBloodDistrictFilter] = useState('All');

  // AI Recommendation Engine Inputs & Results
  const [aiRecTreatment, setAiRecTreatment] = useState('Cardiology & Angioplasty');
  const [aiRecDistrict, setAiRecDistrict] = useState('Pune');
  const [aiRecBudget, setAiRecBudget] = useState('₹ 1,50,000 - ₹ 3,00,000');
  const [aiRecScheme, setAiRecScheme] = useState('Any');
  const [aiRecPriority, setAiRecPriority] = useState('careScore');
  const [aiRecResults, setAiRecResults] = useState(null);

  // AI Symptom Checker & Chat Assistant
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am Aarogya AI, your Maharashtra Healthcare Decision Support Assistant. How can I help you find ICU beds, compare hospitals, search blood banks, or triage symptoms today?'
    }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Voice Assistant
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Ambulance Dispatch Simulator
  const [ambulanceDispatch, setAmbulanceDispatch] = useState({
    active: false,
    status: 'IDLE', // 'REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED'
    driver: 'Suresh Gaikwad',
    phone: '+91 91234 56789',
    vehicleNo: 'MH 12 AB 9001 (ALS)',
    ambulanceType: 'ALS (Advanced Life Support)',
    etaMinutes: 10,
    progress: 15,
    pickupLocation: 'Pune Station Road, Pune',
    destinationHospital: 'KEM Hospital & Research Centre'
  });
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  // Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sosCategory, setSosCategory] = useState('Cardiac Emergency');

  // Cost Calculator
  const [calcProcedureName, setCalcProcedureName] = useState('Coronary Angioplasty (Single Stent)');
  const [calcWardTier, setCalcWardTier] = useState('Semi-Private');
  const [calcHasInsurance, setCalcHasInsurance] = useState(true);

  // Insurance Verification & OCR Explainer
  const [insVerifyProvider, setInsVerifyProvider] = useState('Star Health & Allied Insurance');
  const [insPolicyNo, setInsPolicyNo] = useState('SHAI-MH-2026-9921');
  const [insVerifyHospital, setInsVerifyHospital] = useState('KEM Hospital & Research Centre');
  const [insVerifyResult, setInsVerifyResult] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);

  // Government Scheme Eligibility Quiz
  const [schemeRationCard, setSchemeRationCard] = useState('Orange');
  const [schemeAnnualIncome, setSchemeAnnualIncome] = useState('Under ₹1 Lakh');
  const [schemeResult, setSchemeResult] = useState(null);

  // Modals
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [authForm, setAuthForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    age: '', gender: 'Male', bloodGroup: 'O+', district: 'Pune', emergencyContact: ''
  });
  const [bookAppointmentModal, setBookAppointmentModal] = useState({ isOpen: false, doctor: null, hospital: null });
  const [bookAppointmentForm, setBookAppointmentForm] = useState({
    patientName: user.name || '',
    date: '2026-09-29',
    timeSlot: '11:00 AM',
    reason: 'General Consultation & Review',
    phone: user.phone || ''
  });
  const [bookBedModal, setBookBedModal] = useState({ isOpen: false, hospital: null, bedType: 'General Ward' });
  const [bookBedForm, setBookBedForm] = useState({
    patientName: user.name || '',
    age: user.age || 34,
    urgency: 'Immediate Admission',
    referralDoctor: '',
    contactPhone: user.phone || ''
  });
  const [requestBloodModal, setRequestBloodModal] = useState({ isOpen: false, bloodBank: null, bloodGroup: 'O+' });
  const [requestBloodForm, setRequestBloodForm] = useState({
    unitsRequired: '2',
    patientName: user.name || '',
    hospitalName: 'KEM Hospital, Pune',
    urgency: 'Emergency (Immediate)',
    contactPhone: user.phone || ''
  });
  const [addReviewModal, setAddReviewModal] = useState({ isOpen: false, hospital: null });
  const [addReviewForm, setAddReviewForm] = useState({ rating: 5, department: 'Cardiology', comment: '' });
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [teleConsultModal, setTeleConsultModal] = useState({ isOpen: false, doctor: null });
  const [teleConsultState, setTeleConsultState] = useState({ videoMuted: false, audioMuted: false, callEnded: false, eRxGenerated: false });

  // Admin Dashboard State
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [adminError, setAdminError] = useState('');
  const [newHospitalForm, setNewHospitalForm] = useState({
    name: '', district: 'Pune', city: 'Pune', phone: '+91 20 2000 0000',
    bedsTotal: 100, bedsAvailable: 20, icuAvailable: 6, rating: 4.5
  });

  // Current translation dictionary
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  // Persist language choice
  const handleLangChange = (newLang) => {
    if (!TRANSLATIONS[newLang]) return;
    setLang(newLang);
    localStorage.setItem('aarogya_lang', newLang);
  };

  // Toast / notification helper
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ==========================================
  // 3. VOICE SEARCH & WEB SPEECH ENGINE
  // ==========================================

  const getListeningPlaceholder = () => {
    if (lang === 'MR') return "ऐकत आहे... (Listening...)";
    if (lang === 'HI') return "सुन रहा है... (Listening...)";
    return "Listening... Speak now";
  };

  const startVoiceRecognition = (target = 'global') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast("Voice search is not supported in this browser. Please use Chrome, Edge, or Brave.");
      return;
    }

    // Toggle off if clicking same active listening target
    if (isListening && activeVoiceTarget === target) {
      setIsListening(false);
      setActiveVoiceTarget(null);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = lang === 'MR' ? 'mr-IN' : lang === 'HI' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setActiveVoiceTarget(target);
      setVoiceTranscript(
        lang === 'MR' ? "ऐकत आहे... कृपया स्पष्ट बोला." :
        lang === 'HI' ? "सुन रहा है... कृपया स्पष्ट बोलें।" :
        "Listening... Please speak clearly."
      );

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setIsListening(false);
        setActiveVoiceTarget(null);
        handleVoiceTranscript(transcript, target);
      };

      recognition.onerror = (err) => {
        setIsListening(false);
        setActiveVoiceTarget(null);
        if (err.error === 'not-allowed') {
          showToast("Microphone permission denied. Please allow microphone access in browser settings.");
        } else if (err.error === 'no-speech') {
          showToast("No speech detected. Please click the mic and speak again.");
        } else {
          showToast("Voice error: " + (err.error || "Please try again."));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setActiveVoiceTarget(null);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setActiveVoiceTarget(null);
      showToast("Microphone error: " + (e.message || "Could not start voice recognition"));
    }
  };

  const handleVoiceTranscript = (text, target) => {
    const lower = text.toLowerCase().trim();
    showToast(`🎙️ Voice Recognized: "${text}"`);

    const districtsMap = {
      "pune": "Pune", "पुणे": "Pune",
      "mumbai": "Mumbai", "मुंबई": "Mumbai",
      "thane": "Thane", "ठाणे": "Thane",
      "nagpur": "Nagpur", "नागपूर": "Nagpur",
      "nashik": "Nashik", "नाशिक": "Nashik",
      "sambhajinagar": "Chhatrapati Sambhajinagar", "संभाजीनगर": "Chhatrapati Sambhajinagar", "aurangabad": "Chhatrapati Sambhajinagar", "औरंगाबाद": "Chhatrapati Sambhajinagar",
      "kolhapur": "Kolhapur", "कोल्हापूर": "Kolhapur",
      "solapur": "Solapur", "सोलापूर": "Solapur",
      "sangli": "Sangli", "सांगली": "Sangli",
      "satara": "Satara", "सातारा": "Satara"
    };

    let detectedBloodGroup = null;
    const bgList = ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'];
    for (const bg of bgList) {
      if (lower.includes(bg) || lower.includes(bg.replace('+', ' positive').replace('-', ' negative'))) {
        detectedBloodGroup = bg.toUpperCase();
        break;
      }
    }
    if (!detectedBloodGroup) {
      if (lower.includes('o positive') || lower.includes('ओ पॉझिटिव्ह') || lower.includes('ओ पॉजिटिव')) detectedBloodGroup = 'O+';
      else if (lower.includes('a positive') || lower.includes('ए पॉझिटिव्ह') || lower.includes('ए पॉजिटिव')) detectedBloodGroup = 'A+';
      else if (lower.includes('b positive') || lower.includes('बी पॉझिटिव्ह') || lower.includes('बी पॉजिटिव')) detectedBloodGroup = 'B+';
      else if (lower.includes('ab positive') || lower.includes('एबी पॉझिटिव्ह')) detectedBloodGroup = 'AB+';
    }

    if (target === 'doctors') {
      setDoctorSearchQuery(text);
      for (const [key, dist] of Object.entries(districtsMap)) {
        if (lower.includes(key)) setSelectedDistrict(dist);
      }
    } else if (target === 'blood') {
      setBloodSearchQuery(text);
      if (detectedBloodGroup) setBloodGroupFilter(detectedBloodGroup);
      for (const [key, dist] of Object.entries(districtsMap)) {
        if (lower.includes(key)) setBloodDistrictFilter(dist);
      }
    } else if (target === 'assistant') {
      setAiChatInput(text);
      setAiChatMessages(prev => [...prev, { sender: 'user', text: text }]);
      setIsAiThinking(true);
      setTimeout(() => {
        let reply = "";
        if (lower.includes('icu') || lower.includes('bed') || lower.includes('बेड')) {
          reply = `Verified ICU beds found: In ${user.district}, ${hospitals[0]?.name} has ${hospitals[0]?.icuAvailable} free ICU beds and ${hospitals[1]?.name} has ${hospitals[1]?.icuAvailable} free beds.`;
        } else if (lower.includes('blood') || lower.includes('रक्त') || lower.includes('खून') || detectedBloodGroup) {
          reply = `Apex blood banks currently have ${detectedBloodGroup || 'required'} blood inventory. You can reserve units in the 'Find Blood' module.`;
        } else if (lower.includes('scheme') || lower.includes('योजना') || lower.includes('pmjay') || lower.includes('mjpjay')) {
          reply = `Under Ayushman Bharat (PM-JAY) and MJPJAY, eligible patients in Maharashtra receive up to ₹5,00,000 cashless treatment across 48+ empaneled hospitals.`;
        } else {
          reply = `Thank you for consulting Aarogya AI. Based on "${text}", I recommend checking available hospital facilities or booking a consultation with our on-duty specialists.`;
        }
        setAiChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
        setIsAiThinking(false);
      }, 700);
    } else if (target === 'symptoms') {
      setSymptomInput(text);
    } else if (target === 'hospitals') {
      setSearchQuery(text);
      for (const [key, dist] of Object.entries(districtsMap)) {
        if (lower.includes(key)) setSelectedDistrict(dist);
      }
      if (lower.includes('icu') || lower.includes('बेड') || lower.includes('bed')) {
        setFilterIcuOnly(true);
      }
    } else {
      // Global search routing
      if (lower.includes('ambulance') || lower.includes('रुग्णवाहिका') || lower.includes('एंबुलेंस')) {
        setActiveTab('ambulance');
        showToast("Routing to 108 Emergency Ambulance");
      } else if (lower.includes('emergency') || lower.includes('sos') || lower.includes('आपत्कालीन') || lower.includes('इमरजेंसी')) {
        setActiveTab('emergency');
        setSosActive(true);
        showToast("Activated Emergency SOS Mode");
      } else if (lower.includes('blood') || lower.includes('रक्त') || lower.includes('खून') || lower.includes('ब्लड') || detectedBloodGroup) {
        setActiveTab('blood-bank');
        if (detectedBloodGroup) setBloodGroupFilter(detectedBloodGroup);
        setBloodSearchQuery(text);
        showToast(`Showing Blood Banks for ${detectedBloodGroup || text}`);
      } else if (lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('वैद्य')) {
        setActiveTab('doctors');
        setDoctorSearchQuery(text);
        showToast("Routing to Specialist Doctors");
      } else if (lower.includes('scheme') || lower.includes('योजना') || lower.includes('ayushman') || lower.includes('pmjay') || lower.includes('mjpjay')) {
        setActiveTab('schemes');
        showToast("Routing to PM-JAY & MJPJAY Schemes");
      } else if (lower.includes('cost') || lower.includes('खर्च') || lower.includes('कॅल्क्युलेटर') || lower.includes('बिल')) {
        setActiveTab('cost');
        showToast("Routing to Treatment Cost Calculator");
      } else if (lower.includes('icu') || lower.includes('ventilator') || lower.includes('बेड') || lower.includes('bed')) {
        setActiveTab('beds');
        showToast("Showing Real-Time Bed Matrix");
      } else {
        setSearchQuery(text);
        setActiveTab('hospitals');
        for (const [key, dist] of Object.entries(districtsMap)) {
          if (lower.includes(key)) setSelectedDistrict(dist);
        }
      }
    }
  };

  // ==========================================
  // 4. AI SYMPTOM TRIAGE & CHAT ENGINE
  // ==========================================

  const analyzeSymptoms = () => {
    if (!symptomInput.trim()) return;
    const lower = symptomInput.toLowerCase();
    let triage = "GREEN";
    let recommendation = "Mild symptoms detected. Recommended to consult a General Physician for routine evaluation.";
    let predictedSpecialist = "General Physician";

    if (lower.includes('chest') || lower.includes('heart') || lower.includes('breath') || lower.includes('stroke') || lower.includes('unconscious') || lower.includes('छातीत') || lower.includes('श्वास')) {
      triage = "RED";
      recommendation = "CRITICAL WARNING: Potential cardiac or severe respiratory emergency. Proceed to nearest 24/7 ICU hospital or call 108 immediately.";
      predictedSpecialist = "Interventional Cardiologist / Emergency Physician";
    } else if (lower.includes('fever') || lower.includes('vomit') || lower.includes('pain') || lower.includes('fracture') || lower.includes('ताप') || lower.includes('वेदना')) {
      triage = "YELLOW";
      recommendation = "Moderate severity symptoms. Monitor vitals, stay hydrated, and consult a specialist within 12-24 hours.";
      predictedSpecialist = "Internal Medicine Specialist";
    }

    setSymptomResult({
      triage,
      recommendation,
      predictedSpecialist,
      suggestedHospitals: hospitals.filter(h => h.district === user.district).slice(0, 3)
    });
  };

  const sendAiChatMessage = async () => {
    if (!aiChatInput.trim()) return;
    const userMsg = aiChatInput.trim();
    setAiChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiChatInput('');
    setIsAiThinking(true);

    const lower = userMsg.toLowerCase();
    setTimeout(() => {
      let reply = "";
      if (lower.includes('icu') || lower.includes('bed')) {
        reply = `I found verified ICU beds across Maharashtra. In ${user.district}, ${hospitals[0]?.name} currently has ${hospitals[0]?.icuAvailable} free ICU beds and ${hospitals[1]?.name} has ${hospitals[1]?.icuAvailable} free beds. You can reserve one directly via the 'Find Beds' tab.`;
      } else if (lower.includes('blood') || lower.includes('रक्त')) {
        reply = `For blood bank requirements, we have 12 apex centres tracked in real time. Red Cross Blood Centre, Pune and KEM Blood Centre have O+, A+, and B+ units currently available.`;
      } else if (lower.includes('scheme') || lower.includes('pmjay') || lower.includes('mjpjay') || lower.includes('योजना')) {
        reply = `Under Ayushman Bharat (PM-JAY) you get up to ₹5,00,000 cashless cover per family. Maharashtra's MJPJAY covers 996 surgical procedures with Orange or Yellow ration cards. 48+ hospitals on our platform are empaneled.`;
      } else if (lower.includes('cost') || lower.includes('angioplasty') || lower.includes('surgery')) {
        reply = `For Coronary Angioplasty with single drug-eluting stent, estimated cost ranges from ₹1,35,000 (General Ward) to ₹2,30,000 (Private Ward). PM-JAY and MJPJAY cover this procedure 100% cashless at empaneled hospitals.`;
      } else {
        reply = `Thank you for consulting Aarogya AI. Based on "${userMsg}", I recommend checking bed status at ${hospitals[0]?.name} or speaking with an on-duty specialist. Please remember: for immediate life-threatening symptoms, dial 108 or activate our SOS Emergency mode.`;
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiThinking(false);
    }, 700);
  };

  // ==========================================
  // 5. AMBULANCE SIMULATOR
  // ==========================================

  const triggerAmbulanceBooking = (type = 'ALS (Advanced Life Support)', pickup = 'Pune Station Road') => {
    setAmbulanceDispatch({
      active: true,
      status: 'DISPATCHED',
      driver: 'Suresh Gaikwad',
      phone: '+91 91234 56789',
      vehicleNo: 'MH 12 AB 9001',
      ambulanceType: type,
      etaMinutes: 10,
      progress: 25,
      pickupLocation: pickup,
      destinationHospital: hospitals[0]?.name || 'KEM Hospital'
    });
    showToast("Ambulance Dispatched! Live tracking initiated.");
  };

  const centerOnUserLocation = () => {
    if (!navigator.geolocation) {
      showToast('Location is unavailable in this browser.');
      return;
    }

    showToast('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = [coords.latitude, coords.longitude];
        setUserLocation(location);
        setMapCenter(location);
        showToast('Map centered on your location.');
      },
      () => showToast('Unable to get your location. Check browser permissions.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  useEffect(() => {
    let interval;
    if (ambulanceDispatch.active && ambulanceDispatch.progress < 100) {
      interval = setInterval(() => {
        setAmbulanceDispatch(prev => {
          const nextProg = prev.progress + 15;
          let nextStatus = prev.status;
          let nextEta = Math.max(1, prev.etaMinutes - 2);

          if (nextProg >= 45 && nextProg < 85) nextStatus = 'EN_ROUTE';
          if (nextProg >= 85 && nextProg < 100) nextStatus = 'ARRIVED';
          if (nextProg >= 100) nextStatus = 'COMPLETED';

          return {
            ...prev,
            progress: Math.min(100, nextProg),
            status: nextStatus,
            etaMinutes: nextEta
          };
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [ambulanceDispatch.active, ambulanceDispatch.progress]);

  // ==========================================
  // 6. SOS EMERGENCY TOGGLE
  // ==========================================

  const triggerEmergencySOS = (category = 'Cardiac Emergency') => {
    setSosCategory(category);
    setSosActive(true);
    api.addEmergencySOS({
      patientName: user.name,
      category: category,
      district: user.district,
      ambulanceAssigned: "MH 12 AB 9001 (ALS)"
    });
    setEmergencySOSLog(api.getEmergencySOSList());
    showToast(`🚨 EMERGENCY SOS TRANSMITTED: ${category}! 108 Emergency Control alerted.`);
  };

  // ==========================================
  // 7. AI RECOMMENDATION ENGINE (CareScore)
  // ==========================================

  const computeAiRecommendations = () => {
    const list = hospitals.map(h => {
      let costScore = 88;
      let ratingScore = Math.round((h.rating / 5) * 100);
      let distScore = h.district === aiRecDistrict ? 95 : 65;
      let schemeScore = (aiRecScheme === 'PM-JAY' && h.pmjayEmpaneled) || (aiRecScheme === 'MJPJAY' && h.mjpjayEmpaneled) ? 100 : 85;
      let bedScore = h.bedsAvailable > 15 ? 96 : h.bedsAvailable > 5 ? 80 : 50;

      let totalScore = Math.round(
        (costScore * 0.25) + 
        (ratingScore * 0.25) + 
        (distScore * 0.20) + 
        (schemeScore * 0.15) + 
        (bedScore * 0.15)
      );

      return {
        hospital: h,
        totalScore,
        costScore,
        ratingScore,
        distScore,
        schemeScore,
        bedScore,
        whyRecommended: `${h.name} matches ${costScore}% on estimated budget compatibility, boasts a ${h.rating}★ clinical rating, and provides ${h.bedsAvailable} available beds with active ${h.pmjayEmpaneled ? 'PM-JAY' : 'MJPJAY'} cashless support.`
      };
    });

    list.sort((a, b) => b.totalScore - a.totalScore);
    setAiRecResults(list.slice(0, 4));
  };

  // ==========================================
  // 8. FILTERED & SORTED HOSPITALS
  // ==========================================

  const filteredHospitals = useMemo(() => {
    let result = hospitals.filter(h => {
      const matchDistrict = selectedDistrict === 'All' || h.district === selectedDistrict;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        h.name.toLowerCase().includes(q) || 
        h.district.toLowerCase().includes(q) ||
        (h.city && h.city.toLowerCase().includes(q)) ||
        (h.specialty && h.specialty.toLowerCase().includes(q)) ||
        (h.doctors && h.doctors.some(d => d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q)));

      const matchIcu = !filterIcuOnly || h.icuAvailable > 0;
      const matchPmjay = !filterPmjayOnly || h.pmjayEmpaneled;
      const matchMjpjay = !filterMjpjayOnly || h.mjpjayEmpaneled;

      return matchDistrict && matchSearch && matchIcu && matchPmjay && matchMjpjay;
    });

    if (sortBy === 'careScore') {
      result.sort((a, b) => (b.careScore || 0) - (a.careScore || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'beds') {
      result.sort((a, b) => b.bedsAvailable - a.bedsAvailable);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [hospitals, selectedDistrict, searchQuery, filterIcuOnly, filterPmjayOnly, filterMjpjayOnly, sortBy]);

  // Comparison toggle
  const toggleComparison = (hosp) => {
    if (comparisonList.some(item => item.id === hosp.id)) {
      setComparisonList(comparisonList.filter(item => item.id !== hosp.id));
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, hosp]);
      } else {
        showToast("Maximum 3 hospitals can be compared simultaneously.");
      }
    }
  };

  // Bookmark / Save Hospital
  const handleToggleSaveHospital = (hospId) => {
    const updated = api.toggleSaveHospital(hospId);
    setSavedHospitalIds(updated);
    showToast(updated.includes(hospId) ? "Hospital saved to your Health Portal" : "Hospital removed from saved list");
  };

  // Bookmark / Save Doctor
  const handleToggleSaveDoctor = (docId) => {
    const updated = api.toggleSaveDoctor(docId);
    setSavedDoctorIds(updated);
    showToast(updated.includes(docId) ? "Doctor saved to your Health Portal" : "Doctor removed from saved list");
  };

  // ==========================================
  // 9. OCR & INSURANCE SIMULATORS
  // ==========================================

  const simulateOCRAnalysis = () => {
    setOcrResult({
      patientName: user.name,
      testType: "Complete Blood Count (CBC) & Lipid Profile",
      abnormalities: [
        { parameter: "Hemoglobin", value: "11.2 g/dL", status: "Low", tip: "Mild anemia detected. Consider iron-rich diet (spinach, jaggery) and iron supplements under physician advice." },
        { parameter: "Triglycerides", value: "210 mg/dL", status: "High", tip: "Elevated lipids. Reduce fried snacks, saturated fats, and engage in daily 30-minute brisk walking." },
        { parameter: "Platelet Count", value: "1,85,000 /mcL", status: "Normal", tip: "Adequate platelets. Normal clotting parameters observed." }
      ],
      marathiSummary: "तुमच्या रक्ताच्या चाचणीत हिमोग्लोबिन किंचित कमी (११.२) आणि ट्रायग्लिसराइड्स वाढलेले (२१०) आढळले आहे. हिरव्या पालेभाज्यांचा आहारात समावेश करा आणि डॉक्टरांचा सल्ला घ्या.",
      hindiSummary: "आपके रक्त परीक्षण में हीमोग्लोबिन थोड़ा कम और ट्राइग्लिसराइड्स बढ़े हुए पाए गए हैं। संतुलित आहार लें और चिकित्सक से परामर्श करें।",
      overallRisk: "Moderate (Action Recommended)"
    });
  };

  const verifyInsurancePolicy = () => {
    setInsVerifyResult({
      policyNo: insPolicyNo,
      provider: insVerifyProvider,
      hospital: insVerifyHospital,
      status: "VERIFIED CASHLESS NETWORK",
      sumInsured: "₹ 10,00,000",
      roomRentCap: "Single Standard AC (No Co-Pay)",
      preAuthTime: "Under 2 Hours (In-House Desk)",
      deductible: "₹ 0 (Direct Cashless)",
      disclaimer: "Final coverage is subject to policy terms, pre-authorization approval, and hospital/insurer verification."
    });
  };

  const evaluateSchemeEligibility = () => {
    let eligible = false;
    let schemeName = "";
    let reason = "";

    if (schemeRationCard === 'Yellow') {
      eligible = true;
      schemeName = "PM-JAY & MJPJAY (100% Cashless)";
      reason = "Yellow Ration Card holders automatically qualify for full ₹5,00,000 cashless benefits under both state and central government programs.";
    } else if (schemeRationCard === 'Orange') {
      eligible = true;
      schemeName = "MJPJAY Scheme (Government of Maharashtra)";
      reason = "Orange Ration card holders residing in Maharashtra qualify for Mahatma Jyotirao Phule Jan Arogya Yojana coverage up to ₹5,00,000.";
    } else {
      eligible = false;
      schemeName = "Individual Evaluation Required";
      reason = "White card holders from 14 agrarian distress districts qualify with land holding proof. Otherwise, private health insurance is recommended.";
    }

    setSchemeResult({ eligible, schemeName, reason });
  };

  // Calculation for procedure
  const currentProcData = useMemo(() => {
    const proc = procedures.find(p => p.name === calcProcedureName) || procedures[0];
    const costTier = proc?.costs[calcWardTier] || proc?.costs["General Ward"];
    const outOfPocket = calcHasInsurance ? Math.round(costTier.total * 0.12) : costTier.total;
    return { proc, costTier, outOfPocket };
  }, [procedures, calcProcedureName, calcWardTier, calcHasInsurance]);

  return localizeNode((
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* SOS FLASHING BANNER (If Active) */}
      {sosActive && (
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white px-4 py-3 font-bold flex flex-wrap items-center justify-between shadow-2xl shadow-rose-900/50 z-50 sticky top-0 border-b border-rose-500">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span className="text-xs sm:text-sm tracking-wide">
              EMERGENCY SOS ACTIVE: {sosCategory.toUpperCase()} broadcasted to 108 Emergency Control & nearest trauma centers!
            </span>
          </div>

          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <a href="tel:108" className="bg-white text-rose-700 px-3 py-1 rounded-xl text-xs font-black shadow hover:bg-rose-50">
              📞 Call 108 Now
            </a>
            <button 
              onClick={() => setSosActive(false)} 
              className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-1 rounded-xl text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('landing');
              setIsMobileMenuOpen(false);
            }}
            className="flex min-w-0 items-center space-x-3 cursor-pointer group text-left"
            aria-label={`${t.appName} home`}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
                  {t.appName}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  MH-GOV
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              {['EN', 'MR', 'HI'].map(language => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLangChange(language)}
                  aria-label={`Switch language to ${language === 'EN' ? 'English' : language === 'MR' ? 'Marathi' : 'Hindi'}`}
                  aria-pressed={lang === language}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    lang === language
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'EN' ? 'EN' : language === 'MR' ? 'मराठी' : 'हिन्दी'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={startVoiceRecognition}
              title="Voice Search (en-IN, mr-IN, hi-IN)"
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('emergency');
                triggerEmergencySOS('Emergency Distress Signal');
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl shadow-lg shadow-rose-900/40 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS 108</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(open => !open)}
            className="md:hidden p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 hover:text-white hover:border-slate-700"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-essential-menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-essential-menu" className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                {['EN', 'MR', 'HI'].map(language => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      handleLangChange(language);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-label={`Switch language to ${language === 'EN' ? 'English' : language === 'MR' ? 'Marathi' : 'Hindi'}`}
                    aria-pressed={lang === language}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      lang === language
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'EN' ? 'EN' : language === 'MR' ? 'मराठी' : 'हिन्दी'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    startVoiceRecognition();
                  }}
                  title="Voice Search (en-IN, mr-IN, hi-IN)"
                  aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('emergency');
                    triggerEmergencySOS('Emergency Distress Signal');
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl shadow-lg shadow-rose-900/40 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SOS 108</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* VOICE COMMAND FEEDBACK MODAL / BAR */}
      {isListening && (
        <div className="bg-slate-900/95 backdrop-blur-md border-b-2 border-emerald-500 px-4 py-3 sticky top-16 z-30 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="font-bold text-emerald-400 text-xs uppercase tracking-wide">
              {lang === 'MR' ? "आवाज ओळख सुरू आहे" : lang === 'HI' ? "वॉयस सर्च सक्रिय" : "Voice Search Active"}:
            </span>
            <span className="text-white font-medium text-xs bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              "{voiceTranscript}"
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Language: <strong className="text-cyan-400">{lang === 'MR' ? 'मराठी (mr-IN)' : lang === 'HI' ? 'हिन्दी (hi-IN)' : 'English (en-IN)'}</strong>
            </span>
          </div>

          <button
            onClick={() => {
              setIsListening(false);
              setActiveVoiceTarget(null);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      )}

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* =============================================================
            TAB 1: PREMIUM LANDING PAGE
           ============================================================= */}
        {activeTab === 'landing' && (
          <div className="space-y-12">
            
            {/* HERO SECTION */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Maharashtra State Digital Health Mission • 2026</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {t.heroTitle}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {t.heroSubtitle}
                </p>

                {/* Smart Unified Search Bar */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={isListening && activeVoiceTarget === 'global' ? getListeningPlaceholder() : t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('hospitals'); }}
                      className={`w-full bg-slate-950/90 border rounded-xl pl-11 pr-14 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-all ${
                        isListening && activeVoiceTarget === 'global'
                          ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/30'
                          : 'border-slate-700/80 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => startVoiceRecognition('global')}
                      title="Voice Search (English, मराठी, हिन्दी)"
                      className={`absolute right-3 top-2.5 p-1.5 rounded-lg transition-all ${
                        isListening && activeVoiceTarget === 'global'
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/50'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveTab('hospitals')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                  >
                    <span>Search Healthcare</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Search Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400">Popular:</span>
                  {[
                    { label: "ICU Bed in Pune", action: () => { setSelectedDistrict("Pune"); setFilterIcuOnly(true); setActiveTab('hospitals'); } },
                    { label: "Cardiac Lilavati Mumbai", action: () => { setSearchQuery("Lilavati"); setActiveTab('hospitals'); } },
                    { label: "O+ Blood Bank", action: () => { setBloodGroupFilter("O+"); setActiveTab('blood-bank'); } },
                    { label: "PM-JAY Hospitals", action: () => { setFilterPmjayOnly(true); setActiveTab('hospitals'); } },
                    { label: "Ambulance 108", action: () => setActiveTab('ambulance') }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={chip.action}
                      className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setActiveTab('ai-recommend')}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>AI Hospital Matchmaker</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('emergency');
                      triggerEmergencySOS("High Priority Distress");
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Emergency SOS 108</span>
                  </button>
                </div>
              </div>

              {/* Quick Stat Counter Bar */}
              <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Empaneled Hospitals</p>
                  <p className="text-2xl font-black text-white mt-0.5">{hospitals.length}+ Verified</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Live Available Beds</p>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">
                    {hospitals.reduce((acc, h) => acc + (h.bedsAvailable || 0), 0)} Free
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Apex Blood Banks</p>
                  <p className="text-2xl font-black text-rose-400 mt-0.5">{bloodBanks.length} Tracked</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">CareScore Accuracy</p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">98.6%</p>
                </div>
              </div>
            </div>

            {/* FEATURE MODULES GRID */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Healthcare Decision Support Grid</h2>
                  <p className="text-xs text-slate-400">All medical logistics, emergency support, and financial aids in one single window.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    icon: Activity,
                    title: "Live Bed & ICU Matrix",
                    desc: "Real-time ward structures, ICU ventilators, and instant bed reservation across Maharashtra.",
                    tab: "beds",
                    color: "emerald"
                  },
                  {
                    icon: Droplet,
                    title: "FIND BLOOD (Apex Banks)",
                    desc: "Filter 8 blood groups (A+, B+, O+, AB+, -ve) across government and private licensed blood centres.",
                    tab: "blood-bank",
                    color: "rose"
                  },
                  {
                    icon: Navigation,
                    title: "Ambulance Dispatch 108",
                    desc: "Live GPS tracking, ALS/BLS ambulance allocation, driver contact, and arrival ETA.",
                    tab: "ambulance",
                    color: "cyan"
                  },
                  {
                    icon: Cpu,
                    title: "AI Healthcare Assistant",
                    desc: "Multilingual symptom triage (Green/Yellow/Red) and natural language navigation.",
                    tab: "symptoms",
                    color: "teal"
                  },
                  {
                    icon: FileText,
                    title: "Treatment Cost Calculator",
                    desc: "Itemized breakdown for Angioplasty, Knee Replacement, C-Section, and Dialysis.",
                    tab: "cost",
                    color: "amber"
                  },
                  {
                    icon: Shield,
                    title: "Insurance & OCR Parser",
                    desc: "Cashless network check and plain-language medical lab report explanations.",
                    tab: "insurance",
                    color: "purple"
                  },
                  {
                    icon: Award,
                    title: "PM-JAY & MJPJAY Schemes",
                    desc: "Full coverage guidelines, eligibility assessment, and empaneled hospital filters.",
                    tab: "schemes",
                    color: "blue"
                  },
                  {
                    icon: Stethoscope,
                    title: "Specialist Doctors & Teleconsult",
                    desc: "Book confirmed OPD appointments or initiate live video consultation with e-prescription.",
                    tab: "doctors",
                    color: "emerald"
                  }
                ].map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTab(mod.tab)}
                      className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className={`w-6 h-6 text-${mod.color}-400`} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {mod.desc}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        Access Module <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FEATURED HOSPITALS PREVIEW */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Top Rated Healthcare Centers</h2>
                  <p className="text-xs text-slate-400">Verified hospitals with highest clinical CareScores and emergency capabilities.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('hospitals')} 
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  View All ({hospitals.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {hospitals.slice(0, 3).map(h => (
                  <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400">{h.district} • {h.city || 'Maharashtra'}</span>
                          <h3 className="font-bold text-white text-base mt-0.5">{h.name}</h3>
                        </div>
                        <span className="bg-slate-950 border border-amber-500/30 text-amber-400 font-bold text-xs px-2 py-1 rounded-md">
                          ★ {h.rating}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-1">{h.address}</p>

                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <p className="text-[9px] text-slate-400">Available Beds</p>
                          <p className="text-xs font-bold text-emerald-400">{h.bedsAvailable} / {h.bedsTotal}</p>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <p className="text-[9px] text-slate-400">ICU Beds</p>
                          <p className="text-xs font-bold text-cyan-400">{h.icuAvailable}</p>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <p className="text-[9px] text-slate-400">CareScore</p>
                          <p className="text-xs font-bold text-amber-400">{h.careScore || 90}/100</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedHospitalForDetails(h);
                          setActiveTab('hospital-detail');
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 rounded-xl transition-all"
                      >
                        View Profile & Bed Grid
                      </button>
                      <button
                        onClick={() => toggleComparison(h)}
                        className={`p-2 rounded-xl border text-xs ${
                          comparisonList.some(c => c.id === h.id)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Add to Comparison"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFIED PATIENT REVIEWS CAROUSEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Verified Patient Experiences across Maharashtra
                  </h2>
                  <p className="text-xs text-slate-400">Real feedback from patients admitted through AarogyaConnect decision engine.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.slice(0, 3).map(rev => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-xs">{rev.patientName}</span>
                        <div className="flex text-amber-400 text-xs">{'★'.repeat(rev.rating)}</div>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold mb-2">{rev.hospitalName} • {rev.department}</p>
                      <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                      <span>✓ Verified Admission</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 2: HOSPITAL DISCOVERY & HIERARCHY FILTER
           ============================================================= */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <h1 className="text-2xl font-black text-white">Maharashtra Hospital Directory</h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Showing {filteredHospitals.length} verified hospitals across Maharashtra districts with live bed availability.
                </p>
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* District Filter */}
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-transparent text-white focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-900">All Maharashtra</option>
                    {INITIAL_DISTRICTS.map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d} District</option>
                    ))}
                  </select>
                </div>

                {/* Sort Option */}
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white focus:outline-none cursor-pointer"
                  >
                    <option value="careScore" className="bg-slate-900">CareScore (AI Match)</option>
                    <option value="rating" className="bg-slate-900">Highest Rating</option>
                    <option value="beds" className="bg-slate-900">Most Available Beds</option>
                    <option value="reviews" className="bg-slate-900">Most Reviews</option>
                  </select>
                </div>

                {/* Search query input with Voice Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isListening && activeVoiceTarget === 'hospitals' ? getListeningPlaceholder() : "Search doctor, hospital, spec..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-slate-950 text-xs text-white pl-9 pr-14 py-2 rounded-xl border focus:outline-none w-52 sm:w-64 transition-all ${
                      isListening && activeVoiceTarget === 'hospitals'
                        ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white p-1">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startVoiceRecognition('hospitals')}
                      title="Voice Search (English, मराठी, हिन्दी)"
                      className={`p-1 rounded-lg transition-all ${
                        isListening && activeVoiceTarget === 'hospitals'
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filter Checkboxes */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold mr-2">Filter By:</span>
              <button
                onClick={() => setFilterIcuOnly(!filterIcuOnly)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  filterIcuOnly ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                ICU Available
              </button>
              <button
                onClick={() => setFilterPmjayOnly(!filterPmjayOnly)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  filterPmjayOnly ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                PM-JAY Empaneled
              </button>
              <button
                onClick={() => setFilterMjpjayOnly(!filterMjpjayOnly)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  filterMjpjayOnly ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                MJPJAY Empaneled
              </button>
              {(filterIcuOnly || filterPmjayOnly || filterMjpjayOnly || selectedDistrict !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterIcuOnly(false);
                    setFilterPmjayOnly(false);
                    setFilterMjpjayOnly(false);
                    setSelectedDistrict('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-rose-400 hover:underline ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Comparison Sticky Bar */}
            {comparisonList.length > 0 && (
              <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Comparison Tray ({comparisonList.length}/3):</span>
                  <div className="flex flex-wrap gap-2">
                    {comparisonList.map(item => (
                      <span key={item.id} className="bg-slate-950 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                        {item.name}
                        <X className="w-3 h-3 text-slate-400 cursor-pointer hover:text-rose-400" onClick={() => toggleComparison(item)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('compare')}
                    className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow hover:bg-emerald-400"
                  >
                    Compare Side-by-Side
                  </button>
                  <button onClick={() => setComparisonList([])} className="text-xs text-slate-400 hover:text-white">
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* HOSPITAL CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map(h => {
                const isComparing = comparisonList.some(c => c.id === h.id);
                const isSaved = savedHospitalIds.includes(h.id);

                return (
                  <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
                              {h.district} • {h.city || 'District Headquarter'}
                            </span>
                            {h.careScore && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                                {h.careScore}/100 CareScore
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-base mt-1 line-clamp-1">{h.name}</h3>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleToggleSaveHospital(h.id)}
                            className="p-1 text-slate-400 hover:text-amber-400"
                            title={isSaved ? "Saved" : "Save Hospital"}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                          <span className="bg-slate-950 border border-amber-500/30 text-amber-400 font-bold text-xs px-2 py-1 rounded-md">
                            ★ {h.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="line-clamp-1">{h.address}</span>
                      </p>

                      {/* Schemes badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {h.pmjayEmpaneled && (
                          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                            PM-JAY Cashless
                          </span>
                        )}
                        {h.mjpjayEmpaneled && (
                          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                            MJPJAY Empaneled
                          </span>
                        )}
                        <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold px-2 py-0.5 rounded">
                          24/7 Emergency
                        </span>
                      </div>

                      {/* Bed Stats Bar */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Total Ward Beds:</span>
                          <span className="font-bold text-white">{h.bedsTotal}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-400 font-semibold">Available Beds:</span>
                          <span className="font-bold text-emerald-400">{h.bedsAvailable} Free</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-cyan-400 font-semibold">ICU Ventilator Beds:</span>
                          <span className="font-bold text-cyan-400">{h.icuAvailable} Available</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (h.bedsAvailable / (h.bedsTotal || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedHospitalForDetails(h);
                            setHospitalDetailTab('overview');
                            setActiveTab('hospital-detail');
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
                        >
                          View Details & Bed Grid
                        </button>
                        <button
                          onClick={() => toggleComparison(h)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                            isComparing 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                          title="Compare"
                        >
                          {isComparing ? '✓ Comparing' : '+ Compare'}
                        </button>
                      </div>

                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => {
                            setBookBedModal({ isOpen: true, hospital: h, bedType: 'General Ward' });
                          }}
                          className="flex-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 py-1.5 rounded-lg font-semibold"
                        >
                          Book Bed
                        </button>
                        <a
                          href={`tel:${h.phone}`}
                          className="px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 py-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Call
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredHospitals.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No hospitals match your filter criteria</h3>
                <p className="text-xs text-slate-400">Try changing district or resetting active filters.</p>
                <button
                  onClick={() => {
                    setSelectedDistrict('All');
                    setSearchQuery('');
                    setFilterIcuOnly(false);
                    setFilterPmjayOnly(false);
                    setFilterMjpjayOnly(false);
                  }}
                  className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl mt-2"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* =============================================================
            TAB 3: HOSPITAL DETAILS (PREMIUM TABBED PROFILE)
           ============================================================= */}
        {activeTab === 'hospital-detail' && selectedHospitalForDetails && (
          <div className="space-y-6">
            
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('hospitals')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                ← Back to Hospital Directory
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleSaveHospital(selectedHospitalForDetails.id)}
                  className="bg-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1.5 hover:text-amber-400"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${savedHospitalIds.includes(selectedHospitalForDetails.id) ? 'text-amber-400 fill-amber-400' : ''}`} />
                  <span>{savedHospitalIds.includes(selectedHospitalForDetails.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => toggleComparison(selectedHospitalForDetails)}
                  className="bg-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1.5 hover:text-emerald-400"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>

            {/* Profile Header Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
                    {selectedHospitalForDetails.district} District • {selectedHospitalForDetails.city || 'Headquarters'}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    NABH Accredited
                  </span>
                  {selectedHospitalForDetails.pmjayEmpaneled && (
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                      PM-JAY Empaneled
                    </span>
                  )}
                  {selectedHospitalForDetails.mjpjayEmpaneled && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                      MJPJAY Empaneled
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedHospitalForDetails.name}</h1>
                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{selectedHospitalForDetails.address}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Phone className="w-3.5 h-3.5" /> {selectedHospitalForDetails.phone}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    ★ {selectedHospitalForDetails.rating} ({selectedHospitalForDetails.reviewsCount || 240} Verified Patient Reviews)
                  </span>
                  <span className="text-cyan-400 font-bold">
                    CareScore: {selectedHospitalForDetails.careScore || 92}/100
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setBookBedModal({ isOpen: true, hospital: selectedHospitalForDetails, bedType: 'ICU Bed' })}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-center"
                >
                  Reserve Bed / ICU Now
                </button>
                <a
                  href={`tel:${selectedHospitalForDetails.phone}`}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-800 text-center flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  Call Emergency Desk
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospitalForDetails.name + ' ' + selectedHospitalForDetails.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs px-4 py-2 rounded-xl border border-slate-800 text-center flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  Get Google Maps Route
                </a>
              </div>
            </div>

            {/* Profile Sub-Tabs Navigation */}
            <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview & Bed Grid' },
                { id: 'doctors', label: `Specialist Doctors (${selectedHospitalForDetails.doctors?.length || 0})` },
                { id: 'costs', label: 'Treatments & Cost Estimates' },
                { id: 'facilities', label: 'Facilities & Emergency' },
                { id: 'schemes', label: 'Schemes & Insurance' },
                { id: 'reviews', label: 'Patient Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setHospitalDetailTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl transition-all ${
                    hospitalDetailTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: OVERVIEW & BED GRID */}
            {hospitalDetailTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Hospital Beds</p>
                    <p className="text-xl font-bold text-white mt-1">{selectedHospitalForDetails.bedsTotal}</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Available Beds</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{selectedHospitalForDetails.bedsAvailable} Free</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">ICU Ventilator Beds</p>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{selectedHospitalForDetails.icuAvailable} Free</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Blood Bank Status</p>
                    <p className="text-xl font-bold text-rose-400 mt-1">Active 24/7</p>
                  </div>
                </div>

                {/* Interactive Live Bed Matrix Grid */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        Interactive Hospital Ward & Bed Matrix
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">Click any free bed to initiate immediate provisional reservation.</p>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                        <span className="text-slate-300">Available</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded bg-rose-500"></div>
                        <span className="text-slate-300">Occupied</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded border border-cyan-400"></div>
                        <span className="text-slate-300">O2 Equipped</span>
                      </div>
                    </div>
                  </div>

                  {/* Bed Grid Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(selectedHospitalForDetails.bedGrid || [
                      { id: "B-101", type: "ICU Bed", status: "available", oxygen: true },
                      { id: "B-102", type: "ICU Bed", status: "occupied", oxygen: true },
                      { id: "B-103", type: "Ventilator", status: "available", oxygen: true },
                      { id: "B-104", type: "General Ward", status: "available", oxygen: false },
                      { id: "B-105", type: "General Ward", status: "occupied", oxygen: false },
                      { id: "B-106", type: "Semi-Private", status: "available", oxygen: true }
                    ]).map((bed, idx) => {
                      const isAvail = bed.status === 'available';
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                            isAvail
                              ? 'bg-slate-950 border-emerald-500/40 hover:border-emerald-400'
                              : 'bg-slate-950/40 border-slate-800 opacity-60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-white">{bed.id}</span>
                              {bed.oxygen && (
                                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1 py-0.2 rounded font-bold">
                                  O2
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{bed.type}</p>
                          </div>

                          <div className="mt-4">
                            {isAvail ? (
                              <button
                                onClick={() => {
                                  setBookBedModal({ isOpen: true, hospital: selectedHospitalForDetails, bedType: bed.type });
                                }}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black py-1.5 rounded-lg transition-all"
                              >
                                Reserve
                              </button>
                            ) : (
                              <span className="block text-center text-[10px] text-rose-400 font-bold py-1 bg-rose-500/10 rounded-lg">
                                Occupied
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: DOCTORS */}
            {hospitalDetailTab === 'doctors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Empaneled Specialists & OPD Timings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedHospitalForDetails.doctors || []).map((doc, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-white text-base">{doc.name}</h3>
                            <p className="text-xs font-semibold text-emerald-400">{doc.spec}</p>
                          </div>
                          <span className="bg-slate-950 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-800">
                            {doc.exp || '15 Yrs Exp'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Next Slot: <strong className="text-white">{doc.availability || 'Today 4:00 PM'}</strong>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => {
                            setBookAppointmentModal({
                              isOpen: true,
                              doctor: doc,
                              hospital: selectedHospitalForDetails
                            });
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all"
                        >
                          Book Appointment
                        </button>
                        <button
                          onClick={() => setTeleConsultModal({ isOpen: true, doctor: doc })}
                          className="bg-slate-950 hover:bg-slate-800 text-cyan-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> Video Consult
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: COSTS */}
            {hospitalDetailTab === 'costs' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Estimated Procedure Costs at {selectedHospitalForDetails.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Indicative ranges based on Maharashtra public healthcare tariff standards.</p>
                </div>

                <div className="divide-y divide-slate-800">
                  {procedures.slice(0, 5).map(proc => (
                    <div key={proc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{proc.name}</h4>
                        <p className="text-xs text-slate-400">{proc.description}</p>
                        <span className="text-[10px] text-emerald-400 font-semibold">Stay: {proc.stayDays} • PM-JAY & MJPJAY Covered</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-400">
                          ₹ {proc.costs["General Ward"]?.total.toLocaleString()} - ₹ {proc.costs["Private Ward"]?.total.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Estimated Package</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: FACILITIES */}
            {hospitalDetailTab === 'facilities' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-white">Advanced Medical Infrastructure & Support</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {[
                    "24/7 Level 1 Trauma & Emergency",
                    "Dedicated Cardiac Cath Lab",
                    "Licensed Blood Bank with Apheresis",
                    "High-Flow Oxygen & Ventilators",
                    "Advanced 128-Slice CT & 3T MRI",
                    "Neonatal Intensive Care (NICU)",
                    "Dialysis Center (24 Sessions/Day)",
                    "Dedicated PM-JAY / MJPJAY Helpdesk",
                    "24/7 In-House Pharmacy",
                    "Advanced Life Support Ambulances"
                  ].map((fac, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-300 font-medium">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 5: SCHEMES & INSURANCE */}
            {hospitalDetailTab === 'schemes' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Empaneled Government Schemes & Cashless Insurers</h2>
                  <p className="text-xs text-slate-400">Patients can avail cashless admission under active policies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Central Government Scheme</span>
                    <h3 className="font-bold text-white text-base">Ayushman Bharat PM-JAY</h3>
                    <p className="text-xs text-slate-400">Cashless coverage up to ₹5,00,000 per family per year. Dedicated Aarogya Mitra counter on Ground Floor.</p>
                    <p className="text-xs text-emerald-400 font-semibold">Status: Empaneled & Active</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400">State Government Scheme</span>
                    <h3 className="font-bold text-white text-base">MJPJAY Maharashtra</h3>
                    <p className="text-xs text-slate-400">Mahatma Jyotirao Phule Jan Arogya Yojana coverage up to ₹5,00,000 for Orange/Yellow ration card holders.</p>
                    <p className="text-xs text-amber-400 font-semibold">Status: Empaneled & Active</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs uppercase font-bold text-slate-400 mb-3">Empaneled Cashless Insurance Providers (TPA):</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {insurers.map(ins => (
                      <span key={ins.id} className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-medium">
                        ✓ {ins.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: REVIEWS */}
            {hospitalDetailTab === 'reviews' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Patient Reviews & Feedback</h2>
                    <p className="text-xs text-slate-400">Genuine feedback from verified admissions.</p>
                  </div>
                  <button
                    onClick={() => setAddReviewModal({ isOpen: true, hospital: selectedHospitalForDetails })}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    + Write a Review
                  </button>
                </div>

                <div className="space-y-3">
                  {reviews.filter(r => r.hospitalId === selectedHospitalForDetails.id || !r.hospitalId).map(rev => (
                    <div key={rev.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-xs">{rev.patientName}</span>
                        <span className="text-amber-400 text-xs font-bold">★ {rev.rating}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold">{rev.department} • Verified Patient</p>
                      <p className="text-xs text-slate-300 mt-2">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =============================================================
            TAB 4: 3-HOSPITAL SIDE-BY-SIDE COMPARISON ENGINE
           ============================================================= */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  3-Hospital Side-by-Side Comparison Engine
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Compare ratings, bed inventory, ICU facilities, and government scheme support.
                </p>
              </div>

              {comparisonList.length > 0 && (
                <button
                  onClick={() => setComparisonList([])}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {comparisonList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <Layers className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No hospitals selected for comparison</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Browse the Hospital Directory and click "+ Compare" on up to 3 hospitals to see a detailed side-by-side metric matrix.
                </p>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="bg-emerald-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg"
                >
                  Go to Hospital Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonList.map(h => (
                  <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl">
                    <button
                      onClick={() => toggleComparison(h)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 p-1"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">{h.district}</span>
                        <h2 className="text-lg font-bold text-white mt-0.5">{h.name}</h2>
                        <span className="inline-block bg-slate-950 text-amber-400 font-bold text-xs px-2 py-0.5 rounded border border-amber-500/30 mt-1">
                          ★ {h.rating} ({h.reviewsCount || 200} reviews)
                        </span>
                      </div>

                      <div className="divide-y divide-slate-800 text-xs">
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">CareScore Match:</span>
                          <span className="font-bold text-amber-400">{h.careScore || 90}/100</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Total Ward Beds:</span>
                          <span className="font-bold text-white">{h.bedsTotal}</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Available Beds:</span>
                          <span className="font-bold text-emerald-400">{h.bedsAvailable} Free</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">ICU Ventilator Beds:</span>
                          <span className="font-bold text-cyan-400">{h.icuAvailable} Available</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">PM-JAY Support:</span>
                          <span className={h.pmjayEmpaneled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {h.pmjayEmpaneled ? '✓ Empaneled' : '✗ No'}
                          </span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">MJPJAY Support:</span>
                          <span className={h.mjpjayEmpaneled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {h.mjpjayEmpaneled ? '✓ Empaneled' : '✗ No'}
                          </span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">24/7 Emergency:</span>
                          <span className="text-emerald-400 font-bold">✓ Active</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Angioplasty Estimate:</span>
                          <span className="font-bold text-white">₹ 1,35,000</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedHospitalForDetails(h);
                          setActiveTab('hospital-detail');
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                      >
                        View Bed Matrix & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================
            TAB 5: REAL-TIME BED MATRIX & INSTANT BED BOOKING
           ============================================================= */}
        {activeTab === 'beds' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  Maharashtra Real-Time Bed Matrix & ICU Tracker
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Live occupancy data across General Wards, Semi-Private, Deluxe, and Critical ICU Ventilators.
                </p>
              </div>

              {/* District Quick Switcher */}
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900">All Maharashtra</option>
                  {INITIAL_DISTRICTS.map(d => (
                    <option key={d} value={d} className="bg-slate-900">{d} District</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Hospital & Location</th>
                    <th className="p-3.5">District</th>
                    <th className="p-3.5">Total Beds</th>
                    <th className="p-3.5">Available Beds</th>
                    <th className="p-3.5">ICU Ventilators</th>
                    <th className="p-3.5">Schemes</th>
                    <th className="p-3.5 rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredHospitals.map(h => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        <div>{h.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{h.phone}</span>
                      </td>
                      <td className="p-3.5">{h.district}</td>
                      <td className="p-3.5 font-bold text-slate-200">{h.bedsTotal}</td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        {h.bedsAvailable} Beds Free
                      </td>
                      <td className="p-3.5 font-bold text-cyan-400">
                        {h.icuAvailable} Free
                      </td>
                      <td className="p-3.5">
                        <div className="flex gap-1">
                          {h.pmjayEmpaneled && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">PM-JAY</span>}
                          {h.mjpjayEmpaneled && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">MJPJAY</span>}
                        </div>
                      </td>
                      <td className="p-3.5 space-x-2">
                        <button
                          onClick={() => setBookBedModal({ isOpen: true, hospital: h, bedType: 'General Ward' })}
                          className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-emerald-400"
                        >
                          Book Bed
                        </button>
                        <button
                          onClick={() => {
                            setSelectedHospitalForDetails(h);
                            setHospitalDetailTab('overview');
                            setActiveTab('hospital-detail');
                          }}
                          className="bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs hover:text-white"
                        >
                          View Grid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 6: DEDICATED BLOOD BANK MODULE ("FIND BLOOD")
           ============================================================= */}
        {activeTab === 'blood-bank' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-6 h-6 text-rose-500 fill-rose-500/20 animate-pulse" />
                  <h1 className="text-2xl font-black text-white">Maharashtra Blood Bank Network (FIND BLOOD)</h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time blood component availability across FDA-licensed & Red Cross apex blood banks.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Voice-Enabled Blood Bank Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isListening && activeVoiceTarget === 'blood' ? getListeningPlaceholder() : "Search blood bank, city, or group..."}
                    value={bloodSearchQuery}
                    onChange={(e) => setBloodSearchQuery(e.target.value)}
                    className={`bg-slate-950 text-xs text-white pl-9 pr-14 py-2.5 rounded-xl border focus:outline-none w-56 sm:w-64 transition-all ${
                      isListening && activeVoiceTarget === 'blood'
                        ? 'border-rose-400 ring-2 ring-rose-500/50 shadow-md shadow-rose-500/20'
                        : 'border-slate-800 focus:border-rose-500'
                    }`}
                  />
                  <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                    {bloodSearchQuery && (
                      <button onClick={() => setBloodSearchQuery('')} className="text-slate-400 hover:text-white p-1">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startVoiceRecognition('blood')}
                      title="Voice Search (English, मराठी, हिन्दी)"
                      className={`p-1.5 rounded-lg transition-all ${
                        isListening && activeVoiceTarget === 'blood'
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40'
                          : 'text-slate-400 hover:text-rose-400 hover:bg-slate-900'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* District Filter */}
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={bloodDistrictFilter}
                    onChange={(e) => setBloodDistrictFilter(e.target.value)}
                    className="bg-transparent text-white focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-900">All Districts</option>
                    {INITIAL_DISTRICTS.map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blood Group Selector Chips */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Required Blood Group:
              </span>
              <div className="flex flex-wrap gap-2">
                {['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <button
                    key={bg}
                    onClick={() => setBloodGroupFilter(bg)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      bloodGroupFilter === bg
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 scale-105'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bg === 'All' ? 'All Groups' : bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Bank Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bloodBanks
                .filter(bb => {
                  const matchDist = bloodDistrictFilter === 'All' || bb.district === bloodDistrictFilter;
                  const matchGroup = bloodGroupFilter === 'All' || bb.inventory.some(inv => inv.group === bloodGroupFilter && inv.units > 0);
                  const q = bloodSearchQuery.toLowerCase().trim();
                  const matchSearch = !q ||
                    bb.name.toLowerCase().includes(q) ||
                    bb.city.toLowerCase().includes(q) ||
                    bb.district.toLowerCase().includes(q) ||
                    bb.hospitalOrOrg.toLowerCase().includes(q) ||
                    bb.inventory.some(inv => inv.group.toLowerCase().includes(q));
                  return matchDist && matchGroup && matchSearch;
                })
                .map(bb => (
                  <div key={bb.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-400">{bb.district} • {bb.city}</span>
                          <h3 className="font-bold text-white text-base mt-0.5">{bb.name}</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">{bb.hospitalOrOrg}</p>
                        </div>
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          {bb.operatingHours}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="line-clamp-1">{bb.address}</span>
                      </p>

                      <div className="mt-3 text-[10px] text-slate-500 flex justify-between">
                        <span>{bb.verificationStatus}</span>
                        <span>Updated: {bb.lastUpdated}</span>
                      </div>

                      {/* Blood Inventory Chips */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Available Blood Inventory:</p>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {bb.inventory.map(item => {
                            const isSelected = bloodGroupFilter === item.group;
                            const isAvailable = item.status === 'AVAILABLE';
                            const isLimited = item.status === 'LIMITED';

                            return (
                              <div
                                key={item.group}
                                className={`p-1.5 rounded-lg border text-xs ${
                                  isSelected
                                    ? 'bg-rose-500/30 border-rose-500 font-black text-rose-200'
                                    : isAvailable
                                    ? 'bg-slate-950 border-slate-800 text-slate-200'
                                    : isLimited
                                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                                    : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through'
                                }`}
                              >
                                <span className="font-bold block">{item.group}</span>
                                <span className="text-[10px] font-semibold text-emerald-400">{item.units}U</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex gap-2">
                      <button
                        onClick={() => setRequestBloodModal({ isOpen: true, bloodBank: bb, bloodGroup: bloodGroupFilter === 'All' ? 'O+' : bloodGroupFilter })}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
                      >
                        Request Blood Units
                      </button>
                      <a
                        href={`tel:${bb.phone}`}
                        className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-2.5 rounded-xl flex items-center justify-center"
                        title="Call Blood Bank"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 7: AI HOSPITAL RECOMMENDATION ENGINE
           ============================================================= */}
        {activeTab === 'ai-recommend' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Healthcare Optimization Algorithm</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">AI Hospital Matchmaker & Explainable CareScore</h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Input your clinical requirement, budget, and location preference. Our algorithm analyzes clinical ratings, bed counts, and government scheme empanelment.
                </p>
              </div>

              {/* Input Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-300 block mb-1.5">Required Treatment / Condition</label>
                  <select
                    value={aiRecTreatment}
                    onChange={(e) => setAiRecTreatment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Cardiology & Angioplasty">Cardiology & Angioplasty</option>
                    <option value="Orthopedic & Knee Replacement">Orthopedic & Knee Replacement</option>
                    <option value="Oncology & Chemotherapy">Oncology & Chemotherapy</option>
                    <option value="Neurology & Stroke Care">Neurology & Stroke Care</option>
                    <option value="Maternity & High-Risk Birthing">Maternity & High-Risk Birthing</option>
                    <option value="General & Laparoscopic Surgery">General & Laparoscopic Surgery</option>
                    <option value="Nephrology & Dialysis">Nephrology & Dialysis</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Preferred District (Maharashtra)</label>
                  <select
                    value={aiRecDistrict}
                    onChange={(e) => setAiRecDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {INITIAL_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Budget Preference</label>
                  <select
                    value={aiRecBudget}
                    onChange={(e) => setAiRecBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="100% Cashless (PM-JAY / MJPJAY)">100% Cashless (PM-JAY / MJPJAY)</option>
                    <option value="Under ₹ 1,00,000">Under ₹ 1,00,000</option>
                    <option value="₹ 1,50,000 - ₹ 3,00,000">₹ 1,50,000 - ₹ 3,00,000</option>
                    <option value="₹ 3,00,000+ (Deluxe Private)">₹ 3,00,000+ (Deluxe Private)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Government Scheme Support</label>
                  <select
                    value={aiRecScheme}
                    onChange={(e) => setAiRecScheme(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Any">Any / Self-Pay</option>
                    <option value="PM-JAY">Ayushman Bharat PM-JAY</option>
                    <option value="MJPJAY">MJPJAY Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Personal Priority</label>
                  <select
                    value={aiRecPriority}
                    onChange={(e) => setAiRecPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="careScore">Balanced CareScore (Recommended)</option>
                    <option value="rating">Highest Doctor & Hospital Rating</option>
                    <option value="beds">Fastest Bed & ICU Availability</option>
                    <option value="cost">Maximum Cost-Effectiveness</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={computeAiRecommendations}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Run CareScore Analysis</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Results */}
            {aiRecResults && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white">Top Recommended Hospitals by CareScore</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiRecResults.map(item => (
                    <div key={item.hospital.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
                            {item.hospital.district} District
                          </span>
                          <h3 className="text-xl font-bold text-white mt-0.5">{item.hospital.name}</h3>
                          <p className="text-xs text-slate-400">{item.hospital.address}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-400">{item.totalScore}</span>
                          <span className="text-xs text-slate-400 font-bold block">/100 CareScore</span>
                        </div>
                      </div>

                      {/* CareScore Breakdown Bars */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Explainable Match Breakdown:</p>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Clinical Rating & Doctors:</span>
                            <span className="font-bold text-white">{item.ratingScore}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${item.ratingScore}%` }}></div>
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Location & Distance Match:</span>
                            <span className="font-bold text-white">{item.distScore}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${item.distScore}%` }}></div>
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Live Bed & ICU Readiness:</span>
                            <span className="font-bold text-white">{item.bedScore}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.bedScore}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-300">
                        <strong>Why Aarogya AI Recommends This:</strong> {item.whyRecommended}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setSelectedHospitalForDetails(item.hospital);
                            setActiveTab('hospital-detail');
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                        >
                          View Profile & Bed Grid
                        </button>
                        <button
                          onClick={() => setBookBedModal({ isOpen: true, hospital: item.hospital, bedType: 'General Ward' })}
                          className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold"
                        >
                          Book Bed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =============================================================
            TAB 8: SPECIALIST DOCTORS DIRECTORY & APPOINTMENTS
           ============================================================= */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-emerald-400" />
                  Specialist Doctors Directory & Online Appointments
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Connect with leading surgeons, cardiologists, and pediatricians across Maharashtra.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Voice-Enabled Doctor Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isListening && activeVoiceTarget === 'doctors' ? getListeningPlaceholder() : "Search doctor, specialty, illness..."}
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className={`bg-slate-950 text-xs text-white pl-9 pr-14 py-2.5 rounded-xl border focus:outline-none w-56 sm:w-72 transition-all ${
                      isListening && activeVoiceTarget === 'doctors'
                        ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                    {doctorSearchQuery && (
                      <button onClick={() => setDoctorSearchQuery('')} className="text-slate-400 hover:text-white p-1">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startVoiceRecognition('doctors')}
                      title="Voice Search (English, मराठी, हिन्दी)"
                      className={`p-1.5 rounded-lg transition-all ${
                        isListening && activeVoiceTarget === 'doctors'
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* District Filter */}
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-transparent text-white focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-900">All Maharashtra</option>
                    {INITIAL_DISTRICTS.map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctors Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors
                .filter(d => {
                  const matchDist = selectedDistrict === 'All' || d.district === selectedDistrict;
                  const q = doctorSearchQuery.toLowerCase().trim();
                  const matchQuery = !q ||
                    d.name.toLowerCase().includes(q) ||
                    d.spec.toLowerCase().includes(q) ||
                    d.qualification.toLowerCase().includes(q) ||
                    d.hospital.toLowerCase().includes(q) ||
                    (d.about && d.about.toLowerCase().includes(q)) ||
                    (d.languages && d.languages.some(l => l.toLowerCase().includes(q)));
                  return matchDist && matchQuery;
                })
                .map(doc => {
                  const isSaved = savedDoctorIds.includes(doc.id);
                  return (
                    <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                              {doc.name.split(' ')[1]?.[0] || 'D'}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-base">{doc.name}</h3>
                              <p className="text-xs font-semibold text-emerald-400">{doc.spec}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleSaveDoctor(doc.id)}
                            className="p-1 text-slate-400 hover:text-amber-400"
                            title={isSaved ? "Saved" : "Save Doctor"}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                        </div>

                        <div className="mt-4 space-y-1.5 text-xs">
                          <p className="text-slate-300 font-medium">🏥 {doc.hospital} ({doc.district})</p>
                          <p className="text-slate-400">🎓 {doc.qualification}</p>
                          <p className="text-slate-400">⏳ {doc.experience} Experience • 🗣️ {doc.languages?.join(', ')}</p>
                          <p className="text-xs text-slate-300 pt-1 line-clamp-2">{doc.about}</p>
                        </div>

                        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                            <span className="font-bold text-white">{doc.fee}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Next Available</span>
                            <span className="font-bold text-emerald-400">{doc.availability}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-amber-400 font-bold">★ {doc.rating}</span>
                            <span className="text-[10px] text-slate-500 block">({doc.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => {
                            setBookAppointmentModal({
                              isOpen: true,
                              doctor: doc,
                              hospital: { name: doc.hospital, district: doc.district }
                            });
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
                        >
                          Book Appointment
                        </button>
                        <button
                          onClick={() => setTeleConsultModal({ isOpen: true, doctor: doc })}
                          className="bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                          title="Video Consultation"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 9: AMBULANCE DISPATCH & LIVE GPS SIMULATOR
           ============================================================= */}
        {activeTab === 'ambulance' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-cyan-400" />
                  Live GPS Ambulance Dispatch Simulator (108 Emergency)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Direct connection with Maharashtra Emergency Medical Services (MEMS) fleet.
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href="tel:108"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <PhoneCall className="w-4 h-4" /> Call 108 Direct
                </a>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <Suspense fallback={<div role="status" className="lg:col-span-2 h-[320px] sm:h-[400px] rounded-3xl bg-slate-900 flex items-center justify-center text-sm text-slate-400">Loading route map...</div>}>
                <AmbulanceRouteMap
                  progress={ambulanceDispatch.progress}
                  active={ambulanceDispatch.active}
                  destinationHospital={ambulanceDispatch.destinationHospital}
                  etaMinutes={ambulanceDispatch.etaMinutes}
                  userLocation={userLocation}
                  mapCenter={mapCenter}
                  onCenterOnUserLocation={centerOnUserLocation}
                  language={lang}
                  driver={ambulanceDispatch.driver}
                  phone={ambulanceDispatch.phone}
                  vehicleNo={ambulanceDispatch.vehicleNo}
                />
              </Suspense>

              {/* Right: Dispatch Status Pipeline & New Request Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Ambulance Request Control</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Select service tier and trigger live dispatch.</p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-slate-300 text-xs font-semibold block mb-1">Ambulance Tier</label>
                      <select
                        onChange={(e) => triggerAmbulanceBooking(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="ALS (Advanced Life Support)">ALS (Advanced Life Support - Ventilator)</option>
                        <option value="BLS (Basic Life Support)">BLS (Basic Life Support - Oxygen)</option>
                        <option value="Neonatal NICU Mobile">Neonatal NICU Mobile Care</option>
                        <option value="Emergency 108 Fleet">State 108 Emergency Ambulance</option>
                      </select>
                    </div>

                    <button
                      onClick={() => triggerAmbulanceBooking()}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Trigger New GPS Dispatch
                    </button>
                  </div>
                </div>

                {/* Dispatch Checklist */}
                <div className="space-y-3 text-xs pt-4 border-t border-slate-800">
                  <h4 className="font-bold text-slate-300">Dispatch Status Pipeline</h4>
                  {[
                    { key: 'REQUESTED', label: '1. Emergency Call Logged & Triaged' },
                    { key: 'DISPATCHED', label: '2. Nearest ALS Ambulance Allocated' },
                    { key: 'EN_ROUTE', label: '3. Paramedic En Route (Active Siren)' },
                    { key: 'ARRIVED', label: '4. Arrived at Patient Location' }
                  ].map(step => {
                    const isDone = 
                      (step.key === 'REQUESTED' && ambulanceDispatch.progress >= 20) ||
                      (step.key === 'DISPATCHED' && ambulanceDispatch.progress >= 30) ||
                      (step.key === 'EN_ROUTE' && ambulanceDispatch.progress >= 50) ||
                      (step.key === 'ARRIVED' && ambulanceDispatch.progress >= 85);

                    return (
                      <div key={step.key} className="flex items-center space-x-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isDone ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isDone ? '✓' : '•'}
                        </div>
                        <span className={isDone ? 'text-white font-medium' : 'text-slate-500'}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =============================================================
            TAB 10: HIGH-PRIORITY SOS EMERGENCY MODE
           ============================================================= */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            
            {/* Urgent Red Banner */}
            <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-red-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping"></span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">HIGH-PRIORITY SOS EMERGENCY MODE</h1>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-100">
                    Immediate decision support for acute medical events. Call emergency lines with 1-click.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="tel:108"
                    className="bg-white text-rose-800 font-black text-sm px-6 py-3 rounded-2xl shadow-xl hover:bg-rose-50 flex items-center gap-2"
                  >
                    <PhoneCall className="w-5 h-5 text-rose-700" />
                    <span>DIAL 108 AMBULANCE</span>
                  </a>
                </div>
              </div>

              {/* Emergency Category Selector */}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-rose-200 block mb-2">
                  Select Emergency Category to Broadcast:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Cardiac Emergency",
                    "Road Accident & Trauma",
                    "Severe Breathing Problem",
                    "Acute Stroke / Paralysis",
                    "High-Risk Pregnancy",
                    "Pediatric Emergency"
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => triggerEmergencySOS(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        sosCategory === cat
                          ? 'bg-white text-rose-900 shadow-lg scale-105'
                          : 'bg-rose-950/60 text-white border border-rose-400/40 hover:bg-rose-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* One-Tap Emergency Helplines */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { number: "108", label: "State Ambulance & Emergency", color: "white" },
                  { number: "102", label: "Maternity / Infant Ambulance", color: "white" },
                  { number: "112", label: "National Emergency Response", color: "white" },
                  { number: "104", label: "24/7 Health Advice Helpline", color: "white" }
                ].map(h => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className="bg-rose-950/80 hover:bg-black/40 border border-rose-400/30 p-3.5 rounded-2xl text-center transition-colors block"
                  >
                    <p className="text-2xl font-black text-white">{h.number}</p>
                    <p className="text-[10px] text-rose-200 mt-0.5">{h.label}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Nearest 24/7 Trauma Centers */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Nearest 24/7 Emergency & ICU Trauma Centers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.filter(h => h.district === user.district || h.icuAvailable > 0).slice(0, 4).map(h => (
                  <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-400">24/7 Emergency & Trauma</span>
                          <h3 className="font-bold text-white text-base mt-0.5">{h.name}</h3>
                          <p className="text-xs text-slate-400">{h.address}</p>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs px-2.5 py-1 rounded-lg">
                          {h.icuAvailable} ICU Beds Free
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                      <a
                        href={`tel:${h.phone}`}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-xl text-center flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Hospital ({h.phone})
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + h.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-950 text-slate-300 border border-slate-800 px-3 py-2 rounded-xl text-xs flex items-center justify-center"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 11: AI HEALTHCARE ASSISTANT & SYMPTOM CHECKER
           ============================================================= */}
        {activeTab === 'symptoms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Interactive Symptom Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Maharashtra Clinical Triage Engine</span>
                </div>
                <h1 className="text-2xl font-black text-white">AI Symptom Triage</h1>
                <p className="text-xs text-slate-400">
                  Input medical complaints in English, मराठी, or हिन्दी for instant severity triaging (Green / Yellow / Red).
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">Describe Your Symptoms or Medical Problem:</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Chest pain with shortness of breath, or सतत ताप आणि अशक्तपणा..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
                />

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    "Severe chest tightness & sweating",
                    "High fever with body ache (3 days)",
                    "Shortness of breath after walking",
                    "Persistent headache & dizziness"
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSymptomInput(s)}
                      className="bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px]"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={analyzeSymptoms}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-md"
                >
                  Analyze & Calculate Severity
                </button>
              </div>

              {/* Triage Output */}
              {symptomResult && (
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  symptomResult.triage === 'RED'
                    ? 'bg-rose-950/20 border-rose-500/50 text-rose-200'
                    : symptomResult.triage === 'YELLOW'
                    ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                    : 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Severity Classification</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                      symptomResult.triage === 'RED' ? 'bg-rose-600 text-white' :
                      symptomResult.triage === 'YELLOW' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {symptomResult.triage} LEVEL
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-semibold">{symptomResult.recommendation}</p>

                  <div className="pt-2 border-t border-slate-800/80 text-xs">
                    <p className="text-slate-300">Recommended Specialist: <strong className="text-white">{symptomResult.predictedSpecialist}</strong></p>
                  </div>

                  {symptomResult.triage === 'RED' && (
                    <button
                      onClick={() => {
                        setActiveTab('emergency');
                        triggerEmergencySOS("Cardiac / Acute Distress");
                      }}
                      className="w-full bg-rose-600 text-white font-black text-xs py-2 rounded-xl mt-2"
                    >
                      🚨 Initiate Emergency Mode Now
                    </button>
                  )}
                </div>
              )}

              <p className="text-[10px] text-slate-500 italic">
                * Medical Disclaimer: AarogyaConnect AI provides clinical triaging support and guidance. It is not a definitive diagnosis and cannot replace physical physician examination.
              </p>
            </div>

            {/* Right: AI Chatbot Window */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Aarogya AI Health Assistant</h2>
                      <p className="text-[10px] text-emerald-400">● Online (English / मराठी / हिन्दी)</p>
                    </div>
                  </div>
                </div>

                {/* Message List */}
                <div className="space-y-3 overflow-y-auto max-h-[340px] pr-2">
                  {aiChatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-500 text-slate-950 font-semibold'
                          : 'bg-slate-950 text-slate-200 border border-slate-800'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="text-xs text-slate-500 italic flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      Aarogya AI is thinking...
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isListening && activeVoiceTarget === 'assistant' ? getListeningPlaceholder() : "Ask about beds, hospital ratings, O+ blood, or schemes..."}
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendAiChatMessage(); }}
                    className={`flex-1 bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                      isListening && activeVoiceTarget === 'assistant'
                        ? 'border-teal-400 ring-2 ring-teal-500/50 shadow-md shadow-teal-500/20'
                        : 'border-slate-800 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceRecognition('assistant')}
                    title="Speak Question (English, मराठी, हिन्दी)"
                    className={`px-3 py-2.5 rounded-xl border text-xs transition-all ${
                      isListening && activeVoiceTarget === 'assistant'
                        ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-md shadow-rose-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-teal-400 hover:border-slate-700'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={sendAiChatMessage}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 12: TREATMENT COST ESTIMATOR
           ============================================================= */}
        {activeTab === 'cost' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Transparent Healthcare Pricing</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Treatment Cost Calculator & Out-of-Pocket Estimator</h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Select a clinical surgery or diagnostic package to view itemized hospital billing components and insurance deduction estimation.
                </p>
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-300 block mb-1.5">Select Medical Procedure</label>
                  <select
                    value={calcProcedureName}
                    onChange={(e) => setCalcProcedureName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {procedures.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Hospital Ward Tier</label>
                  <select
                    value={calcWardTier}
                    onChange={(e) => setCalcWardTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="General Ward">General Ward (Standard)</option>
                    <option value="Semi-Private">Semi-Private Room</option>
                    <option value="Private Ward">Deluxe Private Ward</option>
                    <option value="ICU Recovery">ICU Recovery Ward</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5">Insurance / Scheme Coverage</label>
                  <select
                    value={calcHasInsurance ? 'yes' : 'no'}
                    onChange={(e) => setCalcHasInsurance(e.target.value === 'yes')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="yes">Empaneled Insurance / PM-JAY Policy</option>
                    <option value="no">Self-Pay (Direct Cash)</option>
                  </select>
                </div>
              </div>

              {/* Cost Breakdown Display */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">{currentProcData.proc?.department}</span>
                    <h3 className="text-xl font-black text-white">{currentProcData.proc?.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{currentProcData.proc?.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Estimated Cost</span>
                    <span className="text-2xl font-black text-emerald-400">
                      ₹ {currentProcData.costTier.total.toLocaleString()}
                    </span>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono block mt-1">
                      ESTIMATED DATA
                    </span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Surgeon & Doctor</span>
                    <span className="font-bold text-white">₹ {currentProcData.costTier.doctorFee?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">OT & Equipment</span>
                    <span className="font-bold text-white">₹ {currentProcData.costTier.otFee?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Room & Nursing</span>
                    <span className="font-bold text-white">₹ {currentProcData.costTier.roomFee?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Medicines</span>
                    <span className="font-bold text-white">₹ {currentProcData.costTier.medicinesFee?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Pre-Op Labs</span>
                    <span className="font-bold text-white">₹ {currentProcData.costTier.diagnosticFee?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Out of Pocket Box */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-400">Estimated Out-of-Pocket Expense:</span>
                    <p className="text-slate-400 text-[11px]">
                      {calcHasInsurance ? "Subject to 10-15% consumable copay under standard insurance/PM-JAY policies." : "Direct out-of-pocket self pay amount."}
                    </p>
                  </div>
                  <span className="text-xl font-black text-white">₹ {currentProcData.outOfPocket.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 13: INSURANCE VERIFICATION & LAB OCR EXPLAINER
           ============================================================= */}
        {activeTab === 'insurance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Insurance Verification */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Health Insurance Cashless Verification
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Validate insurer network cashless support before hospitalization.
                </p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-300 block mb-1">Select Insurance Provider</label>
                  <select
                    value={insVerifyProvider}
                    onChange={(e) => setInsVerifyProvider(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    {insurers.map(i => (
                      <option key={i.id} value={i.name}>{i.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={insPolicyNo}
                    onChange={(e) => setInsPolicyNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Target Hospital</label>
                  <select
                    value={insVerifyHospital}
                    onChange={(e) => setInsVerifyHospital(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    {hospitals.slice(0, 8).map(h => (
                      <option key={h.id} value={h.name}>{h.name} ({h.district})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={verifyInsurancePolicy}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md"
                >
                  Verify Cashless Network
                </button>
              </div>

              {insVerifyResult && (
                <div className="bg-slate-950 border border-purple-500/40 p-5 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{insVerifyResult.provider}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                      {insVerifyResult.status}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800 text-[11px]">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-400">Sum Insured:</span>
                      <span className="font-bold text-white">{insVerifyResult.sumInsured}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-400">Pre-Auth Window:</span>
                      <span className="text-cyan-400 font-semibold">{insVerifyResult.preAuthTime}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-400">Room Rent Limit:</span>
                      <span className="text-slate-300">{insVerifyResult.roomRentCap}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic pt-1">
                    * {insVerifyResult.disclaimer}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Lab Report OCR Explainer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Medical Lab OCR & Report Explainer
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload pathology or radiology reports to convert medical jargon into plain English & Marathi summaries.
                </p>
              </div>

              <div 
                onClick={simulateOCRAnalysis}
                className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-slate-950 cursor-pointer transition-all"
              >
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-bold">Click to load Sample CBC & Lipid Blood Report</p>
                <p className="text-[10px] text-slate-500 mt-1">Simulates optical character recognition (OCR) and bilingual plain-language analysis</p>
              </div>

              {ocrResult && (
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{ocrResult.testType}</span>
                    <span className="text-amber-400 font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded">
                      Risk: {ocrResult.overallRisk}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ocrResult.abnormalities.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-xs font-bold text-white">
                          <span>{item.parameter}: {item.value}</span>
                          <span className={item.status === 'High' ? 'text-rose-400' : 'text-amber-400'}>{item.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{item.tip}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-xs">
                    <strong>मराठी सारांश:</strong> {ocrResult.marathiSummary}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 14: GOVERNMENT SCHEMES (PM-JAY & MJPJAY)
           ============================================================= */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Government Healthcare Schemes Guide</h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  100% Cashless medical benefits under Ayushman Bharat (PM-JAY) and Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY).
                </p>
              </div>

              {/* Scheme Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemes.map(sch => (
                  <div key={sch.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">{sch.govt}</span>
                      <h2 className="text-xl font-bold text-white mt-0.5">{sch.name}</h2>
                      <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded mt-1">
                        Coverage: {sch.coverage}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold">Eligibility:</span>
                        <p className="text-slate-200">{sch.eligibility}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold">Documents Required:</span>
                        <ul className="list-disc pl-4 text-slate-300 space-y-0.5">
                          {sch.documentsRequired?.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold">Key Benefits:</span>
                        <p className="text-slate-200">{sch.benefits}</p>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400">
                        <span>Official Helpline: <strong className="text-white">{sch.helpline}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (sch.id === 'sch-1') setFilterPmjayOnly(true);
                        else setFilterMjpjayOnly(true);
                        setActiveTab('hospitals');
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                    >
                      View Empaneled Hospitals for {sch.shortName}
                    </button>
                  </div>
                ))}
              </div>

              {/* Eligibility Quiz Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Instant Scheme Eligibility Checker</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <label className="text-slate-300 block mb-1">Ration Card Type in Maharashtra</label>
                    <select
                      value={schemeRationCard}
                      onChange={(e) => setSchemeRationCard(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option value="Yellow">Yellow (BPL / Antyodaya)</option>
                      <option value="Orange">Orange (Annual Income up to ₹1 Lakh)</option>
                      <option value="White">White (Higher Income / Agrarian District)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Annual Household Income</label>
                    <select
                      value={schemeAnnualIncome}
                      onChange={(e) => setSchemeAnnualIncome(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option value="Under ₹1 Lakh">Under ₹ 1,00,000 / year</option>
                      <option value="₹1 Lakh to ₹2.5 Lakh">₹ 1,00,000 to ₹ 2,50,000</option>
                      <option value="Above ₹2.5 Lakh">Above ₹ 2,50,000</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={evaluateSchemeEligibility}
                      className="w-full bg-emerald-500 text-slate-950 font-black text-xs py-2.5 rounded-xl"
                    >
                      Check My Eligibility
                    </button>
                  </div>
                </div>

                {schemeResult && (
                  <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-200">
                    <span className="font-bold text-white text-sm block mb-1">✓ Eligible: {schemeResult.schemeName}</span>
                    <p>{schemeResult.reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 15: USER DASHBOARD & HEALTH VAULT
           ============================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* User Profile Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-2xl">
                    {user.name?.[0] || 'U'}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">{user.name}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ABHA ID: <strong className="text-emerald-400 font-mono">{user.abhaId}</strong> • {user.district} District
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                    <span className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                      Blood: {user.bloodGroup}
                    </span>
                    <span className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                      Emergency: {user.emergencyContact}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      Verified Patient Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowAbhaModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> View Digital ABHA Card
                </button>
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3 py-2.5 rounded-xl"
                >
                  Switch User / Login
                </button>
              </div>
            </div>

            {/* Dashboard Activity Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Confirmed Bed Bookings */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Confirmed Hospital Bed Reservations ({bookings.length})
                </h3>

                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No active bed reservations.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(book => (
                      <div key={book.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{book.hospitalName}</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                              {book.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Bed Type: <strong className="text-white">{book.bedType}</strong> • Token: <code className="text-cyan-400">{book.qrToken || book.id}</code>
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Patient: {book.patientName} • Booked: {book.bookingTime}</p>
                        </div>

                        {book.status !== 'CANCELLED' && (
                          <button
                            onClick={() => {
                              const updated = api.cancelBooking(book.id);
                              setBookings(updated);
                              showToast("Booking cancelled successfully.");
                            }}
                            className="text-[11px] text-rose-400 hover:underline border border-rose-500/30 px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specialist Consultations */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Upcoming Doctor Appointments ({appointments.length})
                </h3>

                {appointments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No appointments scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map(apt => (
                      <div key={apt.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white text-sm">{apt.doctor}</span>
                          <p className="text-[11px] text-emerald-400 font-semibold">{apt.specialty} • {apt.hospital}</p>
                          <p className="text-[10px] text-slate-400 mt-1">🗓️ {apt.date} at {apt.time}</p>
                        </div>

                        <button
                          onClick={() => setTeleConsultModal({ isOpen: true, doctor: { name: apt.doctor, spec: apt.specialty } })}
                          className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-cyan-500/30"
                        >
                          Join Video
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Saved Items Row */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                Bookmarked Hospitals & Doctors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Saved Hospitals */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Saved Hospitals:</h4>
                  {savedHospitalIds.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No hospitals saved.</p>
                  ) : (
                    <div className="space-y-2">
                      {hospitals.filter(h => savedHospitalIds.includes(h.id)).map(h => (
                        <div key={h.id} className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{h.name} ({h.district})</span>
                          <button
                            onClick={() => {
                              setSelectedHospitalForDetails(h);
                              setActiveTab('hospital-detail');
                            }}
                            className="text-emerald-400 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Doctors */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Saved Doctors:</h4>
                  {savedDoctorIds.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No doctors saved.</p>
                  ) : (
                    <div className="space-y-2">
                      {doctors.filter(d => savedDoctorIds.includes(d.id)).map(d => (
                        <div key={d.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white">{d.name}</span>
                            <span className="text-[10px] text-slate-400 block">{d.spec}</span>
                          </div>
                          <button
                            onClick={() => {
                              setBookAppointmentModal({ isOpen: true, doctor: d, hospital: { name: d.hospital } });
                            }}
                            className="text-emerald-400 hover:underline"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 16: HEALTHCARE ADMINISTRATION PANEL
           ============================================================= */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            
            {!adminLoggedIn ? (
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-center shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">Maharashtra Health Admin Gateway</h1>
                  <p className="text-xs text-slate-400 mt-1">Authorized hospital administrators & district nodal officers only.</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const u = (adminUser || '').trim().toLowerCase();
                    const p = (adminPass || '').trim();
                    if ((u === 'admin' || u === '') && (p === 'admin123' || p === '')) {
                      setAdminLoggedIn(true);
                      setAdminError('');
                      showToast("✓ Admin access granted. Welcome, Hospital Administrator!");
                    } else {
                      setAdminError("Invalid credentials. Demo credentials are: admin / admin123");
                      showToast("⚠️ Invalid credentials. Use demo: admin / admin123");
                    }
                  }} 
                  className="space-y-4 text-left"
                >
                  {adminError && (
                    <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center justify-between">
                      <span>Admin Username</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Demo: admin</span>
                    </label>
                    <input
                      type="text"
                      placeholder="admin"
                      value={adminUser}
                      onChange={(e) => { setAdminUser(e.target.value); setAdminError(''); }}
                      style={{ color: '#ffffff', backgroundColor: '#020617' }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 caret-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center justify-between">
                      <span>Password</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Demo: admin123</span>
                    </label>
                    <input
                      type="password"
                      placeholder="admin123"
                      value={adminPass}
                      onChange={(e) => { setAdminPass(e.target.value); setAdminError(''); }}
                      style={{ color: '#ffffff', backgroundColor: '#020617' }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 caret-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authenticate Access</span>
                  </button>

                  <div className="pt-2 text-center space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminUser('admin');
                        setAdminPass('admin123');
                        setAdminLoggedIn(true);
                        setAdminError('');
                        showToast("✓ 1-Click Demo Admin login successful!");
                      }}
                      className="w-full bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-xl py-2 text-xs font-bold transition-colors"
                    >
                      ⚡ 1-Click Instant Demo Login (admin / admin123)
                    </button>
                    <p className="text-[11px] text-slate-400">
                      Demo Credentials: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Admin Header & Stats */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400">Maharashtra State Health Command</span>
                    <h1 className="text-2xl font-black text-white">Healthcare Resource Management Panel</h1>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-emerald-400 font-mono">● LIVE DATABASE</span>
                    <button
                      onClick={() => setAdminLoggedIn(false)}
                      className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Empaneled Hospitals</p>
                    <p className="text-2xl font-black text-white mt-1">{hospitals.length}</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Available Beds</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      {hospitals.reduce((acc, h) => acc + (h.bedsAvailable || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Incoming SOS Signals</p>
                    <p className="text-2xl font-black text-rose-400 mt-1">{emergencySOSLog.length}</p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Blood Banks</p>
                    <p className="text-2xl font-black text-cyan-400 mt-1">{bloodBanks.length}</p>
                  </div>
                </div>

                {/* Live Bed Inventory Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-x-auto space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white">Live Hospital Bed Inventory Management</h3>
                    <span className="text-xs text-slate-400">Directly alter live bed availability</span>
                  </div>

                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Hospital Name</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Free Beds</th>
                        <th className="p-3">ICU Count</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {hospitals.map(h => (
                        <tr key={h.id}>
                          <td className="p-3 font-bold text-white">{h.name}</td>
                          <td className="p-3">{h.district}</td>
                          <td className="p-3 text-emerald-400 font-bold">{h.bedsAvailable}</td>
                          <td className="p-3 text-cyan-400 font-bold">{h.icuAvailable}</td>
                          <td className="p-3 space-x-2">
                            <button
                              onClick={() => {
                                const updated = hospitals.map(item => item.id === h.id ? { ...item, bedsAvailable: item.bedsAvailable + 1 } : item);
                                setHospitals(updated);
                                api.saveHospitals(updated);
                              }}
                              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-1 rounded text-[11px]"
                            >
                              + Add Free Bed
                            </button>
                            <button
                              onClick={() => {
                                const updated = hospitals.map(item => item.id === h.id ? { ...item, bedsAvailable: Math.max(0, item.bedsAvailable - 1) } : item);
                                setHospitals(updated);
                                api.saveHospitals(updated);
                              }}
                              className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-1 rounded text-[11px]"
                            >
                              - Occupy Bed
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Emergency SOS Log Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-x-auto space-y-4">
                  <h3 className="text-base font-bold text-white">Emergency SOS Incident Log</h3>
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">SOS ID</th>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Assigned Vehicle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {emergencySOSLog.map(sos => (
                        <tr key={sos.id}>
                          <td className="p-3 font-mono font-bold text-rose-400">{sos.id}</td>
                          <td className="p-3 font-semibold text-white">{sos.patientName}</td>
                          <td className="p-3 text-amber-300">{sos.category}</td>
                          <td className="p-3">{sos.district}</td>
                          <td className="p-3 text-slate-400">{sos.timestamp}</td>
                          <td className="p-3 text-cyan-400">{sos.ambulanceAssigned || 'ALS Unit 108'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* =============================================================
          MODAL 1: USER AUTHENTICATION & REGISTRATION
         ============================================================= */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setAuthModal({ isOpen: false, mode: 'login' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Tabs: Login / Register */}
            <div className="flex border-b border-slate-800 pb-2 text-xs font-bold gap-4">
              <button
                onClick={() => setAuthModal(prev => ({ ...prev, mode: 'login' }))}
                className={`pb-1 ${authModal.mode === 'login' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal(prev => ({ ...prev, mode: 'register' }))}
                className={`pb-1 ${authModal.mode === 'register' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}`}
              >
                Create Account
              </button>
            </div>

            {authModal.mode === 'login' ? (
              <div className="space-y-3 text-xs">
                <h3 className="text-lg font-black text-white">Welcome Back</h3>
                <p className="text-slate-400">Access your appointments, saved hospitals, and digital health card.</p>

                <div>
                  <label className="text-slate-300 block mb-1">Email or Mobile Number</label>
                  <input
                    type="text"
                    defaultValue={user.email}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    setAuthModal({ isOpen: false, mode: 'login' });
                    showToast(`Logged in successfully as ${user.name}`);
                  }}
                  className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl shadow-lg mt-2"
                >
                  Sign In to AarogyaConnect
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs max-h-[420px] overflow-y-auto pr-1">
                <h3 className="text-lg font-black text-white">Register Patient Account</h3>
                
                <div>
                  <label className="text-slate-300 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patil"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Mobile</label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Blood Group</label>
                    <select
                      value={authForm.bloodGroup}
                      onChange={(e) => setAuthForm({ ...authForm, bloodGroup: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">District (Maharashtra)</label>
                  <select
                    value={authForm.district}
                    onChange={(e) => setAuthForm({ ...authForm, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {INITIAL_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98..."
                    value={authForm.emergencyContact}
                    onChange={(e) => setAuthForm({ ...authForm, emergencyContact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    const newUser = {
                      ...user,
                      name: authForm.name || "New Registered Patient",
                      phone: authForm.phone || "+91 98000 12345",
                      bloodGroup: authForm.bloodGroup,
                      district: authForm.district,
                      emergencyContact: authForm.emergencyContact || "+91 98000 00000"
                    };
                    setUser(newUser);
                    api.updateUser(newUser);
                    setAuthModal({ isOpen: false, mode: 'login' });
                    showToast(`Registration complete. Welcome, ${newUser.name}!`);
                  }}
                  className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl shadow-lg mt-2"
                >
                  Create Account & Generate ABHA ID
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 2: BOOK BED RESERVATION
         ============================================================= */}
      {bookBedModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setBookBedModal({ isOpen: false, hospital: null, bedType: 'General Ward' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Emergency & Planned Admission</span>
              <h2 className="text-xl font-black text-white mt-0.5">Reserve Hospital Bed</h2>
              <p className="text-xs text-slate-400">{bookBedModal.hospital?.name} ({bookBedModal.hospital?.district})</p>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-300 block mb-1">Bed Category</label>
                <select
                  value={bookBedForm.bedType}
                  onChange={(e) => setBookBedForm({ ...bookBedForm, bedType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="General Ward">General Ward (Cashless Scheme)</option>
                  <option value="Semi-Private">Semi-Private Room</option>
                  <option value="Deluxe Private">Deluxe Private Ward</option>
                  <option value="ICU Bed">Critical Care ICU Bed</option>
                  <option value="Ventilator">Ventilator Equipped ICU</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={bookBedForm.patientName}
                  onChange={(e) => setBookBedForm({ ...bookBedForm, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Urgency</label>
                  <select
                    value={bookBedForm.urgency}
                    onChange={(e) => setBookBedForm({ ...bookBedForm, urgency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    <option value="Immediate Admission">Immediate (Within 1 Hr)</option>
                    <option value="Urgent Today">Urgent (Today)</option>
                    <option value="Planned Next 24h">Planned (Next 24h)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={bookBedForm.contactPhone}
                    onChange={(e) => setBookBedForm({ ...bookBedForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const newBooking = api.addBedBooking({
                    hospitalId: bookBedModal.hospital?.id,
                    hospitalName: bookBedModal.hospital?.name,
                    bedType: bookBedForm.bedType,
                    patientName: bookBedForm.patientName,
                    urgency: bookBedForm.urgency
                  });
                  setBookings(api.getBookings());
                  setHospitals(api.getHospitals());
                  setBookBedModal({ isOpen: false, hospital: null, bedType: 'General Ward' });
                  showToast(`Bed Reserved! Token: ${newBooking.qrToken}`);
                  setActiveTab('dashboard');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-lg mt-2"
              >
                Confirm Bed Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 3: BOOK DOCTOR APPOINTMENT
         ============================================================= */}
      {bookAppointmentModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setBookAppointmentModal({ isOpen: false, doctor: null, hospital: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Specialist OPD Consultation</span>
              <h2 className="text-xl font-black text-white mt-0.5">Book Appointment</h2>
              <p className="text-xs text-slate-400">{bookAppointmentModal.doctor?.name} ({bookAppointmentModal.doctor?.spec})</p>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-300 block mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={bookAppointmentForm.date}
                  onChange={(e) => setBookAppointmentForm({ ...bookAppointmentForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Available Time Slot</label>
                <select
                  value={bookAppointmentForm.timeSlot}
                  onChange={(e) => setBookAppointmentForm({ ...bookAppointmentForm, timeSlot: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  {(bookAppointmentModal.doctor?.availableSlots || ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"]).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={bookAppointmentForm.patientName}
                  onChange={(e) => setBookAppointmentForm({ ...bookAppointmentForm, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Reason for Consultation</label>
                <input
                  type="text"
                  value={bookAppointmentForm.reason}
                  onChange={(e) => setBookAppointmentForm({ ...bookAppointmentForm, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={() => {
                  const newApt = api.addAppointment({
                    doctorId: bookAppointmentModal.doctor?.id,
                    doctor: bookAppointmentModal.doctor?.name,
                    specialty: bookAppointmentModal.doctor?.spec,
                    hospital: bookAppointmentModal.hospital?.name || "KEM Hospital",
                    date: bookAppointmentForm.date,
                    time: bookAppointmentForm.timeSlot,
                    patientName: bookAppointmentForm.patientName,
                    status: "Confirmed",
                    type: "In-Person Consultation"
                  });
                  setAppointments(api.getAppointments());
                  setBookAppointmentModal({ isOpen: false, doctor: null, hospital: null });
                  showToast(`Appointment confirmed with ${newApt.doctor}!`);
                  setActiveTab('dashboard');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-lg mt-2"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 4: REQUEST BLOOD UNITS
         ============================================================= */}
      {requestBloodModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setRequestBloodModal({ isOpen: false, bloodBank: null, bloodGroup: 'O+' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400">Emergency Blood Requisition</span>
              <h2 className="text-xl font-black text-white mt-0.5">Request Blood Units</h2>
              <p className="text-xs text-slate-400">{requestBloodModal.bloodBank?.name} ({requestBloodModal.bloodBank?.district})</p>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Blood Group</label>
                  <select
                    value={requestBloodForm.bloodGroup || requestBloodModal.bloodGroup}
                    onChange={(e) => setRequestBloodForm({ ...requestBloodForm, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Units Required</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={requestBloodForm.unitsRequired}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setRequestBloodForm({ ...requestBloodForm, unitsRequired: value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={requestBloodForm.patientName}
                  onChange={(e) => setRequestBloodForm({ ...requestBloodForm, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Hospital Where Patient is Admitted</label>
                <input
                  type="text"
                  value={requestBloodForm.hospitalName}
                  onChange={(e) => setRequestBloodForm({ ...requestBloodForm, hospitalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={() => {
                  api.addBloodRequest({
                    bloodBankId: requestBloodModal.bloodBank?.id,
                    bloodBankName: requestBloodModal.bloodBank?.name,
                    bloodGroup: requestBloodForm.bloodGroup || requestBloodModal.bloodGroup,
                    unitsRequired: Math.min(10, Math.max(1, parseInt(requestBloodForm.unitsRequired, 10) || 1)),
                    patientName: requestBloodForm.patientName,
                    hospitalName: requestBloodForm.hospitalName
                  });
                  setRequestBloodModal({ isOpen: false, bloodBank: null, bloodGroup: 'O+' });
                  showToast("Emergency blood requisition transmitted! Blood bank contacted.");
                }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl shadow-lg mt-2"
              >
                Transmit Emergency Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 5: DIGITAL ABHA CARD
         ============================================================= */}
      {showAbhaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAbhaModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ABHA Card Graphic */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 p-6 space-y-4 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
                    AB
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-400">National Health Authority</p>
                    <p className="text-xs font-black">Ayushman Bharat Digital Mission</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  ABHA ID
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xl text-emerald-400">
                  {user.name?.[0] || 'A'}
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-black text-white text-base">{user.name}</p>
                  <p className="text-slate-400">DOB: 14-Aug-1992 • {user.gender || 'Male'}</p>
                  <p className="text-slate-400">Blood Group: <strong className="text-emerald-400">{user.bloodGroup}</strong></p>
                  <p className="text-slate-400">State: Maharashtra</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">14-Digit ABHA Number:</span>
                  <span className="text-sm font-black text-emerald-400">{user.abhaId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase">QR Verification:</span>
                  <span className="text-xs font-bold text-slate-300">✓ VERIFIED</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full bg-emerald-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save ABHA Digital Card
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 6: VIRTUAL TELE-CONSULTATION VIDEO SUITE
         ============================================================= */}
      {teleConsultModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setTeleConsultModal({ isOpen: false, doctor: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Suite Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-bold text-white">Live Consultation: {teleConsultModal.doctor?.name}</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Encrypted WebRTC • 00:04:12</span>
            </div>

            {/* Video Container Simulator */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-64 sm:h-80 flex items-center justify-center">
              {/* Doctor Video Simulator */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 font-bold text-2xl animate-pulse">
                  👨‍⚕️
                </div>
                <p className="text-sm font-bold text-white">{teleConsultModal.doctor?.name}</p>
                <p className="text-xs text-emerald-400 font-medium">Video Feed Active • Audio Connected</p>
              </div>

              {/* Self Video Inset */}
              <div className="absolute bottom-4 right-4 w-28 h-20 bg-slate-950 rounded-xl border border-slate-700 p-2 flex flex-col justify-between shadow-lg">
                <span className="text-[9px] text-slate-400">Self (You)</span>
                <p className="text-[10px] text-emerald-400 font-bold text-center">
                  {teleConsultState.videoMuted ? 'Cam Off' : 'Camera On'}
                </p>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setTeleConsultState(prev => ({ ...prev, videoMuted: !prev.videoMuted }))}
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    teleConsultState.videoMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {teleConsultState.videoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTeleConsultState(prev => ({ ...prev, audioMuted: !prev.audioMuted }))}
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    teleConsultState.audioMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {teleConsultState.audioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => {
                  setTeleConsultState(prev => ({ ...prev, eRxGenerated: true }));
                  showToast("E-Prescription generated by doctor!");
                }}
                className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow"
              >
                Generate Digital E-Prescription
              </button>

              <button
                onClick={() => setTeleConsultModal({ isOpen: false, doctor: null })}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                End Call
              </button>
            </div>

            {/* Generated E-Prescription Preview */}
            {teleConsultState.eRxGenerated && (
              <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">E-Prescription • Signed by {teleConsultModal.doctor?.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">RX-MH-2026-8812</span>
                </div>
                <p className="text-slate-300">1. Tab Paracetamol 650mg — 1 tab SOS after food</p>
                <p className="text-slate-300">2. Tab Azithromycin 500mg — 1 tab OD for 3 days</p>
                <p className="text-slate-300">3. Syrup Ambroxol — 10ml TDS</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      alert("E-Prescription downloaded to device!");
                    }}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF Prescription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 7: ADD REVIEW MODAL
         ============================================================= */}
      {addReviewModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setAddReviewModal({ isOpen: false, hospital: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Patient Community</span>
              <h2 className="text-xl font-black text-white mt-0.5">Write Hospital Review</h2>
              <p className="text-xs text-slate-400">{addReviewModal.hospital?.name}</p>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-300 block mb-1">Star Rating (1 - 5 Stars)</label>
                <select
                  value={addReviewForm.rating}
                  onChange={(e) => setAddReviewForm({ ...addReviewForm, rating: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Department Visited</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology, Emergency, Maternity"
                  value={addReviewForm.department}
                  onChange={(e) => setAddReviewForm({ ...addReviewForm, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Your Detailed Experience</label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding nursing care, doctors, bed readiness, and scheme processing..."
                  value={addReviewForm.comment}
                  onChange={(e) => setAddReviewForm({ ...addReviewForm, comment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={() => {
                  const newRev = {
                    id: `rev-${Date.now()}`,
                    hospitalId: addReviewModal.hospital?.id,
                    hospitalName: addReviewModal.hospital?.name,
                    patientName: user.name,
                    rating: addReviewForm.rating,
                    department: addReviewForm.department,
                    comment: addReviewForm.comment,
                    date: "Today",
                    verifiedPatient: true
                  };
                  const updated = [newRev, ...reviews];
                  setReviews(updated);
                  api.saveReviews(updated);
                  setAddReviewModal({ isOpen: false, hospital: null });
                  showToast("Thank you! Review published.");
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-lg mt-2"
              >
                Submit Verified Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-semibold text-xs">
            <button onClick={() => setActiveTab('hospitals')} className="hover:text-emerald-400">Hospitals</button>
            <button onClick={() => setActiveTab('beds')} className="hover:text-emerald-400">Live Bed Matrix</button>
            <button onClick={() => setActiveTab('blood-bank')} className="hover:text-emerald-400">Blood Bank</button>
            <button onClick={() => setActiveTab('ambulance')} className="hover:text-emerald-400">108 Ambulance</button>
            <button onClick={() => setActiveTab('schemes')} className="hover:text-emerald-400">PM-JAY & MJPJAY</button>
            <button onClick={() => setActiveTab('cost')} className="hover:text-emerald-400">Cost Calculator</button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-cyan-400">Admin Control</button>
          </div>

          <p className="font-semibold text-slate-400 max-w-2xl mx-auto">
            AarogyaConnect — Unified Healthcare Decision & Emergency Grid for Maharashtra State.
          </p>

          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto">
            {t.disclaimer}
          </p>

          <p className="text-[10px] text-slate-600 font-mono">
            © 2026 Maharashtra State Digital Healthcare Mission • Integrated with NHA & PM-JAY • Data Version v3.0
          </p>
        </div>
      </footer>

    </div>
  ), lang);
}