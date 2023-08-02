import React from "react";
import { NoteForm } from "~/components";
import { type RawNote } from "~/utils/types";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function NewNote() {
  const router = useRouter();
  const utils = api.useContext();
  const { mutate: createNote } = api.note.create.useMutation({
    onMutate: async (newNote) => {
      await utils.note.getAll.cancel();
      utils.note.getAll.setData(undefined, (prevNotes) => {
        if (prevNotes) {
          return [
            {
              id: "temp-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              title: newNote.title,
              content: newNote.content,
              userId: "temp-user-id",
              NoteTag: [],
            },
            ...prevNotes,
          ];
        } else {
          return [
            {
              id: "temp-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              title: newNote.title,
              content: newNote.content,
              userId: "temp-user-id",
              NoteTag: [],
            },
          ];
        }
      });
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Note created successfuly");
      void router.push("/");
    },
    onError: (error) => {
      console.log("Create Note Error", error);
      toast.error("Error creating a note");
    },
    onSettled: async () => {
      await utils.note.getAll.invalidate();
    },
  });

  const submitHandler = (note: RawNote) => {
    console.log(note);
    createNote({ ...note, tagIds: note.tags.map((tag) => tag.value) });
  };

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <h1 className="text-2xl text-white">New Note</h1>
      <NoteForm onSubmit={submitHandler} />
    </div>
  );
}

export default NewNote;
