from django.utils.deprecation import MiddlewareMixin

class XFrameOptionsMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        allowed_origins = ['https://huggingface.co', 'http://gaganyatri-django-spaces.hf.space/']  # Add your allowed origins here
        if 'HTTP_ORIGIN' in request.META and request.META['HTTP_ORIGIN'] in allowed_origins:
            response['X-Frame-Options'] = 'ALLOW-FROM %s' % request.META['HTTP_ORIGIN']
        return response