import { type ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <h2 className="text-lg font-semibold">Sprawdź swoją skrzynkę</h2>
          <p className="text-muted-foreground mt-2">Wysłaliśmy instrukcje resetowania hasła na podany adres email.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/login" className="w-full">
            <Button className="w-full" variant="outline">
              Powrót do logowania
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" type="submit" onClick={() => setIsSubmitted(true)}>
          Wyślij instrukcje
        </Button>
        <Link href="/login" className="text-sm text-center">
          Powrót do logowania
        </Link>
      </CardFooter>
    </Card>
  );
}
