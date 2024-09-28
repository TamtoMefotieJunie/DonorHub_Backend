require ("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

require('./db');

const authRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const packRoutes = require('./routes/pack.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const protectedRoutes = require('./routes/protected.routes');
const loginRoutes = require('./routes/authentication.routes');
const emailRoutes = require('./routes/email.routes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/banks', hospitalRoutes);
app.use('/user', loginRoutes);
app.use('/protected', protectedRoutes);
app.use('/blood', packRoutes);
app.use('/email',emailRoutes)


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`, { port }));

