#!/bin/sh

git add -A
git commit -am 'mail send'
git push heroku master
# heroku ps:scale web=1
heroku ps:scale worker=1

git add -A
git commit -am 'mail send'
git push origin master
