import React from "react";
import { timeAgo } from "~/utils/timeAgo/timeAgo.utils";
import { type NoteCard } from "~/utils/types";

interface NoteCardProps {
  note: NoteCard;
  key: string;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { title, NoteTag, createdAt } = note;
  const tags = NoteTag.map((nt) => nt.tag.title);

  console.log(createdAt);

  return (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <div className="mb-2  text-xl font-bold ">{title}</div>
        <p className="text-base text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
        {timeAgo(createdAt.toISOString())}
      </div>
      <div className="px-6 pb-2 pt-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
