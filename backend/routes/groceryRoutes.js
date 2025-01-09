import express from 'express';
import jwt from 'jsonwebtoken';
import Grocery from '../models/Groceries.js';

const router = express.Router();

const protect = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/', protect, async (req, res) => {
  const { name, quantity } = req.body;
  const grocery = new Grocery({
    name,
    quantity,
    user: req.user.id,
  });
  await grocery.save();
  res.status(201).json(grocery);
});


router.get('/', protect, async (req, res) => {
  const groceries = await Grocery.find({ user: req.user.id });
  res.json(groceries);
});


router.delete('/:id', protect, async (req, res) => {
  const grocery = await Grocery.findById(req.params.id);
  if (!grocery) {
    return res.status(404).json({ message: 'Grocery item not found' });
  }
  if (grocery.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await grocery.remove();
  res.json({ message: 'Grocery item removed' });
});

export default router;
