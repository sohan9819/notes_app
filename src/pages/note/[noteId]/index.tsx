import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Preview } from "~/components";
import { StageSpinner } from "react-spinners-kit";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NoteId() {
  const router = useRouter();
  const noteId = router.query.noteId as string;
  const utils = api.useContext();
  const { data: note, isLoading } = api.note.getById.useQuery({ id: noteId });
  const tags = note?.NoteTag.map((nt) => nt.tag.title);

  const { mutateAsync: deleteNote } = api.note.delete.useMutation({
    onSuccess: async () => {
      await utils.note.getAll.invalidate();
      void router.replace("/");
    },
    onError: (error) => {
      console.log("Note Delete Error : ", error);
    },
  });

  const handleDeleteNote = () => {
    if (note?.id) {
      if (window.confirm("Are you sure you want to delete this note?")) {
        const deleteNoteStatus = deleteNote({ id: note?.id });
        void toast.promise(deleteNoteStatus, {
          loading: "Deleting a note...",
          success: "Note deleted successfuly",
          error: "Error deleting a note",
        });
      }
    } else {
      toast.error("Invalid id , unable to delete note");
    }
  };

  return (
    <div className="mx-auto mt-5  flex h-full w-full max-w-6xl flex-col items-start justify-center gap-4 py-6">
      {isLoading && (
        <div className="mt-[10vh] flex w-full items-center justify-center">
          <StageSpinner />
        </div>
      )}
      {!isLoading && (
        <div className="mx-auto mb-10 flex w-full max-w-2xl items-center justify-center gap-4">
          <button
            onClick={() => void router.back()}
            className="mr-auto rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Back
          </button>
          <Link
            href={`/note/${noteId}/edit`}
            className="rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Edit
          </Link>
          <button
            className="rounded-md bg-red-500 px-2 py-1 text-white"
            onClick={handleDeleteNote}
          >
            Delete
          </button>
        </div>
      )}
      <h1 className="w-full text-center text-4xl font-bold text-white">
        {note?.title}
      </h1>
      <pre className="w-full text-center text-gray-400">
        {note?.createdAt.toDateString()}
      </pre>
      <div className="mx-auto flex h-full w-full max-w-xl flex-wrap items-center justify-center  px-6 pb-2 pt-4">
        {tags?.map((tag, index) => (
          <span
            key={index}
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="w-full max-w-6xl">
        <Preview doc={note ? note?.content : ""} />
      </div>
    </div>
  );
}
