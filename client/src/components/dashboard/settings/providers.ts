import {
  Apple,
  Coins,
  Flame,
  Megaphone,
  Play,
  type LucideIcon,
} from "lucide-react";
import type { IntegrationProvider } from "@/services/integrations";

export type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  secret?: boolean; // write-only; never shown back
  multiline?: boolean;
  file?: { accept: string; json?: boolean }; // allow loading the value from a file
};

export type ProviderDef = {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  docsUrl: string;
  fields: FieldDef[];
};

export const PROVIDERS: ProviderDef[] = [
  {
    id: "revenuecat",
    name: "RevenueCat",
    description: "Doanh thu gói đăng ký, thuê bao, lượt dùng thử",
    icon: Coins,
    color: "#f2545b",
    docsUrl: "https://www.revenuecat.com/docs/api-v2",
    fields: [
      {
        key: "projectId",
        label: "Project ID",
        placeholder: "proj1a2b3c4d",
        required: true,
      },
      {
        key: "secretApiKey",
        label: "Secret API key (v2)",
        placeholder: "sk_...",
        secret: true,
        required: true,
        help: "Project settings → API keys → tạo Secret key, quyền chỉ đọc (read-only).",
      },
    ],
  },
  {
    id: "app_store_connect",
    name: "App Store Connect",
    description: "Lượt tải, doanh thu, đánh giá ứng dụng iOS",
    icon: Apple,
    color: "#0d0c22",
    docsUrl:
      "https://developer.apple.com/documentation/appstoreconnectapi/creating-api-keys-for-app-store-connect-api",
    fields: [
      {
        key: "issuerId",
        label: "Issuer ID",
        placeholder: "57246542-96fe-1a63-e053-0824d011072a",
        required: true,
      },
      {
        key: "keyId",
        label: "Key ID",
        placeholder: "2X9R4HXF34",
        required: true,
      },
      {
        key: "vendorNumber",
        label: "Vendor number",
        placeholder: "85123456",
        required: true,
        help: "Dùng cho báo cáo Sales & Trends (Payments and Financial Reports).",
      },
      {
        key: "privateKey",
        label: "Private key (.p8)",
        placeholder: "-----BEGIN PRIVATE KEY-----",
        secret: true,
        multiline: true,
        required: true,
        file: { accept: ".p8" },
        help: "Users and Access → Integrations → App Store Connect API. Quyền Sales/Finance hoặc Admin.",
      },
    ],
  },
  {
    id: "google_play",
    name: "Google Play Console",
    description: "Lượt cài, gỡ, đánh giá, crash/ANR ứng dụng Android",
    icon: Play,
    color: "#16a34a",
    docsUrl: "https://developers.google.com/play/developer/reporting",
    fields: [
      {
        key: "developerId",
        label: "Developer account ID",
        placeholder: "1234567890123456789",
        required: true,
      },
      {
        key: "reportsBucket",
        label: "Cloud Storage bucket báo cáo",
        placeholder: "pubsite_prod_rev_01234567890987654321",
        required: true,
        help: "Play Console → Tải báo cáo → Thống kê → Sao chép URI Cloud Storage.",
      },
      {
        key: "serviceAccountJson",
        label: "Service account (JSON)",
        placeholder: '{ "type": "service_account", ... }',
        secret: true,
        multiline: true,
        required: true,
        file: { accept: ".json,application/json", json: true },
        help: "Cấp quyền cho service account trong Play Console → Người dùng và quyền.",
      },
    ],
  },
  {
    id: "admob",
    name: "AdMob",
    description: "Doanh thu quảng cáo, lượt hiển thị, eCPM",
    icon: Megaphone,
    color: "#f59e0b",
    docsUrl: "https://developers.google.com/admob/api/v1/getting-started",
    fields: [
      {
        key: "publisherId",
        label: "Publisher ID",
        placeholder: "pub-1234567890123456",
        required: true,
      },
      {
        key: "clientId",
        label: "OAuth client ID",
        placeholder: "xxx.apps.googleusercontent.com",
        required: true,
      },
      {
        key: "clientSecret",
        label: "OAuth client secret",
        placeholder: "GOCSPX-...",
        secret: true,
        required: true,
      },
      {
        key: "refreshToken",
        label: "OAuth refresh token",
        placeholder: "1//0g...",
        secret: true,
        required: true,
        help: "Lấy bằng OAuth với scope admob.readonly, đăng nhập bằng tài khoản sở hữu AdMob.",
      },
    ],
  },
  {
    id: "firebase",
    name: "Firebase / Google Analytics",
    description: "Người dùng hoạt động, phiên, sự kiện, quốc gia",
    icon: Flame,
    color: "#f97316",
    docsUrl:
      "https://developers.google.com/analytics/devguides/reporting/data/v1",
    fields: [
      {
        key: "projectId",
        label: "Firebase project ID",
        placeholder: "nexa-apps",
        required: true,
      },
      {
        key: "ga4PropertyId",
        label: "GA4 property ID",
        placeholder: "123456789",
        required: true,
        help: "Firebase → Project settings → Integrations → Google Analytics.",
      },
      {
        key: "serviceAccountJson",
        label: "Service account (JSON)",
        placeholder: '{ "type": "service_account", ... }',
        secret: true,
        multiline: true,
        required: true,
        file: { accept: ".json,application/json", json: true },
        help: "Thêm email service account vào GA4 property với quyền Viewer.",
      },
    ],
  },
];
