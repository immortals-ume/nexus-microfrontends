#!/bin/bash

echo "Starting all microfrontend apps in separate terminals..."

# Start dashboard in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-dashboard && npm run dev"'

# Start admin in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-admin && npm run dev"'

# Start analytics in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-analytics && npm run dev"'

# Start auth in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-auth && npm run dev"'

# Start product in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-product && npm run dev"'

# Start microfrontend host in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-microfrontend && npm run dev"'

# Start microbackend in new terminal
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/nexus-microbackend && npm run dev"'

echo "All apps started in separate terminal windows!"
