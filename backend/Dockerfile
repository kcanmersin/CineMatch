# # pull official base image
# # FROM python:latest-alpine AS build
# # # set work directory
# # WORKDIR /srv/app

# # # set environment variables
# # ENV PYTHONDONTWRITEBYTECODE 1
# # ENV PYTHONUNBUFFERED 1

# # # install dependencies
# # RUN pip install --upgrade pip
# # COPY ./requirements.txt .

# # RUN apt-get update && apt-get install -y \
# #   gcc \
# #   netcat \
# #   libpq-dev \
# #   postgresql-client \
# #   && apt-get clean

# # # install temp dependencies for build of pyscopg2 etc
# # RUN pip install -r requirements.txt

# # # copy entrypoint.sh
# # COPY ./entrypoint.sh .

# # # copy project
# # COPY . .

# # # run entrypoint.sh
# # # ENTRYPOINT ["/srv/app/entrypoint.sh"]




# # # FINAL
# # # pull official base image
# # #FROM python:latest-alpine

# # # create the app user
# # RUN addgroup -S app && adduser -S app -G app

# # # create the appropriate directories
# # # ENV HOME=/srv
# # ENV APP_HOME=/srv/app
# # RUN mkdir $APP_HOME
# # RUN mkdir $APP_HOME/static
# # RUN mkdir $APP_HOME/media
# # WORKDIR $APP_HOME

# # # install dependencies
# # RUN apk add --update --no-cache libpq postgresql-client
# # COPY --from=build /srv/app/wheels /wheels
# # COPY --from=build /srv/app/requirements.txt .
# # RUN pip install --no-cache /wheels/*

# # # copy entrypoint-prod.sh
# # COPY ./entrypoint.prod.sh $APP_HOME

# # # copy project
# # COPY . $APP_HOME

# # # chown all the files to the app user
# # RUN chown -R app:app $APP_HOME

# # # change to the app user
# # USER app

# # # run entrypoint.prod.sh
# # ENTRYPOINT ["/srv/app/entrypoint.prod.sh"]





# # Stage 1: Build Stage
# FROM python:3.8.3-alpine AS build

# WORKDIR /srv/app

# # set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# RUN apt-get update -y &&  \
#    python -m pip install --upgrade pip  

# # install dependencies for build
# RUN apk add --no-cache \
#     g++ \
#     musl-dev \
#     libffi-dev \
#     openssl-dev

   
# # install temp dependencies for build of pyscopg2 etc
# COPY ./requirements.txt .
# # RUN pip install --upgrade pip 
# RUN apk add --no-cache python3-dev openssl-dev libffi-dev gcc gfortran && pip3 install --upgrade pip

# RUN pip install -r requirements.txt

# # Stage 2: Final Stage
# FROM python:3.8-alpine

# # create the app user
# RUN addgroup -S app && adduser -S app -G app

# # create the appropriate directories
# ENV APP_HOME=/srv/app
# RUN mkdir $APP_HOME
# RUN mkdir $APP_HOME/static
# RUN mkdir $APP_HOME/media
# WORKDIR $APP_HOME

# # install dependencies
# # RUN apk add --update --no-cache libpq postgresql-client
# RUN apk add --no-cache python3-dev openssl-dev libffi-dev  gcc && pip3 install --upgrade pip

# RUN pip install --upgrade pip setuptools

# COPY --from=build /srv/app/. /srv/app/



# # chown all the files to the app user
# RUN chown -R app:app $APP_HOME

# # change to the app user
# USER app

# # run entrypoint.prod.sh
# ENTRYPOINT ["/srv/app/entrypoint.prod.sh"]


#FROM python:3.8-slim
#FROM python:3.12.1-bullseye

#FROM python:3.9.1-slim-buster

FROM python:3.8.18-bookworm

RUN pip install --upgrade pip

RUN pip3 install --upgrade pip setuptools

RUN pip install docopt

RUN pip install psycopg2

RUN pip install odfpy

RUN pip install MarkupPy

RUN pip install future

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]