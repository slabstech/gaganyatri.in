Backend


Setup

git clone https://huggingface.co/spaces/gaganyatri/django_spaces

cd django_spaces

docker build -t slabstech/gaganyatri -f Dockerfile .

docker run slabstech/gaganyatri 


- Steps to build this project 
   - python3.10 -m venv venv 
   - source venv/bin/activate
   - pip install Django==5.1.1
   - django-admin startproject spaces .
   - python manage.py migrate
   - python manage.py runserver

   - python manage.py startapp space_walks
   - python manage.py makemigrations
   - python manage.py migrate


   - pip install uvicorn
   - python -m uvicorn spaces.asgi:application


- Merge for Huggingface
   - git fetch --all
   - git checkout main
   - git merge --squash django-setup
   - git commit -m "merge"
   - git push origin main



 - Referenc
    - https://www.djangoproject.com/download/
    - https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
    - https://github.com/testdrivenio/django-on-docker

   http://localhost:8000/api/v1/recipes/execute_prompt_get/?prompt=%22sachin%22