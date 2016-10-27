'use strict'
const getReviews = require('amazon-reviews-crawler')
const getQuestions = require('amazon-questions-crawler')
const database = require('./database')

function crawl(opt, cb){
	let progress = -1
	let keys = Object.keys(opt.productList)
	let total = keys.length
	let output = {}

	// Moves through categories
	function next(err, data){
		// Save data to output
		if(err){
			cb(err)
			throw err
		}
		if(data){
			output[keys[progress]] = data
		}
		progress++
		if(progress >= total){
			// Done!
			cb(false, output)
		}
		else{
			processCategory(opt, keys[progress], next)
		}
	}
	next()
}


// Processes a category of ASINs
function processCategory(opt, category, cb){
	let progress = 0
	processProduct(opt, category, progress, [], cb)
}

// Processes a single ASIN
function processProduct(opt, category, progress, output, cb){

	// If done
	if(progress >= opt.productList[category].length){
		cb(false, output)
		return
	}

	// Options
	const reviewOpt = {
		stopAtReviewId: database.getLastReview(opt.db, opt.productList[category][progress])
	}
	const questionOpt = {
		stopAtQuestionId: database.getLastQuestion(opt.db, opt.productList[category][progress])
	}
	if('userAgent' in opt){
		reviewOpt.userAgent = opt.userAgent
		questionOpt.userAgent = opt.userAgent
	}

	// Find reviews
	getReviews(opt.productList[category][progress], reviewOpt, (err, reviews) => {
		if(err){
			cb(err)
			throw err
		}

		// Find questions
		getQuestions(opt.productList[category][progress], questionOpt, (err, questions) => {
			if(err){
				cb(err)
				throw err
			}

			// Add to output and progress to next product
			output.push({
				asin: opt.productList[category][progress],
				title: reviews.title || questions.title,
				reviews: reviews.reviews,
				questions: questions.questions
			})
			progress++
			processProduct(opt, category, progress, output, cb)

		})
	})
}

module.exports = crawl