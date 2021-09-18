 #!/bin/bash
 sudo systemctl disable --now stackdriver-logging.service
 sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
 