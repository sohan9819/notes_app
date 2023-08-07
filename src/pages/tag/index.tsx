import React, { useState, useMemo } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { StageSpinner } from "react-spinners-kit";
import { EditTag } from "~/components";
import Select from "react-select";
import { type RawTag } from "~/utils/types";

const Tags = () => {
  const { data: tagsList, isLoading: isTagsLoading } =
    api.tag.getAll.useQuery();

  const [selectedTags, setSelectedTags] = useState<RawTag[]>([]);
  const filteredTags = useMemo(() => {
    return selectedTags.length === 0
      ? tagsList
      : tagsList?.filter((tagData) =>
          selectedTags.some((tag) => tag.value === tagData.id)
        );
  }, [tagsList, selectedTags]);

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-2xl justify-between ">
        <h1 className="text-4xl font-bold text-white">Tags</h1>
        <div className="flex items-center justify-center gap-4">
          {/* <Link
            href={"/note"}
            className="rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Create
          </Link> */}
          <Link
            href={"/"}
            className="rounded-md bg-gray-200 px-2 py-1 text-gray-700"
          >
            Notes
          </Link>
        </div>
      </div>

      {isTagsLoading ? (
        <div className="mt-10 flex w-full items-center justify-center text-white">
          <StageSpinner />
        </div>
      ) : (
        <>
          <div className="my-4 w-full max-w-xl">
            <Select
              isMulti
              className="w-full text-xl"
              required
              name="tags"
              options={tagsList?.map((tag) => ({
                label: tag.title,
                value: tag.id,
              }))}
              value={selectedTags}
              onChange={(tags) => setSelectedTags(tags as RawTag[])}
              isLoading={isTagsLoading}
              placeholder={"Search for Tags"}
            />
          </div>
          <div className="relative w-full max-w-2xl overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm  ">
              <thead className="text-l bg-white/10  uppercase text-white ">
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
                {filteredTags?.map((tag) => (
                  <EditTag key={tag.id} tag={tag} />
                ))}
                {filteredTags?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-2xl text-white">
                      No notes are found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Tags;
