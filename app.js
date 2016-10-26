'use strict'
const database = require('./src/database')
const crawl = require('./src/crawler')
const email = require('./src/email.js')

const defaultOptions = {
	db: './db.json',
	sendEmail: true,
	emailType: 'html',
	crawlReviews: true,
	crawlQuestions: true
}


function init(opt, cb){

	// Find options
	if(!opt){
		opt = defaultOptions
	}
	else{
		let i
		for(i in defaultOptions){
			if(!(i in opt)){
				opt[i] = defaultOptions[i]
			}
		}
	}

	// Missing property errors
	if(!('productList' in opt)) return cb('No "productList" property found in options.')
	if(opt.sendEmail && !('emailList' in opt)) return cb('No "emailList" property found in options.')
	if(opt.sendEmail && !('smtpCredentials' in opt)) return cb('No "smtpCredentials" property found in options.')


	// Require if file paths
	if(typeof opt.productList === 'string'){
		try { opt.productList = require(opt.productList) }
		catch(e) { return cb(e) }
	}
	if(opt.sendEmail && typeof opt.emailList === 'string'){
		try { opt.emailList = require(opt.emailList) }
		catch(e) { return cb(e) }
	}
	if(opt.sendEmail && typeof opt.smtpCredentials === 'string'){
		try { opt.smtpCredentials = require(opt.smtpCredentials) }
		catch(e) { return cb(e) }
	}

	// Database defaults
	database.init(opt)

	// Start crawling
	crawl(opt, (err, data) => {
		if(err) cb(err)

		// Start emailing
		email(opt, data, (err, data) => {
			if(err) cb(err)

			// Log latest in database
			database.logLatest(opt.db, data)
			cb()

		})

	})

}




module.exports = init






