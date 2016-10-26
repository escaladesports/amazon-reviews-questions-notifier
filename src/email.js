'use strict'
const nodemailer = require('nodemailer')
const templates = require('./email-templates.js')

// Prettify category name
function formatCategory(category){
	category = category.split('-')
	for(var i = category.length; i--;){
		category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1)
	}
	return category.join(' ')
}

// Sends email
function mail(opt, data, cb){
	let prog = 0
	let total = Object.keys(data).length
	let mailTransport

	// Get SMTP CREDENTIALS
	if(
		opt.sendEmail === true && (
			!('host' in opt.smtpCredentials) ||
			!('port' in opt.smtpCredentials) ||
			!('user' in opt.smtpCredentials) ||
			!('from' in opt.smtpCredentials) ||
			!('pass' in opt.smtpCredentials)
		)
	){
		cb('Some email credentials not found in options.smtpCredentials. View README.')
	}
	else{
		mailTransport = nodemailer.createTransport({
			host: opt.smtpCredentials.host,
			port: opt.smtpCredentials.port,
			secure: opt.smtpCredentials.secure || true,
			auth: {
				user: opt.smtpCredentials.user,
				pass: opt.smtpCredentials.pass
			}
		})
	}



	for(var category in data){
		if(category in opt.emailList){
			let formattedCategory = formatCategory(category)
			let emailBody = (opt.emailType === 'html') ? templates.formatHtmlData(data[category]) : templates.formatData(data[category])
			if(emailBody){
				if(opt.sendEmail === true){
					let mailOpt = {
						from: opt.smtpCredentials.from,
						to: opt.emailList[category].join(', '),
						subject: `Amazon Content for ${formatCategory(formattedCategory)} Category`
					}
					if(opt.emailType === 'html'){
						mailOpt.html = emailBody
					}
					else{
						mailOpt.text = emailBody
					}
					mailTransport.sendMail(mailOpt, (err, info) => {
						if(err) throw err
						next()
					})
				}
				else{
					next()
				}
			}
			else{
				next()
			}
		}
		else{
			next()
		}
	}

	function next(){
		prog++
		if(prog >= total){
			cb(false, data)
		}
	}
}


module.exports = mail