#!/bin/sh

git add -A
git commit -am 'Reg change'
git push heroku master
# heroku ps:scale web=1
heroku ps:scale worker=1


git push origin master
