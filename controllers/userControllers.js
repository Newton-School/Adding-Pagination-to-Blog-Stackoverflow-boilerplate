const User   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');
const JWT_SECRET = 'NEWTONSCHOOL'

const saltRounds = 10;

const signupUser = async (req, res) => {

    const {email, password, name, role} = req.body;

    const user = await User.findOne({ email });
    if(user){
        res.status(409).json({
            message: 'User with the given email already registered',
            status: 'fail'
        });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newuser = {
        name,
        email,
        password: hashedPassword,
        role
    };

    try{
        await User.create(newuser);
        res.status(200).json({
            message: 'User signed up successfully',
            status: 'success'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }

}

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ 'email':email });

    if(user){
        if(bcrypt.compareSync(password , user.password)){

            const token = jwt.sign(
                { userId: user._id },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.status(200).json({
                status: 'success',
                token
            });
        }else{
            res.status(401).json({
                message: 'Invalid password. Try again!',
                status: 'fail'
            });
        }
    }else{
        res.status(404).json({
            message: 'User with this email does not exist!',
            status: 'fail'
        });
    }

}

/*
 You need to implement a logout controller which takes an token as input from req.body, verifies the token, clears the cookie and logs out the user.
 
 req.body = {
    "token": token
 }

 Instructions:
 
 If the token is missing, the controller should respond with a 401 Unauthorized status and a JSON object containing a 'message' field with value 'Authentication failed: Missing token.', and a 'status' field with value 'fail'.
  
 If the token is valid, the controller should clear the cookie and respond with a 200 OK status and a JSON object containing a 'message' field with value 'Logged out successfully.', and a 'status' field with value 'success'.
 
 If there is an error during the JWT verification process or clearing the cookie, the controller should respond with a 500 Internal Server Error status and a JSON object containing a 'message' field with value 'Something went wrong', a 'status' field with value 'fail', and an 'error' field with the error object.
 
 Input:
 Authorization Token, token is present in req.hearders.authorization
 
 Output:
 {
 "message": "Logged out successfully.",
 "status": "Success"
 }
 */

 const logoutUser = (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res
            .status(401)
            .json({
                message: "Authentication failed: Missing token.",
                status: "fail",
            });
    }
    try {
        jwt.verify(token, JWT_SECRET);
        res.clearCookie("token");
        return res
            .status(200)
            .json({ message: "Logged out successfully.", status: "success" });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

module.exports = { signupUser, loginUser, logoutUser };
