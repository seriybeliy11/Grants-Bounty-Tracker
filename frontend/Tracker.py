import subprocess
import os
import time
import platform

npm_command = "npm run dev"
python_script_path = os.path.join("public", "get_data.py")

try:
    npm_process = subprocess.Popen(npm_command, shell=True)
    time.sleep(5)

    os_type = platform.system()

    if os_type == "Darwin":
        python_process = subprocess.Popen("python get_data.py", shell=True)
    elif os_type == "Linux":
        python_process = subprocess.Popen("python3 get_data.py", shell=True)
    elif os_type == "Windows":
        python_process = subprocess.Popen("python get_data.py", shell=True)
    else:
        raise OSError(f"Unsupported operating system: {os_type}")

    npm_process.wait()
    python_process.wait()

except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    print("Both processes have finished.")
