FROM postgres:alpine

ENV POSTGRES_PASSWORD=1337 
ENV POSTGRES_USER=postgres 
ENV POSTGRES_DB=trans 

EXPOSE 5432


