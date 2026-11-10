# Mati Fare Management System

A small single-page application for recording passenger fare transactions within **Mati City, Davao Oriental only**.

## Features
- Route fare calculator: estimates point-to-point distance from Mati City landmarks and calculates a shared trip fare from the selected gasoline-price tier.
- Transparent fare schedule: displays each fuel-price tier, its base fare for 0–3 km, and its rate per added kilometer.
- Transaction manager: add, edit, and delete passenger transaction records.
- Daily summary: shows today's transaction count, passenger count, and total collections.
- Form validation with visible error messages.
- LocalStorage persistence: records remain after refreshing the browser.
- Fixed service-area label and transaction location: Mati City, Davao Oriental.

## Technology
- HTML5 and CSS3
- Vanilla JavaScript with ES modules
- MVC architecture using Model, Views, and Controller
- Browser LocalStorage

## Run the application
Because this project uses JavaScript ES modules, run it through a local development server rather than opening `index.html` directly.

1. Open the project folder in Visual Studio Code.
2. Install/use the Live Server extension, if available.
3. Right-click `index.html` and select **Open with Live Server**.
4. Use the application in the browser.

You can also use another simple static local server.

## MVC responsibilities
- `js/model.js`: owns application state, route fare calculations, transaction changes, and LocalStorage.
- `js/farePricing.js`: shared fuel-price tiers and fare schedule.
- `js/views/View.js`: reusable base View class.
- `js/views/*.js`: child Views that extend the base View and render markup.
- `js/controller.js`: connects View event handlers to Model functions and re-renders the Views.

Views do not import the Model. The Model does not access the DOM. The Controller is the only layer that imports both.

## Important fare note
The calculator selects one of the eight displayed tiers using the entered gasoline price. The base fare covers 0–3 km; distance beyond 3 km is charged at that tier's per-kilometer rate, prorated for fractional kilometers. The trip fare is shared evenly across the entered passenger count; average shares are shown to three decimal places while the total route fare is rounded to centavos. Route distance is an estimate based on landmark coordinates and an adjustable road-distance factor, not live road routing. The pictured fare schedule has not been verified as an official government or LTO rate; confirm applicable authorized fares before use.

## Service area limitation
The interface and saved transaction location are fixed to **Mati City, Davao Oriental**. The application does not provide service-area selection or routing to other cities.

## Data and privacy
Transaction records are stored in the browser's LocalStorage on the device/browser where the app is used. Clearing browser storage may delete those records. This project has no backend or shared database.

## Suggested group contribution split
- Member 1: `FareCalculatorView.js` and fare-calculator controller function.
- Member 2: `TransactionView.js` and transaction controller functions.
- Member 3: `SummaryView.js` and summary display/controller work.

Each member should understand, test, and commit their own work.

## AI-use disclosure
This starter project was prepared with AI assistance. The group must review, adapt, test, and understand every submitted line. In Section 11 of the written report, disclose the AI tool, what it was used for, and which files/functions were affected. Do not claim AI-assisted code as independently written without review and understanding.
