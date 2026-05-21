#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Joy
from geometry_msgs.msg import Twist
from std_msgs.msg import UInt8


class PS4ControllerNode(Node):
    MODE_CRAB = 0
    MODE_OPPOSITE = 1
    MODE_TURN_IN_PLACE = 2

    def __init__(self):
        super().__init__('ps4_controller_node')

        # Buttons
        self.BTN_X = 0
        self.BTN_CIRCLE = 1
        self.BTN_TRI = 2
        self.BTN_L1 = 4
        self.BTN_R1 = 5

        # Axes
        self.AXIS_L2 = 2
        self.AXIS_R2 = 5
        self.AXIS_RIGHT_X = 3

        # Params
        self.v_max = float(self.declare_parameter('v_max', 1.0).value)
        self.deadzone = float(self.declare_parameter('deadzone', 0.1).value)
        self.steer_threshold = float(self.declare_parameter('steer_threshold', 0.1).value)

        # State
        self.prev_buttons = []
        self.mode = self.MODE_OPPOSITE
        self.latched_steer = 0.0

        # ROS
        self.joy_sub = self.create_subscription(Joy, '/joy', self.callback_joy, 10)
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        self.get_logger().info("Hybrid JP-style teleop started")

    def apply_deadzone(self, v):
        return 0.0 if abs(v) < self.deadzone else v

    def pressed(self, buttons, idx):
        if not self.prev_buttons:
            return buttons[idx] == 1
        return buttons[idx] == 1 and self.prev_buttons[idx] == 0

    def trigger_to_0_1(self, val):
        return (1.0 - val) * 0.5

    def callback_joy(self, msg: Joy):
        axes = msg.axes
        buttons = msg.buttons

        # --- Mode switching ---
        if self.pressed(buttons, self.BTN_L1):
            self.mode = self.MODE_CRAB
        elif self.pressed(buttons, self.BTN_R1):
            self.mode = self.MODE_OPPOSITE
        elif self.pressed(buttons, self.BTN_CIRCLE):
            self.mode = self.MODE_TURN_IN_PLACE

        # --- Throttle (triggers) ---
        l2 = self.trigger_to_0_1(axes[self.AXIS_L2])
        r2 = self.trigger_to_0_1(axes[self.AXIS_R2])
        throttle = self.apply_deadzone(r2 - l2)

        # --- Steering (latched) ---
        rx = self.apply_deadzone(-axes[self.AXIS_RIGHT_X])
        if abs(rx) > self.steer_threshold:
            self.latched_steer = rx

        # --- Build cmd_vel ---
        cmd = Twist()

        if self.mode == self.MODE_CRAB:
            # sideways motion
            cmd.linear.x = throttle * self.v_max
            cmd.linear.y = self.latched_steer * self.v_max
            cmd.angular.z = 0.0

        elif self.mode == self.MODE_OPPOSITE:
            # car-like turning
            cmd.linear.x = throttle * self.v_max
            cmd.linear.y = 0.0
            cmd.angular.z = self.latched_steer

        elif self.mode == self.MODE_TURN_IN_PLACE:
            # spin only
            cmd.linear.x = 0.0
            cmd.linear.y = 0.0
            cmd.angular.z = self.latched_steer

        if self.pressed(buttons, self.BTN_X):
            self.latched_steer = 0.0

            cmd = Twist()  # ALL ZERO
            self.cmd_pub.publish(cmd)

            self.get_logger().info("Reset: all motion zeroed + steering straight")
            self.prev_buttons = list(buttons)
            return
        
        self.cmd_pub.publish(cmd)
        self.prev_buttons = list(buttons)

        self.get_logger().info(
            f"mode={self.mode} x={cmd.linear.x:.2f} y={cmd.linear.y:.2f} z={cmd.angular.z:.2f}"
        )


def main():
    rclpy.init()
    node = PS4ControllerNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()