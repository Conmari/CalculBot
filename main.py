import telebot
import logik
from telebot import types

bot = telebot.TeleBot('6528762019:AAEU0EnqfX9z_ez7Eu9UjSn7gal-h8ea35w')


@bot.message_handler(commands=['калькулятор'])
def calc(message):
    numan = bot.send_message(message.chat.id, 'Первое число')
    bot.register_next_step_handler(numan, num1_fun)


def num1_fun(message):
    global num1;
    num1 = message.text
    numtwo = bot.send_message(message.chat.id, 'Второе число')
    bot.register_next_step_handler(numtwo, num2_fun)


def num2_fun(message):
    global num2;
    num2 = message.text

    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    summ = types.KeyboardButton('Сложение (+)')
    subtraction = types.KeyboardButton('Вычитание (-)')
    multiply = types.KeyboardButton('Умножение (*)')
    delete = types.KeyboardButton('Деление (/)')

    markup.add(summ, subtraction, multiply, delete)

    operu = bot.send_message(message.chat.id, 'Выберите действие', reply_markup=markup)

    bot.register_next_step_handler(operu, operi)



def operi(message):
    global oper;
    oper = message.text
    bot.send_message(message.chat.id, 'Результат:', reply_markup=types.ReplyKeyboardRemove())
    if oper == "Сложение (+)" or oper == '+':
        res = logik.summ(num1, num2)
        bot.send_message(message.chat.id,  res)
    elif oper == "Вычитание (-)" or oper == '-':
        res = logik.subtraction(num1, num2)
        bot.send_message(message.chat.id,  res)
    elif oper == "Умножение (*)" or oper == '*':
        res = logik.multiply(num1, num2)
        bot.send_message(message.chat.id,  res)
    elif oper == "Деление (/)" or oper == '/':
        res = logik.delete(num1, num2)
        bot.send_message(message.chat.id,  res)

    else:
        bot.send_message(message.chat.id, "Ошибка")


@bot.message_handler(commands=['start'])
def main(message):
    bot.send_message(message.chat.id, 'Приветик')


# не поднимать
@bot.message_handler()
def action(message):
    if message.text == message.text:
        bot.send_message(message.chat.id, 'Я не знаю этого попробуй то что я знаю')


bot.infinity_polling()
