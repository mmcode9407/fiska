import type { APIRoute } from "astro";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const validatedData = loginSchema.parse(data);

    const { data: authData, error: authError } = await locals.supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError) {
      let errorMessage = "Wystąpił błąd podczas logowania";

      switch (authError.message) {
        case "Invalid login credentials":
          errorMessage = "Nieprawidłowy email lub hasło";
          break;
        case "Email not confirmed":
          errorMessage = "Email nie został potwierdzony";
          break;
        default:
          console.error("Błąd logowania:", authError);
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        user: authData.user,
        session: authData.session,
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane formularza",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    console.error("Nieoczekiwany błąd:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
      }),
      { status: 500 }
    );
  }
};
