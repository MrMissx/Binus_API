const cheerio = require('cheerio');
const got = require('got');
const tough = require('tough-cookie');


function createSession(){
    return got.extend({cookieJar: new tough.CookieJar()});
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


module.exports = { getSchedule, getExam }
