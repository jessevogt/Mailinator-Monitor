/* Author: 

*/

var emailRefreshTimer = null;

function doIt() {
    // delete the data div and recreate to remove all previous results
    $("#results #data").remove();
    $("#results").append('<div id="data"></div>');

    var rawAddresses = $("#addresses").val().split(/[\s,;]/);
    var addressesLength = rawAddresses.length;
    for( var i = 0; i < addressesLength; ++i ) {
        var address = null
        if( rawAddresses[i].indexOf("@") < 0 ) {
            // address does not contain @server.com, just add as is
            address = rawAddresses[i];
        } else {
            // strip of the @ sign and everything after it
            address = rawAddresses[i].substr(0,rawAddresses[i].indexOf("@"));
        }

        $("#results #data").append('<div id="' + address + '"></div>');
        $("#results #data #" + address).append("<h1>" + address + "</h1>");
        
        var finishedCount = 0;

        var from = $("#from").val()

        var url = "/mailinator/" + address + (from.length > 0 ? "?from=" + from : "")

        jQuery.getJSON(url, function(accountData) {
            var user = accountData.user;
            var user_elem = "#results #data #" + user;
            var emailsLength = accountData.emails.length;
            if( emailsLength > 0 ) {
                for( var j = 0; j < (emailsLength > 5 ? 5 : emailsLength); ++j ) {
                    $(user_elem).append(accountData.emails[j].subject + "<br/>");
                }
            }
            finishedCount++;

            if( finishedCount == addressesLength ) {
                emailRefreshTimer = setTimeout("doIt()",5000);
            }
        });
    }
}


var MailinatorMonitorNamespace = {
    common : {
        init : function() {
            $("#go").click( function() {
                doIt();
            });
            $("#stop").click( function() {
                clearTimeout(emailRefreshTimer);
            });
        },
        finalize : function() {}
    }
}

UTIL = {
 
  fire : function(func,funcname, args){
 
    var namespace = MailinatorMonitorNamespace;  // indicate your obj literal namespace here
 
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    } 
 
  }, 
 
  loadEvents : function(){
 
    var bodyId = document.body.id;
 
    // hit up common first.
    UTIL.fire('common');
 
    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
      UTIL.fire(classnm,bodyId);
    });
 
    UTIL.fire('common','finalize');
 
  } 
 
}; 
 
// kick it all off here 
$(document).ready(UTIL.loadEvents);























