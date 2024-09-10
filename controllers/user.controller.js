
const userService = require('../services/user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { listenerCount } = require('../models/hospital.model');

const registerUser = async (req, res) => {
    
        const { name, email, password, gender, role,bloodGroup,telephone} = req.body;
        if (req.body.email) {
            const isUserFound = await userService.getUserByEmail(req.body.email)
            if (isUserFound) return res.status(400).json({ message: "Sorry user with this email exist already" })
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const User = {
                name,
                email,
                password: hashedPassword,
                gender,
                bloodGroup,
                telephone,
                role
            };
            const user = await userService.registerUser(User);
            res.status(201).json({data:user, message: 'User registered successfully' });
        } catch (error) {
            console.log("error:",error.message)
            res.status(500).json({ error: 'Registration failed' });
        }    
};
const getAllUsers=async(req,res)=>{
    try{
        
        const users = await userService.getAllUsers({});

        return res.status(200).json({data: users, message: 'Users fetched successfully !!!'})

    }catch(err){
        return res.status(500).json('An error occured while fetching users')
    }
}
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params?.id); 
    
        if (!user) {
            return res.status(404).json({ data: null, message: 'User not found' });
        }
        return res.status(200).json({ data: user, message: 'User fetched successfully!' });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ data: null, message: 'An error occurred while fetching user' });
    }
};
const getUserByEmail=async(req,res)=>{
    try{
        
        const user = await userService.getUserByEmail(req.params?.email);
        if(!user){
        return res.status(404).json({data: user, message: 'user not found!!!'})
        }
        return res.status(200).json({data: user, message: 'user fetched successfully !!!'})

    }catch(err){
        return res.status(500).json('An error occured while fetching user')
    }
}

const updateUser = async (req, res) => {
    try {
      let user = await userService.updateUser(req.params.id, req.body);
      if (user !== null) {
        user = await userService.getUserById(req.params.id)
      }
      res.json({ data: user, status: "success" }).status(200);
    } catch (err) {
      res.status(500).json({ error : err.message });
    }
  };

  const deleteUSer = async (req,res) => {
    try {
        const user = await userService.deleteUSer(req.params?.id);
        res.status(200).json("user deleted successfully");
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
  };

module.exports = {
    registerUser,
    updateUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    deleteUSer,
};