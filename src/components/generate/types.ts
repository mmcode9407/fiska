import type { FlashcardProposalDTO } from "@/types";

export interface LocalFlashcardProposal extends Omit<FlashcardProposalDTO, "source"> {
  id: string;
  source: "ai-full" | "ai-edited";
  accepted: boolean;
  edited: boolean;
}
