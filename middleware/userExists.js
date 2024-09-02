const userService = require("../services/user.service.js")

const userExist = async (req, res, next) => {
    console.log(req.body)
    let user = await userService.getUserByEmail(req.body.email)
    if(!user) return res.status(400).json({ error: 'Sorry no user found with this email' });
}
module.exports = userExist;