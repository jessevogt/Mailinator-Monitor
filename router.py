from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from home import HomeHandler
from mailinator import MailinatorHandler

import logging

def main():
    logging.getLogger().setLevel(logging.DEBUG)

    routes = [('/mailinator/(.+)',MailinatorHandler),
              ('/',HomeHandler)]
    application = webapp.WSGIApplication(routes,debug=True)
    util.run_wsgi_app(application)
                                          

if __name__ == '__main__':
    main()
