var cron = require("node-cron");
var Domain = require("../models/Domain");
const sslCertificate = require("get-ssl-certificate");

var Tasks = {
  SyncDomainSSLStatusTask: cron.schedule(
    "* * * * *",
    function() {
      Domain.find((err, domains) => {
        if (domains) {
          domains.forEach(element => {
            console.log(element);
          });
        }
      });
    },
    false
  ),
};

var updateDomainSSLStatusTask = (domain) => {
  sslCertificate.get(domain.name).then(certificate => {
    var validFrom = Date.parse(certificate.valid_from);
    var validTo = Date.parse(certificate.valid_to);
    validFrom = moment(validFrom);
    validTo = moment(validTo);

    var daysUntilExpire = moment.duration(moment().diff(validTo)).asDays();
    daysUntilExpire = parseInt(daysUntilExpire) * -1;
    Domain.findOneAndUpdate(
      query,
      {
        $set: {
          expiresIn: daysUntilExpire
        }
      },
      function(err, success) {
        if (err) throw err;
        
      }
    );
  })
}


module.exports = Tasks