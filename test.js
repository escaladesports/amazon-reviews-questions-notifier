'use strict'
const amazonNotifier = require('./app')


amazonNotifier({
	sendEmail: false,
	productList: 'product.json',
	emailList: 'email.json',
	smtpCredentials: 'smtp.json'
}, function(err, data){
	if(err){
		console.error(err)
	}
	console.log(data)
})