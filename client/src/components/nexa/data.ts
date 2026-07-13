export type Project = {
  title: string;
  description: string;
  category: "Web" | "Mobile" | "Extension" | "Library";
  tech: string[];
  image?: string;
  icon?: string;
  primaryUrl: string;
  primaryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
};

export const projects: Project[] = [
  {
    title: "react-native-simple-fs",
    description:
      "A lightweight React Native file-system library built as a showcase utility for storage, file access, and export flows.",
    category: "Library",
    tech: ["React Native", "TypeScript", "File System"],
    image: "/generated-products/react-native-simple-fs.png",
    primaryUrl: "https://www.npmjs.com/package/react-native-simple-fs",
    primaryLabel: "npm package",
  },
  {
    title: "The Home Versus",
    description:
      "Editorial product comparisons and practical recommendations for real households.",
    category: "Web",
    tech: ["React", "Next.js"],
    image: "/graphic/the-home-versus.png",
    primaryUrl: "https://thehomeversus.com/",
    primaryLabel: "Visit website",
    secondaryUrl: "https://github.com/nexa-tech-solution/the-home-versus",
    secondaryLabel: "Source code",
  },
  {
    title: "Mystic Tarot",
    description:
      "A reflective tarot experience for self-discovery and daily guidance.",
    category: "Web",
    tech: ["React", "Tailwind", "Node.js"],
    image: "/graphic/tarot-destiny.webp",
    primaryUrl: "https://tarrot-web-app.vercel.app/",
    primaryLabel: "Live demo",
  },
  {
    title: "PetPal",
    description:
      "An expressive virtual pet companion powered by conversational AI.",
    category: "Web",
    tech: ["Next.js", "Gemini", "Rive"],
    image: "/graphic/petpal.png",
    primaryUrl: "https://pet-simulator-sigma.vercel.app/",
    primaryLabel: "Live demo",
  },
  {
    title: "Resize Image",
    description:
      "A private browser tool for fast image resizing, compression, and conversion.",
    category: "Web",
    tech: ["Web Tool", "Image Processing"],
    image: "/graphic/resize-image.png",
    primaryUrl: "https://resizeimage.tech/",
    primaryLabel: "Use tool",
  },
  {
    title: "Time Converter",
    description:
      "Compare cities and time zones without the friction of manual calculations.",
    category: "Web",
    tech: ["React", "Productivity"],
    image: "/graphic/time-converter.png",
    primaryUrl: "https://time-converter-woad-iota.vercel.app/",
    primaryLabel: "Live demo",
  },
  {
    title: "Tarot Destiny",
    description:
      "Daily readings, self-discovery, and AI-guided reflection on mobile.",
    category: "Mobile",
    tech: ["React Native", "Redux", "AI"],
    image: "/graphic/tarot-destiny.webp",
    icon: "https://play-lh.googleusercontent.com/T7ggFDyRA1egiQtJNYeAtG911bTUNhtvni3wbD1QJSITKmcVtvf8xT4sp1GXsQAzG0_MlVe3IfLxxOdG_orEVg=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa_tarrot_app",
    primaryLabel: "Google Play",
  },
  {
    title: "PetPal — Pet Simulator",
    description:
      "A playful virtual pet with chat, personality, and everyday interactions.",
    category: "Mobile",
    tech: ["React Native", "Gemini", "Rive"],
    image: "/graphic/petpal.png",
    icon: "https://play-lh.googleusercontent.com/pIIQUTIv-UHpOuZ77_VbGz34Y3WsNTzM928j5KQUwg2-zcslt6CbKn-bEZXsqFCI3bQNWbEqQaD1EXdDyzrlSA=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.pet_simulator",
    primaryLabel: "Google Play",
  },
  {
    title: "ScanQR",
    description: "A focused QR code and barcode scanner for Android and iOS.",
    category: "Mobile",
    tech: ["React Native", "Vision Camera", "QR Kit"],
    image: "/graphic/scanqr.png",
    icon: "https://play-lh.googleusercontent.com/d1AgNfOeL3vqVejG8bawDP8-oV3kNEpcSjJfBb_DfMu-yW8XyxyA_kZVrOB7WqgKKSdMvRX53CjmHpie6GlmbQ=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.qr_code",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/scanqr-qr-code-barcode/id6779862851",
    secondaryLabel: "App Store",
  },
  {
    title: "FieldStamp GPS Camera",
    description:
      "Capture photos with GPS stamps, project notes, and exportable location details.",
    category: "Mobile",
    tech: ["React Native", "GPS", "Camera", "PDF"],
    image: "/graphic/fieldstamp-camera.png",
    icon: "https://play-lh.googleusercontent.com/rcjxgvm0yq0v2sX5dtysxLmIlA54sryED14MNtuMtJKuyzpv_mfp7wUThMWmoMjqT1j3cq-5gE9VF3_3ncV14g=w480-h960-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.fieldstamp.free",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/fieldstamp-gps-camera/id6786527961",
    secondaryLabel: "App Store",
  },
  {
    title: "Smart Currency Converter",
    description:
      "Fast exchange-rate conversion with useful offline calculations.",
    category: "Mobile",
    tech: ["React Native", "Currency", "Offline"],
    image: "/graphic/currency-converter.png",
    icon: "https://play-lh.googleusercontent.com/6ozMZAiEX_Jh0K-7hia9_HT8AASk1k-GRTAXdv7HGxra1YplyvBJnDVDkkllYp0OG8UJ173IPwcO8FrTjLGtiQ=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.currencyunitconverter",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/currency-unit-converter/id6780219094",
    secondaryLabel: "App Store",
  },
  {
    title: "Loan Estimator",
    description:
      "Estimate repayments and export clear loan calculation reports.",
    category: "Mobile",
    tech: ["React Native", "Finance", "PDF"],
    image: "/graphic/easy-loan-calculator.webp",
    icon: "https://play-lh.googleusercontent.com/c1AnZ1m1ZmxKL7ddoShW3nmHEU2-uhjY7w0xndohbvOAxkwXTdIOu7tSYlQNRkAubkZcpmz7e0_2XXMiGS7KCg=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.loan.estimator",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/easy-loan-estimator/id6779272088",
    secondaryLabel: "App Store",
  },
  {
    title: "Time Converter — World Clock",
    description:
      "Plan meetings and travel across global time zones from your phone.",
    category: "Mobile",
    tech: ["React Native", "Time Zones", "Productivity"],
    image: "/graphic/time-converter.png",
    icon: "https://play-lh.googleusercontent.com/QdmzxZ2aJk2Z0kf4iwcgllNiprRjlg5niRDdVNGRZNSscq_SURIMbRsijIM7IMfE1mKaU48E-ndA84eWmXkd1A=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=nexa.timeconverter.com",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/time-converter-world-clock/id6780116305",
    secondaryLabel: "App Store",
  },
  {
    title: "Quick Image PDF Resizer",
    description:
      "Resize images, compress files, convert formats, and handle common PDF tasks.",
    category: "Mobile",
    tech: ["React Native", "PDF", "Image Tools"],
    image: "/graphic/resize-image.png",
    icon: "https://play-lh.googleusercontent.com/bT-I_LW96dpNyK9z69tAz4StNGneXqKACXqjXNgdOBILI43yfS8ny6DGZshmUNL-DvaQwtItdRBUaCTAC08Tqw=s512-rw",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.pdfresizer",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/quick-image-pdf-resizer/id6780742651",
    secondaryLabel: "App Store",
  },
  {
    title: "World Time Buddy",
    description:
      "A lightweight Chrome extension for comparing time zones while you work.",
    category: "Extension",
    tech: ["Chrome Extension", "Time Zones", "Productivity"],
    image: "/graphic/time-converter-extension.png",
    primaryUrl:
      "https://chromewebstore.google.com/detail/world-time-buddy/mmlplefhfbacmbebleofnfligokkaljh",
    primaryLabel: "Chrome Web Store",
  },
];

export const team = [
  {
    name: "Ethan",
    role: "Tech Lead · Mobile & Web",
    bio: "Shapes product direction and builds reliable experiences across web and mobile.",
    avatar: "https://avatars.githubusercontent.com/u/74121720?v=4",
    github: "https://github.com/tankhang1",
    linkedin: "https://www.linkedin.com/in/khang-doan-373898264/",
  },
  {
    name: "Tina",
    role: "Team Lead · Mobile & Web",
    bio: "Leads execution with a focus on scalable architecture and user-centred products.",
    avatar: "https://avatars.githubusercontent.com/u/114568554?v=4",
    github: "https://github.com/Tien25012003",
    linkedin: "https://www.linkedin.com/in/tien-nguyen-2aa5a927b/",
  },
];

export const socials = {
  github: "https://github.com/nexa-tech-solution",
  linkedin: "https://www.linkedin.com/in/tech-nexa-ba02a9387/",
  email: "cs.nexatech@gmail.com",
};
