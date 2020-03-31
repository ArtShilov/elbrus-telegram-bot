git add -A
git commit -am 'autocommit'
git push heroku master
heroku ps:scale web=1
