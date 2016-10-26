'use strict'
const lowdb = require('lowdb')

// Gets last ID crawled from database
function getDatabase(db, product, key){
	var row = db.get('product')
		.find({ id: product })
		.value()
	if(row){
		return row[key]
	}
	return false
}

// Sets last ID crawled in database
function setDatabase(db, product, key, value){
	let idObj = { id: product }
	let obj = db.get('product')
		.find(idObj)
		.value()
	let setObj = {}
	setObj[key] = value

	// If entry doesn't exist yet
	if(!obj){
		setObj.id = product
		let test = db.get('product')
			.push(setObj)
			.value()
	}
	// If entry does exist, update
	else{
		let test = db.get('product')
			.find(idObj)
			.assign(setObj)
			.value()
	}
}



// DB setters
function setLastReview(db, product, value){
	setDatabase(db, product, 'lastReview', value)
}
function setLastQuestion(db, product, value){
	setDatabase(db, product, 'lastQuestion', value)
}

module.exports = {

	// Database defaults
	init: function(opt){
		opt.db = lowdb(opt.db)
		opt.db.defaults({
				product: []
			})
			.value()
	},

	// Gets the last review ID crawled for an ASIN
	getLastReview: function(db, product){
		return getDatabase(db, product, 'lastReview')
	},

	// Gets the last question ID crawled for an ASIN
	getLastQuestion: function(db, product){
		return getDatabase(db, product, 'lastQuestion')
	},

	// Logs latest reviews/questions in database
	logLatest: function(db, data){
		for(var category in data){
			for(var i = 0; i < data[category].length; i++){
				if(data[category][i].reviews.length){
					setLastReview(db, data[category][i].asin, data[category][i].reviews[0].id)
				}
				if(data[category][i].questions.length){
					setLastQuestion(db, data[category][i].asin, data[category][i].questions[0].id)
				}
			}
		}
	}
}