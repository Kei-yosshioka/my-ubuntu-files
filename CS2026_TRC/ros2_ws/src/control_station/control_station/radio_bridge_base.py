#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import serial
import struct

HEADER = 0xAA
FOOTER = 0x55

class RadioBridgeBase(Node):
    def __init__(self):
        super().__init__('radio_bridge_base')

        # Open serial port to Arduino
        try:
            self.ser = serial.Serial('/dev/ttyACM0', 57600, timeout=0.1)
            self.get_logger().info("Opened /dev/ttyACM0 successfully")
        except Exception as e:
            self.get_logger().error(f"Failed to open /dev/ttyACM0: {e}")
            raise

        self.get_logger().info("Base radio bridge started")

        # Subscribe to teleop Twist messages
        self.subscription = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.twist_callback,
            10
        )

    # ------------------------------------------------------------------
    # Convert Twist → 6‑byte packet and send to Arduino
    # ------------------------------------------------------------------
    def twist_callback(self, msg):
        linear = msg.linear.x
        angular = msg.angular.z

        # Scale to signed 16‑bit integers
        linear_i  = int(linear  * 1000)
        angular_i = int(angular * 1000)

        # Pack into little‑endian signed shorts
        v_low, v_high = struct.pack('<h', linear_i)
        o_low, o_high = struct.pack('<h', angular_i)

        packet = bytes([
            HEADER,
            v_low,
            v_high,
            o_low,
            o_high,
            FOOTER
        ])

        # Log for debugging
        self.get_logger().info(f"Sending packet bytes: {list(packet)}")

        # Send to Arduino
        try:
            self.ser.write(packet)
        except Exception as e:
            self.get_logger().error(f"Serial write failed: {e}")


def main(args=None):
    rclpy.init(args=args)
    node = RadioBridgeBase()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()