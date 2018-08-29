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

router.get("/updateAll", (req, res, next) => {
  Domain.find((err, domains) => {
    if (err) return next(err);

    domains.forEach(domain => {
      sslCertificate.get(domain.name).then(certificate => {
        var validFrom = Date.parse(certificate.valid_from);
        var validTo = Date.parse(certificate.valid_to);
        validFrom = moment(validFrom);
        validTo = moment(validTo);

        var daysUntilExpire = moment.duration(moment().diff(validTo)).asDays();
        daysUntilExpire = parseInt(daysUntilExpire) * -1;
        Domain.findByIdAndUpdate(
          domain.id,
          {
            $set: {
              validFrom: certificate.valid_from,
              validTo: certificate.valid_to,
              expiresIn: daysUntilExpire
            }
          },
          function (err) {
            if (err) res.render('error', err);
          }
        );
      });
    });
  });
  res.redirect("/domains");
});

module.exports = router;
