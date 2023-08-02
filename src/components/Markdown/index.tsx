import React, { useState, useEffect, useRef } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import { VscPreview } from "react-icons/vsc";

interface MarkdownProps {
  doc: string;
  handleDocChange: (newDoc: string) => void;
}

function Markdown({ doc, handleDocChange }: MarkdownProps) {
  const [previewState, setPreviewState] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-full  w-full max-w-6xl flex-col items-start gap-4 md:flex-row">
      <button
        className="ml-auto block flex-1 rounded-md bg-gray-600 px-4 py-2 font-bold text-white md:hidden"
        type="button"
        onClick={() => void setPreviewState((prev) => !prev)}
      >
        <VscPreview />
      </button>
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
  );
}

export default Markdown;
