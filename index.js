const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "D5MVBx38yX02kZILcDbIXr6+CgD5pPl4OoQRkOsASHuZz9l6aTtz0GCirez+0GGH+B3W8mXp3tHkfWAUII28OX4GAHmCF1C7FRJj7hVcfrxS6FU6qUHrUWtgtVITUZy2xToww27FXxizRZS4jJ/QUQdB04t89/1O/w1cDnyilFU=";

app.get("/", (req, res) => {
  res.send("OK");
});

let orders = {
  "123": { status: "waiting" }
};

app.post("/webhook", async (req, res) => {
  const event = req.body.events[0];

  if (!event || event.type !== "message") {
    return res.sendStatus(200);
  }

  const text = event.message.text;
  const match = text.match(/#(\d+)/);

  if (match) {
    const orderId = match[1];

    if (!orders[orderId]) {
      return reply(event.replyToken, "❌ 查無此訂單");
    }

    if (orders[orderId].status === "waiting") {
      orders[orderId].status = "assigned";
      return reply(event.replyToken, "✅ 接單成功");
    } else {
      return reply(event.replyToken, "❌ 已被接走");
    }
  }

  res.sendStatus(200);
});

function reply(replyToken, text) {
  return axios.post("https://api.line.me/v2/bot/message/reply", {
    replyToken,
    messages: [{ type: "text", text }]
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT);
