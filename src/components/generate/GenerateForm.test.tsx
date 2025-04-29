import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GenerateForm } from "./GenerateForm";

describe("GenerateForm", () => {
  const mockOnSourceTextChange = vi.fn();
  const mockOnGenerate = vi.fn();

  beforeEach(() => {
    mockOnSourceTextChange.mockClear();
    mockOnGenerate.mockClear();
  });

  it("renders form with correct elements", () => {
    render(<GenerateForm sourceText="" onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />);

    expect(screen.getByLabelText("Tekst źródłowy")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Wklej tutaj tekst/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generuj fiszki/ })).toBeInTheDocument();
    expect(screen.getByText("Liczba znaków: 0")).toBeInTheDocument();
  });

  it("displays character count", () => {
    const text = "Lorem ipsum dolor sit amet";
    render(<GenerateForm sourceText={text} onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />);

    expect(screen.getByText(`Liczba znaków: ${text.length}`)).toBeInTheDocument();
  });

  it("calls onSourceTextChange when user enters text", () => {
    render(<GenerateForm sourceText="" onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "New text" } });

    expect(mockOnSourceTextChange).toHaveBeenCalledWith("New text");
  });

  it("disables button when text is too short", () => {
    const shortText = "Too short";
    render(
      <GenerateForm sourceText={shortText} onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("displays error message when text has invalid length", () => {
    const shortText = "Too short";
    render(
      <GenerateForm sourceText={shortText} onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />
    );

    expect(screen.getByText("Tekst musi mieć od 1000 do 10000 znaków")).toBeInTheDocument();
  });

  it("does not display error when field is empty", () => {
    render(<GenerateForm sourceText="" onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />);

    expect(screen.queryByText("Tekst musi mieć od 1000 do 10000 znaków")).not.toBeInTheDocument();
  });

  it("calls onGenerate when form is valid and submitted", () => {
    const validText = "a".repeat(1000);

    render(
      <GenerateForm sourceText={validText} onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />
    );

    const button = screen.getByRole("button", { name: /Generuj fiszki/ });
    fireEvent.click(button);

    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  it("changes button text and disables form when in disabled state", () => {
    render(
      <GenerateForm
        sourceText={"a".repeat(1000)}
        onSourceTextChange={mockOnSourceTextChange}
        onGenerate={mockOnGenerate}
        disabled={true}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Generowanie...");
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("does not call onGenerate when text is invalid", () => {
    const shortText = "Too short";

    render(
      <GenerateForm sourceText={shortText} onSourceTextChange={mockOnSourceTextChange} onGenerate={mockOnGenerate} />
    );

    const button = screen.getByRole("button", { name: /Generuj fiszki/ });
    fireEvent.click(button);

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });
});
