const express = require("express")
const app = express()
const isonline = require("is-reachable")
const config = require("./config.json")
const fs = require("fs")
const log = require("./logs")


setInterval(function() {
    fs.readdirSync(__dirname + "/data/monitors").map( async (monitor) => {
        const url = monitor.replace(".json", "")
        const onlinecheck = await isonline(url)
        if (onlinecheck) {
            const lastuptime = fs.readFileSync(__dirname + "/data/monitors/" + monitor)
            const lastuptime_formated = lastuptime.toString().replace(`{"url":"${url}","status":`, "").replace("false", "").replace("true", "").replace(`,"uptime":`, "").replace("}", "")
            const data =  { "url": url,
            "status": onlinecheck,
            "uptime": Number(lastuptime_formated) + 60000
        }
    
    const datajson = JSON.stringify(data)
    fs.writeFileSync(__dirname + `/data/monitors/${url}.json`, datajson)
        } else if (!onlinecheck) {
            const data =  { "url": url,
            "status": onlinecheck,
            "uptime": 0
        }
    
    const datajson = JSON.stringify(data)
    fs.writeFileSync(__dirname + `/data/monitors/${url}.json`, datajson)
        }

})
}, 60000);

app.get("/createmonitor/", async function (req, res) {
    const url = req.query.url
    if (!url) return res.send("No URL entered. e. g. /createmonitor/daneeskripter.tk")
    const onlinecheck = await isonline(url)
    const data =  { "url": url,
            "status": onlinecheck,
            "uptime": 0
        }
    
    const datajson = JSON.stringify(data)
    fs.writeFileSync(__dirname + `/data/monitors/${url}.json`, datajson)
    res.send("Monitor created!")
})

app.get("/monitor", async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const url = req.query.url
    const files = fs.readdirSync(__dirname + "/data/monitors")
    if (files.includes(url + ".json")) {
        res.header("Content-Type",'application/json');
        const data = await fs.readFileSync(__dirname + `/data/monitors/${url}.json`).toString()
        res.send(data)
    } else {
        res.send(`No monitor is monitoring this domain.`)
    }

})
app.listen(config.port)
log.success("Listening on port " + config.port)