#!/bin/sh

git add -A
git commit -am 'autocommit'
git push heroku master
# heroku ps:scale web=1
heroku ps:scale worker=1
