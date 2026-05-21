"""
ARM Base Station Keyboard Controller
    Right now the current functionality includes adjusting speed for a single motor. Eventually
    we will migrate to an end to end solution involving keyboard movement across the entire
    arm.
ARM Base Station Keyboard Controller 
Controls:
   q: Major RPM+
   e: Minor RPM+
   z: Major RPM-
   c: Minor RPM-
   space: stop (x)
   h: HELP
   esc: Quit
"""

#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

import sys
import termios
import tty
import select

class ArmKeyboardController(Node):
    def __init__(self):
        super().__init__('arm_keyboard_controller')

        # local variables
        self.MAX_RPM = 400.0
        self.MIN_RPM = -self.MAX_RPM

        self.minor_step_rpm = 10.0
        self.major_step_rpm = 100.0

        self.target_state = 0.0  # RPM

        self.pub = self.create_publisher(String, '/arm/serial_cmd', 10)

        self.print_help()

        # Timer to poll keyboard without blocking ROS spin
        self.timer = self.create_timer(0.02, self.poll_keyboard)  # 50 Hz

        # Set terminal raw mode
        self._stdin_fd = sys.stdin.fileno()
        self._old_termios = termios.tcgetattr(self._stdin_fd)
        tty.setcbreak(self._stdin_fd)

    def destroy_node(self):
        # Restore terminal settings on exit
        try:
            termios.tcsetattr(self._stdin_fd, termios.TCSADRAIN, self._old_termios)
        except Exception:
            pass
        super().destroy_node()

    def print_help(self):
        self.get_logger().info(
            "Keyboard control started for Karura ARM\n"
            "Controls:\n"
            "   q: Major RPM+\n"
            "   e: Minor RPM+\n"
            "   z: Major RPM-\n"
            "   c: Minor RPM-\n"
            "   space: stop (x)\n"
            "   h: HELP (reprints this)\n"
            "   esc: Quit\n"
        )

    def publish_cmd(self, txt: str):
        msg = String()
        msg.data = txt
        self.pub.publish(msg)

    def check_max_min_rpm(self):
        if self.target_state > self.MAX_RPM:
            self.get_logger().warning("too fast dude")
            self.target_state = self.MAX_RPM
        elif self.target_state < self.MIN_RPM:
            self.get_logger().warning("too fast dude")
            self.target_state = self.MIN_RPM

    def send_speed(self):
        rpm_int = int(round(self.target_state))
        self.publish_cmd(f"v{rpm_int}")
        self.get_logger().info(f"Set speed: {rpm_int} RPM")

    def stop(self):
        self.target_state = 0.0
        self.publish_cmd("x")
        self.get_logger().info("STOP (x)")

    def poll_keyboard(self):
        # Non-blocking read of stdin
        if select.select([sys.stdin], [], [], 0)[0]:
            ch = sys.stdin.read(1)

            # ESC quit
            if ch == '\x1b':
                self.get_logger().info("Quitting keyboard controller...")
                self.stop()
                rclpy.shutdown()
                return

            # Space stop
            if ch == ' ':
                self.stop()
                return

            c = ch.lower()

            if c == 'h':
                self.print_help()
                return

            if c == 'q':
                self.target_state += self.major_step_rpm
                self.check_max_min_rpm()
                self.send_speed()
                return

            if c == 'e':
                self.target_state += self.minor_step_rpm
                self.check_max_min_rpm()
                self.send_speed()
                return

            if c == 'z':
                self.target_state -= self.major_step_rpm
                self.check_max_min_rpm()
                self.send_speed()
                return

            if c == 'c':
                self.target_state -= self.minor_step_rpm
                self.check_max_min_rpm()
                self.send_speed()
                return


def main():
    rclpy.init()
    node = ArmKeyboardController()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        try:
            node.stop()
        except Exception:
            pass
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()

if __name__ == '__main__':
    main()
