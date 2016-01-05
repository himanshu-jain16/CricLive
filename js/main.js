var file = require('file.js');
var gui = require('nw.gui');

var menu = new gui.Menu({ type: 'menubar' });

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var driver = require('node-phantom-simple');
    
 
    
    var scrapeddata = {};
    url = 'http://www.espncricinfo.com/';

function updateCache() {
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            $('.scoreline-list').first().filter(function(){
                var data = $(this);
                var numOfMatches = data.children().length;
                console.log("Number of Matches:  ",numOfMatches);
                var matches=[];

                //GET URL FOR EACH MATCH
                for(x=0;x<numOfMatches;x++)
                {
                    var lielem = data.children().eq(x);
                    matches[x] = "http://www.espncricinfo.com" + lielem.children().first().attr('href');
                    $('#editor').val(matches[x]);
                    console.log(matches[x]);

                }
                
                //FOR EACH MATCH URL
                for(x=0;x<numOfMatches;x++)
                {  
                    var matchurl = matches[x];   
                    //console.log(matchurl);
                    driver.create({ path: require('phantomjs').path }, function (err, browser) {
                      return browser.createPage(function (err, page) {
                        return page.open(matchurl, function (err,status) {
                          console.log("opened site? ", status);
                          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function (err) {
                            // jQuery Loaded. 
                            // Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds. 
                            setTimeout(function () {
                              return page.evaluate(function () {
                                //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object. 
                                var h2Arr = [];
                     
                                $('.innings-information').each(function () { h2Arr.push($(this).html()); });
                                scrapeddata = JSON.parse(h2Arr);
                                return {
                                  h2: h2Arr
                                };
                              }, function (err,result) {
                                browser.exit();
                              });
                            }, 5000);
                          });
                          });
                      });
                    });
                 setTimeout(function(){
                        //waiting for the jquery to load
                        //scrapeddata = h2Arr;

                    }, 5000);

                } //END FOR LOOP EACH MATCH URL




            })

            // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

           
            //console.log(json);
        }
    }); // end of request
}

//Update cache every 60 secs.
setInterval(updateCache, 10000);
                            

app.get('/myendpoint', function(req, res) {
    console.log("GET scrapeddata");
    console.log(scrapeddata);
    res.json(scrapeddata);
        })


menu.append(new gui.MenuItem({
	label: 'File',
	submenu: new gui.Menu()
}));

menu.items[0].submenu.append(new gui.MenuItem({
	label: 'New',
	click: function () {
		gui.Window.open('index.html');
	}
}));
menu.items[0].submenu.append(new gui.MenuItem({
	type: 'separator'
}));
menu.items[0].submenu.append(new gui.MenuItem({
	label: 'Close',
	click: function () {
		gui.Window.get().close();
	}
}));

gui.Window.get().menu = menu;

function clickInput(id) {
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click');
	document.getElementById(id).dispatchEvent(event);
}

document.addEventListener('keyup', function (e) {
	if (e.keyCode == 'O'.charCodeAt(0) && e.ctrlKey) {
		clickInput('open');
	} else if (e.keyCode == 'S'.charCodeAt(0) && e.ctrlKey) {
		clickInput('save');
	} else if (e.keyCode == 'N'.charCodeAt(0) && e.ctrlKey) {
	gui.Window.open('notes.html');
    }
});

app.listen(3001);