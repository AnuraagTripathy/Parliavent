/** Hexclave user IDs — User.id equals Hexclave user.id (no separate externalId). */
export const SHOWCASE_USER_IDS = {
  u1: "92922a59-c6da-45cf-b3ae-74666a0d4798",
  u2: "bcebfb2d-7639-431d-a4c0-1fdaa4d4abda",
  u3: "e072a62d-e6aa-459e-bfb0-f2ccf505ab84",
} as const;

export type ShowcaseUserKey = keyof typeof SHOWCASE_USER_IDS;

export function showcaseUserEnvName(key: ShowcaseUserKey): string | undefined {
  const envKey = `SHOWCASE_USER_${key.slice(1)}_NAME` as const;
  return process.env[envKey]?.trim() || undefined;
}
