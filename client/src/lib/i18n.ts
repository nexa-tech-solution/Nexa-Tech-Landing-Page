import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        products: "Products",
        opensource: "Open Source",
        team: "Team",
        contact: "Say Hello"
      },
      hero: {
        badge: "Small team, real products, free for users",
        title_prefix: "We build",
        title_highlight: "useful digital products",
        title_suffix: "people can actually use",
        description: "Nexa Tech is a small builder team creating free web apps, mobile apps, and open-source tools that solve everyday problems.",
        cta_primary: "Explore Products",
        cta_secondary: "View Open Source",
        quick_links: {
          web: "Web Products",
          mobile: "Mobile Apps",
          opensource: "Open Source",
          free: "Free for Users"
        }
      },
      trust: {
        badge: "What we have launched so far",
        title: "This site is where we collect the products we have shipped, the tools we share, and the ideas we keep improving over time.",
        stats: {
          products: {
            value: "7+",
            label: "Products launched"
          },
          stores: {
            value: "2",
            label: "Platforms reached"
          },
          delivery: {
            value: "Free",
            label: "User-first mindset"
          }
        },
        capabilities: {
          open_source: {
            title: "Open-source side projects",
            description: "Some of the things we build become public repositories so other developers can learn from them or build on top of them."
          },
          web_platforms: {
            title: "Free web products",
            description: "We create lightweight websites and web tools that are easy to use, fast to open, and useful for real people."
          },
          mobile_apps: {
            title: "Published mobile apps",
            description: "Our mobile products are designed to be practical, easy to understand, and ready for daily use on Android and iOS."
          }
        }
      },
      about: {
        title_prefix: "About",
        title_highlight: "Nexa",
        description1: "Nexa is a small team of builders who enjoy turning simple ideas into products that people can try right away.",
        description2: "This portfolio is where we share what we have launched, what we are learning, and the free tools we put into the hands of real users.",
        points: {
          dev_first: {
            title: "Built in public",
            desc: "We use this space to show real work, not pitch decks or placeholder concepts."
          },
          scalable: {
            title: "Practical products",
            desc: "We focus on ideas that are easy to try, easy to understand, and genuinely useful in daily life."
          },
          community: {
            title: "Community mindset",
            desc: "When a tool is worth sharing, we turn it into something other builders can explore too."
          }
        }
      },
      products: {
        title_prefix: "Our",
        title_highlight: "Products",
        description: "A collection of free products, experiments, and published apps built by our team for real users.",
        tabs: {
          web: "Web Applications",
          mobile: "Mobile Apps",
          chrome: "Chrome Extensions"
        },
        buttons: {
          demo: "Live Demo",
          store: "App Store",
          play: "Play Store",
          chrome: "Chrome Web Store"
        }
      },
      editorial: {
        eyebrow: "A closer look at what we make",
        title_prefix: "How we think about",
        title_highlight: "building products",
        description: "These are the areas we keep coming back to when we make something new for users: useful websites, practical apps, and open-source experiments.",
        cta: "Browse the portfolio",
        cards: {
          launchpad: {
            tag: "Web products",
            meta: "Fast, clear, useful",
            title: "We like building websites that are simple, focused, and easy to use.",
            description: "Some are content-driven, some are utility-based, but all of them aim to solve a specific problem without making users work too hard.",
            highlightLabel: "What matters to us",
            highlightValue: "Clarity, speed, and a clean experience from the first visit."
          },
          apps: {
            tag: "Mobile apps",
            meta: "Published for users",
            title: "We build mobile apps that feel useful in everyday life.",
            description: "Our goal is not just to launch to the store, but to create apps people can open often, understand quickly, and keep around.",
            highlightLabel: "What we focus on",
            highlightValue: "Simple onboarding, practical features, and reliable release quality."
          },
          oss: {
            tag: "Open source",
            meta: "Things worth sharing",
            title: "We share code when it can help other builders move faster.",
            description: "Open source is part of how we learn, document ideas, and turn side experiments into something more useful for the wider community.",
            highlightLabel: "Why we share it",
            highlightValue: "To make useful code reusable, easier to explore, and more valuable beyond a single project."
          }
        }
      },
      opensource: {
        title_prefix: "Open Source",
        title_highlight: "DNA",
        description: "Some of our projects turn into public repositories so developers can explore how we build and reuse the work.",
        cta: "View Repository"
      },
      techstack: {
        frontend: "Frontend",
        backend: "Backend",
        mobile: "Mobile",
        devops: "DevOps"
      },
      team: {
        title_prefix: "Meet the",
        title_highlight: "Team",
        description: "The people behind the products, experiments, and late-night ideas shipped under Nexa."
      },
      contact: {
        title_prefix: "Want to follow or",
        title_highlight: "say hello",
        description: "If you enjoy what we are building, want to share feedback, or have an idea for a useful product, feel free to reach out.",
        email: "Email",
        community: "Community",
        form: {
          name: "Name",
          email: "Email",
          subject: "Subject",
          message: "Message",
          submit: "Send Message"
        }
      },
      footer: {
        description: "A small team building free digital products, mobile apps, and open-source experiments for real users.",
        links: "Links",
        connect: "Connect",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service"
      }
    }
  },
  vi: {
    translation: {
      nav: {
        products: "Sản Phẩm",
        opensource: "Mã Nguồn Mở",
        team: "Đội Ngũ",
        contact: "Chào Nexa"
      },
      hero: {
        badge: "Team nhỏ, sản phẩm thật, miễn phí cho người dùng",
        title_prefix: "Chúng tôi xây",
        title_highlight: "sản phẩm số hữu ích",
        title_suffix: "để mọi người có thể dùng ngay",
        description: "Nexa Tech là một team nhỏ tạo ra web app, mobile app và công cụ mã nguồn mở miễn phí để giải quyết những nhu cầu đời thường.",
        cta_primary: "Khám Phá Sản Phẩm",
        cta_secondary: "Xem Open Source",
        quick_links: {
          web: "Sản Phẩm Web",
          mobile: "Ứng Dụng Mobile",
          opensource: "Mã Nguồn Mở",
          free: "Miễn Phí Cho User"
        }
      },
      trust: {
        badge: "Những gì chúng tôi đã ra mắt",
        title: "Website này là nơi chúng tôi lưu lại các sản phẩm đã phát hành, công cụ đã chia sẻ và những thử nghiệm vẫn đang tiếp tục cải thiện.",
        stats: {
          products: {
            value: "7+",
            label: "Sản phẩm đã ra mắt"
          },
          stores: {
            value: "2",
            label: "Nền tảng đã phát hành"
          },
          delivery: {
            value: "Free",
            label: "Ưu tiên người dùng"
          }
        },
        capabilities: {
          open_source: {
            title: "Dự án mã nguồn mở",
            description: "Một số thứ chúng tôi làm sẽ trở thành repository công khai để các developer khác có thể học hỏi hoặc phát triển tiếp."
          },
          web_platforms: {
            title: "Sản phẩm web miễn phí",
            description: "Chúng tôi tạo ra website và web tool gọn nhẹ, dễ dùng, mở nhanh và hữu ích với nhu cầu thực tế."
          },
          mobile_apps: {
            title: "Ứng dụng mobile đã phát hành",
            description: "Các sản phẩm mobile của chúng tôi hướng đến sự thực dụng, dễ hiểu và sẵn sàng cho việc sử dụng mỗi ngày trên Android và iOS."
          }
        }
      },
      about: {
        title_prefix: "Về",
        title_highlight: "Nexa",
        description1: "Nexa là một team nhỏ thích biến những ý tưởng đơn giản thành sản phẩm mà người dùng có thể thử ngay.",
        description2: "Portfolio này là nơi chúng tôi chia sẻ những gì đã ra mắt, những gì đang học được, và các công cụ miễn phí đã đưa tới tay người dùng thật.",
        points: {
          dev_first: {
            title: "Xây dựng công khai",
            desc: "Chúng tôi dùng không gian này để cho thấy công việc thật, không phải ý tưởng giả lập hay pitch deck."
          },
          scalable: {
            title: "Sản phẩm thực dụng",
            desc: "Chúng tôi ưu tiên những ý tưởng dễ thử, dễ hiểu và hữu ích trong cuộc sống hằng ngày."
          },
          community: {
            title: "Tư duy cộng đồng",
            desc: "Khi một công cụ đủ đáng để chia sẻ, chúng tôi sẽ biến nó thành thứ mà người khác cũng có thể khám phá."
          }
        }
      },
      products: {
        title_prefix: "Sản Phẩm",
        title_highlight: "Của Chúng Tôi",
        description: "Bộ sưu tập các sản phẩm miễn phí, thử nghiệm và ứng dụng đã phát hành do team chúng tôi xây dựng cho người dùng thật.",
        tabs: {
          web: "Ứng Dụng Web",
          mobile: "Ứng Dụng Mobile",
          chrome: "Tiện Ích Chrome"
        },
        buttons: {
          demo: "Xem Demo",
          store: "App Store",
          play: "Play Store",
          chrome: "Chrome Web Store"
        }
      },
      editorial: {
        eyebrow: "Một góc nhìn gần hơn vào những gì chúng tôi làm",
        title_prefix: "Cách chúng tôi nghĩ về",
        title_highlight: "việc xây sản phẩm",
        description: "Đây là những hướng mà chúng tôi luôn quay lại khi tạo ra thứ gì đó mới cho user: website hữu ích, app thực dụng và các thử nghiệm mã nguồn mở.",
        cta: "Xem portfolio",
        cards: {
          launchpad: {
            tag: "Sản phẩm web",
            meta: "Nhanh, rõ ràng, hữu ích",
            title: "Chúng tôi thích xây những website đơn giản, tập trung và dễ sử dụng.",
            description: "Có sản phẩm thiên về nội dung, có sản phẩm là công cụ tiện ích, nhưng tất cả đều cố gắng giải quyết một nhu cầu cụ thể mà không làm người dùng phải mất nhiều công sức.",
            highlightLabel: "Điều chúng tôi coi trọng",
            highlightValue: "Sự rõ ràng, tốc độ và trải nghiệm sạch ngay từ lần truy cập đầu tiên."
          },
          apps: {
            tag: "Ứng dụng mobile",
            meta: "Đã phát hành cho user",
            title: "Chúng tôi xây mobile app để có ích trong cuộc sống hằng ngày.",
            description: "Mục tiêu không chỉ là đưa app lên store, mà là tạo ra thứ người dùng có thể mở thường xuyên, hiểu nhanh và muốn giữ lại trên máy.",
            highlightLabel: "Điều chúng tôi tập trung",
            highlightValue: "Onboarding đơn giản, tính năng thực dụng và chất lượng release ổn định."
          },
          oss: {
            tag: "Mã nguồn mở",
            meta: "Những thứ đáng để chia sẻ",
            title: "Chúng tôi chia sẻ code khi nó có thể giúp builder khác đi nhanh hơn.",
            description: "Open source là một phần trong cách chúng tôi học hỏi, lưu lại ý tưởng và biến các thử nghiệm nhỏ thành thứ hữu ích hơn cho cộng đồng.",
            highlightLabel: "Vì sao chúng tôi chia sẻ",
            highlightValue: "Để code hữu ích được tái sử dụng, dễ khám phá hơn và tạo giá trị vượt ra ngoài một dự án."
          }
        }
      },
      opensource: {
        title_prefix: "DNA",
        title_highlight: "Mã Nguồn Mở",
        description: "Một vài dự án của chúng tôi được đưa lên công khai để developer có thể xem cách chúng tôi xây và tái sử dụng công việc đó.",
        cta: "Xem Repository"
      },
      techstack: {
        frontend: "Frontend",
        backend: "Backend",
        mobile: "Mobile",
        devops: "DevOps"
      },
      team: {
        title_prefix: "Gặp Gỡ",
        title_highlight: "Đội Ngũ",
        description: "Những người đứng sau các sản phẩm, thử nghiệm và những ý tưởng được Nexa biến thành sản phẩm thật."
      },
      contact: {
        title_prefix: "Muốn theo dõi hoặc",
        title_highlight: "gửi lời chào",
        description: "Nếu bạn thích những gì chúng tôi đang xây, muốn góp ý, hoặc có ý tưởng cho một sản phẩm hữu ích, cứ liên hệ với Nexa.",
        email: "Email",
        community: "Cộng Đồng",
        form: {
          name: "Tên",
          email: "Email",
          subject: "Chủ đề",
          message: "Nội dung",
          submit: "Gửi Tin Nhắn"
        }
      },
      footer: {
        description: "Một team nhỏ xây sản phẩm số miễn phí, ứng dụng mobile và các thử nghiệm mã nguồn mở cho người dùng thật.",
        links: "Liên Kết",
        connect: "Kết Nối",
        rights: "Đã đăng ký bản quyền.",
        privacy: "Chính Sách Bảo Mật",
        terms: "Điều Khoản Dịch Vụ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
