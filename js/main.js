var gui = require('nw.gui');

var menu = new gui.Menu({ type: 'menubar' });

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var driver = require('node-phantom-simple');
    
 
var matches=[];
var scrapedMatchData = [];

var appWidth = 350;
window.moveTo(window.screen.availWidth - appWidth - 10,60);

url = 'http://www.espncricinfo.com/';

function getMatchUrl(callback) {
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            $('.scoreline-list').first().filter(function(){
                var data = $(this);
                var numOfMatches = data.children().length;

                //GET URL FOR EACH MATCH
                for(x=0;x<numOfMatches;x++)
                {
                    var lielem = data.children().eq(x);
                    matches[x] = "http://www.espncricinfo.com" + lielem.children().first().attr('href');
                    //console.log(matches[x]);

                }
            });
            callback();

        }
    });
}

function getMatchData(matchurl,callback) {
    console.log("url",matchurl);
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
                var inningsinfo = [];
                var scoretable = [];
                var recentovers = [];
                var bowlingtable = [];
     
                $('.innings-information').each(function () { inningsinfo.push($(this).html()); });
                $('.score-table').each(function () { scoretable.push($(this).html()); });
                $('.recent-overs').each(function () { recentovers.push($(this).html()); });

                var nav = $('.tab-full-scorecard')[0]; // obtain reference to the underlying DOMElement
        
               

                return{innings_info:inningsinfo,
                        score_table:scoretable,
                        recent_overs:recentovers};
              }, function (err,result) {
                scrapedMatchData = result;
                browser.exit();
                callback();
              });
            }, 5000);
          });
          });
      });
    });   
}


app.get('/getallmatches', function(req, res) {
    getMatchUrl(function(){
        console.log(matches);
        res.json(matches);
    });
});

app.post('/getmatchdata', function(req, res) {
    var matchurl = req.body.matchurl;
    getMatchData(matchurl,function(){
        res.json(scrapedMatchData);
    });
});



app.listen(3001);