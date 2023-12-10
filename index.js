const typeorm = require("typeorm");
const fs = require("fs");
const path = require("path");
const express = require("express");

const TelegramBot = require("node-telegram-bot-api");
const request = require("request");

const telegramToken = "6585194080:AAFFdzzaVXlLT29HNLQ6uKVg-KUGZNuuNq0";
const bot = new TelegramBot(telegramToken, { polling: true });

bot.request = async function (command, json) {
  return request.post(
    {
      url: `https://api.telegram.org/bot${telegramToken}/${command}`,
      body: JSON.stringify(json),
      headers: { "Content-Type": "application/json" },
    },
    (error, res, result) => {
      console.log({ result });
    }
  );
};

const commands = [
  {
    command: "start",
    description: "wellcome movie bot",
  },
  {
    command: "search",
    description: "search for movies to data",
  },
  {
    command: "categories",
    description: "display the categories",
  },
  {
    command: "regions",
    description: "display the regions",
  },
  {
    command: "years",
    description: "display the years",
  },
  {
    command: "settings",
    description: "configure settings",
  },
  {
    command: "subcribe",
    description: "buy an subcribe account",
  },
  {
    command: "language",
    description: "change the bot's language",
  },
  {
    command: "help",
    description: "display the help",
  },
];
bot.request("setMyCommands", {
  commands,
  scope: { type: "all_private_chats" },
  language_code: "en",
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Hi! 😊
I am a movie bot. Give me the keyword of your movie and I will send you the new items (articles, tweets, videos etc.) as soon as they are available.

Use /categories, /regions and /years to filter list movies.
Use /search to search for movies.
You can also add me in a Telegram group or channel: howto

For support: /help and @MovieBotSupport

💡 Suggestions 💡
Don't know where to start? First of all, read the /help 😊, and the tutorials here: https://moviebot.com`
  );
});

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hmm!",
  });
});
// https://github.com/BerkeKaragoz/nextjs-muiv5-typeorm-ts-boilerplate

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
