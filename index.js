const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');


app.use(cors({
    origin: '*',
    credentials: true,
  }
));
app.use(express.json());


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

    //all collections
    const usersCollection = client.db('studySphereDB').collection('users');

    //users routes

    app.post('/users', async (req, res) => {
      try {
        const data = req.body;
        const users = await usersCollection.find().toArray();
        const isExist = users.find(user => user.email === data.email);
        const sequrePassword = await bcrypt.hashSync(data.password, 10);

        if (isExist) {
          return res.send({ message: 'User already exists' });
        }

        
        const userData = {
          name: data.name,
          email: data.email,
          password: sequrePassword,
          // photo: data.photo,
          role: data.role, // user | admin
        }
 
        const result = await usersCollection.insertOne(userData);
         res.json({
      success: true,
      message: 'User created successfully',
      data: result
    })


      } catch (error) {
        console.log("something went wrong", error)
        res.status(500).json({ message: 'Error while creating user' })
      }
    });
    
  }catch (error) {
    console.error(error);
  }
}
 
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Study Sphere is running');
});

app.listen(port, () => {
    console.log(`Study Sphere server is running on port: ${port}`);
});