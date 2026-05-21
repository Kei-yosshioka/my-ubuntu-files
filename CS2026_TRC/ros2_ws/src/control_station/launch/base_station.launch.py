from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='joy',
            executable='joy_node',
            name='joy_node',
            output='screen',
            parameters=[{
                'device_id': 0,
                'deadzone': 0.05,
                'autorepeat_rate': 20.0
            }]
        ),

        Node(
            package='control_station',
            executable='ps4_controller_node',
            name='ps4_controller_node',
            output='screen'
        ),
        
        Node(
            package='control_station',
            executable='cmd_integrator_node',
            name='cmd_integrator_node',
            output='screen'
        )

        # Node(
        #     package='control_station',
        #     executable='radio_bridge_base',
        #     name='radio_bridge_base',
        #     output='screen'
        # ),

    ])