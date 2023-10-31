import os

def get_file_names_in_folder(folder_path="."):
    file_names = []
    try:
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

        file_names = files

    except OSError as e:
        print(f"Error: {e}")

    return file_names

if __name__ == "__main__":
    folder_path = "."  
    files_list = get_file_names_in_folder(folder_path)

    with open("dirs.py", "w") as file:
        file.write(f"file_names = {files_list}\n")

    print("File names in the folder:")
    for file_name in files_list:
        print(file_name)
