import matter from "gray-matter";
import { without } from "./utils";
import yaml from "js-yaml";

class Post {
  constructor(filename, data) {
    this.filename = filename;
    this.data = data;
  }

  get json() {
    const { data, content } = matter(this.data, {
      engines: {
        yaml: (s) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }),
      },
    });
    let publishedAt = -1;
    if (data.publishedAt) {
      publishedAt = Date.parse(data.publishedAt);
    }
    let lastUpdatedAt = -1;
    if (data.lastUpdatedAt) {
      lastUpdatedAt = Date.parse(data.lastUpdatedAt);
    }

    const retVal = {
      ...data,
      frontmatter: without(data, ["lastUpdatedAt", "publishedAt"]),
      slug: this.filename.replace(".md", ""),
      lastUpdatedAt,
      publishedAt,
      content,
    };
    return retVal;
  }
}

export default Post;
