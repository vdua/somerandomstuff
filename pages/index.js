import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import Layout from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

export default function Home({ posts }) {
  return (
    <Layout>
      <Head>
        <title>Some Random Stuff - Built with Nextjs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {posts.map(
          ({ frontmatter: { title, description, updatedAt, tags }, slug }) => (
            <div>
              <article key={slug}>
                <h3 className="mb-2 flex flex-col items-start">
                  <Link href={"/posts/[slug]"} as={`/posts/${slug}`}>
                    <a className="mb-4 text-3xl font-semibold text-orange-600 no-underline">
                      {title}
                    </a>
                  </Link>
                  <span className="mb-4 text-sm text-gray-600">
                    {updatedAt}
                  </span>
                </h3>
                <div>
                  <p className="mb-4 text-justify leading-normal">
                    {description}
                  </p>
                </div>
                <div className="flex min-w-screen-xs items-center">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="mr-2 text-gray-600"
                  />
                  {tags.map((tag, i) => (
                    <Link href={`/tags/${tag}`} as={`/tags/${tag}`}>
                      <a rel="tag" className="tag anchor text-gray-600 mr-2">
                        {tag}
                        {i === tags.length - 1 ? " " : ","}
                      </a>
                    </Link>
                  ))}
                </div>
              </article>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(`${process.cwd()}/content/posts`);

  const posts = files.map((filename) => {
    const markdownWithMetadata = fs
      .readFileSync(`content/posts/${filename}`)
      .toString();

    const { data } = matter(markdownWithMetadata);
    console.log(data);
    // Convert post date to format: Month day, Year
    const options = { year: "numeric", month: "long", day: "numeric" };
    const updatedAt = data.updatedAt.toLocaleDateString("en-US", options);

    const frontmatter = {
      ...data,
      updatedAt,
    };

    return {
      slug: filename.replace(".md", ""),
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
