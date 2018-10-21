EnBW ODR Windkraft Nachweis Web App

## Installation

* npm install

## Development

* npm run dev
* visit `http://localhost:8080`

## Development

* npm start

## Test

npm test

## Contract deployment

npm run deployContracts

## Accounts mit Ether aufladen 

Hier bekommt man ether her:
https://faucet.rinkeby.io/

Via Metamask kann das Ether auf die 8 Accounts verteilt werden. Zugriff auf die 8 accounts erhält man mit dem mnemonic "hire fancy burst fresh gadget theme cloud broom insane screen foster where". Das mnemonic bei der Installation des Metamask Plugins eingeben. Dann 8 mal create Account ausführen. Dabei werden auf Basis des mnemonic seeds die 8 accounts generiert.    

## Anmerkungen:

Die blockchainApi.js Methoden stets synchron ausführen. Falls die gleiche Methode mehrmals hintereinander asynchron ausgeführt wird, dann gehen Transaktionen verloren bzw. werden überschrieben. 