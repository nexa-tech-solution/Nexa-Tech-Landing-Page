// Contract of POST /contact (public) and /admin/contact-messages (nexa-be contact module).

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type ContactSubmitInput = {
  name: string;
  email: string;
  message: string;
  page?: string; // where the form was sent from
  website?: string; // honeypot: must stay empty
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  sourcePage: string | null;
  status: ContactStatus;
  createdAt: number; // epoch ms
  readAt: number | null;
  repliedAt: number | null;
};

export type ContactReply = {
  id: number;
  subject: string;
  body: string;
  status: "SENT" | "FAILED";
  error: string | null;
  sentAt: number;
};

export type ContactMessageDetail = {
  message: ContactMessage;
  replies: ContactReply[]; // oldest first
};

export type ContactListParams = {
  status?: ContactStatus; // none = everything except ARCHIVED
  searchTerm?: string;
  page?: number;
  size?: number;
};

export type ContactEmailTemplateKey =
  | "GENERAL"
  | "RECEIVED"
  | "PROJECT_INQUIRY"
  | "QUOTE"
  | "SUPPORT"
  | "FOLLOW_UP";

// A reply design; subject/body are starting points, {name} = the sender's name.
export type ContactEmailTemplate = {
  key: ContactEmailTemplateKey;
  label: string;
  description: string;
  accent: string;
  subject: string;
  body: string;
  ctaLabel: string | null;
};

export type ContactReplyInput = {
  subject: string;
  body: string;
  template?: ContactEmailTemplateKey; // default GENERAL
  ctaLabel?: string; // button shown only with both label and url
  ctaUrl?: string; // http(s):// or mailto:
};

export type ContactEmailPreview = { subject: string; html: string; text: string };
