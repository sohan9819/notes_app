import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { NoteForm } from "~/components";
import { type RawNote } from "~/utils/types";
import { api } from "~/utils/api";
import { StageSpinner } from "react-spinners-kit";
import toast from "react-hot-toast";

const EditNote = () => {
  const router = useRouter();
  const noteId = router.query.noteId as string;
  const utils = api.useContext();
  const { data, isLoading: isNoteDataLoading } = api.note.getById.useQuery({
    id: noteId,
  });

  const noteData = useMemo<RawNote>(
    () => ({
      title: data ? data.title : "",
      tags: data
        ? data.NoteTag.map((nt) => ({
            label: nt.tag.title,
            value: nt.tagId,
          }))
        : [],
      content: data ? data.content : "",
    }),
    [data]
  );

  const { mutateAsync: updateNote, isLoading } = api.note.update.useMutation({
    onSuccess: async (data) => {
      void router.replace(`/note/${data.id}`);
      await utils.note.getAll.invalidate();
    },
  });

  const submitHandler = (data: RawNote) => {
    const updatedNoteData = {
      noteId,
      title: data.title,
      tagIds: data.tags.map((tag) => tag.value),
      content: data.content,
    };
    const prevNoteData = {
      noteId,
      title: noteData.title,
      tagIds: noteData.tags.map((tag) => tag.value),
      content: noteData.content,
    };

    if (JSON.stringify(updatedNoteData) !== JSON.stringify(prevNoteData)) {
      const updateNoteStatus = updateNote(updatedNoteData);
      void toast.promise(updateNoteStatus, {
        loading: "Updating a note...",
        success: "Note updated successfuly",
        error: "Error updaing a note",
      });
    } else {
      toast.remove();
      toast("No changes detected to update");
    }
  };

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      {isNoteDataLoading ? (
        <>
          <div className="mt-10 flex w-full items-center justify-center text-white">
            <StageSpinner />
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full max-w-2xl items-center justify-between">
            <h1 className="text-4xl font-bold text-white">Edit Note</h1>
            <button
              className="rounded-md bg-blue-500 px-2 py-1 text-white"
              onClick={() => void router.back()}
            >
              Back
            </button>
          </div>

          {data && (
            <NoteForm
              onSubmit={submitHandler}
              noteFormState={noteData}
              disabled={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EditNote;
