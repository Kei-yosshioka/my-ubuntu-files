# from setuptools import find_packages, setup

# package_name = 'control_station'

# setup(
#     name=package_name,
#     version='0.0.0',
#     packages=find_packages(exclude=['test']),
#     data_files=[
#         ('share/ament_index/resource_index/packages',
#             ['resource/' + package_name]),
#         ('share/' + package_name, ['package.xml']),
#     ],
#     install_requires=['setuptools'],
#     zip_safe=True,
#     maintainer='karura-csmain',
#     maintainer_email='zacharyrenkema@tamu.edu',
#     description='TODO: Package description',
#     license='TODO: License declaration',
#     extras_require={
#         'test': [
#             'pytest',
#         ],
#     },
#     entry_points={
#         'console_scripts': [
#             'radio_bridge_base = control_station.radio_bridge_base:main', 
#             'arm_keyboard_controller = control_station.arm_keyboard_controller:main',
#             'steering_node = control_station.steering_node:main',
#             'ps4_controller_node = control_station.ps4_controller_node:main',
#             'four_ws_kinematics = control_station.four_ws_kinematics:main', 
#         ],
#     },
# )
# Launch Version:
from glob import glob
from setuptools import find_packages, setup

package_name = 'control_station'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch', glob('launch/*.launch.py')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='karura-csmain',
    maintainer_email='zacharyrenkema@tamu.edu',
    description='Control station nodes for Karura rover',
    license='TODO: License declaration',
    extras_require={
        'test': ['pytest'],
    },
    entry_points={
        'console_scripts': [
            # 'radio_bridge_base = control_station.radio_bridge_base:main',
            # 'arm_keyboard_controller = control_station.arm_keyboard_controller:main',
            # 'steering_node = control_station.steering_node:main',
            'ps4_controller_node = control_station.ps4_controller_node:main',
            # 'four_ws_kinematics = control_station.four_ws_kinematics:main',
            'cmd_integrator_node = control_station.cmd_integrator_node:main',
        ],
    },
)