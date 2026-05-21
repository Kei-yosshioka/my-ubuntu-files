from setuptools import find_packages, setup

package_name = 'rover'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='kio',
    maintainer_email='4523119@ed.tus.ac.jp',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'teleop_joy_control = rover.teleop_joy_control:main',
            # 'rover = rover.rover:main',
            # 'ctl_serial = rover.ctl_serial:main',
            # 'spiral_movement = rover.spiral_movement:main',
        ],
    },
)