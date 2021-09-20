# Set up Docker
sudo apt-get update
sudo apt install docker.io -y

# Install Npm
sudo apt install npm -y

# Nodejs
sudo npm install -g n
sudo n stable

# Install mup
sudo npm install -g mup

# Meteor
sudo curl https://install.meteor.com/ | sh

# Meteor-dependencies
meteor add ostrio:flow-router-extra
meteor npm install --save react react-dom
meteor npm install --save react-mounter
meteor npm install --save react-beautiful-dnd
meteor npm install --save react-html-parser

# Add current user to Docker
sudo gpasswd -a $USER docker
newgrp docker
