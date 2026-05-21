import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import Joy

import time

class Joy_control(Node):
    def __init__(self):
        super().__init__('teleop_joy_control')
        self.log = self.get_logger()
        self.sub = self.create_subscription(Joy, '/joy', self.joy_cb, 1)
        self.pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.pubTimer = self.create_timer(0.1, self.pub_interrupt)
        self.cmd_vel = Twist()
        self.max_vel_linear = 1.0
        self.max_vel_angular = 1.0
    
    def normalize_LR2(self, value):
        return -0.5 * (value - 1.0)
    
    def joy_cb(self, joy_msg):
        if joy_msg.axes[7] == 1:
            self.max_vel_linear += 0.1
            time.sleep(0.5)
        if joy_msg.axes[7] == -1:
            self.max_vel_linear -= 0.1
            time.sleep(0.5)
        if joy_msg.axes[6] == 1:
            self.max_vel_angular += 0.1
            time.sleep(0.5)
        if joy_msg.axes[6] == -1:
            self.max_vel_angular -= 0.1
            time.sleep(0.5)
        self.cmd_vel.linear.x = joy_msg.axes[1] * (0.01 + 0.99 * self.max_vel_linear * self.normalize_LR2(joy_msg.axes[2]))
        self.cmd_vel.linear.y = joy_msg.axes[0] * (0.01 + 0.99 * self.max_vel_linear * self.normalize_LR2(joy_msg.axes[2]))
        self.cmd_vel.angular.z = (joy_msg.buttons[4] - joy_msg.buttons[5]) * (0.01 + 0.99 * self.max_vel_angular * self.normalize_LR2(joy_msg.axes[5]))
    
    def pub_interrupt(self):
        self.pub.publish(self.cmd_vel)
        formaatted = [f"{val:5.2f}" for val in [self.cmd_vel.linear.x, self.cmd_vel.linear.y, self.cmd_vel.angular.z]]
        self.log.info(f"/cmd_vel: {formaatted}")

def main():
    rclpy.init()
    node = Joy_control()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.log.info("shutdowning...")
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()