import React from "react";
import { NoteForm } from "~/components";
import { type RawNote } from "~/utils/types";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function NewNote() {
  const router = useRouter();
  const utils = api.useContext();
  const { mutateAsync: createNote, isLoading } = api.note.create.useMutation({
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
      // toast.success("Note created successfuly");
      void router.push("/");
    },
    onError: (error) => {
      console.log("Create Note Error", error);
    },
    onSettled: async () => {
      await utils.note.getAll.invalidate();
    },
  });

  const submitHandler = (note: RawNote) => {
    console.log(note);
    const createNoteStatus = createNote({
      ...note,
      tagIds: note.tags.map((tag) => tag.value),
    });

    void toast.promise(createNoteStatus, {
      loading: "Creating a new note...",
      success: "Note created successfuly",
      error: "Error creating a note",
    });
  };

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-4xl font-bold text-white">New Note</h1>
        <button
          className="rounded-md bg-blue-500 px-2 py-1 text-white"
          onClick={() => void router.back()}
        >
          Back
        </button>
      </div>
      <NoteForm onSubmit={submitHandler} disabled={isLoading} />
    </div>
  );
}

export default NewNote;
