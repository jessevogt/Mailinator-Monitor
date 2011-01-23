from google.appengine.ext import webapp
from google.appengine.api import urlfetch

from xml.dom import minidom

from django.utils import simplejson

from base import BaseHandler

import logging
import cgi

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
        
        mail_rss_url = 'http://mailinator.com/rss.jsp?email=' + username
        logging.debug('fetching %s' % mail_rss_url)

        raw_xml = ''
        fetch_response = urlfetch.fetch(mail_rss_url,deadline=10)
        if fetch_response.status_code == 200:
            raw_xml = fetch_response.content

        emails = []
        if raw_xml:
            rss_dom = minidom.parseString(raw_xml)
            for item_node in rss_dom.getElementsByTagName('item'):
                email = dict()
                email['from'] = getText(item_node.getElementsByTagName('dc:creator')[0])
                email['subject'] = getText(item_node.getElementsByTagName('title')[0])
                email['date'] = getText(item_node.getElementsByTagName('dc:date')[0])
                email['link'] = getText(item_node.getElementsByTagName('link')[0])
                
                emails.append(email)

        self.response.out.write(simplejson.dumps(emails))
