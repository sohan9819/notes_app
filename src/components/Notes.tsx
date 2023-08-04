import Link from "next/link";
import React, { useState, useMemo } from "react";
import { api } from "~/utils/api";
import NoteCard from "./NoteCard";
import { StageSpinner } from "react-spinners-kit";
import Select from "react-select";
import { type RawTag } from "~/utils/types";

const Notes = () => {
  const [selectedTags, setSelectedTags] = useState<RawTag[]>([]);
  const [search, setSearch] = useState("");

  const { data: notes, isLoading } = api.note.getAll.useQuery();
  const { data: tags, isLoading: isTagsLoading } = api.tag.getAll.useQuery();

  const searchRegex = useMemo(() => {
    return new RegExp(search, "ig");
  }, [search]);

  const filteredNotes = useMemo(() => {
    return notes?.filter((note) => {
      return (
        (search === "" || note.title.match(searchRegex)) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.NoteTag.some((nt) => nt.tagId === tag.value)
          ))
      );
    });
  }, [notes, search, searchRegex, selectedTags]);

  return (
    <div className="container flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-2xl justify-between ">
        <h1 className="text-4xl font-bold text-white">Notes</h1>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={"/note"}
            className="rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Create
          </Link>
          <Link
            href={"/tag"}
            className="rounded-md bg-gray-200 px-2 py-1 text-gray-700"
          >
            Tags
          </Link>
        </div>
      </div>
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
            value={search}
            onChange={(e) => void setSearch(e.target.value)}
            placeholder="Search for Title"
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
            options={tags?.map((tag) => ({ label: tag.title, value: tag.id }))}
            value={selectedTags}
            onChange={(tags) => setSelectedTags(tags as RawTag[])}
            isLoading={isTagsLoading}
            placeholder={"Search for Tags"}
          />
        </div>
      </div>
      <div className="mt-10">
        {isLoading ? (
          <div className="flex w-full items-center justify-center text-white">
            <StageSpinner />
          </div>
        ) : (
          <div className="flex w-full flex-wrap items-start justify-center gap-4">
            {filteredNotes?.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
            {filteredNotes?.length === 0 && (
              <h2 className="text-2xl text-white">No notes are found 🔍</h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
