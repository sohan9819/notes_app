import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import Select from "react-select/creatable";
import { Editor, Preview } from "./index";
import { VscPreview } from "react-icons/vsc";
import { type NoteData, type Tag } from "~/utils/types";

interface NoteFormProps {
  onSubmit: (data: NoteData) => void;
}

function NoteForm({ onSubmit }: NoteFormProps) {
  const [doc, setDoc] = useState<string>("# Hello, World!\n");
  const [previewState, setPreviewState] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const syncScrollPreview = () => {
      const editorDiv = editorRef.current;
      const previewDiv = previewRef.current;

      if (!editorDiv || !previewDiv) return;

      const editorScrollPercentage =
        editorDiv.scrollTop / (editorDiv.scrollHeight - editorDiv.clientHeight);
      const previewScrollPercentage =
        previewDiv.scrollTop /
        (previewDiv.scrollHeight - previewDiv.clientHeight);

      if (Math.abs(editorScrollPercentage - previewScrollPercentage) > 0.01) {
        // Sync editor to preview
        editorDiv.scrollTop =
          previewScrollPercentage *
          (editorDiv.scrollHeight - editorDiv.clientHeight);
      }
    };

    const syncScrollEditor = () => {
      const editorDiv = editorRef.current;
      const previewDiv = previewRef.current;

      if (!editorDiv || !previewDiv) return;

      const editorScrollPercentage =
        editorDiv.scrollTop / (editorDiv.scrollHeight - editorDiv.clientHeight);
      const previewScrollPercentage =
        previewDiv.scrollTop /
        (previewDiv.scrollHeight - previewDiv.clientHeight);

      if (Math.abs(previewScrollPercentage - editorScrollPercentage) > 0.01) {
        // Sync editor to preview
        previewDiv.scrollTop =
          editorScrollPercentage *
          (previewDiv.scrollHeight - previewDiv.clientHeight);
      }
    };

    const editorDiv = editorRef.current;
    const previewDiv = previewRef.current;

    if (editorDiv && previewDiv) {
      editorDiv.addEventListener("scroll", syncScrollEditor);
      previewDiv.addEventListener("scroll", syncScrollPreview);
    }

    return () => {
      if (editorDiv && previewDiv) {
        editorDiv.removeEventListener("scroll", syncScrollEditor);
        previewDiv.removeEventListener("scroll", syncScrollPreview);
      }
    };
  }, []);

  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc);
  }, []);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      tags: selectedTags,
      markdown: doc,
    });
  };
  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleOnSubmit}
    >
      <div className="flex w-full max-w-2xl items-start gap-4">
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="title" className="text-xl text-white">
            Title
          </label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            className="h-[2.6rem] w-full rounded-md px-2 py-1 text-xl text-[#0d1117] outline-none"
            required
            name="title"
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="tags" className="text-xl text-white">
            Tags
          </label>
          <Select
            isMulti
            className="w-full text-xl"
            required
            name="tags"
            onCreateOption={undefined}
            options={selectedTags.map((tag) => {
              return { label: tag.label, value: tag.id };
            })}
            value={selectedTags.map((tag) => ({
              label: tag.label,
              value: tag.id,
            }))}
            onChange={(tags) => {
              setSelectedTags(
                tags.map((tag) => ({ label: tag.label, id: tag.value }))
              );
            }}
          />
        </div>
      </div>
      <button
        className="ml-auto block rounded-full bg-gray-600 px-4 py-2 font-bold text-white md:hidden"
        type="button"
        onClick={() => void setPreviewState((prev) => !prev)}
      >
        <VscPreview />
      </button>
      <div className="flex h-full  w-full max-w-6xl items-start gap-4">
        <div
          ref={editorRef}
          className={`h-full max-h-[80vh] min-h-[20rem] w-full overflow-x-auto  rounded-md bg-[#282c34] ${
            !previewState ? "block" : "hidden"
          }`}
        >
          <Editor onChange={handleDocChange} initialDoc={doc} />
        </div>
        <div
          ref={previewRef}
          className={`h-full max-h-[80vh] min-h-[20rem]  w-full overflow-x-auto  bg-[#0d1117] md:block ${
            previewState ? "block" : "hidden"
          }`}
        >
          <Preview doc={doc} />
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 "
          type="submit"
        >
          Save
        </button>

        <button
          className="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
          type="reset"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
