#!/usr/bin/bash
./wait-for-it.sh -h postgres -t 60 -p 5432 -s -- echo "O postgress esta conectavel!"
./wait-for-it.sh -h rabbitmq -t 60 -p 5672 -s -- echo "O rabbitmq esta conectavel!"
dotnet ChatApp.dll