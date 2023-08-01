export type Note = {
  id: string;
} & NoteData;

export interface NoteData {
  title: string;
  tags: Tag[];
  markdown: string;
}

export interface Tag {
  id: string;
  label: string;
}
