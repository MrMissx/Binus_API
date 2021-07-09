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
        const rawData = JSON.parse(schedule.body);
        return { ok: true, result : rawData}
    } catch (error) {
        return { ok: false, message: "Failed to reach binusmaya!"}
    }
}


module.exports = { getSchedule }
