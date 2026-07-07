type AuthUserLike = {
  id: string;
  displayName?: string | null;
  primaryEmail?: string | null;
  profileImageUrl?: string | null;
};

export function getAuthorDisplayName(user: AuthUserLike | null): string {
  if (!user) return "Guest";
  if (user.displayName?.trim()) return user.displayName.trim();
  const email = user.primaryEmail?.trim();
  if (email) return email.split("@")[0] ?? "Member";
  return "Member";
}

export function getUserProfileFields(user: AuthUserLike) {
  return {
    id: user.id,
    displayName: getAuthorDisplayName(user),
    email: user.primaryEmail ?? null,
    imageUrl: user.profileImageUrl ?? null,
  };
}
