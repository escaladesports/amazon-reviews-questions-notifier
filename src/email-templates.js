'use strict'
module.exports = {

	// Text email template
	formatData: function(data){
		let reviews = ''
		let questions = ''
		let product
		let i

		for(product = data.length; product--;){
			for(i = data[product].reviews.length; i--;){
				reviews += `Title: ${data[product].reviews[i].title}\n`
				reviews += `Rating: ${data[product].reviews[i].rating}/5 Stars\n`
				reviews += `Review: ${data[product].reviews[i].text}\n`
				reviews += `Link: ${data[product].reviews[i].link}\n`
				reviews += `Author: ${data[product].reviews[i].author}\n`
				reviews += `Date: ${data[product].reviews[i].date}\n`
				reviews += '\n'
			}
			for(i = data[product].questions.length; i--;){
				questions += `Question: ${data[product].questions[i].question}\n`
				questions += `Link: ${data[product].questions[i].link}\n`
				questions += '\n'
			}
		}

		if(reviews){
			reviews = `REVIEWS:\n\n${reviews}`
		}
		if(questions){
			questions = `QUESTIONS:\n\n${questions}`
		}

		return reviews + questions
	},

	// HTML email template
	formatHtmlData: function(data){
		let reviews = ''
		let questions = ''
		let product
		let i

		for(product = data.length; product--;){
			for(i = data[product].reviews.length; i--;){
				reviews += `<b><a href="${data[product].reviews[i].link}">${data[product].reviews[i].title}</a></b><br>`
				reviews += `<b>Rating:</b> ${data[product].reviews[i].rating}/5 Stars<br>`
				reviews += `<b>Review:</b> ${data[product].reviews[i].text}<br>`
				reviews += `<b>Author:</b> ${data[product].reviews[i].author}<br>`
				reviews += `<b>Date:</b> ${data[product].reviews[i].date}<br>`
				reviews += '<br>'
			}
			for(i = data[product].questions.length; i--;){
				questions += `<b><a href="${data[product].questions[i].link}">${data[product].questions[i].question}</a></b><br>`
				questions += '<br>'
			}
		}

		if(reviews){
			reviews = `<h3>Latest Reviews:</h3><br><br>${reviews}`
		}
		if(questions){
			questions = `<h3>Latest Questions:</h3><br><br>${questions}`
		}

		return reviews + questions
	}

}

