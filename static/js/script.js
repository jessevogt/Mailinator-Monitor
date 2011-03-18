/* Author: 

*/

var emailRefreshTimer = null;

function collectAddresses(rawData) {
    // split the addresses by whitespace, newlines, commas, and semicolons
    var rawAddresses = rawData.split(/[\s,;\n]+/);
    var addressCount = rawAddresses.length;
    var addresses = [];
    for( var i = 0; i < addressCount; ++i ) {
        var address = null;
        if( rawAddresses[i].indexOf("@") < 0 ) {
            // address does not contain @server.com, just add as is
            address = rawAddresses[i];
        } else {
            // strip of the @ sign and everything after it
            address = rawAddresses[i].substr(0,rawAddresses[i].indexOf("@"));
        }

        if( address && !(address in addresses) ) {
            addresses[address] = 1;
        }
    }
    
    return addresses;
}

function checkAddresses() {
    $("#results *").remove();

    var addresses = collectAddresses($("#addresses").val());
    var resultsElement = $("<div>");
    for( var address in addresses ) {
        if( !addresses.hasOwnProperty(address) ) {
            continue;
        }
        var resultElement = $('<div id="' + address + '">');
        resultElement.append(address);
        resultsElement.append(resultElement);
    }


    $("#results").append(resultsElement);
}

function doIt(continuousCheck) {
    

    var rawAddresses = $("#addresses").val().split(/[\s,;\n]+/);
    var hitAddresses = []
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

        // prevent using the same address more than once
        if( hitAddresses[address] == 'HIT' ) {
            continue;
        }
        hitAddresses[address] = 'HIT';

        $("#results #data").append('<div id="' + address + '"></div>');
        var userElem = "#results #data #" + address;
        $(userElem).append("<h1>" + address + "</h1>");
        break;

        var finishedCount = 0;

        var from = $("#from").val();

        var url = "/mailinator/" + address + (from.length > 0 ? "?from=" + from : "");

        jQuery.getJSON(url, function(accountData) {
            var user = accountData.user;
            var myUserElem = "#results #data #" + user;
            var emailsLength = accountData.emails.length;
            if( emailsLength > 0 ) {
                var mytable = $(myUserElem).append("<table><tbody></tbody></table>")
                for( var j = 0; j < (emailsLength > 5 ? 5 : emailsLength); ++j ) {
                    // $(user_elem).append(accountData.emails[j].subject + "<br/>");
                    em = accountData.emails[j];
                    emailDate = new Date();
                    emailDate.setTime(Date.parse(em.date));
                    today = new Date();

                    var dateText = '';
                    if( emailDate.getFullYear() == today.getFullYear() ) {
                        if( emailDate.getMonth() == today.getMonth() &&
                            emailDate.getDate() == today.getDate() ) {
                            dateText = emailDate.getHours() + ':';
                            if( emailDate.getMinutes() < 10 ) {
                                dateText += '0' + emailDate.getMinutes();
                            } else {
                                dateText += emailDate.getMinutes();
                            }
                        } else {
                            dateText = [ 'Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec' ][emailDate.getMonth()] + ' ' + emailDate.getDate();
                        }
                    } else {
                        dateText = emailDate.getFullYear() + '/' +
                                   (emailDate.getMonth() + 1) + '/' + 
                                   emailDate.getDate();
                    }

                    emailHTML = '<tr onclick="javascript:window.open(\'' + em.link + '\');">' +
                                  '<td><span class="from">' + em.from + '</span></td>' +
                                  '<td><span class="subject">' + em.subject + '</span>' +
                                      '<span class="body">' + em.body + '</span></td>' +  
                                  '<td><span class="date">' + dateText + '</span></td>' +
                                '</tr>';
                                
                    if( j == 0 ) {
                        // delete the data div and recreate to remove all previous results
                        $("#results #data").remove();
                        $("#results").append('<div id="data"></div>');
                    }


                    mytable.find('tbody')
                      .append(emailHTML);
                }
            }
            finishedCount++;

            if( continuousCheck && finishedCount == addressesLength ) {
                emailRefreshTimer = setTimeout("doIt(true)",5000);
            }
        });
    }
}


var MailinatorMonitorNamespace = {
    common : {
        init : function() {
            $("#go").click( function() {
                // check if a timer is already running, if it is running clear it since
                // starting a new timer would cause a new timer to be created making the
                // updates show up once for each time the button is clicked
                /*
                if(emailRefreshTimer) {
                    clearTimeout(emailRefreshTimer);
                    emailRefreshTimer = null;
                }
                */
                checkAddresses();
            });
            $("#stop").click( function() {
                clearTimeout(emailRefreshTimer);
            });
            $("#checkonce").click( function() {
                checkAddresses();
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























