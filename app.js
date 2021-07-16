const express = require('express');
const { getSchedule, getExam, getExamHistory } = require('./scrape/scraper');
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());


app.get("/", (_, res) => {
    res.redirect('/api');
});

app.get('/api', (_, res) => {
    res.status(200).json(
        [
            "GET      /api", 
            "POST     /api/exam",
            "POST     /api/examHistory",
            "POST     /api/schedule"
        ]
    );
});


app.post('/api/schedule', async (req, res) => {
    if (!checkBody(req, res)){
        return;
    }

    const data = await getSchedule(req.body);
    res.status(200).json(data)
});


app.post('/api/exam', async (req, res) => {
    if (!checkBody(req, res)){
        return;
    }

    const data = await getExam(req.body);
    res.status(200).json(data);
});


app.post('/api/examHistory', async (req, res) => {
    if(!checkBody(req, res)){
        return
    }
    if(!req.body.ExamQuestionID){
        res.status(400).send({
            ok: false,
            message: "[BadRequest] need a ExamQuestionID parameter"
        });
        return;
    }

    const data = await getExamHistory(req.body);
    res.status(200).json(data);
});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});


function checkBody(request, response){
    if(!request.body.username || !request.body.password){
        response.status(400).send({
            ok: false,
            message: "require a username and password arguments"
        });
        return false;
    }
    return true;
}