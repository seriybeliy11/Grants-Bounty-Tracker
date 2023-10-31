import threading
import queue
import subprocess
import importlib
import time
import platform
import schedule
import random

def run_parser(parser_module, parser_description):
    while True:
        item = work_queue.get()
        if item is None:
            break

        try:
            print(f"Запуск {parser_description}: элемент {item}")
            parser = importlib.import_module(parser_module.__name__)
            start_time = time.time()
            parser.parse(item)
            end_time = time.time()
            execution_time = end_time - start_time
            print(f"{parser_description} выполнился за {execution_time:.2f} секунд")

            delay_minutes = 4
            print(f"Пауза {parser_description} на {delay_minutes} минуты")
            time.sleep(delay_minutes * 60)

        except Exception as e:
            print(f"Ошибка в {parser_description}: {str(e)}")
            print(f"Перезапуск {parser_description} через 10 минут")
            time.sleep(10 * 60)

        work_queue.task_done()

# Создание очереди задач
work_queue = queue.Queue()

# Заполнение очереди задачами
for i in range(7):
    work_queue.put(i)

parser_info = [
    ("get_all_issues_json", "Получение всех задач в формате JSON"),
    ("get_approved_issues_json", "Получение утвержденных задач в формате JSON"),
    ("get_commenter_json", "Получение комментаторов в формате JSON"),
    ("get_commits_json", "Получение коммитов в формате JSON"),
    ("get_contributors_json", "Получение участников в формате JSON"),
    ("get_just_closed_issues_json", "Получение только что закрытых задач в формате JSON"),
    ("get_state_issues_json", "Получение задач по статусу в формате JSON"),
]

# Создание потоков для выполнения парсеров
parser_threads = [threading.Thread(target=run_parser, args=(parser_module, parser_description)) for parser_module, parser_description in parser_info]

# Определение расписания выполнения парсеров
schedule.every(12).hours.do(lambda: [thread.start() for thread in parser_threads if not thread.is_alive()])

# Ожидание завершения всех потоков
[thread.join() for thread in parser_threads]

# Завершение работы потоков
[work_queue.put(None) for _ in range(7)]

# Ожидание завершения очереди
work_queue.join()

# После завершения всех парсеров, запуск сайта
if platform.system() == "Windows":
    subprocess.Popen(["start", "cmd", "/k", "npm run dev"], shell=True)
else:
    subprocess.Popen(["x-terminal-emulator", "-e", "npm run dev"])

while True:
    schedule.run_pending()
    time.sleep(1)
