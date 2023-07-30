import React from "react";
import Head from "next/head";

function Header() {
  return (
    <Head>
      <title>NotesApp</title>
      <meta name="description" content="Note taking app using Markdown" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
}

export default Header;
