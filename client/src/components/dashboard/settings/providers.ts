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
  normalize?: (value: string) => string; // applied on submit, e.g. strip a pasted URI prefix
};

export type GuideStep = {
  title: string;
  body: string;
  link?: { label: string; href: string };
};

export type ProviderGuide = {
  steps: GuideStep[];
  note?: string;
};

export type ProviderDef = {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  docsUrl: string;
  guide?: ProviderGuide; // step-by-step setup shown above the form
  // Deleting only removes our copy of the credentials; how to cut access on the provider's side.
  revokeHint?: string;
  liveCheck?: boolean; // backend connects to the provider right after saving
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
    guide: {
      steps: [
        {
          title: "Mở trang App Store Connect API",
          body: "App Store Connect → Users and Access → Integrations → App Store Connect API → tab Team Keys. Cần tài khoản Account Holder hoặc Admin; lần đầu bấm “Request Access” và chờ Apple duyệt.",
          link: {
            label: "Mở App Store Connect API",
            href: "https://appstoreconnect.apple.com/access/integrations/api",
          },
        },
        {
          title: "Tạo API key",
          body: "Bấm “Generate API Key” (dấu +), đặt tên VD: Nexa Dashboard, Access chọn “Sales” — đủ để đọc danh sách app và báo cáo Sales and Trends, không sửa được gì.",
        },
        {
          title: "Sao chép Issuer ID và Key ID",
          body: "Issuer ID nằm phía trên bảng key; Key ID nằm ở dòng key vừa tạo. Dán vào hai ô tương ứng bên dưới.",
        },
        {
          title: "Tải file .p8",
          body: "Bấm “Download API Key” ở dòng key đó. Apple chỉ cho tải MỘT lần — lưu file cẩn thận, rồi bấm “Tải file” ở ô Private key bên dưới.",
        },
        {
          title: "Lấy Vendor number",
          body: "Payments and Financial Reports → số Vendor hiển thị ở góc trên bên trái (dạng 8xxxxxxx).",
          link: {
            label: "Mở Payments and Financial Reports",
            href: "https://appstoreconnect.apple.com/itc/payments_and_financial_reports",
          },
        },
      ],
      note: "Key mới tạo dùng được ngay. Nếu kiểm tra báo lỗi quyền Sales and Trends, hãy đổi Access của key sang Sales, Finance hoặc Admin.",
    },
    liveCheck: true,
    revokeHint:
      "Để thu hồi hẳn quyền phía Apple: App Store Connect → Users and Access → Integrations → App Store Connect API → Revoke key.",
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
        help: "File AuthKey_<KeyID>.p8 tải từ Users and Access → Integrations → App Store Connect API (chỉ tải được một lần).",
      },
    ],
  },
  {
    id: "google_play",
    name: "Google Play Console",
    description: "Lượt cài, gỡ, đánh giá, crash/ANR ứng dụng Android",
    icon: Play,
    color: "#16a34a",
    docsUrl: "https://support.google.com/googleplay/android-developer/answer/6135870",
    guide: {
      steps: [
        {
          title: "Tạo service account trên Google Cloud",
          body: "Chọn (hoặc tạo) một project → IAM & Admin → Service accounts → Create service account. Không cần gán role nào trong Cloud.",
          link: {
            label: "Mở Service accounts",
            href: "https://console.cloud.google.com/iam-admin/serviceaccounts",
          },
        },
        {
          title: "Bật Play Developer Reporting API",
          body: "Bật API này trong cùng project để lấy tỉ lệ crash/ANR.",
          link: {
            label: "Mở trang API",
            href: "https://console.cloud.google.com/apis/library/playdeveloperreporting.googleapis.com",
          },
        },
        {
          title: "Tạo key JSON",
          body: "Mở service account → Keys → Add key → Create new key → JSON. Tải file về rồi dán hoặc bấm “Tải file” ở ô Service account bên dưới.",
        },
        {
          title: "Mời service account vào Play Console",
          body: "Người dùng và quyền → Mời người dùng mới → nhập email service account (…@<project>.iam.gserviceaccount.com). Cấp quyền cấp tài khoản: “Xem thông tin ứng dụng và tải xuống báo cáo hàng loạt” và “Xem dữ liệu tài chính”.",
          link: {
            label: "Mở Người dùng và quyền",
            href: "https://play.google.com/console/users-and-permissions",
          },
        },
        {
          title: "Lấy Developer account ID",
          body: "Là dãy số trong URL Play Console: play.google.com/console/u/0/developers/<ID>/…",
        },
        {
          title: "Lấy bucket báo cáo",
          body: "Tải báo cáo xuống → Số liệu thống kê → bấm “Sao chép URI Cloud Storage” cạnh mục bất kỳ (VD: gs://pubsite_prod_…/stats/installs/). Dán nguyên URI vào ô bên dưới, hệ thống tự lấy tên bucket.",
          link: {
            label: "Mở Tải báo cáo",
            href: "https://play.google.com/console/download-reports/statistics",
          },
        },
      ],
      note: "Quyền mới cấp có thể mất tới 24 giờ mới có hiệu lực — nếu “Kiểm tra kết nối” báo lỗi quyền ngay sau khi tạo, hãy thử lại sau.",
    },
    liveCheck: true,
    revokeHint:
      "Để thu hồi hẳn quyền phía Google: gỡ service account khỏi Play Console → Người dùng và quyền, và xoá key JSON trong Google Cloud → Service accounts → Keys.",
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
        placeholder: "gs://pubsite_prod_01234567890987654321/stats/installs/",
        required: true,
        help: "Play Console → Tải báo cáo xuống → Số liệu thống kê → bấm “Sao chép URI Cloud Storage” rồi dán nguyên URI vào đây.",
        // "gs://pubsite_prod_rev_123/stats/" → "pubsite_prod_rev_123"
        normalize: (v) => v.replace(/^gs:\/\//i, "").split("/")[0],
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
    guide: {
      steps: [
        {
          title: "Bật AdMob API",
          body: "Trong Google Cloud, chọn (hoặc tạo) một project rồi bấm Enable cho “AdMob API”. Có thể dùng chung project với Google Play.",
          link: {
            label: "Mở AdMob API",
            href: "https://console.cloud.google.com/apis/library/admob.googleapis.com",
          },
        },
        {
          title: "Cấu hình OAuth consent screen",
          body: "APIs & Services → OAuth consent screen: User type External, điền tên app + email, thêm email tài khoản AdMob vào Test users. Sau đó bấm “Publish app” (In production) — nếu để Testing, refresh token sẽ hết hạn sau 7 ngày.",
          link: {
            label: "Mở OAuth consent screen",
            href: "https://console.cloud.google.com/apis/credentials/consent",
          },
        },
        {
          title: "Tạo OAuth client",
          body: "Credentials → Create credentials → OAuth client ID → loại “Web application”. Ở Authorized redirect URIs thêm https://developers.google.com/oauthplayground. Sao chép Client ID và Client secret vào hai ô bên dưới.",
          link: {
            label: "Mở Credentials",
            href: "https://console.cloud.google.com/apis/credentials",
          },
        },
        {
          title: "Lấy refresh token bằng OAuth Playground",
          body: "Bấm biểu tượng bánh răng → tick “Use your own OAuth credentials” → dán Client ID/secret. Ở Step 1 nhập scope https://www.googleapis.com/auth/admob.readonly → Authorize APIs, đăng nhập bằng tài khoản SỞ HỮU AdMob → Step 2 bấm “Exchange authorization code for tokens” → sao chép Refresh token.",
          link: {
            label: "Mở OAuth Playground",
            href: "https://developers.google.com/oauthplayground",
          },
        },
        {
          title: "Lấy Publisher ID",
          body: "AdMob → Settings → Account information → Publisher ID (dạng pub-1234567890123456).",
          link: {
            label: "Mở cài đặt AdMob",
            href: "https://apps.admob.com/v2/settings",
          },
        },
      ],
      note: "Đồng bộ chỉ lấy được những app trong AdMob đã liên kết với cửa hàng (Google Play / App Store); app chưa liên kết sẽ bị bỏ qua.",
    },
    liveCheck: true,
    revokeHint:
      "Để thu hồi hẳn quyền phía Google: myaccount.google.com/permissions → xoá quyền của OAuth app này, hoặc xoá OAuth client trong Google Cloud → Credentials.",
    fields: [
      {
        key: "publisherId",
        label: "Publisher ID",
        placeholder: "pub-1234567890123456",
        required: true,
        help: "AdMob → Settings → Account information. Dán cả ca-app-pub-… cũng được.",
        // "ca-app-pub-123~456" / "123" → "pub-123", so one account is never saved twice.
        normalize: (v) => {
          const id = v.replace(/^ca-app-/i, "").split("~")[0];
          return id.startsWith("pub-") ? id : `pub-${id}`;
        },
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
        help: "Lấy ở OAuth Playground (bước 4) với scope admob.readonly, đăng nhập bằng tài khoản sở hữu AdMob.",
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
