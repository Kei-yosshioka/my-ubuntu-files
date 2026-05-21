#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32MultiArray

"""
4WS steering kinematics for rover steering motors only.

Input:
  /cmd_vel_4ws  (geometry_msgs/Twist)

Packed meaning:
  linear.x   = throttle for drive side (ignored here)
  angular.x  = steering mode code
  angular.z  = normalized steering command in [-1, +1]

Mode codes:
  0 = CRAB
  1 = OPPOSITE
  2 = TURN_IN_PLACE

Output:
  /wheel_cmd  (std_msgs/Float32MultiArray)
    data[0:4] = steering angles in degrees [FL, FR, RL, RR]
    data[4:8] = wheel speeds (unused here, all zeros)

This node directly computes steering angles.
It does NOT use rigid-body twist kinematics.
"""

class FourWSKinematics(Node):
    MODE_CRAB = 0
    MODE_OPPOSITE = 1
    MODE_TURN_IN_PLACE = 2

    def __init__(self):
        super().__init__('four_ws_kinematics')

        # Steering parameters
        self.max_steer_deg = float(self.declare_parameter('max_steer_deg', 35.0).value)
        self.turn_in_place_deg = float(self.declare_parameter('turn_in_place_deg', 45.0).value)
        self.steer_deadband = float(self.declare_parameter('steer_deadband', 0.05).value)

        self.steer_min_deg = float(self.declare_parameter('steer_min_deg', -90.0).value)
        self.steer_max_deg = float(self.declare_parameter('steer_max_deg', 90.0).value)

        # Per-wheel inversion for real hardware sign differences
        self.inv_fl = bool(self.declare_parameter('invert_fl', False).value)
        self.inv_fr = bool(self.declare_parameter('invert_fr', False).value)
        self.inv_rl = bool(self.declare_parameter('invert_rl', False).value)
        self.inv_rr = bool(self.declare_parameter('invert_rr', False).value)

        # ROS
        self.sub = self.create_subscription(Twist, '/cmd_vel_4ws', self.cb_cmd, 10)
        self.pub = self.create_publisher(Float32MultiArray, '/wheel_cmd', 10)

        self.get_logger().info(
            f"4WS steering kinematics started | "
            f"max_steer_deg={self.max_steer_deg:.1f}, "
            f"turn_in_place_deg={self.turn_in_place_deg:.1f}, "
            f"invert=[FL:{self.inv_fl}, FR:{self.inv_fr}, RL:{self.inv_rl}, RR:{self.inv_rr}]"
        )

    @staticmethod
    def clamp(v: float, lo: float, hi: float) -> float:
        return max(lo, min(hi, v))

    def apply_inversions(self, fl: float, fr: float, rl: float, rr: float):
        if self.inv_fl:
            fl *= -1.0
        if self.inv_fr:
            fr *= -1.0
        if self.inv_rl:
            rl *= -1.0
        if self.inv_rr:
            rr *= -1.0
        return fl, fr, rl, rr

    def cb_cmd(self, msg: Twist):
        # Steering mode packed in angular.x
        mode = int(round(float(msg.angular.x)))

        # Steering command packed in angular.z
        steer_cmd = float(msg.angular.z)
        steer_cmd = self.clamp(steer_cmd, -1.0, 1.0)

        # Deadband
        if abs(steer_cmd) < self.steer_deadband:
            steer_cmd = 0.0

        fl = fr = rl = rr = 0.0

        if mode == self.MODE_CRAB:
            # All wheels same direction
            angle = steer_cmd * self.max_steer_deg
            fl = angle
            fr = angle
            rl = angle
            rr = angle

        elif mode == self.MODE_OPPOSITE:
            # Fronts one way, rears opposite
            angle = steer_cmd * self.max_steer_deg
            fl = angle
            fr = angle
            rl = -angle
            rr = -angle

        elif mode == self.MODE_TURN_IN_PLACE:
            # "X" steering pattern. Magnitude fixed; sign comes from stick direction.
            if steer_cmd > 0.0:
                # one turn direction
                fl = +self.turn_in_place_deg
                fr = -self.turn_in_place_deg
                rl = -self.turn_in_place_deg
                rr = +self.turn_in_place_deg
            elif steer_cmd < 0.0:
                # opposite turn direction
                fl = -self.turn_in_place_deg
                fr = +self.turn_in_place_deg
                rl = +self.turn_in_place_deg
                rr = -self.turn_in_place_deg
            else:
                fl = fr = rl = rr = 0.0

        else:
            # Unknown mode -> safe zero
            fl = fr = rl = rr = 0.0

        # Clamp
        fl = self.clamp(fl, self.steer_min_deg, self.steer_max_deg)
        fr = self.clamp(fr, self.steer_min_deg, self.steer_max_deg)
        rl = self.clamp(rl, self.steer_min_deg, self.steer_max_deg)
        rr = self.clamp(rr, self.steer_min_deg, self.steer_max_deg)

        # Hardware inversions
        fl, fr, rl, rr = self.apply_inversions(fl, fr, rl, rr)

        out = Float32MultiArray()
        out.data = [fl, fr, rl, rr, 0.0, 0.0, 0.0, 0.0]
        self.pub.publish(out)

        self.get_logger().info(
            f"mode={mode} steer_cmd={steer_cmd:+.2f} -> "
            f"deg[FL,FR,RL,RR]=[{fl:+.1f},{fr:+.1f},{rl:+.1f},{rr:+.1f}]"
        )


def main():
    rclpy.init()
    node = FourWSKinematics()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()