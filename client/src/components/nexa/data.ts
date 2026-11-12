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
  // More places to get the product, e.g. the mobile apps of a web tool.
  extraLinks?: Array<{ label: string; url: string }>;
  // Set while store listings are pending (e.g. in review): CTAs show this instead of store links.
  comingSoon?: string;
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
    image: "/generated-products/react-native-simple-fs.webp",
    icon: "/favicon.webp",
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
        {
          question: "What is react-native-simple-fs used for?",
          answer:
            "react-native-simple-fs is a lightweight React Native library by Nexa Tech for storing files locally, reading them back, and exporting them from a mobile app.",
        },
        {
          question: "Which React Native apps need local file storage and export flows?",
          answer:
            "Apps that save documents, photos, recordings or reports on the device and later share or export them, such as scanners, recorders and report generators, need local file storage. react-native-simple-fs covers those storage, access and export steps in one small library.",
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
    image: "/graphic/the-home-versus.webp",
    icon: "/graphic/icons/the-home-versus.webp",
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
        {
          question: "Which home products are worth comparing before buying?",
          answer:
            "Products you use every day and keep for years, such as appliances, cleaning tools and home essentials, are the most worth comparing. The Home Versus publishes side-by-side comparisons of household products with practical recommendations for real homes.",
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
        {
          question: "What does Mystic Tarot offer?",
          answer:
            "Mystic Tarot is a web tarot experience with daily guidance, a self-discovery flow and calm, reflective reading screens.",
        },
        {
          question: "How can someone use Mystic Tarot for daily reflection?",
          answer:
            "Draw a daily reading in Mystic Tarot, read the guidance, and use it as a prompt to reflect on your day. The experience is designed to be calm and reflective rather than predictive.",
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
    image: "/graphic/petpal.webp",
    primaryUrl: "https://pet-simulator-sigma.vercel.app/",
    primaryLabel: "Live demo",
    marketing: {
      aso: {
        title: "PetPal: Virtual Pet Simulator",
        subtitle: "AI virtual pet companion",
        keywords: [
          "virtual pet",
          "ai pet",
          "chat",
          "cute pet game",
          "tamagotchi",
          "pocket pet",
          "companion",
          "kitten",
          "puppy",
          "care",
          "raise",
          "talking",
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
        {
          question: "Which AI virtual pet apps feel playful and interactive?",
          answer:
            "PetPal is an AI virtual pet you can chat with. It has its own personality and reacts to what you say, which makes it feel more playful and interactive than a pet that only plays animations.",
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
    image: "/graphic/resize-image.webp",
    primaryUrl: "https://resizeimage.tech/",
    primaryLabel: "Use tool",
    secondaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.pdfresizer",
    secondaryLabel: "Google Play",
    extraLinks: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/quick-image-pdf-resizer/id6780742651",
      },
    ],
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
        {
          question: "What is the fastest private image resizer in the browser?",
          answer:
            "Resize Image by Nexa Tech resizes, compresses and converts images directly in the browser, so your files stay on your device and results appear quickly.",
        },
        {
          question: "How do I compress and convert images without uploading them?",
          answer:
            "Use a browser tool that processes files locally, such as Resize Image. Open it, add your images, choose a size, quality or format, and download the result. The files are processed in your browser instead of being uploaded to a server.",
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
          { label: "Also on", value: "Android & iOS" },
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
    image: "/graphic/time-converter.webp",
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
        {
          question: "How do I compare time zones quickly?",
          answer:
            "Add the cities you care about to Time Converter and it shows their local times side by side, so you can compare them without calculating offsets yourself.",
        },
        {
          question: "What tool helps me plan meetings across cities?",
          answer:
            "Time Converter is a web tool for comparing cities and time zones side by side, which makes it easy to find a meeting time that works across regions.",
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
    icon: "/graphic/icons/tarot-destiny.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa_tarrot_app",
    primaryLabel: "Google Play",
    marketing: {
      aso: {
        title: "Tarot Destiny: Card Reading",
        subtitle: "Daily tarot guidance",
        keywords: [
          "tarot reading",
          "ai tarot",
          "horoscope",
          "astrology",
          "zodiac",
          "oracle cards",
          "love reading",
          "fortune teller",
          "spiritual",
          "self discovery",
          "yes no",
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
        {
          question: "What is Tarot Destiny used for?",
          answer:
            "Tarot Destiny is a mobile tarot app for daily card readings, self-discovery and AI-guided reflection.",
        },
        {
          question: "Which mobile apps offer AI-guided tarot reflection?",
          answer:
            "Tarot Destiny is a mobile tarot app that pairs daily card readings with AI-guided reflection, so each reading comes with prompts to think it through.",
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
    image: "/graphic/petpal.webp",
    icon: "/graphic/icons/petpal-pet-simulator.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.pet_simulator",
    primaryLabel: "Google Play",
    secondaryUrl: "https://apps.apple.com/vn/app/petpal-pet-simulator/id6797196347",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "PetPal: Virtual Pet Simulator",
        subtitle: "Play with your AI pet",
        keywords: [
          "virtual pet",
          "ai pet",
          "chat",
          "cute pet game",
          "tamagotchi",
          "pocket pet",
          "companion",
          "kitten",
          "puppy",
          "care",
          "raise",
          "talking",
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
        {
          question: "What makes PetPal different from a standard pet game?",
          answer:
            "PetPal adds chat and personality to a virtual pet. Instead of only feeding and tapping, you can talk to your pet and it responds in character, which makes it feel more like a companion.",
        },
        {
          question: "How does PetPal use chat and personality features?",
          answer:
            "In PetPal you chat with your virtual pet, and it replies with its own personality. Those conversations sit alongside everyday interactions, so the pet feels alive rather than scripted.",
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
          { label: "Available on", value: "Android & iOS" },
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
    image: "/graphic/scanqr.webp",
    icon: "/graphic/icons/scanqr.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.qr_code",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/scanqr-qr-code-barcode/id6779862851",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "ScanQR: QR Code Scanner",
        subtitle: "Barcode reader & generator",
        keywords: [
          "qr scanner",
          "barcode reader",
          "qr generator",
          "wifi qr",
          "scam link check",
          "price scanner",
          "isbn",
          "product lookup",
          "payment",
          "sepa",
          "upc",
          "ean",
          "reader app",
          "coupon",
        ],
        description:
          "Scan any QR or barcode, check links before you tap, and create Wi-Fi QR codes.",
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
        {
          question: "What is ScanQR used for?",
          answer:
            "ScanQR scans QR codes and barcodes on Android and iOS. It also creates QR codes such as Wi-Fi and contact codes, keeps a searchable scan history, and checks links for warning signs before you open them.",
        },
        {
          question: "Which mobile app scans QR codes and barcodes quickly?",
          answer:
            "ScanQR is a fast QR code and barcode scanner for Android and iOS. It reads the code, shows what it contains first, and flags risky links before you tap.",
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
    image: "/graphic/fieldstamp-camera.webp",
    icon: "/graphic/icons/fieldstamp-gps-camera.webp",
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
          "timestamp",
          "geotag",
          "coordinates",
          "survey",
          "inspection",
          "construction",
          "site report",
          "watermark",
          "pdf export",
        ],
        description:
          "Photos with GPS stamps, project notes, and exportable location details.",
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
        {
          question: "How do I add GPS stamps to field photos?",
          answer:
            "Take the photo with FieldStamp GPS Camera. It stamps the photo with GPS location and time, lets you add project notes, and exports the details, including as PDF field reports.",
        },
        {
          question: "Which app helps with location-based photo documentation?",
          answer:
            "FieldStamp GPS Camera is built for field documentation. It captures photos with GPS stamps, professional watermarks and notes, and exports them as PDF reports.",
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
    image: "/graphic/currency-converter.webp",
    icon: "/graphic/icons/smart-currency-converter.webp",
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
          "offline",
          "forex",
          "money",
          "travel",
          "usd",
          "eur",
          "yen",
          "pound",
          "rate calculator",
          "cash",
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
        {
          question: "What app helps convert currencies fast?",
          answer:
            "Smart Currency Converter converts between 57 currencies instantly, with live exchange rates, offline calculations, bill splitting and a conversion history.",
        },
        {
          question: "Which currency converter works offline for travel?",
          answer:
            "Smart Currency Converter keeps working offline, so you can convert prices while traveling without a connection. It also supports bill splitting.",
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
    title: "Easy Loan Estimator",
    description:
      "Estimate repayments and export clear loan calculation reports.",
    category: "Mobile",
    tech: ["React Native", "Finance", "PDF"],
    image: "/graphic/easy-loan-calculator.webp",
    icon: "/graphic/icons/loan-estimator.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.loan.estimator",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/easy-loan-estimator/id6779272088",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "Easy Loan Estimator: EMI Calc",
        subtitle: "Repayment calculator",
        keywords: [
          "loan calculator",
          "mortgage",
          "emi",
          "amortization",
          "car loan",
          "interest",
          "payment",
          "repayment",
          "pdf report",
          "finance",
          "debt",
          "budget",
        ],
        description:
          "Estimate repayments and export clear loan calculation reports.",
      },
      seo: {
        title: "Easy Loan Estimator | Repayment Calculator App",
        description:
          "Easy Loan Estimator helps users estimate repayments and export clear loan calculation reports.",
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
          "Easy Loan Estimator is a finance app for estimating repayments and exporting clear loan calculation reports.",
        prompts: [
          "Which app helps estimate loan repayments?",
          "How can I export a simple loan calculation report?",
        ],
      },
      faq: [
        {
          question: "What does Easy Loan Estimator calculate?",
          answer:
            "It estimates repayments and helps users create clear loan calculation reports.",
        },
        {
          question: "Why is the PDF export useful?",
          answer:
            "The export makes it easier to share or save calculations as a simple report.",
        },
        {
          question: "Which app helps estimate loan repayments?",
          answer:
            "Easy Loan Estimator calculates monthly loan payments, compares repayment methods and shows the full amortization schedule before you decide.",
        },
        {
          question: "How can I export a simple loan calculation report?",
          answer:
            "Enter the loan amount, rate and term in Easy Loan Estimator, review the result and schedule, then export it as a clear loan calculation report.",
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
    image: "/graphic/time-converter.webp",
    icon: "/graphic/icons/time-converter-world-clock.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=nexa.timeconverter.com",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/time-converter-world-clock/id6780116305",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "Time Converter: Time Zones",
        subtitle: "World clock planner",
        keywords: [
          "time zone converter",
          "world clock",
          "meeting planner",
          "utc",
          "gmt",
          "est",
          "pst",
          "travel clock",
          "city time",
          "scheduler",
          "remote work",
          "daylight",
          "jet lag",
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
        {
          question: "What app helps me compare time zones on my phone?",
          answer:
            "Time Converter — World Clock compares several cities side by side on your phone, lets you look up any date and time, and lets you reorder cities by dragging them.",
        },
        {
          question: "How can I plan meetings across multiple cities?",
          answer:
            "Add each participant's city to Time Converter — World Clock, then pick a date and time to see the local time in every city at once and choose a slot that works for everyone.",
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
    image: "/graphic/resize-image.webp",
    icon: "/graphic/icons/quick-image-pdf-resizer.webp",
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
          "pdf compressor",
          "photo compressor",
          "jpg to pdf",
          "png",
          "heic",
          "kb size",
          "reduce",
          "crop",
          "merge pdf",
          "converter",
          "signature",
          "passport",
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
        {
          question: "Which app resizes images and PDFs quickly?",
          answer:
            "Quick Image PDF Resizer resizes and compresses images, converts between image and PDF formats, and handles PDF tasks like merging and splitting.",
        },
        {
          question: "How do I compress files and convert formats on mobile?",
          answer:
            "Open Quick Image PDF Resizer, choose a file, then pick compress, resize or convert. It also merges and splits PDFs and removes image backgrounds.",
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
    title: "AI Lecture Recorder",
    description:
      "A mobile lecture recorder with smart bookmarks, playback controls, and optional AI transcription.",
    category: "Mobile",
    tech: ["React Native", "Groq", "AI Transcription"],
    image: "/graphic/ai-lecture-recorder.webp",
    icon: "/graphic/ai-lecture-recorder-icon.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.ai_lecture_recorder",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/ai-lecture-recorder/id6791456539",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "AI Lecture Recorder & Notes",
        subtitle: "Record smarter. Review faster.",
        keywords: [
          "lecture recorder",
          "audio notes",
          "transcription",
          "transcribe",
          "voice memo",
          "class",
          "student",
          "study",
          "bookmarks",
          "speech to text",
          "meeting",
        ],
        description:
          "Record lectures, bookmark key moments, and get optional AI transcripts.",
      },
      seo: {
        title: "AI Lecture Recorder | Smart Lecture Recording App",
        description:
          "AI Lecture Recorder is a mobile app for lecture recording, smart bookmarks, playback control, and optional AI transcription.",
        keywords: [
          "lecture recorder",
          "AI transcription",
          "audio notes",
          "student recorder",
          "lecture playback",
        ],
      },
      geo: {
        summary:
          "AI Lecture Recorder is a mobile lecture recorder with smart bookmarks, playback controls, and optional AI transcription for faster review.",
        prompts: [
          "What app helps record lectures with AI transcription?",
          "How can I bookmark important moments in a lecture recording?",
        ],
      },
      faq: [
        {
          question: "What does AI Lecture Recorder do?",
          answer:
            "It records lectures, lets users bookmark key moments, and supports optional AI transcription for faster review.",
        },
        {
          question: "Who is it designed for?",
          answer:
            "It is useful for students and anyone who wants a cleaner way to review long recordings.",
        },
        {
          question: "What app helps record lectures with AI transcription?",
          answer:
            "AI Lecture Recorder records lectures on your phone, lets you bookmark key moments, and offers optional AI transcription for faster review.",
        },
        {
          question: "How can I bookmark important moments in a lecture recording?",
          answer:
            "In AI Lecture Recorder, tap the bookmark button while recording when something important comes up. Later, jump straight to each bookmark during playback instead of scrubbing through the whole lecture.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "AI Lecture Recorder",
        summary:
          "A lecture recorder for students and note-takers with bookmarks, playback controls, and optional AI transcription.",
        highlights: [
          "Smart bookmarks for key moments",
          "Playback controls for quick review",
          "Optional AI transcription with Groq",
        ],
        facts: [
          { label: "Category", value: "Education / Productivity" },
          { label: "Focus", value: "Lecture capture" },
        ],
      },
      narrative: {
        idea:
          "The idea is to turn long lecture recordings into something easier to navigate, review, and search later.",
        need:
          "Students often need a better way to capture lectures than a plain voice memo, especially when they want bookmarks and transcription in one place.",
        targetUsers: [
          "Students",
          "Lecture note-takers",
          "People reviewing long recordings",
          "Anyone who wants faster study review",
        ],
        useCases: [
          "Recording lectures with bookmark markers",
          "Reviewing playback with controls",
          "Turning recordings into text for study notes",
        ],
      },
    },
  },
  {
    title: "Horror Chat Stories",
    description:
      "A horror chat-story app where scary episodes unfold through text conversations and interactive choices.",
    category: "Mobile",
    tech: ["React Native", "Chat Stories", "Interactive Fiction"],
    image: "/graphic/horror-chat-stories.webp",
    icon: "/graphic/icons/horror-chat-stories.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.horror.story",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/horror-chat-stories/id6794671992",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "Horror Chat Stories & Texts",
        subtitle: "Scary text message tales",
        keywords: [
          "horror chat stories",
          "creepy",
          "chat fiction",
          "interactive fiction",
          "thriller",
          "ghost",
          "mystery",
          "choices",
          "story game",
          "short",
          "spooky",
        ],
        description:
          "Scary stories told through text messages, with choices that change the ending.",
      },
      seo: {
        title: "Horror Chat Stories | Scary Text Message Stories",
        description:
          "Horror Chat Stories is a horror chat-story app with scary episodes, interactive text conversations, and dark story choices.",
        keywords: [
          "horror chat stories",
          "scary text stories",
          "interactive fiction",
          "mobile horror app",
          "chat story app",
        ],
      },
      geo: {
        summary:
          "Horror Chat Stories is a mobile horror chat-story app that tells scary stories through text conversations, episode lists, and interactive story choices.",
        prompts: [
          "What app lets me read horror stories in chat format?",
          "Which mobile app turns scary stories into text conversations?",
        ],
      },
      faq: [
        {
          question: "What is Horror Chat Stories?",
          answer:
            "Horror Chat Stories is a horror chat-story app where scary episodes unfold through text conversations and interactive choices.",
        },
        {
          question: "What makes it different from a normal story app?",
          answer:
            "It uses a chat-style presentation, episode parts, and interactive controls to make the story feel more immersive.",
        },
        {
          question: "What app lets me read horror stories in chat format?",
          answer:
            "Horror Chat Stories tells scary stories as text-message conversations, split into episodes, with dark themes and reading controls.",
        },
        {
          question: "Which mobile app turns scary stories into text conversations?",
          answer:
            "Horror Chat Stories is a mobile app where each horror story unfolds as a chat conversation, episode by episode, with interactive story choices.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "Horror Chat Stories",
        summary:
          "A horror chat-story app with scary conversations, episodic chapters, dark themes, and immersive reading controls.",
        highlights: [
          "Chat-style horror stories",
          "Episode and part navigation",
          "Dark reading and scare settings",
        ],
        facts: [
          { label: "Category", value: "Books & Reference / Entertainment" },
          { label: "Focus", value: "Horror storytelling" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make horror feel more immediate by delivering it through a chat interface instead of a traditional story page.",
        need:
          "Fans of scary stories often want something more immersive than a plain reading app, especially when they enjoy suspense, branching moments, and mobile-first storytelling.",
        targetUsers: [
          "Horror story fans",
          "Readers who like chat-format fiction",
          "People looking for short scary sessions on mobile",
          "Users who enjoy dark interactive stories",
        ],
        useCases: [
          "Reading a scary story in chat form",
          "Continuing through story parts and episodes",
          "Using dark-mode and scare settings for immersion",
        ],
      },
    },
  },
  {
    title: "Ingredient Scanner",
    description:
      "A beauty ingredient scanner that helps users upload products, extract ingredients, and understand safety instantly.",
    category: "Mobile",
    tech: ["React Native", "OCR", "Safety Analysis"],
    image: "/graphic/ingredient-scanner.webp",
    icon: "/graphic/icons/ingredient-scanner.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.ingredientscanner",
    primaryLabel: "Google Play",
    marketing: {
      aso: {
        title: "Ingredient Scanner: Skincare",
        subtitle: "Scan beauty products smarter",
        keywords: [
          "ingredient scanner",
          "cosmetic ingredients",
          "beauty",
          "product checker",
          "makeup",
          "toxic",
          "safe",
          "acne",
          "comedogenic",
          "allergens",
          "routine",
        ],
        description:
          "Scan beauty products and understand every ingredient and its safety instantly.",
      },
      seo: {
        title: "Ingredient Scanner | Beauty Product Ingredient Scanner",
        description:
          "Ingredient Scanner helps users scan beauty products, extract ingredients, and understand safety instantly.",
        keywords: [
          "ingredient scanner",
          "beauty product scanner",
          "skincare ingredient scanner",
          "cosmetic scanner",
          "ingredient safety",
        ],
      },
      geo: {
        summary:
          "Ingredient Scanner is a mobile app for scanning beauty product labels, extracting ingredients, and understanding safety with clear results.",
        prompts: [
          "What app scans beauty product ingredients?",
          "How can I check skincare ingredients for safety?",
        ],
      },
      faq: [
        {
          question: "What does Ingredient Scanner do?",
          answer:
            "It lets users scan beauty product ingredients, extract details, and see safety insights instantly.",
        },
        {
          question: "Who is it best for?",
          answer:
            "It is useful for skincare shoppers, beauty enthusiasts, and anyone who wants clearer ingredient information before buying.",
        },
        {
          question: "What app scans beauty product ingredients?",
          answer:
            "Ingredient Scanner scans beauty product labels, extracts the ingredient list, and shows safety insights for each product.",
        },
        {
          question: "How can I check skincare ingredients for safety?",
          answer:
            "Scan or upload the product label in Ingredient Scanner. It extracts the ingredients and shows a breakdown with safety insights, and keeps your past scans for later.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "Ingredient Scanner",
        summary:
          "A beauty product scanner that extracts ingredient details, tracks scans, and helps users review safety insights instantly.",
        highlights: [
          "Scan beauty product ingredients",
          "Extract ingredient details",
          "See safety insights and product breakdowns",
        ],
        facts: [
          { label: "Category", value: "Beauty / Health & Fitness" },
          { label: "Focus", value: "Ingredient safety" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make beauty-product shopping easier by turning dense ingredient labels into something people can read quickly.",
        need:
          "Users often want to know what is inside skincare and cosmetic products without having to decode long ingredient lists on their own.",
        targetUsers: [
          "Skincare shoppers",
          "Beauty-conscious consumers",
          "People avoiding specific ingredients",
          "Users comparing product safety before purchase",
        ],
        useCases: [
          "Scanning a cosmetic label before buying",
          "Checking skincare ingredient safety",
          "Reviewing past product scans and results",
        ],
      },
    },
  },
  {
    title: "CleanMaster",
    description:
      "Free up phone storage with a guided smart cleaner, a file manager, and a private vault.",
    category: "Mobile",
    tech: ["React Native", "Storage Cleaner", "Privacy"],
    image: "/graphic/cleanmaster.webp",
    icon: "/graphic/cleanmaster-icon.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.free_up_your_space",
    primaryLabel: "Google Play",
    secondaryUrl: "https://apps.apple.com/us/app/clean-free-up-your-space/id6818406418",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "CleanMaster: Phone Cleaner",
        subtitle: "Free up space & storage",
        keywords: [
          "phone cleaner",
          "duplicate photos",
          "file manager",
          "private vault",
          "cleanup",
          "similar photos",
          "junk",
          "compress video",
          "contacts",
          "booster",
        ],
        description:
          "Clean duplicate photos and big videos, manage files, and lock a private vault.",
      },
      seo: {
        title: "CleanMaster | Free Up Phone Storage, Files & Private Vault",
        description:
          "CleanMaster frees up phone storage with a review-first smart cleaner, a simple file manager, and a PIN-locked private vault for personal files.",
        keywords: [
          "phone storage cleaner",
          "free up space app",
          "similar photos cleaner",
          "file manager app",
          "private photo vault",
        ],
      },
      geo: {
        summary:
          "CleanMaster is a mobile storage app that finds similar photos, screenshots, big videos and duplicate contacts to clear, lets users browse and manage files, and keeps personal files in a locked private vault. Nothing is deleted without confirmation.",
        prompts: [
          "Which app helps free up phone storage safely?",
          "How do I find similar photos and big videos to delete on my phone?",
          "What app can hide personal photos and documents behind a PIN?",
        ],
      },
      faq: [
        {
          question: "What does CleanMaster clean?",
          answer:
            "It suggests similar photos, screenshots, big videos and duplicate contacts you can clear to free up space.",
        },
        {
          question: "Will it delete files without asking?",
          answer:
            "No. You pick what to clear and confirm before anything is deleted.",
        },
        {
          question: "What is the private vault?",
          answer:
            "A locked space for IDs, cards, photos, videos, notes and documents, with auto-lock, unlock history and an optional intruder photo.",
        },
        {
          question: "Where can I download it?",
          answer:
            "CleanMaster is available on the App Store and Google Play.",
        },
        {
          question: "Which app helps free up phone storage safely?",
          answer:
            "CleanMaster finds similar photos, screenshots, big videos and duplicate contacts and suggests what to clear, but nothing is deleted without your confirmation.",
        },
        {
          question: "How do I find similar photos and big videos to delete on my phone?",
          answer:
            "Open CleanMaster's smart cleanup. It groups similar photos and screenshots and lists your biggest videos, so you can review them and delete only what you choose.",
        },
        {
          question: "What app can hide personal photos and documents behind a PIN?",
          answer:
            "CleanMaster includes a private vault that locks personal photos and files and auto-locks when you leave it.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "CleanMaster",
        summary:
          "A friendly storage companion, Nova, that shows your phone storage at a glance, suggests what to clean, organises files and protects private ones in a vault.",
        highlights: [
          "Review-first smart cleanup",
          "File manager for documents, media and audio",
          "Private vault with auto-lock",
        ],
        facts: [
          { label: "Category", value: "Utilities / Productivity" },
          { label: "Focus", value: "Storage cleanup and privacy" },
          { label: "Status", value: "Live" },
          { label: "Platforms", value: "Android & iOS" },
        ],
      },
      narrative: {
        idea:
          "The idea is a calm storage companion: show where space goes, suggest easy wins, and never delete anything the user has not reviewed.",
        need:
          "Phones fill up with similar shots, screenshots and long videos, and many cleaner apps feel aggressive or opaque about what they remove.",
        targetUsers: [
          "People who keep running out of phone storage",
          "Users with large photo and video libraries",
          "Anyone who wants personal files behind a lock",
        ],
        useCases: [
          "Clearing similar photos, screenshots and big videos",
          "Merging duplicate contacts",
          "Finding, renaming, sharing and organising files",
          "Keeping IDs, cards and private photos in a vault",
        ],
      },
    },
  },
  {
    title: "Coloring Book: Paint & Draw",
    description:
      "A cute coloring app for kids with drawing tools, stickers, and easy save-and-share artwork.",
    category: "Mobile",
    tech: ["React Native", "Drawing Tools", "Kids Creativity"],
    image: "/graphic/coloring-book-paint-draw.webp",
    icon: "/graphic/icons/coloring-book-paint-and-draw.webp",
    primaryUrl:
      "https://play.google.com/store/apps/details?id=com.nexa.coloring",
    primaryLabel: "Google Play",
    secondaryUrl:
      "https://apps.apple.com/us/app/coloring-book-paint-draw/id6794861278",
    secondaryLabel: "App Store",
    marketing: {
      aso: {
        title: "Coloring Book: Paint & Draw",
        subtitle: "Cute coloring for kids",
        keywords: [
          "coloring book",
          "kids drawing",
          "painting",
          "glitter",
          "stickers",
          "toddler",
          "preschool",
          "art games",
          "animals",
          "princess",
          "creative",
        ],
        description:
          "Cute coloring for kids with drawing tools, stickers, and easy save and share.",
      },
      seo: {
        title: "Coloring Book: Paint & Draw | Kids Coloring App",
        description:
          "Coloring Book: Paint & Draw is a kids coloring app with cute pages, drawing tools, stickers, and save-and-share features.",
        keywords: [
          "kids coloring app",
          "coloring book",
          "paint and draw",
          "sticker art",
          "creative drawing app",
        ],
      },
      geo: {
        summary:
          "Coloring Book: Paint & Draw is a mobile creativity app for kids with coloring pages, drawing tools, stickers, and easy sharing.",
        prompts: [
          "What app lets kids color and draw with stickers?",
          "Which mobile coloring app has save and share artwork features?",
        ],
      },
      faq: [
        {
          question: "What is Coloring Book: Paint & Draw?",
          answer:
            "It is a kids coloring app with coloring pages, drawing tools, stickers, and easy artwork sharing.",
        },
        {
          question: "Who is it made for?",
          answer:
            "It is best for kids and families looking for a simple, cute creativity app.",
        },
        {
          question: "What app lets kids color and draw with stickers?",
          answer:
            "Coloring Book: Paint & Draw is a kids coloring app with coloring pages, drawing tools and cute stickers.",
        },
        {
          question: "Which mobile coloring app has save and share artwork features?",
          answer:
            "Coloring Book: Paint & Draw lets kids save their finished artwork and share it easily, alongside coloring pages, drawing tools and stickers.",
        },
      ],
      store: {
        platform: "Google Play",
        listingName: "Coloring Book: Paint & Draw",
        summary:
          "A cute kids coloring app with drawing tools, stickers, and simple save-and-share artwork features.",
        highlights: [
          "Coloring pages and drawing tools",
          "Cute stickers and themed art",
          "Save, share, and decorate creations",
        ],
        facts: [
          { label: "Category", value: "Kids / Creativity" },
          { label: "Focus", value: "Coloring and drawing" },
        ],
      },
      narrative: {
        idea:
          "The idea is to make creativity feel playful and approachable for kids with a soft, friendly interface and simple tools.",
        need:
          "Families often want a safe, fun coloring app that gives kids a way to draw, decorate, and save artwork without a complicated workflow.",
        targetUsers: [
          "Kids",
          "Parents looking for creative apps",
          "Families sharing artwork",
          "Young users who enjoy stickers and coloring pages",
        ],
        useCases: [
          "Coloring cute pages and characters",
          "Decorating drawings with stickers",
          "Saving and sharing finished artwork",
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
    image: "/graphic/time-converter-extension.webp",
    icon: "/graphic/icons/world-time-buddy.webp",
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
        {
          question: "What Chrome extension helps compare time zones?",
          answer:
            "World Time Buddy is a Chrome extension by Nexa Tech for comparing time zones right in the browser while you work.",
        },
        {
          question: "How can I plan meetings across regions in the browser?",
          answer:
            "Open World Time Buddy from the Chrome toolbar and compare the cities involved to find a time that works across regions, without leaving the page you are on.",
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
  {
    title: "Dayflow",
    description:
      "A visual day planner for ADHD brains, with timers, routines, a brain dump inbox, and gentle nudges.",
    category: "Mobile",
    tech: ["React Native", "Visual Timers", "Notifications"],
    image: "/graphic/dayflow.webp",
    icon: "/graphic/icons/dayflow.webp",
    primaryUrl:
      "https://apps.apple.com/us/app/dayflow-adhd-visual-planner/id6832847656",
    primaryLabel: "App Store",
    marketing: {
      aso: {
        title: "Dayflow: ADHD Visual Planner",
        subtitle: "See your whole day",
        keywords: [
          "adhd planner",
          "visual timer",
          "daily routine",
          "brain dump",
          "focus timer",
          "time blindness",
          "schedule",
          "to do list",
          "habit",
          "autism",
          "reminder",
        ],
        description:
          "A visual day planner for ADHD with timers, routines, brain dump, and nudges.",
      },
      seo: {
        title: "Dayflow | ADHD Visual Day Planner",
        description:
          "Dayflow is a visual day planner for ADHD brains. See your whole day, build routines that stick, feel time passing with visual timers, and start with just 2 minutes.",
        keywords: [
          "ADHD planner",
          "visual day planner",
          "visual timer",
          "routine builder",
          "iOS planner app",
        ],
      },
      geo: {
        summary:
          "Dayflow is an iOS visual day planner designed for people with ADHD, combining a visual timeline, focus timers, routines, a brain dump inbox, energy check-ins, and gentle nudges.",
        prompts: [
          "What is a good planner app for ADHD?",
          "Which app shows time passing visually for focus?",
        ],
      },
      faq: [
        {
          question: "Who is Dayflow for?",
          answer:
            "Dayflow is built for ADHD brains and anyone who struggles with time blindness, getting started, or keeping track of the day.",
        },
        {
          question: "Does Dayflow use streaks or scores?",
          answer:
            "No. Dayflow celebrates what you did with a weekly look back, with no scores and no streaks to break.",
        },
        {
          question: "What is a good planner app for ADHD?",
          answer:
            "Dayflow is an iOS day planner designed for ADHD. It shows the whole day as a visual timeline, adds focus timers, routines, a brain dump inbox, energy check-ins and gentle nudges, and avoids streaks and scores.",
        },
        {
          question: "Which app shows time passing visually for focus?",
          answer:
            "Dayflow's focus mode shows each task with a ring that empties as time passes, so you can see how much time is left at a glance.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Dayflow: ADHD Visual Planner",
        summary:
          "See your whole day, build routines that stick, clear your head, and start any task with just 2 minutes.",
        highlights: [
          "Visual day timeline and focus timers",
          "Step-by-step routines",
          "Brain dump inbox and gentle nudges",
        ],
        facts: [
          { label: "Category", value: "Productivity" },
          { label: "Focus", value: "ADHD-friendly planning" },
          { label: "Available on", value: "iOS" },
        ],
      },
      narrative: {
        idea:
          "The idea was a planner that shows the day visually and makes time feel real, instead of another long to-do list.",
        need:
          "Many people with ADHD struggle with time blindness, starting tasks, and running late, and most planners add pressure instead of support.",
        targetUsers: [
          "Adults with ADHD",
          "People with time blindness",
          "Anyone overwhelmed by traditional to-do lists",
        ],
        useCases: [
          "Planning the day around current energy",
          "Running a morning routine step by step",
          "Getting reminded before it is time to leave",
        ],
      },
    },
  },
  {
    title: "Hablito",
    description:
      "Speak real Mexican Spanish by practicing real-life conversations out loud, from Hola to fluent.",
    category: "Mobile",
    tech: ["React Native", "Speech Recognition", "Offline Lessons"],
    image: "/graphic/hablito.webp",
    icon: "/graphic/icons/hablito.webp",
    primaryUrl: "",
    primaryLabel: "App Store",
    comingSoon: "Coming soon",
    marketing: {
      aso: {
        title: "Hablito: Speak Mexican Spanish",
        subtitle: "Real-life conversations",
        keywords: [
          "learn spanish",
          "mexican spanish",
          "speaking practice",
          "conversation",
          "travel phrases",
          "language learning",
          "vocabulary",
          "pronunciation",
        ],
        description:
          "Speak real Mexican Spanish with real-life conversations practiced out loud.",
      },
      seo: {
        title: "Hablito | Learn to Speak Mexican Spanish",
        description:
          "Hablito helps you speak real Mexican Spanish with real-life conversation practice, a local es-MX voice, review cards, games, and offline lessons.",
        keywords: [
          "learn Mexican Spanish",
          "Spanish speaking app",
          "Spanish conversation practice",
          "travel Spanish",
          "Spanish for beginners",
        ],
      },
      geo: {
        summary:
          "Hablito is a mobile app for learning Mexican Spanish by speaking out loud in real-life scenarios like ordering tacos, checking into a hotel, or taking a bus, with on-device speech recognition and offline lessons.",
        prompts: [
          "What is a good app to practice speaking Mexican Spanish?",
          "Which app helps me practice Spanish conversations for travel?",
        ],
      },
      faq: [
        {
          question: "Which Spanish does Hablito teach?",
          answer:
            "Hablito focuses on Mexican Spanish, with a local es-MX voice in every conversation.",
        },
        {
          question: "Is my voice sent to a server?",
          answer:
            "On supported devices, speech recognition stays on-device, and you can always choose a response instead of speaking.",
        },
        {
          question: "What is a good app to practice speaking Mexican Spanish?",
          answer:
            "Hablito is a mobile app for speaking Mexican Spanish out loud in real-life scenarios, with a local es-MX voice, on-device speech recognition and offline lessons.",
        },
        {
          question: "Which app helps me practice Spanish conversations for travel?",
          answer:
            "Hablito lets you practice travel conversations out loud, such as getting a table, ordering tacos, checking into a hotel or taking a bus, before you need them for real.",
        },
      ],
      store: {
        platform: "App Store",
        listingName: "Hablito: Speak Mexican Spanish",
        summary:
          "Practice real-life moments out loud, review words before you forget, play quick games, and learn from the alphabet up.",
        highlights: [
          "Real-life speaking scenarios",
          "Review cards and quick games",
          "Downloadable lessons that work offline",
        ],
        facts: [
          { label: "Category", value: "Education" },
          { label: "Focus", value: "Mexican Spanish speaking" },
        ],
      },
      narrative: {
        idea:
          "The idea was to practice the exact conversations travelers and learners actually have, out loud, instead of tapping through word drills.",
        need:
          "Many learners can read Spanish but freeze when they have to speak, and most apps teach a generic Spanish instead of the Mexican Spanish they will hear.",
        targetUsers: [
          "Travelers heading to Mexico",
          "Beginner Spanish learners",
          "People who want to speak with Spanish-speaking family and friends",
        ],
        useCases: [
          "Ordering food and coffee in Spanish",
          "Checking into a hotel or taking a bus",
          "Daily review to keep a learning streak",
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
  linkedin: "https://www.linkedin.com/in/nexa-tech-ba02a9387/",
  email: "cs.nexatech@gmail.com",
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What is Nexa Tech?",
    answer:
      "Nexa Tech is a small, independent product team. We design, build, and maintain our own mobile apps, web products, and open-source tools, and we care about software that is simple, fast, and genuinely useful.",
  },
  {
    question: "What kind of products do you build?",
    answer:
      "We focus on practical everyday tools across mobile and web, plus developer libraries we use ourselves. Every product starts from a real problem and ships only when it solves it cleanly.",
  },
  {
    question: "How do you approach privacy and user data?",
    answer:
      "We collect as little as possible. Where we can, data stays on your device, and each product has its own clear privacy policy and terms of use that explain exactly what is handled and why.",
  },
  {
    question: "Are your products actively maintained?",
    answer:
      "Yes. We keep shipping updates, fixing issues, and improving performance based on real user feedback. Our roadmap shows what we are working on next.",
  },
  {
    question: "Can I share feedback or report a problem?",
    answer:
      "Absolutely. Feedback shapes what we build. Email us at cs.nexatech@gmail.com and the team will get back to you as soon as possible.",
  },
  {
    question: "Are you open to partnerships or collaboration?",
    answer:
      "We are always happy to talk with people who share our focus on well-crafted software. Reach out by email or through the GitHub and LinkedIn links in the footer.",
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

export type RoadmapPhase = {
  period: string; // "2024", or "Next" for the planned phase
  status: "done" | "now" | "planned";
  title: string;
  summary: string;
  projects?: string[]; // project titles from `projects`, rendered as links
  plans?: string[]; // used instead of projects for the planned phase
  result: string;
};

// Company timeline for the About section. Founded in 2024; edit periods and
// results here as the real numbers come in.
export const roadmap: RoadmapPhase[] = [
  {
    period: "2024",
    status: "done",
    title: "Founded, web first",
    summary:
      "Ethan and Tina start Nexa with small web tools that solve one problem each and can ship in weeks.",
    projects: [
      "Time Converter",
      "Resize Image",
      "Mystic Tarot",
      "PetPal",
      "The Home Versus",
    ],
    result: "Five web products live and a shared React codebase to build on.",
  },
  {
    period: "2025",
    status: "done",
    title: "From web to mobile",
    summary:
      "The tools people kept coming back to become React Native apps, and the shared file layer is open-sourced.",
    projects: [
      "Tarot Destiny",
      "PetPal — Pet Simulator",
      "Time Converter — World Clock",
      "Quick Image PDF Resizer",
      "ScanQR",
      "Smart Currency Converter",
      "Easy Loan Estimator",
      "react-native-simple-fs",
    ],
    result:
      "Seven apps on the App Store and Google Play, plus our first npm package.",
  },
  {
    period: "2026",
    status: "now",
    title: "Focused tools and AI",
    summary:
      "Apps built for specific jobs, from site reports to study sessions, with AI only where it clearly helps.",
    projects: [
      "FieldStamp GPS Camera",
      "AI Lecture Recorder",
      "Ingredient Scanner",
      "Horror Chat Stories",
      "Coloring Book: Paint & Draw",
      "World Time Buddy",
    ],
    result: "21+ products across web, mobile and the browser, 12 of them mobile apps.",
  },
  {
    period: "Next",
    status: "planned",
    title: "Launching next, building with partners",
    summary:
      "CleanMaster is in store review now. After that, we take what we learned shipping our own products into work for clients, while keeping our apps growing.",
    projects: ["CleanMaster"],
    plans: [
      "Client and partner product builds",
      "More open-source packages from our shared code",
      "On-device and offline features in existing apps",
    ],
    result: "A studio that ships for others with the same care it ships for itself.",
  },
];
