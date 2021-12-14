const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'Neringa Kruizite', email: `${Date.now()}@mail.com`, password: '123345' });
  user = { ...res[0] };
});

test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'CC-01', user_id: user.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('CC-01');
    });
});

test('Não deve inserir uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Deve Listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'CC-List', user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve retornar uma conta por id', () => {
  return app.db('accounts')
    .insert({ name: 'CC-By-ID', user_id: user.id }, ['id'])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('CC-By-ID');
      expect(res.body.user_id).toBe(user.id);
    });
});

test('Deve alterar uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'CC-Update-ID', user_id: user.id }, ['id'])
    .then((acc) => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'CC-Updated-ID' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('CC-Updated-ID');
    });
});

test('Deve remover uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'CC-Remove-ID', user_id: user.id }, ['id'])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
