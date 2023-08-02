import { useState, useCallback, useRef, type FormEvent } from "react";
import Select from "react-select/creatable";
import Markdown from "./Markdown";
import { type RawTag, type RawNote } from "~/utils/types";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface NoteFormProps {
  onSubmit: (data: RawNote) => void;
}

function NoteForm({ onSubmit }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [doc, setDoc] = useState<string>("# Hello, World!\n");
  const [selectedTags, setSelectedTags] = useState<RawTag[]>([]);

  const utils = api.useContext();
  const { data: allTags, isLoading: isAllTagsLoading } =
    api.tag.getAll.useQuery();
  const { mutate: createTag, isLoading: isCreateTagLoading } =
    api.tag.create.useMutation({
      onMutate: async (newTag) => {
        await utils.tag.getAll.cancel();
        utils.tag.getAll.setData(undefined, (prevTags) => {
          if (prevTags) {
            return [
              {
                id: "temp-id",
                createdAt: new Date(),
                updatedAt: new Date(),
                title: newTag.tag,
                userId: "temp-user-id",
              },
              ...prevTags,
            ];
          } else {
            return [
              {
                id: "temp-id",
                createdAt: new Date(),
                updatedAt: new Date(),
                title: newTag.tag,
                userId: "temp-user-id",
              },
            ];
          }
        });
      },
      onSuccess: (data) => {
        setSelectedTags((prev) => [
          ...prev,
          { label: data.title, value: data.id },
        ]);
      },
      onSettled: async () => {
        await utils.tag.getAll.invalidate();
      },
    });

  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc);
  }, []);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (doc === "" || doc.length <= 20 || doc === "# Hello, World!\n") {
      console.log("Enter valid inputs");
    } else {
      onSubmit({
        title: titleRef.current!.value,
        tags: selectedTags,
        content: doc,
      });
      form.reset();
      setDoc("# Hello, World!\n");
    }
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
            onCreateOption={(tagValue) => {
              tagValue.replace(/ /g, "").length <= 10
                ? createTag({ tag: tagValue })
                : toast.error("Tags should no have more than 10 letters");
            }}
            options={
              allTags
                ? allTags.map((tag) => {
                    return { label: tag.title, value: tag.id };
                  })
                : []
            }
            value={selectedTags}
            onChange={(tags) =>
              tags.length < 5
                ? setSelectedTags(tags as RawTag[])
                : toast.error("Maximum only 4 tags are allowed")
            }
            isLoading={isAllTagsLoading || isCreateTagLoading}
          />
        </div>
      </div>
      <Markdown doc={doc} handleDocChange={handleDocChange} />
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
