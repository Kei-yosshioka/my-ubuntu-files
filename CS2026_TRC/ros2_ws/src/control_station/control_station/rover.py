import rclpy
from rclpy.node import Node
import math

from geometry_msgs.msg import Twist
from std_msgs.msg import Float64MultiArray

# JP CODE this is their kinematics node
class Rover(Node):
    def __init__(self):
        super().__init__("rover")
        self.log = self.get_logger()
        self.declare_parameter('tread', 0.5)
        self.declare_parameter('wheelbase', 0.5)
        self.declare_parameter('wheel_radius', 0.15)
        self.sub = self.create_subscription(Twist, "/cmd_vel", self.cv_cb, 1)
        self.pub = self.create_publisher(Float64MultiArray, "/rover/targets", 1)
        self.sub_fb = self.create_subscription(Float64MultiArray, "/actual_val", self.fb_cb, 10)
        self.actual_deg = [ 0.0, 0.0, 0.0, 0.0 ]

    def calc_vector(self, twist: Twist):
        v_xL = twist.linear.x - (0.5 * self.tread * twist.angular.z)
        v_xR = twist.linear.x + (0.5 * self.tread * twist.angular.z)
        v_yF = twist.linear.y + (0.5 * self.wheelbase * twist.angular.z)
        v_yR = twist.linear.y - (0.5 * self.wheelbase * twist.angular.z)
        return v_xL, v_xR, v_yF, v_yR
    
    def calc_m_s(self, v_xL, v_xR, v_yF, v_yR):
        m_s = [ 0.0, 0.0, 0.0, 0.0 ]
        m_s[0] = math.sqrt(v_xL ** 2 + v_yF ** 2)
        m_s[1] = math.sqrt(v_xL ** 2 + v_yR ** 2)
        m_s[2] = math.sqrt(v_xR ** 2 + v_yR ** 2)
        m_s[3] = math.sqrt(v_xR ** 2 + v_yF ** 2)
        return m_s
    
    def calc_rad(self, v_xL, v_xR, v_yF, v_yR):
        rad = [ 0.0, 0.0, 0.0, 0.0 ]
        rad[0] = math.atan2(v_yF, v_xL)
        rad[1] = math.atan2(v_yR, v_xL)
        rad[2] = math.atan2(v_yR, v_xR)
        rad[3] = math.atan2(v_yF, v_xR)
        return rad
    
    def wrap_deg(self, deg):
        while deg >= 180.0:
            deg -= 360.0
        while deg < -180.0:
            deg += 360.0
        return deg
    
    def optimize(self, rpm, deg, actual_deg):
        rpm_optd = [ 0.0, 0.0, 0.0, 0.0 ]
        deg_optd = [ 0.0, 0.0, 0.0, 0.0 ]
        for i in range(4):
            if abs(deg[i] - actual_deg[i]) > 90:
                rpm_optd[i] = rpm[i] * -1.0
                deg_optd[i] = self.wrap_deg(deg[i] + 180.0)
            else:
                rpm_optd[i] = rpm[i]
                deg_optd[i] = self.wrap_deg(deg[i])
        return rpm_optd, deg_optd
    
    def cv_cb(self, twist: Twist):
        targets = Float64MultiArray()
        targets.data = [ 0.0 ] * 8
        try:
            self.tread = self.get_parameter('tread').get_parameter_value().double_value
            self.wheelbase = self.get_parameter('wheelbase').get_parameter_value().double_value
            self.wheel_radius = self.get_parameter('wheel_radius').get_parameter_value().double_value
        except Exception as e:
            self.log.error(f"parameter acquisition error: {e}")
            return
        v_xL, v_xR, v_yF, v_yR = self.calc_vector(twist)
        m_s = self.calc_m_s(v_xL, v_xR, v_yF, v_yR)
        rad = self.calc_rad(v_xL, v_xR, v_yF, v_yR)
        rpm = [ 0.0, 0.0, 0.0, 0.0 ]
        deg = [ 0.0, 0.0, 0.0, 0.0 ]
        for i in range(4):
            rpm[i] = m_s[i] * 60.0 / (2 * math.pi * self.wheel_radius)
            deg[i] = rad[i] * 360.0 / (2 * math.pi)
        rpm_optd, deg_optd = self.optimize(rpm, deg, self.actual_deg)
        #targets.data = rpm_optd + deg_optd
        targets.data[0] = rpm_optd[0]
        targets.data[1] = deg_optd[0]
        targets.data[2] = rpm_optd[1]
        targets.data[3] = deg_optd[1]
        targets.data[4] = rpm_optd[2]
        targets.data[5] = deg_optd[2]
        targets.data[6] = rpm_optd[3]
        targets.data[7] = deg_optd[3]
        self.pub.publish(targets)
        formaatted = [f"{val:5.2f}" for val in targets.data]
        self.log.info(f"/rover/targets: {formaatted}")
    
    def fb_cb(self, val: Float64MultiArray):
        for i in range(4):
            self.actual_deg[i] = val.data[i * 2 + 1]

def main():
    rclpy.init()
    node = Rover()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.log.info("shutdowning...")
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()