#!/bin/bash

set -u
set -e
set -v

DOWNLOAD_DIR="/tmp"
REPO="dangmai/splitwizard"  # this must be the same as the tag from Rockerfile
mkdir -p $DOWNLOAD_DIR
cd $DOWNLOAD_DIR
# Download Rocker
curl -O -L https://github.com/grammarly/rocker/releases/download/1.1.2/rocker-1.1.2-linux_amd64.tar.gz
tar xvfz rocker-1.1.2-linux_amd64.tar.gz
# Build the image
cd $TRAVIS_BUILD_DIR
$DOWNLOAD_DIR/rocker build
# Push to Docker Hub
docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD -e $DOCKERHUB_EMAIL
docker push $REPO
# Download CloudFoundry CLI tool & BlueMix plugin
cd $DOWNLOAD_DIR
curl -o cf.tgz -L 'https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.16.1&source=github-rel'
tar xvfz cf.tgz
./cf install-plugin -f https://static-ice.ng.bluemix.net/ibm-containers-linux_x64
# Push to private repo
./cf ic init
./cf login -u $BLUEMIX_USERNAME -p $BLUEMIX_PASSWORD -a api.ng.bluemix.net
./cf ic cpi $REPO:latest registry.ng.bluemix.net/$REPO:latest
OLD_CONTAINER_NAME=`./cf ic ps | grep -oE '[^ ]+$' | grep splitwizard.* | cat`
NEW_CONTAINER_NAME="splitwizard.`date +%s`"
if [ "$OLD_CONTAINER_NAME" != "" ]; then
  ./cf ic ip unbind $PUBLIC_IP $OLD_CONTAINER_NAME
  ./cf ic stop $OLD_CONTAINER_NAME
  ./cf ic rm $OLD_CONTAINER_NAME
fi
./cf ic run -p 80 -m $BLUEMIX_MEMORY --name $NEW_CONTAINER_NAME registry.ng.bluemix.net/$REPO
./cf ic ip bind $PUBLIC_IP $NEW_CONTAINER_NAME