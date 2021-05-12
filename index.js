const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

(async() => {

    const url = 'mongodb://localhost:27017';

    const dbname = 'ocean-bancodados-11-05-2021';

    console.info('Conectando com o Banco de Dados...');

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });

    console.info('MongoDB conectado com sucesso!!');

    const db = client.db(dbname);

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

        // res.send(messages.filter(Boolean))

    });

    app.get('/messages/:id', async (req, res) => {
        //const id = req.params.id - 1;
        const id = req.params.id;

        //const message = messages[id];
        const message = await messagesCollection.findOne( { _id: ObjectId(id) } ); //.catch(console.error);

        if (!message) {
            res.send("Invalid Message Requested")    
        } else {
            res.send(message);
        }
    });

    app.post("/messages", async (req, res) => {
        /*const message = req.body.message;

        messages.push(message);

        const id = messages.length;

        res.send(`new message '${id}' created!`);*/

        const message = req.body;

        await messagesCollection.insertOne(message);

        res.send(message);
    });

    app.put("/messages/:id", async (req, res) => {
        /*const id = req.params.id - 1;

        const message = req.body.message;

        messages[id] = message;

        res.send(`message '${req.params.id}' updated!`);*/

        const id = req.params.id;

        const message = req.body;

        await messagesCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: message },
        );

        res.send('message updated!');

    });

    app.delete("/messages/:id", async (req, res) => {
        /*const id = req.params.id - 1;

        delete messages[id];

        res.send(`message '${req.params.id}' deleted!`);*/

        const id = req.params.id;

        await messagesCollection.deleteOne(
            { _id: ObjectId(id) },
        );

        res.send('message deleted!');

    });

    app.listen(3000);

})();
