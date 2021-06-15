import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Layout from "../../components/layout";
import ReactMarkdown from "react-markdown/with-html";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import PostModel from "../../lib/Post";
import toc from "remark-toc";
import HeadingRenderer from "../../components/headingRenderer";
const CodeBlock = ({ language, value }) => {
  return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
};

export default function Post({ content, frontmatter }) {
  return (
    <Layout>
      <article className="text-justify">
        <ReactMarkdown
          escapeHtml={false}
          source={content}
          className="markdown-content"
          renderers={{ code: CodeBlock, heading: HeadingRenderer }}
          plugins={[toc]}
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
  const post = new PostModel(id, markdownWithMetadata);
  const postJson = post.json;

  return {
    props: {
      ...postJson,
      content: `# ${postJson.title}\n${postJson.content}`,
    },
  };
}
