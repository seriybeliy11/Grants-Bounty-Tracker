import os

def get_file_names_in_folder(folder_path="."):
    file_names = []
    try:
        # Получение списка файлов в указанной папке
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

        # Сохранение имен файлов в список
        file_names = files

    except OSError as e:
        print(f"Error: {e}")

    return file_names

if __name__ == "__main__":
    folder_path = "."  # Путь к папке (по умолчанию - текущая рабочая папка)

    # Получение имен файлов
    files_list = get_file_names_in_folder(folder_path)

    # Сохранение переменной в файл
    with open("dirs.py", "w") as file:
        file.write(f"file_names = {files_list}\n")

    # Вывод списка имен файлов
    print("File names in the folder:")
    for file_name in files_list:
        print(file_name)
