const express = require('express');
const { getSchedule } = require('./scrape/scraper');
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());


app.get("/", (_, res) => {
    res.redirect('/api');
});

app.get('/api', (_, res) => {
    res.status(200).json(
        ["GET      /api", "POST     /api/schedule"]
        );
});


app.post('/api/schedule', async (req, res) => {
    if (!checkBody(req)){
        res.status(400).send({ ok: false, message: "require a username and password arguments" });
        return;
    }
    const data = await getSchedule(req.body);
    res.status(200).json(data)
});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});


function checkBody(request){
    if(!request.body.username || !request.body.password){
        return false;
    }
    return true;
}