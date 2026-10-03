export const COLORS = {
  revenue: "#0d0c22",
  ads: "#f59e0b",
  revenueCat: "#f2545b",
  installs: "#16a34a",
  users: "#3b82f6",
  trials: "#a78bfa",
};

export const COUNTRIES = [
  { code: "VN", name: "Việt Nam", flag: "🇻🇳", weight: 1.4, revMult: 0.5 },
  { code: "US", name: "Hoa Kỳ", flag: "🇺🇸", weight: 0.9, revMult: 3.2 },
  { code: "IN", name: "Ấn Độ", flag: "🇮🇳", weight: 1.1, revMult: 0.3 },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", weight: 0.8, revMult: 0.4 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", weight: 0.6, revMult: 0.6 },
  { code: "PH", name: "Philippines", flag: "🇵🇭", weight: 0.5, revMult: 0.5 },
  { code: "TH", name: "Thái Lan", flag: "🇹🇭", weight: 0.4, revMult: 0.6 },
  { code: "JP", name: "Nhật Bản", flag: "🇯🇵", weight: 0.35, revMult: 2.6 },
  { code: "GB", name: "Vương quốc Anh", flag: "🇬🇧", weight: 0.3, revMult: 2.5 },
  { code: "DE", name: "Đức", flag: "🇩🇪", weight: 0.3, revMult: 2.4 },
];

export const AD_FORMATS = [
  { key: "banner", name: "Banner", weight: 0.45, ecpmMult: 0.3 },
  { key: "interstitial", name: "Toàn màn hình", weight: 0.2, ecpmMult: 2.2 },
  { key: "rewarded", name: "Có tặng thưởng", weight: 0.1, ecpmMult: 3.5 },
  { key: "appOpen", name: "Mở ứng dụng", weight: 0.1, ecpmMult: 1.8 },
  { key: "native", name: "Quảng cáo gốc", weight: 0.15, ecpmMult: 1.2 },
];
