const http= require('http');
const fs=require('fs');
var requests=require('requests');
const homeFile=fs.readFileSync("index.html","utf-8");
const replaceVal=(tempVal,orgval)=> {
    let temperature=tempVal.replace("{%tempval%}",(orgval.main.temp-273.15).toPrecision(4)+"\u00B0");
    temperature=temperature.replace("{%tempmin%}",(orgval.main.temp_min-273.15).toPrecision(4)+"\u00B0");
    temperature=temperature.replace("{%tempmax%}",(orgval.main.temp_max-273.15).toPrecision(4)+"\u00B0");
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    if(orgval.weather[0].main=="Clouds"){
        temperature=temperature.replace("{%change%}","cloud");
    }
    if(orgval.weather[0].main=="sun"){       
        temperature=temperature.replace("{%change%}","sun");
    }
    if(orgval.weather[0].main=="Rain"){
        temperature=temperature.replace("{%change%}","cloud-rain");
    }
    return temperature;
};

const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Pune,India&appid=c46a16cade9eba054169d83b85fc7ff2').on("data", (chunk)=> {
        const first=JSON.parse(chunk);
        const arrData=[first];
        const realTimeData=arrData.map((val)=> replaceVal(homeFile,val)).join("");
        res.write(realTimeData);
    })
    .on("end",(err) =>{
    if (err) return console.log('connection closed due to errors', err);
        res.end();
    });
    
    }
})
server.listen(8000);   