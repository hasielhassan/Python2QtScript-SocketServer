#client code
import time
import socket
client = socket.socket()
client.connect(("localhost", 8080))

while True:
    message = raw_input(">" )
    client.send(message)
    if message == "quit":
        break
    else:
        client.send(message)

print "Goodby"