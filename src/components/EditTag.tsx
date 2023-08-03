import { type Tag } from "@prisma/client";
import { type FormEvent, useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface EditTagProps {
  tag: Tag;
  key: string;
}

export default function EditTag({ tag, key }: EditTagProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(tag.title);

  const utils = api.useContext();
  const { mutateAsync: updateTag, isLoading: isUpdateTagLoading } =
    api.tag.update.useMutation({
      onSuccess: async () => {
        await utils.tag.getAll.invalidate();
      },
      onError: (error) => {
        console.log("Update Tag Error : ", error);
        setTitle(tag.title);
      },
      onSettled: () => {
        setIsEdit((prev) => !prev);
      },
    });

  const { mutateAsync: deleteTag, isLoading: isDeleteTagLoading } =
    api.tag.delete.useMutation({
      onSuccess: async () => {
        await utils.tag.getAll.invalidate();
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title !== tag.title) {
      const updateTagStatus = updateTag({ id: tag.id, tag: title });
      void toast.promise(updateTagStatus, {
        loading: "Updating tag...",
        success: "Tag updated successfuly",
        error: "Error updating a tag",
      });
    } else {
      setIsEdit((prev) => !prev);
    }
  };

  const handleDelete = () => {
    setIsEdit(false);
    if (window.confirm("Are you sure you want to delete this tag?")) {
      const deleteTagStatus = deleteTag({ id: tag.id });
      void toast.promise(deleteTagStatus, {
        loading: "Deleting tag...",
        success: "Tag deleted successfuly",
        error: "Error deleting a tag",
      });
    }
  };

  return (
    <tr className="border-b">
      <td scope="row" className="w-[60%] py-4 text-center font-medium">
        {isEdit ? (
          <form onSubmit={handleSubmit}>
            <input
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
              value={title}
              type="text"
              name="title"
              onChange={(e) => void setTitle(e.target.value)}
              disabled={isUpdateTagLoading || isDeleteTagLoading}
            />
          </form>
        ) : (
          <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            #{title}
          </span>
        )}
      </td>
      <td className="py-4 text-center">
        <button
          className="rounded-md bg-blue-500 px-2 py-1 text-white"
          onClick={() => void setIsEdit((prev) => !prev)}
          disabled={isUpdateTagLoading || isDeleteTagLoading}
        >
          Edit
        </button>
      </td>
      <td className="py-4 text-center">
        <button
          className="rounded-md bg-red-500 px-2 py-1 text-white"
          onClick={handleDelete}
          disabled={isUpdateTagLoading || isDeleteTagLoading}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
