from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db

import os
import logging

class AppSettings(db.Model):
    pass

class BaseHandler(webapp.RequestHandler):
    def __init__(self):
        super(BaseHandler,self).__init__()
        
        logging.getLogger().setLevel(logging.DEBUG)

        # get the single instance of the app settings
        all_settings = AppSettings.all().fetch(1)
        if len(all_settings) == 0:
            self.appsettings = AppSettings()
            self.appsettings.put()
        else:
            self.appsettings = all_settings[0]

        self._context = {'c':dict()}

    def get(self,*args):
        pass

    def context(self,key,val):
        self._context['c'][key] = val

    def render_view(self,view):
        path = os.path.join(os.path.dirname(__file__),view)
        logging.debug(self.context)
        self.response.out.write(template.render(path,self._context))
