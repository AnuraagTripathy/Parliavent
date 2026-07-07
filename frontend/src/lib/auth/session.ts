import { NextResponse } from "next/server";
import { hexclaveServerApp } from "@/hexclave/server";
import { prisma } from "@/lib/db";
import { getAuthorDisplayName, getUserProfileFields } from "@/lib/auth/display-name";

export async function getOptionalAuthUser(request: Request) {
  return hexclaveServerApp.getUser({ tokenStore: request });
}

export async function requireAuthUser(request: Request) {
  const user = await hexclaveServerApp.getUser({
    tokenStore: request,
    or: "throw",
  });

  const profile = getUserProfileFields(user);

  await prisma.user.upsert({
    where: { id: profile.id },
    create: profile,
    update: {
      displayName: profile.displayName,
      email: profile.email,
      imageUrl: profile.imageUrl,
    },
  });

  return {
    user,
    authorName: getAuthorDisplayName(user),
    authorId: user.id,
  };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
