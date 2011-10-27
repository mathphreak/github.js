// You... need to change all reference of GitHub to your library's name.
var PREV_LIBRARY = window.GH = window.GitHub = {OMG: 'PONIES'};

test('basics', function() {
  ok(GH, 'GH should be.. something');
  ok(GitHub, 'GitHub should be.. something');
  equals(GH, GitHub, 'GH and GitHub should point to the same thing');
  notEqual(GH, PREV_LIBRARY, 'GH should not be the previous window.GH');
  notEqual(GitHub, PREV_LIBRARY, 'GitHub should not be the previous window.GitHub');
});

test('noConflict', function() {
  var GHGH = GH;

  equals(GitHub, GitHub.noConflict(), 'GH.noConflict should return our library');
  equals(GitHub, GHGH, 'GitHub should still point to our library');
  equals(GH, PREV_LIBRARY, 'GH should be reverted to prev library');

  GH = GitHub;

  equals(GitHub, GitHub.noConflict(true), 'GH.noConflict should return our library');
  equals(GH, PREV_LIBRARY, 'GH should be reverted to prev library');
  equals(GitHub, PREV_LIBRARY, 'GitHub should be reverted to prev library');

  GH = GitHub = GHGH;
  notEqual(GH, PREV_LIBRARY, 'GH should not be the previous window.GH');
  notEqual(GitHub, PREV_LIBRARY, 'GitHub should not be the previous window.GitHub');
});

asyncTest('getUser', function() {
	GH.getUser("octocat", function(data) {
		equals(data.type, "User", "data.type should be User");
		equals(data.login, "octocat", "the login of octocat should be 'octocat'");
		start();
	});
});

asyncTest('getRepoList and getRepo', function() {
	var st = _.after(2, start);
	var thingsThatDontWork = [
		"has_issues",
		"has_wiki",
		"has_downloads",
		"mirror_url",
		"integrate_branch",
		"language",
		"source",
		"parent",
		"organization"
	];
	GH.getRepoList("octocat", function(data) {
		var s = _.after(data.length, st);
		for (var i = 0; i < data.length; i++) {
			(function(idx) {
				GH.getRepo("octocat", data[idx].name, function(newData) {
					// fix a few things that one provides but the other doesn't
					_.each(thingsThatDontWork, function(thing) {
						data[idx][thing] = newData[thing] = null;
					});
					deepEqual(data[idx], newData, "/users/octocat/repos and /repos/octocat/" + data[idx].name + " should be the same");
					s();
				});
			})(i);
		}
	});
	GH.getRepoList("github", function(data) {
		for (var i = 0; i < data.length; i++) {
		var s = _.after(data.length, st);
			(function(idx) {
				GH.getRepo("github", data[idx].name, function(newData) {
					// fix a few things that one provides but the other doesn't
					_.each(thingsThatDontWork, function(thing) {
						data[idx][thing] = newData[thing] = null;
					});
					deepEqual(data[idx], newData, "/users/github/repos and /repos/github/" + data[idx].name + " should be the same");
					s();
				});
			})(i);
		}
	});
});


asyncTest("smart getRepo", function() {
	GH.getRepo("octocat/Hello-World", function(data1) {
		GH.getRepo("octocat", "Hello-World", function(data2) {
			deepEqual(data1, data2, "octocat/Hello-World should equal octocat / Hello-World");
			start();
		});
	});
});