# market.js

[![npm version](https://img.shields.io/npm/v/@nethaven/market.js.svg)](https://www.npmjs.com/package/@nethaven/market.js)
[![License](https://img.shields.io/npm/l/@nethaven/market.js.svg)](https://github.com/@nethaven/market.js/blob/main/LICENSE)

A lightweight, zero-dependency storage wrapper with a simple API for managing browser storage (localStorage and sessionStorage) with event handling capabilities.

## Features

- 🚀 Zero dependencies
- 📦 Simple and intuitive API
- 🔄 Event-driven architecture
- 🔌 Element subscription support
- 💾 Supports both localStorage and sessionStorage
- 🎯 TypeScript support

## Table of Contents

- [market.js](#marketjs)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [API Reference](#api-reference)
    - [Creating Markets](#creating-markets)
    - [Storage Operations](#storage-operations)
      - [`.get(product?: string)`](#getproduct-string)
      - [`.set(products: {})`](#setproducts-)
      - [`.has(product: string)`](#hasproduct-string)
      - [`.rm(...products: string[])`](#rmproducts-string)
      - [`.clear()`](#clear)
    - [Event System](#event-system)
    - [Element Subscription](#element-subscription)
      - [Subscription Properties](#subscription-properties)
  - [Examples](#examples)
    - [Theme Switcher](#theme-switcher)
    - [Form Data Persistence](#form-data-persistence)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```bash
npm install @nethaven/market.js
# or
yarn add @nethaven/market.js
```

## Quick Start

```javascript
import { useLocalMarket } from 'market';

// Create a new market for user settings
const settings = useLocalMarket("userSettings", { theme: "dark" });

// Set a value
settings.set({ theme: "light" });

// Get a value
const theme = settings.get("theme");

// Listen for changes
settings.on("afterSettingProduct", (evt) => {
  console.log("Theme updated:", evt.newProducts.theme);
});
```

## API Reference

### Creating Markets

```javascript
import { useLocalMarket, useSessionMarket } from 'market';

// Local storage market
const settings = useLocalMarket("userSettings", { theme: "dark" });

// Session storage market
const registration = useSessionMarket("registration");
```

### Storage Operations

#### `.get(product?: string)`
Retrieves a product or all products from the market.

```javascript
// Get specific product
const theme = settings.get("theme");

// Get all products
const allSettings = settings.get();
```

#### `.set(products: {})`
Sets one or more products in the market. Triggers `beforeSettingProduct` and `afterSettingProduct` events.

```javascript
// Set single product
settings.set({ theme: "light" });

// Set multiple products
settings.set({ 
  theme: "light",
  font: "dyslexic",
  fontSize: "16px"
});
```

#### `.has(product: string)`
Checks if a product exists in the market.

```javascript
if (settings.has("theme")) {
  // Theme setting exists
}
```

#### `.rm(...products: string[])`
Removes one or more products from the market. Triggers `beforeRemovingProduct` and `afterRemovingProduct` events.

```javascript
// Remove single product
settings.rm("theme");

// Remove multiple products
settings.rm("theme", "font");
```

#### `.clear()`
Clears all products from the market. Triggers `beforeClearingMarket` and `afterClearingMarket` events.

```javascript
settings.clear();
```

### Event System

The market provides a comprehensive event system for monitoring storage operations. Each event includes a timestamp and relevant data about the operation.

```javascript
const settings = useLocalMarket("userSettings");

// Listen for specific events
settings.on("beforeSettingProduct", (evt) => {
  console.log("About to set:", evt.newProducts);
  console.log("Current state:", evt.products);
  console.log("Event timestamp:", evt.timestamp);
});

settings.on("afterSettingProduct", (evt) => {
  console.log("Updated products:", evt.products);
  console.log("New products:", evt.newProducts);
  console.log("Event timestamp:", evt.timestamp);
});

// Available events:
// - beforeSettingProduct: Triggered before setting products
// - afterSettingProduct: Triggered after setting products
// - beforeRemovingProduct: Triggered before removing products
// - afterRemovingProduct: Triggered after removing products
// - beforeClearingMarket: Triggered before clearing the market
// - afterClearingMarket: Triggered after clearing the market
```

### Element Subscription

Subscribe HTML elements to automatically update the market when their values change. The subscription system automatically syncs the element's value with the market and vice versa.

```javascript
const settings = useLocalMarket("userSettings");

// Subscribe an element
const subscription = {
  element: document.querySelector("#themeSelector"),
  product: "theme",
  event: "change",
  attribute: "value",
  callback: (event, market) => {
    console.log("Theme updated:", event.target.value);
  }
};

settings.subscribeElement(subscription);

// Unsubscribe when done
settings.unsubscribeElement(subscription);
```

#### Subscription Properties
- `element`: The HTML element to subscribe to
- `product`: The market product to sync with
- `event`: The DOM event to listen for
- `attribute`: The element attribute to sync
- `callback`: Optional callback function called after the market is updated

## Examples

### Theme Switcher
```javascript
const settings = useLocalMarket("theme", { current: "light" });

// Subscribe to theme toggle
settings.subscribeElement({
  element: document.querySelector("#themeToggle"),
  product: "current",
  event: "change",
  attribute: "value"
});

// Apply theme changes
settings.on("afterSettingProduct", (evt) => {
  document.body.className = evt.products.current;
});
```

### Form Data Persistence
```javascript
const formData = useSessionMarket("registration");

// Save form progress
formData.subscribeElement({
  element: document.querySelector("#registrationForm"),
  product: "data",
  event: "input",
  attribute: "value"
});

// Restore form on page load
window.addEventListener("load", () => {
  const savedData = formData.get("data");
  if (savedData) {
    // Restore form state
  }
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.