import { useState, useCallback, type FormEvent } from "react";
import Select from "react-select/creatable";
import Markdown from "./Markdown";
import { type RawTag, type RawNote } from "~/utils/types";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface NoteFormProps {
  onSubmit: (data: RawNote) => void;
  noteFormState?: RawNote;
  disabled: boolean;
}

function NoteForm({
  onSubmit,
  noteFormState = undefined,
  disabled,
}: NoteFormProps) {
  const [title, setTitle] = useState<string>(
    noteFormState ? noteFormState.title : ""
  );
  const [doc, setDoc] = useState<string>(
    noteFormState ? noteFormState.content : "# Hello, World!\n"
  );
  const [selectedTags, setSelectedTags] = useState<RawTag[]>(
    noteFormState ? noteFormState.tags : []
  );

  const router = useRouter();
  const utils = api.useContext();
  const { data: allTags, isLoading: isAllTagsLoading } =
    api.tag.getAll.useQuery();
  const { mutateAsync: createTag, isLoading: isCreateTagLoading } =
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

  const handleDocChange = useCallback(
    (newDoc: string) => {
      if (!disabled) {
        setDoc(newDoc);
      }
    },
    [disabled]
  );

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    // const form = e.target as HTMLFormElement;
    if (doc === "" || doc.length <= 20 || doc === "# Hello, World!\n") {
      console.log("Enter valid inputs");
    } else {
      onSubmit({
        title,
        tags: selectedTags,
        content: doc,
      });
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
            type="text"
            id="title"
            className="h-[2.6rem] w-full rounded-md px-2 py-1 text-xl text-[#0d1117] outline-none"
            required
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            maxLength={60}
            disabled={disabled}
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
              if (tagValue.replace(/ /g, "").length <= 10) {
                const createTagStatus = createTag({ tag: tagValue });
                void toast.promise(createTagStatus, {
                  loading: "Creating a new tag...",
                  success: "Created new tag successfuly",
                  error: "Error creating tag",
                });
              } else {
                toast.error("Tags should no have more than 10 letters");
              }
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
              tags.length < 10
                ? setSelectedTags(tags as RawTag[])
                : toast.error("Maximum only 4 tags are allowed")
            }
            isLoading={isAllTagsLoading || isCreateTagLoading}
            isDisabled={disabled}
          />
        </div>
      </div>
      <Markdown doc={doc} handleDocChange={handleDocChange} />
      <div className="flex gap-4">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 "
          type="submit"
          disabled={disabled}
        >
          Save
        </button>

        <button
          className="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
          type="reset"
          onClick={() => void router.back()}
          disabled={disabled}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
