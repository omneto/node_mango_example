const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

(async() => {

    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;
    
    const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
    
    console.info('Conectando com o Banco de Dados...');

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });

    console.info('MongoDB conectado com sucesso!!');

    const db = client.db(dbName);

    const app = express();

    app.use(express.json());

    app.get('/', function (req, res) {
    res.send('Hello World, Oscar');
    });

    const messages = ['Message 1', 'Message 2'];

    const messagesCollection = db.collection('mensagens');

    app.get('/messages', async (req, res) => {
        
        const messageList = await messagesCollection.find().toArray();
        res.send(messageList);
    });

    app.get('/messages/:id', async (req, res) => {
        const id = req.params.id;

        const message = await messagesCollection.findOne( { _id: ObjectId(id) } ); //.catch(console.error);

        if (!message) {
            res.send("Invalid Message Requested")    
        } else {
            res.send(message);
        }
    });

    app.post("/messages", async (req, res) => {
        const message = req.body;

        await messagesCollection.insertOne(message);

        res.send(message);
    });

    app.put("/messages/:id", async (req, res) => {
        const id = req.params.id;

        const message = req.body;

        await messagesCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: message },
        );

        res.send('message updated!');

    });

    app.delete("/messages/:id", async (req, res) => {
        const id = req.params.id;

        await messagesCollection.deleteOne(
            { _id: ObjectId(id) },
        );

        res.send('message deleted!');

    });

    app.listen( process.env.PORT || 3000);

})();
