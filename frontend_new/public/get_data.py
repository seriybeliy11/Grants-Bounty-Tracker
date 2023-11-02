import subprocess
import time
from datetime import datetime, timedelta

scripts_to_run = [
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

interval_seconds = 120
max_runs_in_2_hours = 4

log_file = "script_log.txt"

def run_script(script_name):
    try:
        subprocess.run(["python", script_name], check=True)
        print(f"Script '{script_name}' executed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing script '{script_name}': {e}")

def log_script_run(script_name):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"{timestamp} - Executed script: {script_name}\n"
    with open(log_file, "a") as log:
        log.write(log_entry)

def count_runs_in_last_2_hours():
    with open(log_file, "r") as log:
        lines = log.readlines()

    now = datetime.now()
    two_hours_ago = now - timedelta(hours=2)

    recent_runs = [line for line in lines if datetime.strptime(line.split(" - ")[0], "%Y-%m-%d %H:%M:%S") > two_hours_ago]
    return len(recent_runs)

def run_scripts_with_interval():
    runs_in_last_2_hours = count_runs_in_last_2_hours()

    if runs_in_last_2_hours >= max_runs_in_2_hours:
        print("Too many runs in the last 2 hours. Exiting.")
        return

    for script in scripts_to_run:
        run_script(script)
        log_script_run(script)
        time.sleep(interval_seconds)

if __name__ == "__main__":
    run_scripts_with_interval()
