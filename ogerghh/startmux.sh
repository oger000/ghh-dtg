#!/bin/bash


SESSIONNAME="ghh-navi"
#STARTDIR="/home/gerhard/oger-syncbox/grüne+gemeinde/ghh-dtg/repo/ogerghh"
STARTDIR=`pwd`
STARTDIR_CLIENT="$STARTDIR/client"
STARTDIR_SERVER="$STARTDIR/server"

tmux has-session -t $SESSIONNAME &> /dev/null
if [ $? != 0 ]
  then
    tmux new-session -s $SESSIONNAME -c "$STARTDIR_CLIENT" -n "ghh-navi" -d
    tmux set-option mouse on
    tmux send-keys -t $SESSIONNAME:0 "yarn quasar dev" C-m M-o

    tmux split-window -t $SESSIONNAME:0.0 -v -c "$STARTDIR_SERVER/log"
    tmux send-keys -t $SESSIONNAME:0 "tail -F error.log" C-m

    tmux split-window -t $SESSIONNAME:0.0 -h -c "$STARTDIR_SERVER"
    tmux send-keys -t $SESSIONNAME:0 "yarn start" C-m M-o

    #tmux split-window -t $SESSIONNAME:0.2 -v -c "$STARTDIR_SERVER/log"
    tmux new-window -t $SESSIONNAME:1 -n "log" -c "$STARTDIR_SERVER/log"
    tmux send-keys -t $SESSIONNAME:1 "tail -F combined.log" C-m


    #tmux new-window -t $SESSIONNAME:1 -n "client" -c "$STARTDIR_CLIENT"
    #tmux send-keys -t $SESSIONNAME:1 "mc" C-m

    #tmux new-window -t $SESSIONNAME:2 -n "server" -c "$STARTDIR_SERVER"
    #tmux send-keys -t $SESSIONNAME:2 "mc" C-m
fi

tmux select-window -t $SESSIONNAME:0
tmux attach -t $SESSIONNAME
