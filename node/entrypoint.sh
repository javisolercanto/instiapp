npm install
npm install -g sequelize-cli
npm install -g sequelize-auto-v3
echo "Let's migrate!"
sequelize db:migrate
echo "Migrations finished"
echo "Starting server ..."
npm start
cat << "EOF"

    __  ___          __        __                
   /  |/  /___ _____/ /__     / /_  __  __       
  / /|_/ / __ `/ __  / _ \   / __ \/ / / /       
 / /  / / /_/ / /_/ /  __/  / /_/ / /_/ /        
/_/  /_/\__,_/\__,_/\___/  /_.___/\__, /         
       __            _    _____  /____/_         
      / /___ __   __(_)  / ___/____  / /__  _____
 __  / / __ `/ | / / /   \__ \/ __ \/ / _ \/ ___/
/ /_/ / /_/ /| |/ / /   ___/ / /_/ / /  __/ /    
\____/\__,_/ |___/_/   /____/\____/_/\___/_/     
                                                 
EOF