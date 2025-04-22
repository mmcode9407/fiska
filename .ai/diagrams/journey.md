```mermaid
stateDiagram-v2
[*] --> StronaGlowna

state PublicZone {
    StronaGlowna --> PanelLogowania: Logowanie
    StronaGlowna --> PanelRejestracji: Rejestracja

    state Rejestracja {
        PanelRejestracji --> WalidacjaRejestracji
        state if_rejestracja <<choice>>
        WalidacjaRejestracji --> if_rejestracja
        if_rejestracja --> WyslanieMaila: Dane poprawne
        if_rejestracja --> BladRejestracji: Dane niepoprawne
        BladRejestracji --> PanelRejestracji
        WyslanieMaila --> PotwierdzenieRejestracji
        PotwierdzenieRejestracji --> PanelLogowania
    }

    state Logowanie {
        PanelLogowania --> WalidacjaLogowania
        state if_logowanie <<choice>>
        WalidacjaLogowania --> if_logowanie
        if_logowanie --> Dashboard: Dane poprawne
        if_logowanie --> BladLogowania: Dane niepoprawne
        BladLogowania --> PanelLogowania
    }

    PanelLogowania --> ResetHasla: Zapomniałem hasła

    state ResetHasla {
        state if_email <<choice>>
        ResetHasla --> if_email
        if_email --> WyslanieResetuHasla: Email istnieje
        if_email --> BladEmaila: Email nie istnieje
        BladEmaila --> ResetHasla
        WyslanieResetuHasla --> NoweHaslo
        state if_haslo <<choice>>
        NoweHaslo --> if_haslo
        if_haslo --> PanelLogowania: Hasło zmienione
        if_haslo --> BladHasla: Błąd walidacji
        BladHasla --> NoweHaslo
    }
}

state AuthZone {
    Dashboard --> GenerowanieFiszek
    Dashboard --> MojeFiszki
    Dashboard --> ZarzadzanieKontem

    state GenerowanieFiszek {
        state if_tekst <<choice>>
        GenerowanieFiszek --> if_tekst
        if_tekst --> PrzetwarzanieAI: Tekst poprawny
        if_tekst --> BladTekstu: Tekst niepoprawny
        BladTekstu --> GenerowanieFiszek
        PrzetwarzanieAI --> RecenzjaFiszek
        state if_recenzja <<choice>>
        RecenzjaFiszek --> if_recenzja
        if_recenzja --> MojeFiszki: Zaakceptowane
        if_recenzja --> GenerowanieFiszek: Odrzucone
    }

    state MojeFiszki {
        MojeFiszki --> EdycjaFiszki
        MojeFiszki --> UsuwanieFiszki
        EdycjaFiszki --> MojeFiszki
        UsuwanieFiszki --> MojeFiszki
    }

    state ZarzadzanieKontem {
        ZarzadzanieKontem --> EdycjaDanych
        ZarzadzanieKontem --> UsuniecieKonta
        EdycjaDanych --> ZarzadzanieKontem
        UsuniecieKonta --> [*]
    }
}

AuthZone --> Wylogowanie: Wyloguj
Wylogowanie --> StronaGlowna
```
