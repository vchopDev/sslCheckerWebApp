  var mongoose = require('mongoose')

  var DomainSchema = new mongoose.Schema({
    name : String,
    validFrom : String,
    validTo : String,
    expiresIn : {type: Number}
    // validFrom : {Type: Date},
    // validTo : {Type: Date}
  })

  module.exports = mongoose.model('Domain', DomainSchema)