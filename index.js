const typeorm = require("typeorm");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

var dataSource = new typeorm.DataSource({
  type: "postgres",
  host: "ap-southeast-1.42f19d1a-ecff-4d66-9dd7-5582402412b3.aws.ybdb.io",
  username: "admin",
  password: "DIC83sI3RlQlXlD-w9Wfh_Nr9Hjpdy",
  database: "movies",
  synchronize: true,
  connectionTimeoutMillis: 5000,
  port: "5433",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "root.crt")).toString(),
  },
  connectionTimeoutMillis: 5000,
  entities: [require("./entity/Post"), require("./entity/Category")],
});

dataSource
  .initialize()
  .then(function () {
    var category1 = {
      name: "TypeScript",
    };
    var category2 = {
      name: "Programming",
    };

    var post = {
      title: "Control flow based type analysis",
      text: "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.",
      categories: [category1, category2],
    };

    var postRepository = dataSource.getRepository("Post");
    postRepository
      .save(post)
      .then(function (savedPost) {
        console.log("Post has been saved: ", savedPost);
        console.log("Now lets load all posts: ");

        return postRepository.find();
      })
      .then(function (allPosts) {
        console.log("All posts: ", allPosts);
      });
  })
  .catch(function (error) {
    console.log("Error: ", error);
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
});
