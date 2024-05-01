# Sain API Gateway Selcom Package

The `sain-apigw-selcom` package provides a convenient way to interact with Selcom API. Register at selcom to get you `apikey`, `secretKey` and whitelist your server.

## USAGE
Installation

```bash
npm i sain-apigw-selcom
```

```bash
const Selcom = require('sain-apigw-selcom');

try{
    let selcom = new Selcom({
      baseUrl: process.env.API_ENDPOINT,
      apiKey: process.env.API_KEY,
      secretKey:process.env.SECRET_KEY
    })
    let response = await selcom.request(url, 'GET', jsonData);

    console.log(response);
    # return response;
}catch(err){
    throw err;
}
```