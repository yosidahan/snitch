#!/usr/bin/env node
// Snitch by Yosi Dahan
// Version 1.0.0 

var program = require('commander');
var swig  = require('swig');
var async = require('async');
var template = swig.compileFile('lib/emails.txt');
var emailExistence = require('email-existence');

program
  .version('0.0.1')
  .option('-n, --name [fullname]' , 'Full name (ex. "John Smith")')
  .option('-d, --domain-url [type]' , 'The domain name of the company, used for emails. For example, "airbnb.com".')
  .parse(process.argv);
  processParams(program);

  function processParams(program){

	if (!program.name) {
		console.log('Please provide the full name of the person surrounded by quotation marks.');
	}else if (!program.domainUrl) {
		console.log('Please provide the company\'s domain');
	}else {
		
		var nameArr = program.name.split(" ");
		if(nameArr.length != 2 || nameArr[0].length == 0 || nameArr[1].length == 0){
			console.error('You must provide a full name surrounded by quotation marks ("John Smith")')
		}else{
		 	var firstname = nameArr[0].toLowerCase();
			var lastname = nameArr[1].toLowerCase();
			createEmailsList(program.domainUrl, firstname, lastname);
		}
		
	}

  }

  function createEmailsList(domain, firsname, lastname){
  	var fi = firsname.charAt(0);
   	var li = lastname.charAt(0);

	var output = template({
	    li : li,
	    fi : fi,
	    fn : firsname,
	    ln : lastname,
	    domain : domain
	});

	var emailsArr = output.split('\n');

	var q = async.queue(function (email, callback) {
		console.log('Testing %s...', email)
	 	emailExistence.check(email, function(res,err){
	 		if(res){
	 			console.log("%s is a valid email address");
	 			process.exit(0)
	 		}
	    	callback();
	    });

	}, 2);

	emailsArr.forEach(function(email){
    	q.push(email, function (err) {});
	});

	q.drain = function() {
    	console.log('all items have been processed');
	}

	

  }




