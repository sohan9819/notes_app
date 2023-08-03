import { type RouterOutputs } from "../api";

export interface RawNote {
  title: string;
  tags: RawTag[];
  content: string;
}

export interface RawTag {
  label: string;
  value: string;
}

export type GetAllNotes = RouterOutputs["note"]["getAll"];
export type NoteCard = RouterOutputs["note"]["getAll"][0];
