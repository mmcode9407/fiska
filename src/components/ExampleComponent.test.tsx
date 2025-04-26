import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Przykładowy komponent do testów - w rzeczywistości powinien być importowany
const ExampleButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} data-testid="example-button">
      {children}
    </button>
  );
};

describe("ExampleButton", () => {
  it("renderuje się poprawnie z dziećmi", () => {
    // ARRANGE
    render(
      <ExampleButton
        onClick={() => {
          /* pusta funkcja */
        }}
      >
        Kliknij mnie
      </ExampleButton>
    );

    // ACT
    const button = screen.getByTestId("example-button");

    // ASSERT
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Kliknij mnie");
  });

  it("wywołuje funkcję onClick po kliknięciu", async () => {
    // ARRANGE
    const handleClick = vi.fn();
    render(<ExampleButton onClick={handleClick}>Kliknij mnie</ExampleButton>);

    // ACT
    const button = screen.getByTestId("example-button");
    await userEvent.click(button);

    // ASSERT
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
