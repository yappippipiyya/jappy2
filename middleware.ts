export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:ico|png|jpeg|json|js|webp)$).*)"],
};