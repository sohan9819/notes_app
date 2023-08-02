import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import NoteCard from "./NoteCard";

const Notes = () => {
  const { data: notes, isLoading } = api.note.getAll.useQuery();

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <h1 className="text-2xl text-white">Notes</h1>
      <Link href={"/note"} className="rounded-md bg-white px-2 py-1 text-black">
        Create Note
      </Link>
      <div>{isLoading && <h1 className="text-white">Loading...</h1>}</div>
      <div>
        {notes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default Notes;
