import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import * as bodyParser from 'body-parser';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.use(bodyParser.json());

  // Роуты CRUD
  server.post('/api/user', (req, res) => {
    // Операция и логика создания пользователя
    const newUser = req.body;
    res.json(newUser);
  });

  server.get('/api/user', (req, res) => {
    // Операция и логика чтения всех пользователей
    const users = [{ /* данные пользователя */ }];
    res.json(users);
  });

  server.get('/api/user/:id', (req, res) => {
    // Операция и логика чтения конкретного пользователя по id
    const userId = req.params.id;
    const user = { /* данные пользователя */ };
    res.json(user);
  });

  server.put('/api/user/:id', (req, res) => {
    // Операция и логика обновления пользователя
    const userId = req.params.id;
    const updatedUserData = req.body;
    const updatedUser = { /* обновленные данные пользователя */ };
    res.json(updatedUser);
  });

  server.delete('/api/user/:id', (req, res) => {
    // Операция и логика удаления пользователя
    const userId = req.params.id;
    res.json({ success: true });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
