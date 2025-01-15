const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS package
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(cors()); 

app.get('/', async(req,res)=>{
   res.send("server running")
})

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
