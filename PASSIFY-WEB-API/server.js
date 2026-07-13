import express from "express";
import router from "./routes/routes.js";
import user_router from "./routes/user.js";
import cors from "cors"; 
import {GetService} from "./services/QueryService.js";
import 'dotenv/config'

const port = process.env.PORT
const app = express();

let dbWakeLockUntil = 0;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

//Routes (API endpoints)
app.use("/api/activities", router)
app.use("/api/user", user_router)


//Routes (HTML endpoints)

//Home Page
app.get('/', (req, res) => {
    res.send('Home Page!');
});

app.get('/form', (req, res) => {
    res.redirect('/form.html');
})

//--------------------Test Routes----------------------------------//

app.get('/hello', (req, res) => {
    res.send('Hello Express!');
});

app.get('/goodbye', (req, res) => {
    res.send('Hastalavista Baby!');
});

app.post('/wakedb', async (req, res) => {
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) return res.status(400).send('Missing idempotency key');
    const time = idempotencyKey.split('-')[1];
    if (!time) return res.status(400).send('Invalid idempotency key format');
    
    const expiry = parseInt(time);
    if (isNaN(expiry)) {
        return res.status(400).send('Invalid idempotency key time');
    }

    const now = Date.now();

    // Check if there is an active lock
    if (now < dbWakeLockUntil) {
        return res.status(409)
            .send(`Request bounced: Database is currently waking up. Lock active until ${new Date(dbWakeLockUntil).toISOString()}`);
    }

    // Set the new lock time based on client's provided time (sent_time + 15 mins)
    dbWakeLockUntil = expiry;
    
    console.log(`Captured wake time. Database lock active until: ${new Date(dbWakeLockUntil).toISOString()}`);
    console.log(`Minutes remaining: ${((dbWakeLockUntil - now) / 1000) / 60}`);

    try {
        console.log(req.body);
        const result = await GetService.wakeword();
        res.status(200).send({ message: 'Request processed', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error processing request', error: error.message });
    }
})

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`View: http://localhost:${port}`);
});