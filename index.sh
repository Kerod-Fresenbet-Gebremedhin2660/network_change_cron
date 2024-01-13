#!/bin/zsh
watch -n 1 echo "WATCHING" && echo "root" | sudo -S /Users/macbook/.nvm/versions/node/v16.14.2/bin/node -e "import('./index.js')"