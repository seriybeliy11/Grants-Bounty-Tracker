import subprocess
import os
import time

npm_command = "npm run dev"
python_script_path = os.path.join("public", "get_data.py")

try:
    npm_process = subprocess.Popen(npm_command, shell=True)
    time.sleep(5)
    os.chdir("public")
    python_process = subprocess.Popen("python get_data.py", shell=True)

    npm_process.wait()
    python_process.wait()

except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    print("Both processes have finished.")
