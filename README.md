🚆 Realtids Tåginformation – Praktikprojekt på Coop
Detta är en React-applikation utvecklad under min praktik på Coop Sverige. Projektet visar datum, tid och realtidsdata för tågtrafik från närliggande stationer. Applikationen körs på en Raspberry Pi kopplad till en skärm och är anpassad för att visas dygnet runt, exempelvis i butik eller på kontor.

Funktioner
Visar aktuellt datum och tid

Hämtar och visar realtidsdata för pendeltåg och tvärbana

Automatisk uppdatering av data

Anpassad för fullskärmsvisning på skärm

Kan köras i bakgrunden med screen på Raspberry Pi

🛠 Teknikstack
React – Frontend

Node.js – Backend och API-hantering

npm – Pakethantering

screen – Håller processen igång även när terminalen stängs

Raspberry Pi – Hårdvaruplattform

Trafiklab API – Realtidsdata för kollektivtrafik

🔧 Installation och konfiguration
Förberedelser (på Raspberry Pi eller Linux)
Uppdatera systemet:
sudo apt update && sudo apt upgrade -y

Installera Node.js och npm:
sudo apt install nodejs npm -y

Verifiera installation:
node -v
npm -v

Installera screen:
sudo apt install screen -y

Installera projektet
Klona projektet:
git clone https://github.com/ditt-användarnamn/ditt-repo.git
cd ditt-repo

Installera beroenden:
npm install

Skapa .env-fil i projektets rot: I projektets rotmapp, skapa en fil som heter .env och lägg till din API-nyckel från Trafiklab.se:
REACT_APP_TRAFIKLAB_API_KEY=din_api_nyckel
API-nyckeln kan du få från Trafiklab.se.

Starta applikationen:
npm start

Kör i bakgrunden med screen
För att hålla applikationen igång även när terminalsessionen stängs:

Starta en ny screen-session:
screen -S tagvisning

Kör applikationen:
npm start
Tryck sedan Ctrl + A, följt av D för att koppla från sessionen.

För att återansluta till sessionen:
screen -r (Session ID)


Exempel på visad information
Realtidsdata för pendeltåg och Tvärbana från: Sundbybergs Station och Solna Business Park.

Datum och klockslag visas i realtid

UI anpassat för stor skärm

Syfte
Projektet är skapat för att ge Coop-personal snabb tillgång till aktuell tågtrafikinformation direkt på en informationsskärm. Perfekt för att planera resor till och från arbetet.

👤 Utvecklat av
Saran Kongthong
Praktikant på Coop Sverige
Studerande inom mjukvaruutveckling – IoT och inbyggda system
📅 Våren 2025

Licens
Detta projekt är utvecklat för utbildningssyfte. Kontakta mig om du vill använda koden kommersiellt.

Första Utkast (Fortfarande under utveckling)

![image](https://github.com/user-attachments/assets/c52c3ee7-b8e6-4f00-beff-31efdd0b3d27)
