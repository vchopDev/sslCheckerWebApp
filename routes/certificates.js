var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Domain = require("../models/Domain");
var moment = require("moment");
const sslCertificate = require("get-ssl-certificate");

router.get("/", (req, res, next) => {
  var query = { name: req.body.domainName };
  sslCertificate.get(req.body.domainName).then(certificate => {
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
          validFrom: certificate.valid_from,
          validTo: certificate.valid_to,
          expiresIn: daysUntilExpire
        }
      },
      function(err, success) {
        if (err) res.render("error", err);
        res.redirect("/domains");
      }
    );
  });
});

module.exports = router;
