export type WorkspaceRole = "owner" | "admin" | "member";

export type WorkspaceMember = {
  id: number;
  email: string;
  name: string | null; // null until an invite is accepted
  avatarUrl: string | null;
  role: WorkspaceRole;
  status: "active" | "invited";
  invitedAt: string; // ISO datetime
};

// A team that shares one maker profile, its apps and one subscription.
export type Workspace = {
  id: number;
  name: string;
  makerSlug: string | null;
  myRole: WorkspaceRole;
  members: WorkspaceMember[];
};

export type InviteInput = { email: string; role: Exclude<WorkspaceRole, "owner"> };

export type InviteResult = {
  member: WorkspaceMember;
  inviteUrl: string; // also emailed by the backend
};

export type InvitePreview = {
  workspaceName: string;
  invitedBy: string;
  email: string;
  role: WorkspaceRole;
};

export type NotificationType = "vote" | "comment" | "launch" | "follow" | "team";

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  body?: string;
  href: string;
  createdAt: string; // ISO datetime
  read: boolean;
  actor?: { name: string; avatarUrl: string | null };
};

export type EmailPreference = "vote" | "comment" | "launch" | "follow" | "digest";

export type NotificationSettings = {
  email: Record<EmailPreference, boolean>;
};
