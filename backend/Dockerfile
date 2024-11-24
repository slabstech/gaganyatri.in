# pull official base image
FROM python:3.12-bullseye
RUN useradd -m -u 1000 user
USER user

ENV PATH="/home/user/.local/bin:$PATH"
# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
#RUN apt-get update && apt-get install -y netcat

# install dependencies
RUN pip install --upgrade pip
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt


# copy project

COPY --chown=user . /app

RUN python manage.py migrate
CMD ["python", "manage.py", "runserver", "0.0.0.0:7860"]

#CMD ["uvicorn", "spaces.asgi:application", "--host", "0.0.0.0", "--port", "7860"]