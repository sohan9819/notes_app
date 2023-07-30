import Link from "next/link";
import { signIn } from "next-auth/react";
import { BsGithub } from "react-icons/bs";

const Landing = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[#191919]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-blue-600">Notes</span>App
          </h1>
          <pre className="text-2xl text-white">
            Make notes using <strong>Markdown</strong>
          </pre>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#2f2f2f] p-4 text-white hover:bg-white/20"
            href="https://snickerdev.netlify.app/"
            target="_blank"
          >
            <h3 className="text-xl">
              An opensource project by{" "}
              <strong className="text-2xl">SnickerDev</strong>
            </h3>
            <div className="text-lg">Built with ❤️ and T3 stack</div>
          </Link>
          <Link
            className="flex max-w-xs flex-col  items-center justify-evenly gap-4 rounded-xl bg-[#2f2f2f] p-4 text-white hover:bg-white/20"
            href="https://github.com/sohan9819"
            target="_blank"
          >
            <h3 className="text-xl ">Feel free to checkout and cotribute </h3>
            <div className="flex items-center justify-center text-lg">
              <BsGithub className="text-4xl" />
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Try Now
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;
