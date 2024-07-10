const newUser = require('../model/newUserModel');
const bcrypt = require('bcrypt');
const handleSignUp = async (req, res) => {
  let { address, email, password } = req.body;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password=hashedPassword;
  try {
    const user = await newUser.create({
      address,
      email,
      password
    });
    if (user) {
        res.status(200).json({ message: 'User Signup', user });
    }
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ message: 'Error in SignUp', error });
  }
};

const handleSignIn = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await newUser.findOne({ email: email});
    if (!findUser) {

        res.status(404).json({message:'User not found Pls Sign Up'})
    }
    else {
        const validPassword = await bcrypt.compare(password, findUser.password);
        if (validPassword) {
            res.status(200).json({ message: 'User SignIn', findUser });
        }
        else {
            res.status(403).json({ message: 'Invalid Password' });
        }
    }
};

module.exports = { handleSignUp, handleSignIn };
