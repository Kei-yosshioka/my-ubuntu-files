import sys
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32, String
from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
import pyqtgraph as pg
import collections
import time
import threading

# --- デザイン設定 ---
COLOR_BG = "#0A0A0A"
COLOR_FRAME = "#FFB000"  # 琥珀色
COLOR_TEXT = "#FFB000"
COLOR_PLOT = "#FFD700"

class SensorCard(QFrame):
    """各センサの数値とグラフをセットにしたパネル"""
    def __init__(self, title, unit):
        super().__init__()
        self.setFrameStyle(QFrame.Shape.Box | QFrame.Shadow.Plain)
        self.setLineWidth(2)
        self.setStyleSheet(f"color: {COLOR_TEXT}; border: 1px solid {COLOR_FRAME}; background: {COLOR_BG};")
        
        layout = QVBoxLayout(self)
        
        # タイトルと数値表示
        self.title_label = QLabel(title)
        self.title_label.setFont(QFont("Orbitron", 10, QFont.Weight.Bold))
        self.title_label.setStyleSheet("border: none;")
        
        self.value_label = QLabel("--.-")
        self.value_label.setFont(QFont("Consolas", 28, QFont.Weight.Bold))
        self.value_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.value_label.setStyleSheet("border: none; color: #FFFFFF;")
        
        self.unit_label = QLabel(unit)
        self.unit_label.setAlignment(Qt.AlignmentFlag.AlignRight)
        self.unit_label.setStyleSheet("border: none;")

        # グラフ表示部
        self.plot_widget = pg.PlotWidget()
        self.plot_widget.setBackground(COLOR_BG)
        self.plot_widget.setMaximumHeight(100)
        self.plot_widget.setMouseEnabled(x=False, y=False)
        self.plot_widget.hideAxis('bottom')
        self.plot_widget.hideAxis('left')
        
        self.data_buffer = collections.deque(maxlen=60) # 60秒分
        self.curve = self.plot_widget.plot(pen=pg.mkPen(color=COLOR_PLOT, width=2))

        layout.addWidget(self.title_label)
        layout.addWidget(self.value_label)
        layout.addWidget(self.unit_label)
        layout.addWidget(self.plot_widget)

    def update_value(self, val):
        self.value_label.setText(f"{val:.2f}")
        self.data_buffer.append(val)
        self.curve.setData(list(self.data_buffer))

class SensorGUINode(Node):
    def __init__(self, gui_app):
        super().__init__('sensor_gui_node')
        self.gui = gui_app
        
        # サブスクライバの設定
        self.topics = {
            "temperature": ("sensor/temperature", "気温 [℃]"),
            "humidity":    ("sensor/humidity",    "湿度 [%]"),
            "pressure":    ("sensor/pressure",    "気圧 [hPa]"),
            "altitude":    ("sensor/altitude",    "高度 [m]"),
            "uv":          ("sensor/uv",          "UV [mW]"),
            "eco2":        ("sensor/eco2",        "CO2 [ppm]"),
            "tvoc":        ("sensor/tvoc",        "TVOC [ppb]"),
            "hcho":        ("sensor/hcho",        "HCHO [ppb]"),
            "nh3":         ("sensor/nh3_ppm",     "NH3 [ppm]"),
            "hcn":         ("sensor/hcn",         "HCN [ppm]")  # 追加予定分
        }

        for key, (topic, label) in self.topics.items():
            cb = lambda msg, k=key: self.gui.cards[k].update_value(msg.data)
            self.create_subscription(Float32, topic, cb, 10)

        self.create_subscription(String, "sensor_data", self.log_callback, 10)

    def log_callback(self, msg):
        self.gui.update_log(msg.data)

class MainGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("ENVIRONMENTAL MONITORING TERMINAL")
        self.resize(1200, 800)
        self.setStyleSheet(f"background-color: {COLOR_BG};")
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)

        # 左側：センサーグリッド
        grid_layout = QGridLayout()
        self.cards = {}
        sensor_list = [
            ("temperature", "TEMP", "℃"), ("humidity", "HUM", "%"),
            ("pressure", "PRES", "hPa"), ("altitude", "ALT", "m"),
            ("uv", "UV", "mW"), ("eco2", "eCO2", "ppm"),
            ("tvoc", "TVOC", "ppb"), ("hcho", "HCHO", "ppb"),
            ("nh3", "NH3", "ppm"), ("hcn", "HCN (CYANIDE)", "ppm") # 空き枠/HCN
        ]

        for i, (key, title, unit) in enumerate(sensor_list):
            card = SensorCard(title, unit)
            grid_layout.addWidget(card, i // 2, i % 2) # 2列で配置
            self.cards[key] = card

        # 右側：ログ表示
        right_layout = QVBoxLayout()
        log_title = QLabel("SYSTEM LOG")
        log_title.setStyleSheet(f"color: {COLOR_TEXT}; font-weight: bold;")
        self.log_display = QTextEdit()
        self.log_display.setReadOnly(True)
        self.log_display.setStyleSheet(f"background: #050505; color: #00FF00; font-family: 'Consolas'; border: 1px solid {COLOR_FRAME};")
        
        right_layout.addWidget(log_title)
        right_layout.addWidget(self.log_display)

        main_layout.addLayout(grid_layout, 7)
        main_layout.addLayout(right_layout, 3)

    def update_log(self, text):
        timestamp = time.strftime("[%H:%M:%S] ")
        self.log_display.append(timestamp + text)
        # スクロールを一番下に
        self.log_display.moveCursor(QTextCursor.MoveOperation.End)

def main():
    rclpy.init()
    app = QApplication(sys.argv)
    gui = MainGUI()
    node = SensorGUINode(gui)

    # ROS2の通信を別スレッドで実行
    thread = threading.Thread(target=rclpy.spin, args=(node,), daemon=True)
    thread.start()

    gui.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
