# My Awesome Dashboard App

This is a React Native + Expo mobile application that provides an interactive dashboard for visualizing offline sales data from a local JSON file.

## Features

- 📊 Interactive and zoomable charts using `victory-native`
- 🔍 Drill-down by time: Year → Month → Week → Day
- 🎯 Filter by product and summarize by any time dimension
- 🗃️ 100,000 sales records for 20 products (realistically distributed)
- 📑 Raw data table under the chart
- ⬇️ Downloadable CSV export of selected data
- 🧭 Day-of-week view for weekly insights

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [victory-native](https://formidable.com/open-source/victory/)
- [@react-native-picker/picker](https://github.com/react-native-picker/picker)
- Custom JSON for data simulation

## Screenshots

> _You can add app screenshots or a screen recording here._

## Getting Started

### Prerequisites

- Node.js (v16 or above recommended)
- Git
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

Install Expo CLI if not already:

```bash
npm install -g expo-cli



#Installation

Clone the repository and install dependencies:
Bash

git clone [https://github.com/your-username/myAwesomeDashboardApp.git](https://github.com/your-username/myAwesomeDashboardApp.git)
cd myAwesomeDashboardApp
npm install

Running the App

Start the development server:
Bash

npx expo start

Then:

    Open Expo Go on your Android or iOS device and scan the QR code
    OR press a to run on Android emulator
    OR press i to run on iOS simulator (macOS only)

#File Structure

myAwesomeDashboardApp/
├── assets/
│   └── sales_data.json         # Local pre-generated data file
├── components/
│   └── DashboardChart.js       # Interactive chart component
├── utils/
│   └── csvExporter.js          # CSV export functionality
├── App.js                      # Main entry point
└── README.md

Offline Data

The app uses a local file located at:

assets/sales_data.json

This file includes:

    100,000 randomly but realistically distributed sales records
    Fields like Product ID, Sale Rate, Quantity, Timestamp

Exporting CSV

The raw data table includes a download button to export selected filtered records in .csv format.
Known Issues

    Some Android builds may require manual linking for certain libraries like react-native-safe-area-context
    Ensure you run expo install if any dependencies show compatibility warnings

Roadmap

    ✅ Add zoomable Victory charts
    ✅ Support drill-down via time dimension selectors
    ✅ Raw data viewer and export
    🚧 Add region and customer segmentation
    🚧 Live API integration
    🚧 Theme toggling and saved views

License

MIT License. Free for personal and commercial use.

Made with 💡 by [Your Name or Team]


I hope this is exactly what you needed. Let me know if there's anything else I can do for you.