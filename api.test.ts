import request from 'supertest';
import { app } from './src/index';

// Função para gerar um e-mail aleatório
function generateRandomEmail(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email = '';

  for (let i = 0; i < 10; i++) {
    email += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${email}@example.com`;
}

describe('API de usuários', () => {
  let userId: string;

  // Teste para criar um novo usuário
  test('Deve criar um novo usuário com sucesso', async () => {
    const userData = {
      name: 'Exemplo',
      email: generateRandomEmail(),
      password: 'senha123',
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.name).toBe(userData.name);
    expect(response.body.user).not.toHaveProperty(userData.password);

    // Armazene o ID do usuário criado para uso posterior
    userId = response.body.user._id;
  });

  // Teste para listar os usuários
  test('Deve listar os usuários', async () => {
    const response = await request(app).get('/api/usersFind');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: userId,
          email: expect.any(String),
          name: expect.any(String),
        }),
      ])
    );
  });

  // Teste para deletar um usuário
  test('Deve deletar um usuário com sucesso', async () => {
    const response = await request(app).delete(`/api/usersDelete/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');

    // Verifique se o usuário foi realmente deletado
    const checkResponse = await request(app).get(`/api/usersDelete/${userId}`);
    expect(checkResponse.status).toBe(404);
  });
});
