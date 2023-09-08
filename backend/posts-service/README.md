# Post Service

This service handles Images processes and posts for any event.

To run this, you'd have to run the install.

First let's set up the virtual environment for python, not really necessary to run but makes your project much neater.
```python -m venv .venv```

Start the virtual environment by running the activate script
On linux/mac
```source ./.venv/Scripts/activate```

On windows
```./.venv/Scripts/activate```

This will start the python virtual environment for you, you can deactivate this environment by running the command
```deactivate```

To start the project, install the dependencies.
```pip install -r requirements.txt```

Ensure you have a mysql database up and running and you've a ```.env``` file with the following contents

```DB_NAME=<DATABASE_NAME>
DB_USER=<DATABASE_USER>
DB_PASSWORD=<DATABASE_USER_PASSWORD>
DB_HOST=<DATABASE_HOST_ADDRESS>
```

Additionally ensure you replace the firebase credentionals and have your service key account file, name it ```permissions```

Now run the server by running the following command
```python server.py <port> <production>```
