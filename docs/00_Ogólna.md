# Dokumentacja projektu

1. MusicDB jest bazą piosenek, albumów i muzyków. Umożliwia przeglądanie i wyszukiwanie informacji na ich temat, a także dodawanie nowych rekordów, ich edycję oraz usuwanie. Wszystkie funkcjonalności serwisu są dostępne dla każdego odwiedzającego. System autoryzacji i autentykacji nie był wymagany w projekcie.

2. Serwis został stworzony w oparciu o architekturę klient-serwer. Na serwerze opartym o Linuxa działa serwer baz danych MySQL, który udostępnia dane interfejsowi API stworzonym w PHP. Klientem jest aplikacja typu Single Page Application stworzona w JavaScript i React. Komunikacja jest prowadzona przez protokół HTTP, formatem wymiany danych w tym przypadku jest JSON.

3. Stack technologiczny w skrócie, rozpoczynając od serwera::
* Debian Linux 3.2.78-1 i686
* MySQL 5.7.29
* PHP 7.4.7
* React 17.0.1
* JavaScript ES6
* HTML5, CSS3
* Przetwarzanie danych
    - Python 3.6
* Narzędzia deweloperskie:
    - Visual Studio Code
    - Postman
    - DataGrip (SQL, Bazy danych)
    - npm 6.14.9
    - create-react-app 4.0.1

4. Szczegółowy stack technologiczny projektu, rozpoczynając od serwera:
* Serwer: Linux tst-192-168-100-203 3.2.0-4-686-pae #1 SMP Debian 3.2.78-1 i686 GNU/Linux
* Serwer baz danych: MySQL Community Server (GPL) 5.7.29
    - protocol_version,10
    - slave_type_conversions,""
    - tls_version,"TLSv1,TLSv1.1,TLSv1.2"
    - version,5.7.29
    - version_compile_machine,x86_64
    - version_compile_os,Linux
* PHP: PHP 7.4.7 (cli) (built: Jun 12 2020 07:48:26) ( NTS )
    - Zend Engine v3.4.0, Copyright (c) Zend Technologies
    - with Zend OPcache v7.4.7, Copyright (c), by Zend Technologies
    - with Xdebug v2.9.1, Copyright (c) 2002-2020, by Derick Rethans
* React i zależności:
    - "react": "^17.0.1",
    - "react-canvas-js": "^1.0.1",
    - "react-dom": "^17.0.1",
    - "react-infinite-scroll-component": "^5.1.0",
    - "react-infinite-scroller": "^1.2.4",
    - "react-script-tag": "^1.1.2",
    - "react-scripts": "4.0.1",
    - "@testing-library/jest-dom": "^5.11.4",
    - "@testing-library/react": "^11.2.5",
    - "@testing-library/user-event": "^12.1.10",
    - "animate.css": "^4.1.1",
    - "axios": "^0.21.1",
    - "canvasjs-react-charts": "^1.0.5",
    - "postscribe": "^2.0.8",
    - "qwest": "^4.5.0",
    - "web-vitals": "^0.2.4"
* JavaScript w dialekcie EcmaScript6
* CSS3
* HTML5

