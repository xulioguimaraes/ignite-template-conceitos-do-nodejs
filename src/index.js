const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userExist = users.some((item) => item?.username === username);

  if (!userExist) {
    return response.status(400).json({ error: "Usuario não existe" });
  }
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExist = users.find((item) => item?.username === username);

  if (userExist) {
    return response.status(400).json({ error: "Usuario já existe" });
  }

  users.push({ name, username, id: uuidv4(), todos: [] });
  return response.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;

  const toDos = users.find((item) => item?.username === username);

  return response.json({ todos: toDos?.todos }).send();
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { title, deadline } = request.body;

  users = users.map((item) => {
    if (item?.username === username) {
      item.todos = [
        ...item.todos,
        {
          id: uuidv4(),
          title,
          done: false,
          deadline: new Date(deadline),
          created_at: new Date(),
        },
      ];
      return item;
    }
    return item;
  });
  return response.send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;
  const { title, deadline } = request.body;

  users = users.map((item) => {
    if (item?.username === username) {
      item.todos = item.todos.map((evt) => {
        if (evt.id === id) {
          (evt.title = title), (evt.deadline = new Date(deadline));
          return evt;
        }
        return evt;
      });
      return item;
    }
    return item;
  });
  response.status(200).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;

  users = users.map((item) => {
    if (item?.username === username) {
      item.todos = item.todos.map((evt) => {
        if (evt.id === id) {
          evt.done = !evt.done;
          return evt;
        }
        return evt;
      });
      return item;
    }
    return item;
  });
  response.status(200).send();
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;

  users = users.map((item) => {
    if (item?.username === username) {
      item.todos = item.todos.filter((evt) => {
        if (evt.id !== id) {
          return evt;
        }
      });
      return item;
    }
    return item;
  });
  response.status(200).send();
});

module.exports = app;
