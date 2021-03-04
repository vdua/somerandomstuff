import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const isRoot = pathname === "/";

  const logo = (
    <div className="mb-4">
      <h1 className="px-4 py-0 mb-0 mt-5">
        <Link href="/">
          <a className="text-4xl font-black text-black no-underline">
            Some More Random Stuff
          </a>
        </Link>
      </h1>
      <h2 className="px-4 m-0">
        <i>On the Internet</i>
      </h2>
    </div>
  );

  const menu = (
    <nav role="full-horizontal" className="m-5">
      <ul className="list-none flex justify-between m-0 max-w-screen-sm">
        <li className="p-2">
          <a href="#" className="anchor">
            About
          </a>
        </li>
        <li className="p-2">
          <a href="mailto:vdua@adobe.com" className="anchor">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <header className="flex flex-col border-0 border-b border-gray-300 border-solid justify-between items-center lg:flex-row">
        {logo}
        {menu}
      </header>
      <main className="container mx-auto max-w-screen-sm pb-10 flex-grow">
        {children}
      </main>
      <footer className="w-full h-20 flex justify-center items-center flex-col">
        <p className="m-0 flex justify-center items-center">
          <span>Powered by</span>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="anchor "
          >
            {" "}
            <img src="/vercel.svg" alt="Vercel Logo" className="h-5 pl-2" />
          </a>
        </p>
        <p className="m-0">
          © {new Date().getFullYear()}, Built with{" "}
          <a href="https://nextjs.org/" className="anchor">
            Next.js
          </a>{" "}
          &#128293;
        </p>
      </footer>
    </div>
  );
}
