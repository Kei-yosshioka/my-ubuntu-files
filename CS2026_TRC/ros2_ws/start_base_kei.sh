#!/bin/bash

source /opt/ros/jazzy/setup.bash
source ~/CS2026_TRC/ros2_ws/install/setup.bash

export ROS_DOMAIN_ID=27

ros2 launch control_station base_station.launch.py
