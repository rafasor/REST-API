import { Request, Response } from 'express';
import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import Jwt  from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, RA } = req.body;
    console.log('Received data:', req.body);

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Verificar se o RA já existe
    const existingUser = await UserModel.findOne({ RA });
    if (existingUser) {
      return res.status(400).json({ error: 'RA já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPassword, RA });
    const newUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const loginUser = async (req: Request, res: Response) => {
  try {
    const { RA, password } = req.body;

    const user = await UserModel.findOne({ RA });
    if (!user) {
      return res.status(400).json({ error: 'RA ou senha inválidos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'RA ou senha inválidos' });
    }

    const token = Jwt.sign({ _id: user._id, RA: user.RA }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete user with ID: ${id}`);
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted successfully');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, RA } = req.body;

    // Verificar se o RA já existe para outro usuário
    const existingUser = await UserModel.findOne({ RA });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ error: 'RA já cadastrado para outro usuário' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, { name, email, password, RA }, { new: true });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, RA } = req.query;
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Busca case-insensitive
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' }; // Busca case-insensitive
    }

    if (RA) {
      query.RA = { $regex: RA, $options: 'i' }; // Busca case-insensitive
    }

    const users = await UserModel.find(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};