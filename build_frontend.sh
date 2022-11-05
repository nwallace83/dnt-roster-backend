#!/bin/bash

STARTDIR=`pwd`
BASEDIR=`dirname $0`
PROJECTDIR="$BASEDIR/build/dnt-roster"

if  [ ! -e $BASEDIR/build/dnt-roster ]; then
    echo "DNT ROSTER PROJECT NOT FOUND, CLONING..........."
    mkdir -p $BASEDIR/build/dnt-roster
    git clone https://github.com/nwallace83/dnt-roster.git $BASEDIR/build/dnt-roster/
fi

cd $PROJECTDIR
git restore .
git reset
git clean -f
git clean -fd
git pull
npm install
npm run build
cd $STARTDIR

if [ ! -e $BASEDIR/src/html ]; then
    mkdir $BASEDIR/src/html
fi

if [ $? -eq 0 ] 
then
    echo "REMOVING FILES"
    rm -Rfv $BASEDIR/dist/html/*
    echo "COPYING FILES"
    cp -Rfv $PROJECTDIR/build/* $BASEDIR/dist/html/
else 
    echo "Package build failed"
fi