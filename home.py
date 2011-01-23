from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from base import BaseHandler

import logging

class HomeHandler(BaseHandler):
    def get(self):
        super(HomeHandler,self).get()

        self.render_view('index.html')

application = webapp.WSGIApplication([('/',HomeHandler)],
                                     debug=True)

def main():
    logging.getLogger().setLevel(logging.DEBUG)
    run_wsgi_app(application)

if __name__ == '__main__':
    main()

        
