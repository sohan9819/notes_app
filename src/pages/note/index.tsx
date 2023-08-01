import React from "react";
import { NoteForm } from "~/components";
import { type NoteData } from "~/utils/types";

function NewNote() {
  const submitHandler = (note: NoteData) => {
    console.log(note);
  };

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <h1 className="text-2xl text-white">New Note</h1>
      <NoteForm onSubmit={submitHandler} />
    </div>
  );
}

export default NewNote;
