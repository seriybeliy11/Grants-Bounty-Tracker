import time
import os
import platform
import subprocess

def run_parser(script_name):
    try:
        python_command = 'python' if platform.system().lower() == 'windows' else 'python3'

        print(f"Running parser: {script_name}")
        subprocess.run([python_command, script_name], check=True)
        print(f"Parser {script_name} executed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing parser {script_name}. Return code: {e.returncode}")
    except Exception as e:
        print(f"Error executing parser {script_name}: {e}")

# List of script names
scripts = [
    'ALLS_approvement.py',
    'CLSPP_approvement.py',
    'COMMENTERS_approvement.py',
    'CONTRIBUTORS_approvement.py',
    'ISERT_approvement.py',
    'JSL_approvement.py',
    'LABELS_approvement.py',
    'STATES_approvement.py',
    'REWARDS_approvement.py',
    'convert_REWARDS.py'
]

# Function to run parsers with a 3-minute interval
def run_parsers_with_interval():
    while True:
        for script in scripts:
            run_parser(script)

        print("Waiting for four hours...")
        time.sleep(60 * 60 * 4)  # 4 hours in seconds
        print("Four hours passed, initiating the next iteration.")

# Run the parsers in the main thread
run_parsers_with_interval()
