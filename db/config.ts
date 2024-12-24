import { defineDb, defineTable, column } from 'astro:db';

const Posts = defineTable({
    columns: {
      id: column.number({ primaryKey: true }),
      title: column.text(),
      slug: column.text(),
      author: column.text(),
      description: column.text(),
      publish_date: column.text(),
      locale: column.text(),
    }
  });

  const Images = defineTable({
    columns: {
      id: column.number({ primaryKey: true }),
      alt: column.text(),
      url: column.text(),
    },
  });

  const Tags = defineTable({
    columns: {
      id: column.number({ primaryKey: true }),
      name: column.text(),
    },
  });
  
  const PostImages = defineTable({
    columns: {
      postId: column.number(),
      imageId: column.number(),
    },
    foreignKeys: [
      {
        columns: ["postId"],
        references: () => [Posts.columns.id],
      },
      {
        columns: ["imageId"],
        references: () => [Images.columns.id],
      }
    ]
  });

  const PostTags = defineTable({
    columns: {
      postId: column.number(),
      tagId: column.number(),
    },
    foreignKeys: [
      {
        columns: ["postId"],
        references: () => [Posts.columns.id],
      },
      {
        columns: ["tagId"],
        references: () => [Tags.columns.id],
      }
    ]
  });


export default defineDb({
  tables: { Posts, Images, Tags, PostImages, PostTags },
});
