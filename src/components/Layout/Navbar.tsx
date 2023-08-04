import React, { Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { api } from "~/utils/api";
import { type Session } from "next-auth";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProfileDropDownTypes {
  sessionData: Session;
}

const ProfileDropDown = ({ sessionData }: ProfileDropDownTypes) => {
  const { data: noteData } = api.note.getAll.useQuery();
  const { data: tagData } = api.tag.getAll.useQuery();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ">
          {sessionData?.user.name}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Account settings
                </a>
              )}
            </Menu.Item> */}
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Support
                </a>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <p>{sessionData?.user.email}</p>
                  <p>
                    Notes : <b>{noteData?.length}</b>
                  </p>
                  <p>
                    Tags : <b>{tagData?.length}</b>
                  </p>
                </div>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  type="submit"
                  className={classNames(
                    active ? "bg-red-100 text-red-500" : "text-red-500",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-20 w-full items-center justify-center  ">
      <nav className="m-auto flex w-full items-center justify-between text-white">
        <Link href={"/"} className="text-4xl font-bold">
          <span className="text-blue-600">Notes</span>App
        </Link>
        {sessionData ? (
          <ProfileDropDown sessionData={sessionData} />
        ) : (
          <button
            className="rounded-md bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            SignIn
          </button>
        )}
      </nav>
    </div>
  );
}
