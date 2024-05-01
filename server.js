const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User')

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));




app.post('/login', async (req, res) => {
  console.log("post called")
  try {
    const { username, password } = req.body;
    console.log(password);
    const user = await User.findOne({ username : username});
    console.log(`username == ${username} and user ==${user}`);
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(`password == ${ user.password }`);
    
    if (password === user.password) {
      try{
        console.log("success");
        const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, config.jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ token });
      }catch(e){
        console.log(e)
        return res.status(500).json({ "msg":"Chod" });

      }
      
    }else{
      console.log("something went wrong");
    }
    
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/register', async (req, res) => {
  console.log("post called")
  try {
    const { username, password , isAdmin } = req.body;
    console.log(password);
    const userExist = await User.findOne({ username});
    if (userExist) {
    return res.status(400).json({ message: 'Username already exists.' })
    }else{
      const userCreated = await  User.create({username, password , isAdmin })
      return res.status(200).json({ response : "success" , message: userCreated })
    }
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

