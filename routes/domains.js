var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Domain = require('../models/Domain')
var moment = require("moment");
const sslCertificate = require("get-ssl-certificate");

router.get('/', (req, res, next) => {
  Domain.find((err, domains) =>{
    if (err) return next(err)
    res.render('domains', {title : "Websites" , domains : domains })
  })
})

router.get('/addDomain', (req, res, next) => {
  res.render("addDomain")
})

router.get('/:id', (req, res, next) => {
  Domain.findById(req.params.id, (err, domain) => {
    if (err) return next(err)
    res.render('editDomain', { domain : domain })
  })
})

router.post('/addDomain', (req, res, next) => {
  Domain.find({ name : req.body.name}).limit(1).lean().exec((err, result) => {
    if(result.length === 0) {
      sslCertificate.get(req.body.name).then(certificate => {
        var validFrom = moment(Date.parse(certificate.valid_from));
        var validTo = moment(Date.parse(certificate.valid_to));
        var daysUntilExpire = parseInt(moment.duration(moment().diff(validTo)).asDays()) * -1;

        var newDomain = Domain({
          name : req.body.name,
          validFrom : validFrom,
          validTo : validTo,
          expiresIn : daysUntilExpire
        })
        newDomain.save( err => {
          if(err) return next(err)

          res.redirect("/domains");
        })
      })
    }
  })
})

router.post('/:id', (req, res, next) => {
  Domain.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err)
    res.redirect("/domains")
  })
})

router.delete('/delete/:id', (req, res, next) => {
  Domain.findByIdAndRemove(req.params.id, req.body, (err, post) => {
    if (err) return next(err)
    res.redirect("/domains")
  })
})


module.exports = router