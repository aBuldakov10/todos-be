import Fastify from 'fastify';

const app = Fastify({ logger: true });

/** Fastify plugins **/
app.register(import('@fastify/cookie'));
app.register(import('@fastify/cors'), {
  origin: ['http://localhost:63342', 'http://localhost:3000', 'https://abuldakov10.github.io'],
});
app.register(import('@fastify/multipart'), { addToBody: true }); // Для работы с формами и файлами

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
  groups = groups.filter(({ id }) => !request.body.includes(id)); // удаление группы
  tasks = tasks.filter(({ groupId }) => !request.body.includes(groupId)); // удаление задач для этой группы

  replay.send(groups);
});

/*** Задачи ***/
// получение
app.get('/task/list', (request, reply) => {
  reply.status(200).send(tasks);
});

// создание
app.post('/task', (request, reply) => {
  const { taskTitle, description, groupId } = request.body;

  const taskObj = {
    id: Date.now().toString(),
    taskTitle,
    description,
    createDate: new Date().toISOString(), // время в UTC
    editDate: null,
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
  const { description } = request.body;

  tasks = tasks.map((item) => {
    if (item.id === taskId) {
      return { ...item, description, editDate: new Date().toISOString(), isEdited: true };
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
app.delete('/task', (request, replay) => {
  tasks = tasks.filter(({ id }) => !request.body.includes(id));

  replay.send(tasks);
});

export default app;
