import { test as teardown } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/db/database.types";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const testUserId = process.env.E2E_USERNAME_ID as string;

teardown("Czyszczenie bazy danych po testach E2E", async () => {
  console.log("Rozpoczynam czyszczenie danych testowych z bazy Supabase...");

  if (!supabaseUrl || !supabaseKey) {
    console.error("Brak wymaganych zmiennych środowiskowych SUPABASE_URL lub SUPABASE_KEY");
    return;
  }

  if (!testUserId) {
    console.error("Brak zmiennej środowiskowej E2E_USERNAME_ID z identyfikatorem testowego użytkownika");
    return;
  }

  try {
    // Utworzenie klienta Supabase
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    // Usunięcie wpisów z tabeli generations dla testowego użytkownika
    const { error: generationsError } = await supabase.from("generations").delete().eq("user_id", testUserId);

    if (generationsError) {
      console.error("Błąd podczas usuwania wpisów z tabeli generations:", generationsError);
      throw generationsError;
    }

    console.log(`Usunięto wpisy z tabeli generations dla użytkownika ${testUserId}`);
  } catch (error) {
    console.error("Wystąpił nieoczekiwany błąd podczas czyszczenia bazy danych:", error);
    throw error;
  }
});
