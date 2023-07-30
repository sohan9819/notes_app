import React from "react";
import { useRouter } from "next/router";

const EditNote = () => {
  const router = useRouter();
  const noteId = router.query.noteId;

  return <div>EditNote : {noteId}</div>;
};

export default EditNote;
