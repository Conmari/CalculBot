const TelegramApi = require('node-telegram-bot-api')

const token = '6528762019:AAEU0EnqfX9z_ez7Eu9UjSn7gal-h8ea35w'

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([

    {command: '/start', description: 'Приветствие'},
    {command: '/info', description: 'Информация'},
    {command: '/calculator', description: 'Калькулятор'}
])

// bot.on('message', msg =>{
//     console.log(msg)
// })

let receivedNumbers = {};

const inlineKeyboardMarkup = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Сложение', callback_data: 'add' },
        { text: 'Вычитание', callback_data: 'subtract' },
      ],
      [
        { text: 'Умножение', callback_data: 'multiply' },
        { text: 'Деление', callback_data: 'divide' },
      ],
    ]
  }
};

bot.onText(/\/calculator/, (message) => {
  bot.sendMessage(message.chat.id, 'Отправьте первое число.');
  bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (!isNaN(parseFloat(msg.text)) && isFinite(msg.text)) {
    const number = parseFloat(msg.text);

    if (!receivedNumbers[chatId]) {
      receivedNumbers[chatId] = { firstNumber: number, secondNumber: undefined, operation: undefined };
      bot.sendMessage(chatId, 'Теперь отправьте второе число.');
    } else if (receivedNumbers[chatId].firstNumber !== undefined && receivedNumbers[chatId].secondNumber === undefined) {
      receivedNumbers[chatId].secondNumber = number;

      bot.sendMessage(chatId, 'Выберите операцию:', inlineKeyboardMarkup);
    }
  } else {
    bot.sendMessage(chatId, 'Пожалуйста, отправьте число.');
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const operation = query.data;

  if (receivedNumbers[chatId]) {
    const firstNumber = receivedNumbers[chatId].firstNumber;
    const secondNumber = receivedNumbers[chatId].secondNumber;
    let result;

    switch (operation) {
      case 'add':
        result = firstNumber + secondNumber;
        bot.sendMessage(chatId, `Результат сложения: ${result}`)
        break;
      case 'subtract':
        result = firstNumber - secondNumber;
        bot.sendMessage(chatId, `Результат вычитания: ${result}` )
        break;
      case 'multiply':
        result = firstNumber * secondNumber;
        bot.sendMessage(chatId, `Результат умножения: ${result}`)
        break;
      case 'divide':
        if (secondNumber === 0) {
          bot.sendMessage(chatId, `Деление на ноль невозможно.`)
        } else {
          result = firstNumber / secondNumber;
          bot.sendMessage(chatId, `Результат деления: ${result}`)
        }
        break;
      default:
          bot.sendMessage(chatId, 'Ошибка. Неизвестная операция.')
        break;
    }

    delete receivedNumbers[chatId];
  } else {
    bot.sendMessage(chatId, 'Вы не ввели числа для проведения операции.')
  }
});
});
