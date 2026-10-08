export const Role = {
  SENDER: "SENDER",
  RIDER: "RIDER",
  HUB_MANAGER: "HUB_MANAGER",
  OPS_MANAGER: "OPS_MANAGER",
  SUPPORT_AGENT: "SUPPORT_AGENT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type TRole = (typeof Role)[keyof typeof Role];

/** Where each role lands after login */
export const ROLE_HOME: Record<TRole, string> = {
  SENDER: "/dashboard/sender",
  RIDER: "/dashboard/rider",
  HUB_MANAGER: "/dashboard/hub-manager",
  OPS_MANAGER: "/dashboard/ops-manager",
  SUPPORT_AGENT: "/dashboard/support",
  ADMIN: "/dashboard/admin",
  SUPER_ADMIN: "/dashboard/admin",
};

/** Which roles can access which base path */
export const ROLE_ALLOWED_PATHS: Record<TRole, string[]> = {
  SENDER: ["/dashboard/sender", "/dashboard/profile"],
  RIDER: ["/dashboard/rider", "/dashboard/profile"],
  HUB_MANAGER: [
    "/dashboard/hub-manager",
    "/dashboard/hubs",
    "/dashboard/profile",
  ],
  OPS_MANAGER: [
    "/dashboard/ops-manager",
    "/dashboard/hubs",
    "/dashboard/profile",
  ],
  SUPPORT_AGENT: ["/dashboard/support", "/dashboard/profile"],
  ADMIN: [
    "/dashboard/admin",
    "/dashboard/hubs",
    "/dashboard/profile",
    "/dashboard/ops-manager",
  ],
  SUPER_ADMIN: [
    "/dashboard/admin",
    "/dashboard/hubs",
    "/dashboard/profile",
    "/dashboard/ops-manager",
  ],
};
