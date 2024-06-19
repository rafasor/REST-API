import express, { Request, Response } from 'express';
import { createUser, getUsers, deleteUser, updateUser, searchUsers, loginUser,} from '../controllers/UserController';

const UserRouters = express.Router();

UserRouters.get('/users', (req: Request, res: Response) => {
  // Lógica para buscar e retornar os usuários
  res.json({ message: 'Rota GET /users' });
});

UserRouters.get('/usersFind', getUsers);  // Rota para pegar todos os usuários
UserRouters.post('/users', createUser);  // Rota para criar um novo usuário
UserRouters.delete('/usersDelete/:id', deleteUser);  // Rota para deletar um usuário
UserRouters.put('/usersUpdate/:id', updateUser);  // Rota para atualizar um usuário
UserRouters.get('/usersFindOne/search', searchUsers);  // Rota para buscar usuários por parâmetros
UserRouters.post('/login', loginUser);

export default UserRouters;
