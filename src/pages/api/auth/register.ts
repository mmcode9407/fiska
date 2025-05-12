import type { APIRoute } from "astro";
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Nieprawidłowy format adresu email"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string().min(6, "Potwierdzenie hasła musi mieć co najmniej 6 znaków"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const validatedData = registerSchema.parse(data);

    const { data: authData, error: authError } = await locals.supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError) {
      let errorMessage = "Wystąpił błąd podczas rejestracji";

      switch (authError.message) {
        case "User already registered":
          errorMessage = "Użytkownik o podanym adresie email jest już zarejestrowany";
          break;
        default:
          console.error("Błąd rejestracji:", authError);
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
        message: "Rejestracja przebiegła pomyślnie.",
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
