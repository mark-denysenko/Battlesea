# AngularSpa

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


--- Spent time
Configure Hub, Angular, ASP.NET Core in RT - 16h
Rooms - 7h
Joining Room - 1h
Models - 3h
Subject<Player> - 3h
Battlefield - 16h
Back-end (api, hub func) - 10 h
game proccess (shoot< step track and final result) - 8h
chat and logs to it - 2h
Markup and styles - 5h

Starting plan:
--------- General plan ( 80 часов )
- разработка бэк-энд логики и моделей (35 часов):
.... моделей пользователя, поля, игры и их взаимодействия ( 5 часов)
.... вывод и обмен информацией при помощи чата, а также логгирование ( 30 часов )

- разработка визуальной части и взаимодействия с пользователем ( 40 часов):
.... игры и ее элементов ( 30 часов) 
.... меню, экранов окончания и дополнительнных информационных элементов ( 10 часов )

- manual тестирование ( 5 часов )

-------- Battleship
- профиль игрока (ник, массив выстрелов, флаг хода makingStep) - 1 час
- поле, содержит массив кораблей (и массив выстрелов на нем?). 1 час
- корабль содержит int размер корабля и массив точек на которых он находится, флаг  isDrowned. (массив точек в которые попали?) - 30 мин
- абстракция битва (2 игрока и 2 поля), таймер для хода, (индикатор того, кто ходит, скорее игрок будет содержать или оба варианта сразу). Создается битва, к ней можно присоединиться и она станет неактивной при 2-х пользователях. при завершении - удаляется. Будет содержать чат и логер? - 3 часа
- пространство имен с конфигурцией: кол-во кораблей, время на ход, размер поля - 30 мин
- Стадии:
-- Подготовка. расстановка своих кораблей. Человек нажимает на тип корабля и выбирает клетки для этого корабля. Правильность выбора клеток проверяет метод IsInRow(): bool - 3 часа
-- Битва. У активного пользователя выводится индикатор хода и время, что осталось до конца. При ходе активируется поле противника , наводя на клетку она подсвечивается, при нажатии стреляет. При попадании делает еще один ход. - 3 часа
-- Результат. Игрокам высвечивается экран победы или поражения. - 1 час
- представление поля, меню и результата - 4 часа
- представление битвы: поле из клеток, клетка с кораблем будет зеленого цвета ( + буква К в центре?), выстрел будет закрашивать клетку в красный или серый цвет при попадании (+ буква Х в центре?) и промахе (+ Х в центре) соответственно.  В клетки вокруг утопленных кораблей ставится Х - 6 часов
- чат (будет в битве) - 5 часов
- логгирование, интерфейс и реализация для внедрения - 3 часа

