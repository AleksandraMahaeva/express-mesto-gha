const express = require('express');
const mongoose = require('mongoose');

const ERROR_CODE_NOTFOUND = 404;

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
  req.user = {
    _id: '64233bd625b20a8536e576fc', // _id созданного пользователя
  };

  next();
});
app.use(require('./routes/user'));
app.use(require('./routes/card'));
app.use('*', (req, res) => res.status(ERROR_CODE_NOTFOUND).send({ message: 'Был запрошен несуществующий адрес' }))

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
