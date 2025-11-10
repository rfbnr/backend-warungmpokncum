require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const kasirRoutes = require('./routes/kasir');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res)=>res.json({ok:true, env: process.env.NODE_ENV || 'development'}));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/kasir', kasirRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try{
    await sequelize.authenticate();
    console.log('DB connected');
  }catch(e){
    console.error('DB connect error:', e.message);
  }
  console.log(`Server running on ${PORT}`);
});
