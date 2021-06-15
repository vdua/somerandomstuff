import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import Layout from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import Post from "../lib/Post";
import { formatDate } from "../lib/utils";
export default function Home({ posts }) {
  return (
    <Layout>
      <Head>
        <title>Some Random Stuff - Built with Nextjs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {posts.map(
          ({ title, description, publishedAt, lastUpdatedAt, tags, slug }) => (
            <div>
              <article key={slug}>
                <h3 className="mb-2 flex flex-col items-start">
                  <Link href={"/posts/[slug]"} as={`/posts/${slug}`}>
                    <a className="mb-4 text-3xl font-semibold text-orange-600 no-underline">
                      {title}
                    </a>
                  </Link>
                  <span className="mb-4 text-sm text-gray-600">
                    {formatDate(publishedAt)}
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

  const posts = files
    .map((filename) => {
      const markdownWithMetadata = fs
        .readFileSync(`content/posts/${filename}`)
        .toString();

      const post = new Post(filename, markdownWithMetadata);
      return post.json;
    })
    .filter(({ state, publishedAt }) => state != "draft" && publishedAt > 0)
    .sort((first, second) => second.publishedAt - first.publishedAt);

  return {
    props: {
      posts,
    },
  };
}
