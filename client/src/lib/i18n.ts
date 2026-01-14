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
        contact: "Contact Us"
      },
      hero: {
        badge: "Powering the Next Generation of Software",
        title_prefix: "Building",
        title_highlight: "Future-Ready",
        title_suffix: "Digital Solutions",
        description: "Nexa Tech engineers high-performance open-source tools, scalable web platforms, and native mobile experiences.",
        cta_primary: "View Our Work",
        cta_secondary: "Explore Open Source"
      },
      about: {
        title_prefix: "Engineering with",
        title_highlight: "Purpose",
        description1: "At Nexa, we believe in transparency and quality. We are a team of developers, designers, and open-source enthusiasts dedicated to building tools that solve real problems.",
        description2: "Whether it's a high-scale web platform or a native mobile application, we bring a developer-first mindset to every project we touch.",
        points: {
          dev_first: {
            title: "Developer-First Mindset",
            desc: "We build with clean architecture and maintainability in mind."
          },
          scalable: {
            title: "Scalable Systems",
            desc: "Our solutions are designed to grow with your user base."
          },
          community: {
            title: "Community Driven",
            desc: "We actively contribute back to the open-source ecosystem."
          }
        }
      },
      products: {
        title_prefix: "Our",
        title_highlight: "Products",
        description: "From complex web applications to intuitive mobile experiences, we build software that solves real-world problems.",
        tabs: {
          web: "Web Applications",
          mobile: "Mobile Apps"
        },
        buttons: {
          demo: "Live Demo",
          store: "App Store",
          play: "Play Store"
        }
      },
      opensource: {
        title_prefix: "Open Source",
        title_highlight: "DNA",
        description: "We don't just use open source software; we build it. Check out some of our most popular repositories.",
        cta: "View GitHub Org"
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
        description: "The minds behind the code. We are a diverse group of problem solvers."
      },
      contact: {
        title_prefix: "Let's Build Something",
        title_highlight: "Great",
        description: "Have a project in mind? Want to collaborate on open source? Or just want to say hi? We'd love to hear from you.",
        email: "Email Us",
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
        description: "Building high-quality open-source software, scalable web platforms, and production-ready mobile apps used by real users.",
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
        contact: "Liên Hệ"
      },
      hero: {
        badge: "Tiếp Sức Cho Thế Hệ Phần Mềm Tiếp Theo",
        title_prefix: "Xây Dựng",
        title_highlight: "Giải Pháp Số",
        title_suffix: "Sẵn Sàng Cho Tương Lai",
        description: "Nexa Tech thiết kế các công cụ mã nguồn mở hiệu năng cao, nền tảng web mở rộng và trải nghiệm di động tối ưu.",
        cta_primary: "Xem Dự Án",
        cta_secondary: "Khám Phá Open Source"
      },
      about: {
        title_prefix: "Kỹ Thuật Có",
        title_highlight: "Mục Đích",
        description1: "Tại Nexa, chúng tôi tin vào sự minh bạch và chất lượng. Chúng tôi là một đội ngũ lập trình viên, nhà thiết kế và những người đam mê mã nguồn mở, tận tâm xây dựng các công cụ giải quyết vấn đề thực tế.",
        description2: "Dù là nền tảng web quy mô lớn hay ứng dụng di động, chúng tôi luôn mang tư duy 'developer-first' vào mọi dự án.",
        points: {
          dev_first: {
            title: "Tư Duy Developer-First",
            desc: "Chúng tôi xây dựng với kiến trúc sạch và khả năng bảo trì cao."
          },
          scalable: {
            title: "Hệ Thống Mở Rộng",
            desc: "Giải pháp của chúng tôi được thiết kế để phát triển cùng lượng người dùng của bạn."
          },
          community: {
            title: "Hướng Về Cộng Đồng",
            desc: "Chúng tôi tích cực đóng góp trở lại cho hệ sinh thái mã nguồn mở."
          }
        }
      },
      products: {
        title_prefix: "Sản Phẩm",
        title_highlight: "Của Chúng Tôi",
        description: "Từ các ứng dụng web phức tạp đến trải nghiệm di động trực quan, chúng tôi xây dựng phần mềm giải quyết các vấn đề thực tế.",
        tabs: {
          web: "Ứng Dụng Web",
          mobile: "Ứng Dụng Mobile"
        },
        buttons: {
          demo: "Xem Demo",
          store: "App Store",
          play: "Play Store"
        }
      },
      opensource: {
        title_prefix: "DNA",
        title_highlight: "Mã Nguồn Mở",
        description: "Chúng tôi không chỉ sử dụng phần mềm mã nguồn mở; chúng tôi xây dựng nó. Hãy xem qua một số kho lưu trữ phổ biến nhất của chúng tôi.",
        cta: "Xem GitHub Org"
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
        description: "Những bộ óc đằng sau những dòng code. Chúng tôi là một nhóm đa dạng các nhà giải quyết vấn đề."
      },
      contact: {
        title_prefix: "Cùng Xây Dựng",
        title_highlight: "Điều Tuyệt Vời",
        description: "Bạn có ý tưởng dự án? Muốn hợp tác về mã nguồn mở? Hay chỉ muốn gửi lời chào? Chúng tôi rất mong nhận được tin từ bạn.",
        email: "Gửi Email",
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
        description: "Xây dựng phần mềm mã nguồn mở chất lượng cao, nền tảng web mở rộng và ứng dụng di động sẵn sàng cho sản xuất.",
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
