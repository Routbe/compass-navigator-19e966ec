import i18next from "i18next";
import { createFileRoute, notFound } from "@tanstack/react-router";

import AuthNeon from "@/components/imported-pages/AuthNeon";
import { isAdminMode } from "@/lib/app-mode";

/**
 * Inloggen en aanmelden via de eigen ROUT-kaart; de Neon Auth-client
 * regelt OAuth, magic links en wachtwoorden eronder.
 * `/auth/sign-in` en `/auth/sign-up` zijn de enige eigen schermen —
 * overige views (reset e.d.) komen van de Neon Auth-service zelf.
 */
export const Route = createFileRoute("/auth/$authView")({
  head: ({ params }) => ({
    meta: [
      { title: isAdminMode() ? i18next.t("auth.meta.admin") : params.authView === "sign-up" ? "Create your ROUT account" : i18next.t("auth.meta.signin") },
      {
        name: "description",
        content: isAdminMode() ? i18next.t("auth.meta.adminDescription") : params.authView === "sign-up" ? "Create your sovereign digital identity with a ROUT account." : i18next.t("auth.meta.description"),
      },
      { property: "og:title", content: isAdminMode() ? i18next.t("auth.meta.admin") : params.authView === "sign-up" ? "Create your ROUT account" : i18next.t("auth.meta.signin") },
      {
        property: "og:description",
        content: isAdminMode() ? i18next.t("auth.meta.adminDescription") : params.authView === "sign-up" ? "Create your sovereign digital identity with a ROUT account." : i18next.t("auth.meta.description"),
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { authView } = Route.useParams();
  if (authView === "sign-in") return <AuthNeon initialMode="magic" />;
  if (authView === "sign-up") return <AuthNeon initialMode="signup" />;
  throw notFound();
}
