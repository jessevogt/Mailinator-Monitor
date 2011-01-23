/* Author: 

*/

var MailinatorMonitorNamespace = {
    common : {
        init : function() {
            $("#go").click( function() {

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

                    $("#results #data").append('<div id="' + address + '"></div>"');
                    $("#results #data #" + address).append("<h1>" + address + "</h1>");

                    var url = "/mailinator/" + address;
                    jQuery.getJSON(url, function(accountData) {
                        var user = accountData.user;
                        var emailsLength = accountData.emails.length;
                        for( var j = 0; j < emailsLength; ++j ) {
                            $("#results #data #" + user).append(accountData.emails[j].subject + "<br/>");
                        }
                        console.log("added for " + user);
                    });
                }
                
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























