import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // página de login, ajuste se for diferente
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
