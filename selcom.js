const axios = require("axios");
const crypto = require("crypto");
const date = require("date-and-time");

class SELCOM {
  constructor(baseUrl, apiKey, apiSecret) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  computeHeader(jsonData) {
    try {
      var authToken =
        "SELCOM" + " " + Buffer.from(this.apiKey, "ascii").toString("base64");
      var now = new Date();
      var timestamp = date.format(now, "YYYY-MM-DD[T]HH:mm:ssZZ");
      var signedFields = "";
      var data = "timestamp=" + timestamp;
      for (var key in jsonData) {
        data = data + "&" + key + "=" + jsonData[key];
        if (signedFields == "") signedFields = signedFields + key;
        else signedFields = signedFields + "," + key;
      }

      var hmac = crypto.createHmac("sha256", this.apiSecret);
      hmac.update(data);
      var digest = hmac.digest("base64");
      return [authToken, timestamp, digest, signedFields];
    } catch (error) {
      throw error;
    }
  }

  async request(path, method, jsonData) {
    try {
      var [authToken, timestamp, digest, signedFields] =
        this.computeHeader(jsonData);
      const instance = await axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-type": "application/json",
          Authorization: authToken,
          "Digest-Method": "HS256",
          Digest: digest,
          Timestamp: timestamp,
          "Signed-Fields": signedFields,
        },
      });
      if (!method) {
        throw new Error("Method not defined!");
      }
      switch (method) {
        case "post" || "POST":
          return await instance.post(path, jsonData);
        case "delete" || "DELETE":
          return await instance.post(path, jsonData);
        default:
          return await instance.get(path, jsonData);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SELCOM;
