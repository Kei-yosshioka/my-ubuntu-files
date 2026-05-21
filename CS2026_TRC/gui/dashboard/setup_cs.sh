#!/bin/bash
set -e

# ===== User settings =====
PI_IP="192.168.137.12"
CS_IP="192.168.137.123"

# ===== Move to GUI directory =====
cd ~/CS2026_TRC/gui/dashboard

# ===== Install Node.js 22 =====
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# ===== Install GUI dependencies =====
rm -rf node_modules
npm install

# ===== Install rosbridge =====
sudo apt update
sudo apt install -y ros-jazzy-rosbridge-server

# ===== Create .env =====
cat > .env << EOF
VITE_STREAM_BASE_URL=http://${PI_IP}:8889
VITE_STREAM_ARM_FRONT_URL=http://${PI_IP}:8889
VITE_ROSBRIDGE_URL=ws://${CS_IP}:9090
EOF

echo "CS setup completed."
echo "Start rosbridge:"
echo "  ros2 launch rosbridge_server rosbridge_websocket_launch.xml"
echo ""
echo "Start GUI:"
echo "  cd ~/CS2026_TRC/gui/dashboard"
echo "  npm run dev -- --host"
echo ""
echo "Open in browser:"
echo "  http://${CS_IP}:5173"

