export interface CarSpec {
  label: string;
  value: string;
  category: string;
}

export interface ScrollPhaseContent {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  metrics: { label: string; value: string }[];
}

export const CAR_SPECS: CarSpec[] = [
  { label: "Engine Type", value: "V10, 90°, MPI & DSI", category: "Engine" },
  { label: "Displacement", value: "5204 cm³ (317.6 cu in)", category: "Engine" },
  { label: "Max Power", value: "640 CV (470 kW) @ 8,000 RPM", category: "Performance" },
  { label: "Max Torque", value: "600 Nm (443 lb-ft) @ 6,500 RPM", category: "Performance" },
  { label: "Top Speed", value: "> 325 km/h (202 mph)", category: "Performance" },
  { label: "0-100 km/h (0-62 mph)", value: "2.9 seconds", category: "Performance" },
  { label: "0-200 km/h (0-124 mph)", value: "8.9 seconds", category: "Performance" },
  { label: "Chassis", value: "Carbon Fiber & Aluminum", category: "Design" },
  { label: "Dry Weight", value: "1,379 kg (3,040 lbs)", category: "Design" },
  { label: "Transmission", value: "7-speed LDF dual-clutch", category: "Transmission" },
  { label: "Drivetrain", value: "Electronically controlled AWD", category: "Transmission" },
  { label: "Brakes", value: "Carbon-ceramic ventilated discs", category: "Brakes" },
];

export const SCROLL_PHASES: { [key: string]: ScrollPhaseContent } = {
  hero: {
    title: "BLUE LAMBORGHINI HURACÁN",
    subtitle: "THE ULTIMATE V10 SHAPE OF PERFORMANCE",
    description: "An experience of pure aerodynamic superiority, combining state-of-the-art carbon fiber craftsmanship with a screaming naturally aspirated engine.",
    details: [
      "Signature Blu Astraeus Finish",
      "Aerodinamica Lamborghini Attiva (ALA) 2.0",
      "Lamborghini Dinamica Veicolo Integrata (LDVI)"
    ],
    metrics: [
      { label: "BASE PRICE", value: "€1.5M" },
      { label: "AVAILABILITY", value: "IMMEDIATE" },
      { label: "EDITION", value: "AD PERSONAM" }
    ]
  },
  design: {
    title: "CARBON MONOCOQUE",
    subtitle: "AERODYNAMIC INTEGRATION & COMPOSITE SCIENCE",
    description: "A hybrid chassis crafted from ultra-lightweight carbon fiber and high-strength aluminum, providing a torsional stiffness-to-weight ratio that dominates both road and track.",
    details: [
      "Carbon Fiber Front Spoiler & Underbody",
      "Forged Composites® Engine Hood",
      "Enhanced Downforce Intake Grilles"
    ],
    metrics: [
      { label: "DRY WEIGHT", value: "1,379 KG" },
      { label: "WEIGHT DIST.", value: "43% F / 57% R" },
      { label: "AERO EFFICIENCY", value: "+150%" }
    ]
  },
  engine: {
    title: "V12 HYBRID PERFORMANCE",
    subtitle: "RAW NATURAL ASPIRATED SOUL WITH 750HP",
    description: "Heart of a titan. Delivering 750HP of pure, unadulterated power with immediate throttle response and a mechanical symphony reaching up to 8,500 RPM.",
    details: [
      "Titanium Intake Valves",
      "Low-Backpressure Exhaust System",
      "Advanced Dual-Clutch Transmission"
    ],
    metrics: [
      { label: "POWER OUTPUT", value: "750 HP" },
      { label: "ENGINE CONFIG", value: "V12 SOUL" },
      { label: "ACCELERATION", value: "2.9s 0-100" }
    ]
  }
};

export const FAQ_ITEMS = [
  {
    question: "What makes the Blue Huracán Ad Personam unique?",
    answer: "The Ad Personam program allows clients to customize color finishes, leather textures, and stitching to create a unique masterpiece. This model features a multi-layer Blu Astraeus paint with metallic flakes that shifting tone under sunlight."
  },
  {
    question: "How does the Aerodinamica Lamborghini Attiva (ALA) work?",
    answer: "ALA is a smart system that actively manages aerodynamic drag and downforce. By opening or closing flaps in the front spoiler and engine cover, the car can optimize for maximum speed on straights or maximum downforce in corners."
  },
  {
    question: "Can this hypercar be driven daily?",
    answer: "While engineered for maximum track performance, the Huracán includes a hydraulic nose-lifting system, comfortable Strada driving mode, and modern Apple CarPlay / Android Auto connectivity, making it surprisingly adaptable to city roads."
  }
];
