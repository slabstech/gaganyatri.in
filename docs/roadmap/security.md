Security for App

Login - 
curl -X GET \
  http://localhost:8000/api/v1/accounts/api/users/me/ \
  -H 'Authorization: Token MyTOken'



Logout


curl -X 'POST'   'http://localhost:8000/api/v1/accounts/api/token/logout/'   -H 'accept: application/json'   -H 'X-CSRFToken: SomeToken'   -d ''  -H 'Authorization: Token MyTokeb'


a. https://saasitive.com/tutorial/react-routing-components-signup-login/
b .https://saasitive.com/tutorial/token-based-authentication-django-rest-framework-djoser/
c. 


- https://saasitive.com/tutorial/react-token-based-authentication-django/
- https://saasitive.com/tutorial/token-based-authentication-django-rest-framework-djoser/
- https://saasitive.com/django-react/boilerplate/
- https://github.com/seankwarren/Django-React-jwt-authentication

Django 
 - https://www.django-rest-framework.org/api-guide/authentication/
 - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#hash-and-verify-the-passwords
 - https://simpleisbetterthancomplex.com/tutorial/2018/11/22/how-to-implement-token-authentication-using-django-rest-framework.html
 - https://www.askpython.com/python/api-calls-bearer-token-authentication
 - 