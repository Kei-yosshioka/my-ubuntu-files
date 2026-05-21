#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist


class CmdIntegratorNode(Node):
    def __init__(self):
        super().__init__('cmd_integrator_node')

        self.latest_cmd = Twist()
        self.last_cmd_time = self.get_clock().now()

        self.cmd_timeout = float(self.declare_parameter('cmd_timeout', 0.5).value)

        self.cmd_sub = self.create_subscription(
            Twist, '/cmd_vel', self.callback_cmd, 10
        )

        self.cmd_pub = self.create_publisher(
            Twist, '/rover/cmd_vel', 10
        )

        self.timer = self.create_timer(0.02, self.publish_cmd)

        self.get_logger().info("Cmd integrator node started")

    def callback_cmd(self, msg: Twist):
        self.latest_cmd = msg
        self.last_cmd_time = self.get_clock().now()

    def publish_cmd(self):
        now = self.get_clock().now()
        age = (now - self.last_cmd_time).nanoseconds / 1e9

        if age <= self.cmd_timeout:
            self.cmd_pub.publish(self.latest_cmd)
        else:
            self.cmd_pub.publish(Twist())  # safety stop


def main(args=None):
    rclpy.init(args=args)
    node = CmdIntegratorNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()