import { useRouter } from "next/router";

export default function NoteId() {
  const router = useRouter();
  const noteId = router.query.noteId;
  return <div>NoteId : {noteId}</div>;
}
