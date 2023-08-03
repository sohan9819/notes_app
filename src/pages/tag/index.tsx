import React from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { StageSpinner } from "react-spinners-kit";
import { EditTag } from "~/components";

const Tags = () => {
  const { data: tagsList, isLoading: isTagsLoading } =
    api.tag.getAll.useQuery();

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-2xl justify-between ">
        <h1 className="text-4xl font-bold text-white">Tags</h1>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={"/note"}
            className="rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Create
          </Link>
          <Link
            href={"/"}
            className="rounded-md bg-gray-200 px-2 py-1 text-gray-700"
          >
            Notes
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-2xl overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm  ">
          <thead className="text-l bg-gray-900 uppercase text-white ">
            <tr>
              <th scope="col" className="px-2 py-3 text-center">
                Tag name
              </th>
              <th scope="col" className="px-2 py-3 text-center" colSpan={2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tagsList?.map((tag) => (
              <EditTag key={tag.id} tag={tag} />
            ))}
          </tbody>
        </table>
      </div>

      {isTagsLoading && (
        <div className="mt-10 flex w-full items-center justify-center text-white">
          <StageSpinner />
        </div>
      )}
    </div>
  );
};

export default Tags;
