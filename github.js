/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, curly:true, browser:true, indent:4, maxerr:100, white: false */

/*!
 * GitHub.js - v0.1.0 - 10/21/2011
 * 
 * Copyrignt (c) 2011 mathphreak
 * MIT licensed.
 * 
 * Based on:
 * JavaScript Library Boilerplate - v0.1.1 - 4/1/2011
 * http://benalman.com/projects/javascript-library-boilerplate/
 *
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function( unglob ) {
	"use strict";
	var name = 'GitHub',
	  glob = this,
	  global = (!glob ? unglob : this),
	  oldGH = global.GH,
	  oldN = global[name],
	  index = 0;

	function sendJSON(url, callback, paramName) {
		paramName = (paramName === undefined ? "callback" : paramName);
		var callbackName = "oMrhlNvOohgMTPgNXLmUGitHubJScallbacknumber" + index++;
		global[callbackName] = function(json) {
			callback(json.data);
		};
		var script = document.createElement("script");
		script.src = url + "?" + paramName + "=" + callbackName;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(script);
	}
	
	function get(path, callback) {
		sendJSON("https://api.github.com" + path, callback, "callback");
	}
	
	function getRepo(user, repo, callback) {
		get("/repos/" + user + "/" + repo, callback);
	}
	
	function smartGetRepo(user, repo, callback) {
		if (callback === undefined) {
			callback = repo;
			var splitted = user.split("/");
			repo = splitted[1];
			user = splitted[0];
		}
		getRepo(user, repo, callback);
	}
	
	function getUserRepoList(user, callback) {
		get("/users/" + user + "/repos", callback);
	}
	
	function getOrgRepoList(org, callback) {
		get("/orgs/" + org + "/repos", callback);
	}
	
	function getUser(name, callback) {
		get("/users/" + name, callback);
	}
	
	function getRepoList(name, callback) {
		getUser(name, function(data) {
			if (data.type === "User") {
				getUserRepoList(name, callback);
			} else if (data.type === "Organization") {
				getOrgRepoList(name, callback);
			} else {
				throw "User type not User or Organization but '" + data.type + "'";
			}
		});
	}

	var GH = {};
	
	GH.getRepoList = getRepoList;
	GH.getRepo = smartGetRepo;
	GH.getUser = getUser;

	// Calling .noConflict will restore the global GH to its previous value.
	// Passing true will do that AND restore the full global name as well.
	// Returns a reference to your library's function.
	GH.noConflict = function( all ) {
		if ( all ) {
			global[name] = oldN;
		}
		global.GH = oldGH;
		return GH;
	};

	// Create a global reference to our library.
	global.GH = global[name] = GH;
})(window);