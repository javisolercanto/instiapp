npm install
npm install -g sequelize-cli
npm install -g sequelize-auto-v3
echo "Let's migrate!"
sequelize db:migrate
echo "Migrations finished"
echo "Starting server ..."
npm start