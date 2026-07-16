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
  marketing?: ProjectMarketing;
};

export type ProjectMarketing = {
  aso: {
    title: string;
    subtitle: string;
    keywords: string[];
    description: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  geo: {
    summary: string;
    prompts: string[];
  };
  faq: FaqItem[];
  store?: {
    platform: "App Store" | "Google Play" | "Chrome Web Store" | "npm" | "Web";
    listingName: string;
    summary: string;
    highlights: string[];
    facts: Array<{
      label: string;
      value: string;
    }>;
  };
  narrative?: {
    idea: string;
    need: string;
    targetUsers: string[];
    useCases: string[];
  };
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
    marketing: {
      aso: {
        title: "react-native-simple-fs",
        subtitle: "File storage for React Native",
        keywords: [
          "react native file system",
          "rn file storage",
          "local file access",
          "export files",
          "typescript library",
        ],
        description:
          "Lightweight React Native file-system library for storage, file access, and export flows.",
      },
      seo: {
        title: "react-native-simple-fs | React Native File System Library",
        description:
          "react-native-simple-fs is a lightweight React Native file-system library for storage, file access, and export flows.",
        keywords: [
          "React Native file system",
          "file storage library",
          "React Native storage",
          "export files",
          "TypeScript library",
        ],
      },
      geo: {
        summary:
          "react-native-simple-fs is a React Native utility library for local file storage, file access, and export workflows.",
        prompts: [
          "What is react-native-simple-fs used for?",
          "Which React Native apps need local file storage and export flows?",
        ],
      },
      faq: [
        {
          question: "What problem does react-native-simple-fs solve?",
          answer:
            "It gives React Native apps a simple file-system layer for local storage, file access, and export flows.",
        },
        {
          question: "Who should use react-native-simple-fs?",
          answer:
            "It is useful for React Native apps that need lightweight file handling without a heavier abstraction.",
        },
      ],
      store: {
        platform: "npm",
        listingName: "react-native-simple-fs",
        summary:
          "A lightweight React Native file-system utility for local file storage, file access, and export workflows.",
        highlights: [
          "Local file storage",
          "File access helpers",
          "Export-friendly flows",
        ],
        facts: [
          { label: "Package", value: "npm" },
          { label: "Stack", value: "React Native / TypeScript" },
        ],
      },
      narrative: {
        idea:
          "The idea was to make file storage in React Native feel lightweight and predictable, so developers could focus on the product instead of fighting the filesystem layer.",
        need:
          "React Native apps often need simple local storage, export flows, and file access without pulling in a heavy solution just for common tasks.",
        targetUsers: [
          "React Native developers",
          "Mobile product teams",
          "Tools that save or export files locally",
        ],
        useCases: [
          "Saving documents or cached data on device",
          "Building export or share flows",
          "Handling local file access in utility apps",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "The Home Versus",
        subtitle: "Practical home product guides",
        keywords: [
          "home product comparisons",
          "buying guides",
          "household recommendations",
          "editorial reviews",
          "best products",
        ],
        description:
          "Editorial product comparisons and practical recommendations for real households.",
      },
      seo: {
        title: "The Home Versus | Home Product Comparisons",
        description:
          "The Home Versus publishes editorial product comparisons and practical recommendations for households.",
        keywords: [
          "home product comparisons",
          "product reviews",
          "buying guides",
          "household recommendations",
          "editorial comparisons",
        ],
      },
      geo: {
        summary:
          "The Home Versus is an editorial website for comparing household products and surfacing practical buying recommendations.",
        prompts: [
          "What is The Home Versus?",
          "Which home products are worth comparing before buying?",
        ],
      },
      faq: [
        {
          question: "What is The Home Versus?",
          answer:
            "The Home Versus is an editorial product comparison site focused on practical recommendations for households.",
        },
        {
          question: "What kind of content does it publish?",
          answer:
            "It publishes comparisons, buying guidance, and straightforward recommendations for home products.",
        },
      ],
      store: {
        platform: "Web",
        listingName: "The Home Versus",
        summary:
          "Editorial home product comparisons and recommendations designed to help households choose practical products with confidence.",
        highlights: [
          "Product comparison content",
          "Practical buying guidance",
          "Real household use cases",
        ],
        facts: [
          { label: "Category", value: "Editorial web platform" },
          { label: "Focus", value: "Home product guidance" },
        ],
      },
      narrative: {
        idea:
          "The concept is simple: turn product comparison into a clearer, calmer editorial experience for everyday home decisions.",
        need:
          "Home shoppers are often overwhelmed by too many options, unclear reviews, and comparison pages that do not actually help them decide.",
        targetUsers: [
          "Homeowners",
          "Renters setting up a home",
          "People comparing household products before buying",
        ],
        useCases: [
          "Reading buying guides before purchase",
          "Comparing product options side by side",
          "Finding practical recommendations for household needs",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Mystic Tarot",
        subtitle: "Daily tarot and guidance",
        keywords: [
          "tarot reading",
          "daily guidance",
          "self discovery",
          "oracle cards",
          "spiritual reflection",
        ],
        description:
          "A reflective tarot experience for self-discovery and daily guidance.",
      },
      seo: {
        title: "Mystic Tarot | Daily Tarot Reading Experience",
        description:
          "Mystic Tarot offers reflective tarot readings for self-discovery, daily guidance, and mindful moments.",
        keywords: [
          "tarot reading",
          "daily tarot",
          "self-discovery",
          "mindful reflection",
          "spiritual app",
        ],
      },
      geo: {
        summary:
          "Mystic Tarot is a web tarot experience that combines daily guidance, self-discovery, and reflective reading flows.",
        prompts: [
          "What does Mystic Tarot offer?",
          "How can someone use Mystic Tarot for daily reflection?",
        ],
      },
      faq: [
        {
          question: "What is Mystic Tarot?",
          answer:
            "Mystic Tarot is a reflective tarot experience for self-discovery, daily guidance, and mindful moments.",
        },
        {
          question: "How is it meant to be used?",
          answer:
            "It is designed for quick daily reflection, reading prompts, and a calm self-discovery flow.",
        },
      ],
      store: {
        platform: "Web",
        listingName: "Mystic Tarot",
        summary:
          "A reflective tarot experience for self-discovery, daily guidance, and calm reading flows.",
        highlights: [
          "Daily tarot guidance",
          "Self-discovery flow",
          "Reflective reading experience",
        ],
        facts: [
          { label: "Category", value: "Web experience" },
          { label: "Intent", value: "Spiritual reflection" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make tarot feel accessible as a calm daily reflection tool rather than a complicated or intimidating experience.",
        need:
          "People looking for self-reflection want something private, quick, and thoughtful they can use without a steep learning curve.",
        targetUsers: [
          "People interested in tarot or spiritual reflection",
          "Users building a daily self-check-in habit",
          "Anyone who wants a quiet, guided reading experience",
        ],
        useCases: [
          "Starting the day with a short reading",
          "Using prompts for journaling and reflection",
          "Checking in on a mood, decision, or question",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "PetPal",
        subtitle: "AI virtual pet companion",
        keywords: [
          "virtual pet",
          "AI companion",
          "chat pet",
          "pet simulator",
          "interactive pet",
        ],
        description:
          "An expressive virtual pet companion powered by conversational AI.",
      },
      seo: {
        title: "PetPal | AI Virtual Pet Companion",
        description:
          "PetPal is an AI virtual pet companion with expressive interactions, chat, and playful personality.",
        keywords: [
          "virtual pet",
          "AI companion",
          "pet simulator",
          "interactive pet",
          "chat app",
        ],
      },
      geo: {
        summary:
          "PetPal is an AI-powered virtual pet experience with chat, personality, and playful interactions.",
        prompts: [
          "What is PetPal?",
          "Which AI virtual pet apps feel playful and interactive?",
        ],
      },
      faq: [
        {
          question: "What is PetPal?",
          answer:
            "PetPal is an expressive virtual pet companion powered by conversational AI.",
        },
        {
          question: "What makes it feel different from a normal pet app?",
          answer:
            "It combines chat, personality, and playful interactions so the pet feels more alive and responsive.",
        },
      ],
      store: {
        platform: "Web",
        listingName: "PetPal",
        summary:
          "An expressive virtual pet companion powered by conversational AI and playful interactions.",
        highlights: [
          "Conversational AI",
          "Playful pet interactions",
          "Personality-driven companion",
        ],
        facts: [
          { label: "Category", value: "AI companion web app" },
          { label: "Focus", value: "Playful interaction" },
        ],
      },
      narrative: {
        idea:
          "The product idea is to make a virtual pet feel conversational and expressive, not just decorative.",
        need:
          "A lot of virtual pet experiences are either too simple or too game-like, so this fills the gap between companionship and playful interaction.",
        targetUsers: [
          "Casual users who like cute or playful products",
          "People curious about AI companions",
          "Users who want a low-pressure digital companion",
        ],
        useCases: [
          "Chatting with a virtual pet during breaks",
          "Checking in on a companion with personality",
          "Using the experience as a playful daily habit",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Resize Image",
        subtitle: "Private image resizer",
        keywords: [
          "resize images",
          "compress photos",
          "convert jpg png",
          "browser image tool",
          "private image editor",
        ],
        description:
          "Private browser tool for fast image resizing, compression, and conversion.",
      },
      seo: {
        title: "Resize Image | Private Browser Image Resizer",
        description:
          "Resize Image is a private browser tool for fast image resizing, compression, and format conversion.",
        keywords: [
          "image resizer",
          "image compression",
          "convert jpg png",
          "browser tool",
          "private image editor",
        ],
      },
      geo: {
        summary:
          "Resize Image is a privacy-friendly browser tool for resizing, compressing, and converting images quickly.",
        prompts: [
          "What is the fastest private image resizer in the browser?",
          "How do I compress and convert images without uploading them?",
        ],
      },
      faq: [
        {
          question: "What does Resize Image do?",
          answer:
            "It lets users resize images, compress files, and convert formats directly in the browser.",
        },
        {
          question: "Why is it privacy-friendly?",
          answer:
            "It is designed as a browser tool, so it can be used for quick edits without adding a heavier workflow.",
        },
      ],
      store: {
        platform: "Web",
        listingName: "Resize Image",
        summary:
          "A private browser-based image tool for resizing, compression, format conversion, and everyday file preparation.",
        highlights: [
          "Private browser processing",
          "Image resize and compression",
          "Format conversion and PDF tasks",
        ],
        facts: [
          { label: "Category", value: "Browser tool" },
          { label: "Focus", value: "Privacy-friendly utility" },
        ],
      },
      narrative: {
        idea:
          "The idea is to give people fast image and PDF utilities directly in the browser, without making them learn a full editor.",
        need:
          "Creators and everyday users often need quick file prep tasks, but they do not want to upload files or install heavier software for tiny jobs.",
        targetUsers: [
          "Creators and marketers",
          "Ecommerce sellers",
          "Students and office users",
          "Anyone needing quick browser-based file prep",
        ],
        useCases: [
          "Resizing images for social or web upload",
          "Compressing files before sending them",
          "Converting formats for compatibility or transparency",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Time Converter",
        subtitle: "Compare time zones fast",
        keywords: [
          "time zone converter",
          "world clock",
          "meeting planner",
          "city comparison",
          "productivity tool",
        ],
        description:
          "Compare cities and time zones without the friction of manual calculations.",
      },
      seo: {
        title: "Time Converter | World Clock Comparison Tool",
        description:
          "Time Converter helps you compare cities and time zones quickly for meetings, travel, and planning.",
        keywords: [
          "time zone converter",
          "world clock",
          "meeting planner",
          "time comparison",
          "productivity app",
        ],
      },
      geo: {
        summary:
          "Time Converter is a productivity web tool for comparing cities and time zones without manual calculations.",
        prompts: [
          "How do I compare time zones quickly?",
          "What tool helps me plan meetings across cities?",
        ],
      },
      faq: [
        {
          question: "What is Time Converter for?",
          answer:
            "It helps people compare cities and time zones without doing manual time math.",
        },
        {
          question: "Who benefits most from it?",
          answer:
            "It is useful for distributed teams, travel planning, and anyone working across regions.",
        },
      ],
      store: {
        platform: "Web",
        listingName: "Time Converter",
        summary:
          "A world clock and time-zone comparison tool for global scheduling, meetings, and travel planning.",
        highlights: [
          "Multi-city comparison",
          "World clock planning",
          "Travel and meeting scheduling",
        ],
        facts: [
          { label: "Category", value: "Productivity web app" },
          { label: "Focus", value: "Time-zone coordination" },
        ],
      },
      narrative: {
        idea:
          "The idea is to remove the mental math from time zones and make cross-city planning feel immediate.",
        need:
          "Remote work, travel, and international calls all create timezone confusion, and people need a simple way to compare times fast.",
        targetUsers: [
          "Remote workers",
          "Distributed teams",
          "Frequent travelers",
          "Freelancers and client-facing teams",
        ],
        useCases: [
          "Scheduling meetings across cities",
          "Checking time differences before travel",
          "Avoiding AM/PM mistakes in global calls",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Tarot Destiny",
        subtitle: "Daily tarot guidance",
        keywords: [
          "tarot reading",
          "daily guidance",
          "self discovery",
          "ai tarot",
          "spiritual app",
        ],
        description:
          "Daily readings, self-discovery, and AI-guided reflection on mobile.",
      },
      seo: {
        title: "Tarot Destiny | AI Tarot Reading App",
        description:
          "Tarot Destiny is a mobile tarot app for daily readings, self-discovery, and AI-guided reflection.",
        keywords: [
          "tarot app",
          "AI tarot",
          "daily readings",
          "self-discovery",
          "mobile spiritual app",
        ],
      },
      geo: {
        summary:
          "Tarot Destiny is a mobile tarot app for daily readings, self-discovery, and AI-guided reflection.",
        prompts: [
          "What is Tarot Destiny used for?",
          "Which mobile apps offer AI-guided tarot reflection?",
        ],
      },
      faq: [
        {
          question: "What is Tarot Destiny?",
          answer:
            "Tarot Destiny is a mobile tarot app for daily readings, self-discovery, and AI-guided reflection.",
        },
        {
          question: "How does the AI part help?",
          answer:
            "AI-guided reflection adds a more personalized reading flow and helps users think through interpretations.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "Tarot Destiny: Daily Reading",
        summary:
          "Daily tarot readings, self-discovery, and AI-guided reflection on mobile.",
        highlights: [
          "Daily card guidance",
          "AI-guided reflection",
          "Mobile spiritual journaling",
        ],
        facts: [
          { label: "Category", value: "Mobile app" },
          { label: "Focus", value: "Spiritual guidance" },
        ],
      },
      narrative: {
        idea:
          "The idea was to turn tarot and reflection into a mobile habit that feels personal, guided, and easy to open every day.",
        need:
          "People looking for spiritual tools usually want privacy, immediacy, and a softer entry point than a dense esoteric app.",
        targetUsers: [
          "Mobile users interested in tarot and reflection",
          "People building a self-check-in habit",
          "Users who like guided spiritual or journaling apps",
        ],
        useCases: [
          "Daily card pulls",
          "Reflecting on a question or mood",
          "Tracking personal insights over time",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "PetPal",
        subtitle: "Play with your AI pet",
        keywords: [
          "virtual pet",
          "pet simulator",
          "ai pet",
          "chat pet",
          "cute pet game",
        ],
        description:
          "A playful virtual pet with chat, personality, and everyday interactions.",
      },
      seo: {
        title: "PetPal | AI Virtual Pet Simulator",
        description:
          "PetPal is a virtual pet simulator with chat, personality, and everyday interactive moments.",
        keywords: [
          "virtual pet simulator",
          "AI pet",
          "pet game",
          "chat pet",
          "interactive pet",
        ],
      },
      geo: {
        summary:
          "PetPal is a virtual pet simulator that blends chat, personality, and everyday interactions into a playful companion experience.",
        prompts: [
          "What makes PetPal different from a standard pet game?",
          "How does PetPal use chat and personality features?",
        ],
      },
      faq: [
        {
          question: "What is PetPal designed to do?",
          answer:
            "It is a virtual pet simulator with chat, personality, and playful everyday interactions.",
        },
        {
          question: "Is it more of a game or an AI companion?",
          answer:
            "It sits between both, acting like a playful pet game with a conversational AI companion feel.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "PetPal",
        summary:
          "A playful virtual pet simulator with chat, personality, and everyday interactions.",
        highlights: [
          "Virtual pet simulator",
          "Chat and personality",
          "Interactive companion feel",
        ],
        facts: [
          { label: "Category", value: "Mobile app" },
          { label: "Focus", value: "Pet simulation" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make a pocket companion that feels alive through conversation, not just a static mascot or animation.",
        need:
          "A lot of virtual pet apps are cute but shallow, so this product adds personality and interaction to create a more engaging routine.",
        targetUsers: [
          "Casual mobile users",
          "People who enjoy AI companions",
          "Users who want a light, playful app between tasks",
        ],
        useCases: [
          "Chatting with a virtual pet during breaks",
          "Checking in with a companion that reacts back",
          "Using a playful app as a daily mood lift",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "ScanQR",
        subtitle: "QR and barcode scanner",
        keywords: [
          "qr scanner",
          "barcode scanner",
          "scan codes",
          "fast scanner",
          "android ios scanner",
        ],
        description:
          "A focused QR code and barcode scanner for Android and iOS.",
      },
      seo: {
        title: "ScanQR | QR Code & Barcode Scanner",
        description:
          "ScanQR is a focused QR code and barcode scanner for Android and iOS with a simple, fast workflow.",
        keywords: [
          "QR code scanner",
          "barcode scanner",
          "scan QR codes",
          "mobile scanner",
          "Android iOS",
        ],
      },
      geo: {
        summary:
          "ScanQR is a mobile QR code and barcode scanner for Android and iOS with a simple, fast workflow.",
        prompts: [
          "What is ScanQR used for?",
          "Which mobile app scans QR codes and barcodes quickly?",
        ],
      },
      faq: [
        {
          question: "What can ScanQR scan?",
          answer:
            "ScanQR is built for QR codes and barcodes on Android and iOS.",
        },
        {
          question: "Why use ScanQR instead of a general camera app?",
          answer:
            "It focuses on a simple scanning workflow, which makes code scanning faster and easier.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "ScanQR - QR Code & Barcode",
        summary:
          "Fast QR and barcode scanning with image import, code generation, history, and link safety tools.",
        highlights: [
          "QR and barcode scanning",
          "QR code generation",
          "Scan history and link safety",
        ],
        facts: [
          { label: "Category", value: "Utilities / Productivity" },
          { label: "Focus", value: "Scanning and code creation" },
        ],
      },
      narrative: {
        idea:
          "The idea was to combine scanning, generating, and managing QR codes in one quick workflow instead of spreading the job across multiple apps.",
        need:
          "People scan QR codes for links, Wi-Fi, contacts, and products, and they also need a trustworthy way to create them and revisit history later.",
        targetUsers: [
          "Everyday phone users",
          "Store owners and event organizers",
          "Office teams and admins",
          "Anyone who creates or scans QR codes frequently",
        ],
        useCases: [
          "Scanning QR codes from packaging or posters",
          "Creating Wi-Fi or contact QR codes",
          "Keeping searchable scan history",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "FieldStamp GPS Camera",
        subtitle: "GPS photo stamps",
        keywords: [
          "gps camera",
          "photo stamp",
          "location photo",
          "field notes",
          "pdf export",
        ],
        description:
          "Capture photos with GPS stamps, project notes, and exportable location details.",
      },
      seo: {
        title: "FieldStamp GPS Camera | Location Photo App",
        description:
          "FieldStamp GPS Camera helps capture photos with GPS stamps, project notes, and exportable location details.",
        keywords: [
          "GPS camera",
          "photo stamp",
          "location photos",
          "field notes",
          "PDF export",
        ],
      },
      geo: {
        summary:
          "FieldStamp GPS Camera is a mobile app for field teams that captures photos with GPS stamps, notes, and exportable location details.",
        prompts: [
          "How do I add GPS stamps to field photos?",
          "Which app helps with location-based photo documentation?",
        ],
      },
      faq: [
        {
          question: "What does FieldStamp GPS Camera do?",
          answer:
            "It captures photos with GPS stamps, project notes, and exportable location details.",
        },
        {
          question: "Who is it made for?",
          answer:
            "It is useful for field teams, site documentation, inspections, and location-based reporting.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "FieldStamp: GPS Camera",
        summary:
          "The all-in-one GPS photo stamping app for professionals who need accurate field documentation and polished reports.",
        highlights: [
          "GPS-stamped photos",
          "Professional watermarks",
          "PDF field reports",
        ],
        facts: [
          { label: "Category", value: "Photo & Video / Business" },
          { label: "Focus", value: "Field documentation" },
          { label: "Version", value: "1.5" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make every field photo more useful by attaching time, place, and project context at the moment of capture.",
        need:
          "Teams in the field need proof and context, not just photos, and they need a faster way to package that evidence into reports.",
        targetUsers: [
          "Contractors and construction teams",
          "Inspectors and survey crews",
          "Property managers and engineers",
          "Agriculture and utility field teams",
        ],
        useCases: [
          "Construction progress reporting",
          "Site and property inspection records",
          "Incident, damage, or compliance documentation",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Smart Currency Converter",
        subtitle: "Fast FX conversion",
        keywords: [
          "currency converter",
          "exchange rates",
          "offline conversion",
          "foreign exchange",
          "money converter",
        ],
        description:
          "Fast exchange-rate conversion with useful offline calculations.",
      },
      seo: {
        title: "Smart Currency Converter | Fast FX App",
        description:
          "Smart Currency Converter is a fast exchange-rate app with offline calculations for travel and everyday use.",
        keywords: [
          "currency converter",
          "exchange rates",
          "FX app",
          "offline conversion",
          "money converter",
        ],
      },
      geo: {
        summary:
          "Smart Currency Converter is a mobile exchange-rate app with offline calculations for travel and everyday use.",
        prompts: [
          "What app helps convert currencies fast?",
          "Which currency converter works offline for travel?",
        ],
      },
      faq: [
        {
          question: "What does Smart Currency Converter do?",
          answer:
            "It converts exchange rates quickly and includes useful offline calculations.",
        },
        {
          question: "Who is it for?",
          answer:
            "It is useful for travelers, shoppers, and anyone who needs a quick FX reference.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Currency Unit Converter",
        summary:
          "An all-in-one currency companion for instant conversions, exchange rates, offline calculations, and bill splitting.",
        highlights: [
          "57 global currencies",
          "Offline conversion",
          "Bill splitting and history",
        ],
        facts: [
          { label: "Category", value: "Utilities / Business" },
          { label: "Focus", value: "Currency conversion" },
          { label: "Version", value: "1.2" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make currency conversion feel immediate and practical for everyday life, especially when traveling or shopping internationally.",
        need:
          "Users often need offline conversion, fast exchange checks, and bill splitting without opening a heavier finance app.",
        targetUsers: [
          "Travelers and expats",
          "Online shoppers",
          "Forex watchers",
          "Groups splitting bills internationally",
        ],
        useCases: [
          "Checking prices abroad",
          "Converting money offline while traveling",
          "Splitting a bill across multiple currencies",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Loan Estimator",
        subtitle: "Repayment calculator",
        keywords: [
          "loan calculator",
          "repayment estimate",
          "finance app",
          "pdf report",
          "amortization",
        ],
        description:
          "Estimate repayments and export clear loan calculation reports.",
      },
      seo: {
        title: "Loan Estimator | Repayment Calculator App",
        description:
          "Loan Estimator helps users estimate repayments and export clear loan calculation reports.",
        keywords: [
          "loan calculator",
          "repayment estimate",
          "finance app",
          "loan report",
          "amortization calculator",
        ],
      },
      geo: {
        summary:
          "Loan Estimator is a finance app for estimating repayments and exporting clear loan calculation reports.",
        prompts: [
          "Which app helps estimate loan repayments?",
          "How can I export a simple loan calculation report?",
        ],
      },
      faq: [
        {
          question: "What does Loan Estimator calculate?",
          answer:
            "It estimates repayments and helps users create clear loan calculation reports.",
        },
        {
          question: "Why is the PDF export useful?",
          answer:
            "The export makes it easier to share or save calculations as a simple report.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Easy Loan Estimator",
        summary:
          "Estimate loan payments, compare repayment methods, and review amortization schedules before making a decision.",
        highlights: [
          "Monthly payment estimates",
          "Amortization schedule",
          "Scenario comparison and history",
        ],
        facts: [
          { label: "Category", value: "Finance / Business" },
          { label: "Focus", value: "Loan planning" },
          { label: "Version", value: "0.0.1" },
        ],
      },
      narrative: {
        idea:
          "The idea is to help people see the true cost of borrowing before they commit to a loan or financing plan.",
        need:
          "Borrowers need clear monthly payments, total interest, and repayment comparisons before talking to a lender or signing terms.",
        targetUsers: [
          "People considering a mortgage or car loan",
          "Borrowers comparing personal or business financing",
          "Users who want amortization clarity",
        ],
        useCases: [
          "Estimating monthly repayment",
          "Comparing loan scenarios side by side",
          "Saving calculations for later review",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Time Converter",
        subtitle: "World clock planner",
        keywords: [
          "time zone converter",
          "world clock",
          "meeting planner",
          "travel clock",
          "timezone app",
        ],
        description:
          "Plan meetings and travel across global time zones from your phone.",
      },
      seo: {
        title: "Time Converter | World Clock Planner App",
        description:
          "Time Converter helps plan meetings and travel across global time zones from your phone.",
        keywords: [
          "time zone converter",
          "world clock",
          "meeting planner",
          "timezone app",
          "travel clock",
        ],
      },
      geo: {
        summary:
          "Time Converter is a mobile world clock app for planning meetings and travel across global time zones.",
        prompts: [
          "What app helps me compare time zones on my phone?",
          "How can I plan meetings across multiple cities?",
        ],
      },
      faq: [
        {
          question: "What is Time Converter — World Clock used for?",
          answer:
            "It helps users plan meetings and travel across global time zones from their phone.",
        },
        {
          question: "How is it different from a standard clock app?",
          answer:
            "It focuses on comparing cities and time zones rather than only showing the current local time.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Time Converter: World Clock",
        summary:
          "A smart and reliable time-zone converter and world clock app for everyday global scheduling.",
        highlights: [
          "Multi-city comparison",
          "Custom date and time lookup",
          "Drag-and-drop city ordering",
        ],
        facts: [
          { label: "Category", value: "Utilities / Productivity" },
          { label: "Focus", value: "Global scheduling" },
          { label: "Version", value: "1.1" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make timezone math disappear so planning across cities feels simple and fast on mobile.",
        need:
          "Remote work and travel create frequent timezone mistakes, and users need a clean world clock that removes friction.",
        targetUsers: [
          "Remote workers",
          "International teams",
          "Travel planners",
          "Anyone coordinating across cities",
        ],
        useCases: [
          "Scheduling across multiple time zones",
          "Checking local times before a call or trip",
          "Avoiding AM/PM mistakes in global planning",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "Quick Image PDF Resizer",
        subtitle: "Resize, compress, convert",
        keywords: [
          "image resizer",
          "pdf resizer",
          "compress files",
          "convert formats",
          "photo tools",
        ],
        description:
          "Resize images, compress files, convert formats, and handle common PDF tasks.",
      },
      seo: {
        title: "Quick Image PDF Resizer | All-in-One File Tools",
        description:
          "Quick Image PDF Resizer lets users resize images, compress files, convert formats, and handle common PDF tasks.",
        keywords: [
          "image resizer",
          "PDF tools",
          "compress files",
          "convert formats",
          "mobile file tools",
        ],
      },
      geo: {
        summary:
          "Quick Image PDF Resizer is a mobile file utility for resizing images, compressing files, converting formats, and handling common PDF tasks.",
        prompts: [
          "Which app resizes images and PDFs quickly?",
          "How do I compress files and convert formats on mobile?",
        ],
      },
      faq: [
        {
          question: "What can Quick Image PDF Resizer handle?",
          answer:
            "It can resize images, compress files, convert formats, and handle common PDF tasks.",
        },
        {
          question: "Why would someone use it?",
          answer:
            "It is a quick all-in-one utility for people who need simple mobile file processing.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Quick Image PDF Resizer",
        summary:
          "A fast, private, browser-based tool for resizing images, compressing files, converting formats, and handling common PDF tasks.",
        highlights: [
          "Resize and compress images",
          "Image and PDF conversion",
          "Merge, split, and background removal",
        ],
        facts: [
          { label: "Category", value: "Utilities / Productivity" },
          { label: "Focus", value: "Image and PDF tools" },
          { label: "Version", value: "1.1" },
        ],
      },
      narrative: {
        idea:
          "The idea is to put the most common image and PDF chores into one simple tool so people can finish quick jobs without desktop software.",
        need:
          "Students, marketers, sellers, and office users often need to resize, compress, or convert files quickly without a complicated workflow.",
        targetUsers: [
          "Students and office users",
          "Ecommerce sellers",
          "Designers and marketers",
          "Anyone prepping images or PDFs on mobile",
        ],
        useCases: [
          "Resizing and compressing images for upload",
          "Converting formats for compatibility",
          "Merging, splitting, or extracting PDF pages",
        ],
      },
    },
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
    marketing: {
      aso: {
        title: "World Time Buddy",
        subtitle: "Compare time zones in Chrome",
        keywords: [
          "time zone extension",
          "world clock",
          "chrome productivity",
          "meeting planner",
          "timezone compare",
        ],
        description:
          "A lightweight Chrome extension for comparing time zones while you work.",
      },
      seo: {
        title: "World Time Buddy | Chrome Time Zone Extension",
        description:
          "World Time Buddy is a lightweight Chrome extension for comparing time zones while you work.",
        keywords: [
          "Chrome extension",
          "time zone comparison",
          "world clock",
          "meeting planner",
          "productivity extension",
        ],
      },
      geo: {
        summary:
          "World Time Buddy is a Chrome extension for comparing time zones, planning meetings, and working across regions.",
        prompts: [
          "What Chrome extension helps compare time zones?",
          "How can I plan meetings across regions in the browser?",
        ],
      },
      faq: [
        {
          question: "What does World Time Buddy do?",
          answer:
            "It is a lightweight Chrome extension for comparing time zones while you work.",
        },
        {
          question: "Who is it best for?",
          answer:
            "It is best for distributed teams, remote workers, and anyone scheduling across time zones.",
        },
      ],
      store: {
        platform: "Chrome Web Store",
        listingName: "World Time Buddy",
        summary:
          "A Chrome extension for quickly comparing time zones while scheduling and working across regions.",
        highlights: [
          "Browser-based time comparison",
          "Fast scheduling support",
          "Remote-work friendly workflow",
        ],
        facts: [
          { label: "Category", value: "Chrome extension" },
          { label: "Focus", value: "Time-zone planning" },
        ],
      },
      narrative: {
        idea:
          "The idea is to keep time-zone comparison in the browser where people are already scheduling their work.",
        need:
          "Users need a quick reference when planning across regions, without leaving the page or doing mental calculations.",
        targetUsers: [
          "Remote teams",
          "Recruiters and coordinators",
          "Freelancers with international clients",
          "Anyone comparing cities while browsing",
        ],
        useCases: [
          "Checking meeting overlap in Chrome",
          "Planning calls across regions",
          "Comparing local times while working",
        ],
      },
    },
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

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What does Nexa Tech build?",
    answer:
      "Nexa Tech builds React Native apps, web products, open-source tools, and product showcases for real users.",
  },
  {
    question: "What is react-native-simple-fs?",
    answer:
      "react-native-simple-fs is a lightweight file-system library for React Native that supports storage, file access, and export flows.",
  },
  {
    question: "Do you ship both mobile and web products?",
    answer:
      "Yes. The portfolio includes mobile apps, web products, browser tools, and a React Native library showcase.",
  },
  {
    question: "How can someone contact the team?",
    answer:
      "The fastest way is by email at cs.nexatech@gmail.com, or through the GitHub and LinkedIn links in the footer.",
  },
];

export function getProjectSlug(project: Project) {
  return project.title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProjectPath(project: Project) {
  return `/work/${getProjectSlug(project)}`;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => getProjectSlug(project) === slug);
}

export function getRelatedProjects(project: Project, limit = 3) {
  return projects
    .filter((item) => item.title !== project.title)
    .filter((item) => item.category === project.category)
    .slice(0, limit);
}
