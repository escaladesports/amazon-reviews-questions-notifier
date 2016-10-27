# Amazon Reviews & Questions Notifier

Notifies via email of new Amazon reviews & questions for a set of products.

## Installation

Via [npm](https://www.npmjs.com/):

`npm install amazon-reviews-questions-notifier`

## Quickstart example:

```
// Require module
var amazonNotifier = require('amazon-reviews-questions-notifier')

// Run notifier with options
amazonNotifier({

	// An object of categories containing arrays of ASINs
	productList: {
		books: ['0062472100', '1503364127'],
		movies: ['B000O7667K']
	},
	
	// An object of categories containing recipient emails
	emailList: {
		books: ['johndoe@gmail.com'],
		movies: ['janedoe@gmail.com, 'jackdoe@gmail.com']
	},
	
	// Provide SMTP credentials for sending emails
	smtpCredentials: {
		from: 'sender.email@gmail.com',
		host: 'smtp.gmail.com',
		port: 465,
		user: 'username',
		pass: 'password'
	}

}, function(err, data){

	// Callback function when done
	if(err) throw err
	console.log(data)
	
})
```

**Note:** Instead of providing objects, you can also provide the absolute path to a JSON file with the same content that will be read by the module.

```
// Require module
var amazonNotifier = require('amazon-reviews-questions-notifier')

// Run notifier with options providing paths to JSON files
amazonNotifier({
	productList: __dirname + '/products.json',
	emailList: __dirname + '/email.json',
	smptCredentials: __dirname + '/smpt.json'
})
```

## Usage

### Load the module

```
var amazonNotifier = require('amazon-reviews-questions-notifier')
```

### Options

- `productList`

	An object of categories that contain arrays of ASINs. Or a string containing the path to a JSON file that contains an object of categories that contain arrays of ASINs.

- `emailList`

	An object of categories that contain arrays of email recipients. Or a string containing the path to a JSON file that contains an object of categories that contain arrays of email recipients.

- `smtpCredentials `

	An object containing SMTP credentials for sending emails.
	
	Example:
	
	```
	{
		from: 'sender.email@gmail.com',
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // Enables SSL
		user: 'username',
		pass: 'password'
	}
	```
- `db` (Default: `"./db.json"`)
	
	A path to a JSON file that will be used as a database for the most recently crawled reviews and questions.
	
- `sendEmail` (Default: `true`)

	Set to false to not send emails. Useful for debugging or rolling your own email solution. The callback will still return an object containing the data that was crawled.
	
- `emailType` (Default: `"html"`)
	
	Determines what email format is sent. Accepts either `"html"` or `"text"`.

- `crawlReviews` (Default: `true`)

	Set to `false` to stop crawling reviews.

- `crawlQuestions` (Default: `true`)

	Set to `false` to stop crawling questions.
	
- `userAgent` (Default: `null`)

	Changes the crawler's default user agent string.