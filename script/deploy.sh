#!/bin/sh
ssh ubuntu@3.17.65.95 <<EOF
    cd ~/true-cards-server
    git pull origin master
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install v10.11.0
    npm install
    npm install -g nodemon pm2
    pm2 restart ecosystem.config.js
    exit
EOF
