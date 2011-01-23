from base import BaseHandler

class HomeHandler(BaseHandler):
    def get(self,*args):
        super(HomeHandler,self).get(args)
        self.render_view('index.html')

        
