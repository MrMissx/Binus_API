const cheerio = require('cheerio');
const got = require('got');
const FormData = require('form-data');
const { CookieJar } = require('tough-cookie');


function createSession(){
    return got.extend({cookieJar: new CookieJar()});
}


async function getSchedule(credential){
    const baseUrl = "https://myclass.apps.binus.ac.id/"
    const session = createSession()
    try {
        const login = await session.post(baseUrl + "/Auth/Login", {
            json: {
                Username: credential.username,
                Password: credential.password
            }
        });
        loginRes = JSON.parse(login.body);
        if(!loginRes.Status){
            return { ok: false, message: loginRes.Message }; 
        }

        const schedule = await session.get(baseUrl + "Home/GetViconSchedule");
        return { ok: true, result : JSON.parse(schedule.body)};
    } catch (error) {
        return { ok: false, message: "Failed to reach binusmaya!"}
    }
}


async function getExam(credential){
    const baseUrl = "https://exam.apps.binus.ac.id/";
    const session = createSession();
    try {
        const login = await session.post(baseUrl + "Auth/Login", {
            json: {
                Username: credential.username,
                Password: credential.password,
            }
        });
        loginRes = JSON.parse(login.body);
        if(!loginRes.Status){
            return { ok: false, message: loginRes.Message }; 
        }
        const examPage = await session.get(baseUrl + loginRes.URL);

        // Get the latest exam key
        const $ = cheerio.load(examPage.body);
        let examKey;
        $("#ddlPeriod").find('option').each((_, elm) => {
            examKey = $(elm).attr('value');
        });

        const examData = await session.post(baseUrl + "Home/GetExamSchedule", {
            json: { key: examKey }
        });
        return { ok: true, result : JSON.parse(examData.body)};
    } catch (error) {
        return { ok: false, message: "Failed to reach binusmaya!"}
    }
}

async function getExamHistory(data){
    const baseUrl = "https://exam.apps.binus.ac.id/";
    const session = createSession();

    try {
        const login = await session.post(baseUrl + "Auth/Login", {
            json: {
                Username: data.username,
                Password: data.password,
            }
        });
        loginRes = JSON.parse(login.body);
        if(!loginRes.Status){
            return { ok: false, message: loginRes.Message }; 
        }

        const examPage = await session.get(baseUrl + loginRes.URL);

        // client should query an exam period before fetching history
        // Get the latest exam key
        let $ = cheerio.load(examPage.body);
        let examKey;
        $("#ddlPeriod").find('option').each((_, elm) => {
            // overwrite to the latest exam key
            examKey = $(elm).attr('value');
        });
        const _ = await session.post(baseUrl + "Home/GetExamSchedule", {
            json: { key: examKey }
        });

        const form = new FormData();
        form.append('ExamQuestionID', data.ExamQuestionID);
        const examHistory = await session.post(baseUrl + "/Home/History", {
            body: form
        });
        let $$ = cheerio.load(examHistory.body);
        var result = [];
        var data = {};
        $$(".looptemplate").find('td').each((_, elm) => {
            if($$(elm).attr('class') != "iHistoryDownload"){
                data[parseKey($$(elm).attr('class'))] = $$(elm).text();
            } else {
                data["Url"] = baseUrl + $$(elm).children().attr("href");
                result.push(data);
                data = {};
            }
        });
        return { ok: true, result};
    } catch (error) {
        return { ok: false, message: "Failed to reach binusmaya!"}
    }
}


function parseKey(key){
    switch(key) {
        case 'iSubTime':
            return 'SubmissionTime';
        case 'iTitle':
            return 'Title';
        case 'iTitle':
            return 'DownloadUrl';
        default:
            return 'Upload';
    }
}


module.exports = { getSchedule, getExam, getExamHistory }
