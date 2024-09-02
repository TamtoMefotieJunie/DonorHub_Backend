require ("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

//middleware
app.use(express.json());
app.use(cors());

require('./db');

const authRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const packRoutes = require('./routes/pack.routes');
const protectedRoutes = require('./routes/protected.routes');
const loginRoutes = require('./routes/authentication.routes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/user', loginRoutes);
app.use('/protected', protectedRoutes);
app.use('/blood', packRoutes);


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`, { port }));