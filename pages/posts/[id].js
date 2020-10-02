import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Layout from "../../components/layout";
import ReactMarkdown from "react-markdown/with-html";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock = ({ language, value }) => {
  return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
};

export default function Post({ content, frontmatter }) {
  return (
    <Layout>
      <article>
        <ReactMarkdown
          escapeHtml={false}
          source={content}
          renderers={{ code: CodeBlock }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync("content/posts");

  const paths = files.map((filename) => ({
    params: {
      id: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps({ params: { id } }) {
  const markdownWithMetadata = fs
    .readFileSync(path.join("content/posts", id + ".md"))
    .toString();

  const { data, content } = matter(markdownWithMetadata);
  console.log(data);
  // Convert post date to format: Month day, Year
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = data.updatedAt.toLocaleDateString("en-US", options);
  console.log(formattedDate);

  const frontmatter = {
    ...data,
    updatedAt: formattedDate,
  };

  return {
    props: {
      content: `# ${data.title}\n${content}`,
      frontmatter,
    },
  };
}
