import configparser
import os


def get_config(path: str = "configs.ini") -> configparser.ConfigParser:
    config = configparser.ConfigParser()
    config.add_section("Server")
    config.set("Server", "port", "80")
    config.set("Server", "index_file_path", os.path.join('frontend', 'index.html'))
    config.set("Server", "static_directory_path", os.path.join('frontend', 'static'))
    config.set("Server", "log_level", "warning")

    config.add_section("Serial")
    config.set("Serial", "delay_after_error", "1")
    config.set("Serial", "baudrate", "115200")
    config.set("Serial", "#port", "COM* (Windows) or /dev/tty* (Linux)")

    if not os.path.exists(path):
        print("Create config file!")
        with open(path, "w") as config_file:
            config.write(config_file)

    config.read(path)
    return config


if __name__ == '__main__':
    if os.path.exists("configs.ini"):
        os.remove("configs.ini")
    get_config()
