from google.appengine.ext import webapp
from google.appengine.api import urlfetch

from xml.dom import minidom

from django.utils import simplejson

from base import BaseHandler

import logging
import cgi
from operator import itemgetter

def getText(node):
    rc = []
    for child in node.childNodes:
        if child.nodeType == child.TEXT_NODE:
            rc.append(child.data)
    return ''.join(rc)

class MailinatorHandler(BaseHandler):
    def get(self,*args):
        super(MailinatorHandler,self).get(args)
        
        username = cgi.escape(args[0].strip())
        from_filter = None
        if self.request.query_string:
            for query in self.request.query_string.split('&'):
                key,value = query.split('=',1)
                if key.lower() == 'from':
                    from_filter = value
        
        mail_rss_url = 'http://mailinator.com/rss.jsp?email=' + username
        logging.debug('fetching %s' % mail_rss_url)

        raw_xml = ''
        fetch_response = urlfetch.fetch(mail_rss_url,deadline=10)
        if fetch_response.status_code == 200:
            raw_xml = fetch_response.content

        account_data = {'user':username}
        emails = []
        if raw_xml:
            rss_dom = minidom.parseString(raw_xml)
            for item_node in rss_dom.getElementsByTagName('item'):
                email = dict()
                email['from'] = getText(item_node.getElementsByTagName('dc:creator')[0])
                email['subject'] = getText(item_node.getElementsByTagName('title')[0])
                email['date'] = getText(item_node.getElementsByTagName('dc:date')[0])
                email['link'] = getText(item_node.getElementsByTagName('link')[0])
                email['body'] = getText(item_node.getElementsByTagName('description')[0])
                
                if from_filter is None or from_filter == email['from']:
                    emails.append(email)

            emails = sorted(emails,key=itemgetter('date'))
            emails.reverse()
        
        account_data['emails'] = emails
        self.response.out.write(simplejson.dumps(account_data))
