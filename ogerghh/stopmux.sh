#!/bin/bash

SESSIONNAME="ghh-navi"

tmux has-session -t $SESSIONNAME &> /dev/null
if [ $? = 0 ]
  then
    tmux send-keys -t $SESSIONNAME:0.3 C-c "exit" C-m
    tmux send-keys -t $SESSIONNAME:0.2 C-c "exit" C-m
    tmux send-keys -t $SESSIONNAME:0.1 C-c "exit" C-m
    tmux send-keys -t $SESSIONNAME:0.0 C-c "exit" C-m

    tmux send-keys -t $SESSIONNAME:1.0 C-c "exit" C-m
fi

tmux kill-session
