const crypto = require('crypto');
const URI = require('urijs');
const swagger=require('swagger-client')

function createSignature (path, key) {
    return crypto.createHmac('sha1', key)
        .update(path)
        .digest('hex').toUpperCase();
}

module.exports = function ptvapi(devid, apikey) {
    return swagger({
        url: 'https://timetableapi.ptv.vic.gov.au/swagger/ui/index', // Let's hope this doesn't get used for anything
        spec: require('./ptv-openapi.json'),
        requestInterceptor: function(req) {
            let url = URI(req.url).addQuery({ devid: devid });
            let signature = createSignature(url.toString().replace(/.*ptv.vic.gov.au/, ''), apikey);
            req.url = url.addQuery({ signature: signature}).toString();
            return req;
        }
    }).then(client => client.apis);
}