const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ where:{ email }});
  if(!user) return res.status(401).json({message:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({message:'Invalid credentials'});
  const token = jwt.sign({ id:user.id, email:user.email, name:user.name, role:'KASIR' }, process.env.JWT_SECRET, { expiresIn:'12h' });
  res.json({ token, user:{ id:user.id, name:user.name, email:user.email }});
});

module.exports = router;
