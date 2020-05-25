#!/usr/bin/env bash
cd /home/cs144/shared/project3
cd Express
mongo < db.sh
npm start &
cd /home/cs144/shared/project4/my-blog
ng serve --host 0.0.0.0


