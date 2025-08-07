import Fastify from 'fastify';

const app = Fastify({ logger: true });

/** Fastify plugins **/
app.register(import('@fastify/cookie'));
app.register(import('@fastify/cors'), {
  origin: ['http://localhost:63342', 'http://localhost:3000', 'https://abuldakov10.github.io'],
});
// Для раблоты с формами и файлами
app.register(import('@fastify/multipart'), { addToBody: true });

/*** Variables ***/
let groups = [];
let tasks = [];

/*** Method functions ***/
/*** Группы ***/
// получение
app.get('/group/list', (request, reply) => {
  reply.send(groups);
  reply.status(200).send(groups);
});

// добавление
app.post('/group', (request, reply) => {
  const { groupTitle, color } = request.body;
  const groupObj = { id: Date.now().toString(), groupTitle, color };

  groups.push(groupObj);

  return reply.send(groups);
});

// редактирование
app.patch('/group/:groupId', (request, replay) => {
  const { groupId } = request.params;
  const { groupTitle, color } = request.body;

  groups = groups.map((item) => {
    if (item.id === groupId) {
      return { ...item, groupTitle, color };
    }

    return item;
  });

  replay.send(groups);
});

// удаление
app.delete('/group', (request, replay) => {
  groups = groups.filter(({ id }) => !request.body.includes(id));

  replay.send(groups);
});

/*** Задачи ***/
// получение
app.get('/task/list', (request, reply) => {
  reply.status(200).send(tasks);
});

// создание
app.post('/task', (request, reply) => {
  const { taskTitle, description, createData, createTime, groupId } = request.body;
  const taskObj = {
    id: Date.now().toString(),
    taskTitle,
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
app.patch('/task/:taskId', (request, replay) => {
  const { taskId } = request.params;
  const { taskTitle, description } = request.body;

  tasks = tasks.map((item) => {
    if (item.id === taskId) {
      return { ...item, taskTitle, description, createTime: Date.now().toString(), isEdited: true };
    }

    return item;
  });

  replay.send(tasks);
});

// завершение
app.patch('/task/done/:taskId', (request, reply) => {
  const { taskId } = request.params;
  const taskObj = tasks.find(({ id }) => id === taskId);

  tasks = tasks.map((item) => {
    if (item.id === taskId) {
      return { ...item, isDone: !taskObj.isDone };
    }

    return item;
  });

  reply.send(tasks);
});

// удаление
app.delete('/task/:taskId', (request, replay) => {
  const { taskId } = request.params;

  tasks = tasks.filter(({ id }) => id !== taskId);

  replay.send(tasks);
});

export default app;
