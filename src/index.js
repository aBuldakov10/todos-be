import Fastify from 'fastify';

const app = Fastify({ logger: true });

/** Fastify plugins **/
app.register(import('@fastify/cookie'));
app.register(import('@fastify/cors'), {
  origin: ['http://localhost:63342', 'http://localhost:3000', 'https://abuldakov10.github.io'],
});
// For working with forms and files
app.register(import('@fastify/multipart'), { addToBody: true });

/*** Variables ***/
let groups = [];
let tasks = [];

/*** Method functions ***/
/*** Группы ***/
// получение
app.get('/groups', (request, reply) => {
  reply.send(groups);
  reply.status(201).send(groups);
});

// создание
app.post('/groups', (request, reply) => {
  const {
    body: { title, color },
  } = request;

  const groupObj = { id: Date.now().toString(), title, color };

  groups.push(groupObj);

  return reply.send(groups);
});

// редактирование
app.patch('/groups/:id', (request, replay) => {
  const { id } = request.params;
  const { title, color } = request.body;

  groups = groups.map((item) => {
    if (item.id === id) {
      return { ...item, title, color };
    }
    return item;
  });

  replay.send(groups);
});

// удаление
app.delete('/groups/:id', (request, replay) => {
  const { id } = request.params;

  groups = groups.filter((item) => item.id !== id);

  replay.send(groups);
});

/*** Задачи ***/
// получение
app.get('/tasks', (request, reply) => {
  reply.status(202).send(tasks);
});

// создание
app.post('/tasks', (request, reply) => {
  const {
    body: { title, description, createData, createTime, groupId },
  } = request;

  const taskObj = {
    id: Date.now().toString(),
    title,
    description,
    createData,
    createTime,
    isEdited: false,
    isDone: false,
    groupId,
  };

  tasks.push(taskObj);

  return reply.send(tasks);
});

// редактирование
app.patch('/tasks/:id', (request, replay) => {
  const { id } = request.params;
  const { title, description } = request.body;

  tasks = tasks.map((item) => {
    if (item.id === id) {
      return { ...item, title, description, createTime: Date.now().toString(), isEdited: true };
    }
    return item;
  });

  replay.send(tasks);
});

// завершение
app.patch('/tasks/done/:id', (request, reply) => {
  const { id } = request.params;
  const taskObj = tasks.find((item) => item.id === id);

  tasks = tasks.map((item) => {
    if (item.id === id) {
      return { ...item, isDone: !taskObj.isDone };
    }
    return item;
  });

  reply.send(tasks);
});

// удаление
app.delete('/tasks/:id', (request, replay) => {
  const { id } = request.params;

  tasks = tasks.filter((item) => item.id !== id);

  replay.send(tasks);
});

export default app;
