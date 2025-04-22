import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Ścieżki publiczne - endpointy Auth API i strony Astro renderowane po stronie serwera
const PUBLIC_PATHS = [
  // Strony Astro renderowane po stronie serwera
  "/login",
  "/register",
  "/forgot-password",
  // Endpointy Auth API
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Zawsze ustawiamy klienta Supabase w locals
  locals.supabase = supabase;

  // Pomijamy sprawdzanie autoryzacji dla ścieżek publicznych
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return next();
  }

  // WAŻNE: Zawsze najpierw pobieramy sesję użytkownika przed innymi operacjami
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Błąd podczas pobierania użytkownika:", error.message);
  }

  if (user) {
    locals.user = {
      email: user.email ?? null,
      id: user.id,
    };
  } else if (!PUBLIC_PATHS.includes(url.pathname)) {
    // Przekierowanie na stronę logowania dla chronionych ścieżek
    return redirect("/login");
  }

  return next();
});
