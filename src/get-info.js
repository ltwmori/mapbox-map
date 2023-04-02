const http = require("http");
const https = require("https");
const fs = require("fs");

const options = {
  rejectUnauthorized: false,
};

const kad_numbers = [
  "030550041309",
  "030550041337",
  "030550041056",
  "030550041062",
  "030550041064",
  "030550041247",
  "030550041338",
  "030550041339",
  "030550041248",
  "030550041249",
  "030550041375",
  "030550041251",
  "030550041252",
  "030550041320",
  "030550041319",
  "030550041256",
  "030550041257",
  "030550041258",
  "030550041295",
  "030550041260",
  "030550041296",
  "030550041313",
  "030550041315",
  "030550041318",
  "030550041316",
  "030550041303",
  "030550041311",
  "030550041314",
  "030550041317",
  "030550041308",
  "030550041307",
  "030550041306",
  "030550041305",
  "030550041304",
  "030550041312",
  "030550041310",
];

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(url, options, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error(`Failed to load page, status code: ${response.statusCode}`)
        );
      }
      const body = [];
      response.on("data", (chunk) => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}


const url =
  "https://aisgzk.kz/aisgzk/Index/FindObjInfoForMap?kadNum=030550041314";


async function fetchAndWriteData(kad_numbers) {
  for (let i = 0; i < kad_numbers.length; i++) {
    try {
      const data = JSON.stringify({
        //  payload data
      });

      const response = await postRequest(`https://aisgzk.kz/aisgzk/Index/FindObjInfoForMap?kadNum=${kad_numbers[i]}`, data);
      console.log("Response:", response);
      const responseData = JSON.parse(response);

      fs.appendFile("output.json", JSON.stringify(responseData, null, 2) + ",\n", (error) => {
        if (error) {
          console.error("Error writing file:", error);
        } else {
          console.log(`Data for kad_number ${kad_numbers[i]} successfully appended to output.json`);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}


fetchAndWriteData(kad_numbers);