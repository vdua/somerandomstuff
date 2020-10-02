const http = require("http");

var obj = {
  get: function (url, params, options) {
    var _paramString = params || "";
    if (typeof params == "object" && params != null) {
      _paramString = Object.keys(params)
        .reduce((accum, curr) => {
          return accum.concat([`${curr}=${params[curr]}`]);
        }, [])
        .join("&");
    }

    if (_paramString.length > 0 && url.indexOf("?") == -1) {
      _paramString = `?${_paramString}`;
    }

    return new Promise((resolve, reject) => {
      console.log("fetching " + `${url}${_paramString}`);
      http.get(`${url}${_paramString}`, options, (res) => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          reject(error);
          return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            resolve(rawData);
          } catch (e) {
            console.error(e.message);
          }
        });
      });
    });
  },
};

export default obj;
