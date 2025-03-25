# **JavaScript Week 1: Beginner’s Guide (Hands-on Learning Approach)**  

Welcome to **Week 1 of JavaScript Learning**! This guide is designed to help you understand **JavaScript fundamentals** while avoiding "tutorial hell." You will write real code, complete exercises, and build **mini-projects** along the way.  

---

## **📌 Week 1 Overview: What You'll Learn**
✅ Introduction to JavaScript  
✅ Variables & Data Types  
✅ Operators & Expressions  
✅ Functions & Scope  
✅ Conditional Statements  
✅ Loops  
✅ Basic DOM Manipulation  
✅ Mini Project: Interactive To-Do List  

---

# **📖 Lesson 1: Introduction to JavaScript**  

### **What is JavaScript?**  
JavaScript is a **programming language** that makes web pages interactive. It allows you to:  
✔ Create dynamic content (e.g., live search results)  
✔ Validate forms (e.g., check if a user entered a valid email)  
✔ Handle events (e.g., click, scroll, hover)  
✔ Communicate with servers using APIs  

### **Basic JavaScript Example**  
Try this in your **browser console** (Right-click → Inspect → Console):  

```js
console.log("Welcome to JavaScript!");
```

### **💡 Task:**  
Open your browser console and print your name using JavaScript.  

---
You're absolutely right! Before diving into JavaScript logic, beginners need to understand how to **connect JavaScript with HTML**. Here’s a new lesson to fit into **Week 1** right after the introduction.  

---

# **📖 Lesson 2: How to Use JavaScript in HTML**  

Before we start coding JavaScript, we need to understand how to use it inside an **HTML document**.  

---

## **1️⃣ Adding JavaScript to an HTML Page**  
There are **three main ways** to include JavaScript in an HTML file:  

### **1. Inline JavaScript (Inside an HTML Tag)**  
You can add JavaScript **directly inside** an HTML element using the `onclick` attribute:  
```html
<button onclick="alert('Hello!')">Click Me</button>
```
💡 **Use Case:** Quick, one-time actions.  

---

### **2. Internal JavaScript (Inside `<script>` Tag in HTML)**  
You can write JavaScript inside a `<script>` tag in the HTML file.  
```html
<!DOCTYPE html>
<html>
<head>
    <title>Internal JavaScript Example</title>
</head>
<body>
    <h1>Welcome</h1>

    <script>
        console.log("This is JavaScript inside the HTML file!");
    </script>
</body>
</html>
```
💡 **Use Case:** Small scripts, quick experiments.  

---

### **3. External JavaScript (Using a Separate `.js` File) [Recommended]**  
This is the best practice because it keeps HTML and JavaScript **separate**.  

#### **Step 1: Create an HTML file (`index.html`)**  
```html
<!DOCTYPE html>
<html>
<head>
    <title>External JavaScript</title>
</head>
<body>
    <h1 id="title">Hello, JavaScript!</h1>
    <button id="changeText">Change Text</button>

    <script src="script.js"></script> <!-- Linking the external JavaScript file -->
</body>
</html>
```

#### **Step 2: Create a JavaScript file (`script.js`) in the same folder**  
```js
// Select the h1 element
document.getElementById("changeText").addEventListener("click", function() {
    document.getElementById("title").innerText = "Text Changed!";
});
```

💡 **Use Case:** Large projects, clean code separation.  

---

## **2️⃣ Where to Place the `<script>` Tag in HTML?**  

There are two main places to insert a `<script>` tag in an HTML file:  

### **1. Inside `<head>` (Not Recommended for DOM Manipulation)**  
```html
<head>
    <script src="script.js"></script>
</head>
```
⛔ **Problem:** If your JavaScript tries to modify an HTML element **before** the page loads, it won’t work.  

---

### **2. Before the `</body>` Tag (Recommended ✅)**  
```html
<body>
    <script src="script.js"></script>
</body>
</html>
```
✅ **Why?** The script loads **after** the HTML elements, so JavaScript can interact with them.  

---

## **3️⃣ Quick Practice Task**  
1️⃣ Create an HTML file with an `<h1>` tag that says **"Welcome to JavaScript"**.  
2️⃣ Create an external **`script.js`** file.  
3️⃣ Write a JavaScript function to change the `<h1>` text when a button is clicked.  

---


# **📖 Lesson 3: Variables & Data Types**  

### **What Are Variables?**  
Variables store **data** in JavaScript. There are three ways to declare them:  
```js
var name = "Alice";  // Old way (avoid using)
let age = 25;        // Modern way (preferred)
const pi = 3.14;     // Constant (cannot change)
```

### **Data Types in JavaScript**  
| Data Type  | Example  | Description |
|------------|---------|-------------|
| String     | `"Hello"`  | Text enclosed in quotes |
| Number     | `42`  | Any numerical value |
| Boolean    | `true` / `false` | Represents true or false |
| Array      | `["Apple", "Banana"]` | Stores multiple values |
| Object     | `{name: "John", age: 30}` | Key-value pair storage |

### **Example**  
```js
let firstName = "John";   // String
let age = 30;             // Number
let isStudent = true;     // Boolean
let hobbies = ["Music", "Sports"]; // Array
let person = { name: "Alice", age: 25 }; // Object

console.log(firstName, age, isStudent, hobbies, person);
```

### **💡 Task:**  
1. Declare a variable `city` and assign it your city name.  
2. Create an array of three hobbies.  
3. Log them to the console.  

---

# **📖 Lesson 4: Operators & Expressions**  

### **Types of Operators**  
| Operator | Description | Example |
|----------|------------|---------|
| `+` | Addition | `5 + 2 // 7` |
| `-` | Subtraction | `5 - 2 // 3` |
| `*` | Multiplication | `5 * 2 // 10` |
| `/` | Division | `10 / 2 // 5` |
| `%` | Modulus (Remainder) | `10 % 3 // 1` |
| `==` | Equal to (loose check) | `"5" == 5 // true` |
| `===` | Strict equal (checks type too) | `"5" === 5 // false` |

### **Example**
```js
let a = 10;
let b = 3;
console.log(a + b); // 13
console.log(a % b); // 1
console.log(5 == "5"); // true (checks value only)
console.log(5 === "5"); // false (checks value & type)
```

### **💡 Task:**  
1. Write a program that takes two numbers and prints their sum.  

---

# **📖 Lesson 5: Functions & Scope**  

### **What is a Function?**  
Functions **group code** into reusable blocks:  
```js
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Alice"));
```

### **Function Scope**  
Variables inside a function **cannot be accessed outside**:  
```js
function testScope() {
    let secret = "Hidden";
}
console.log(secret); // Error! Variable is inside function scope
```

### **💡 Task:**  
1. Write a function that takes **two numbers** and **returns their product**.  

---

# **📖 Lesson 6: Conditional Statements**  

### **if-else Statements**  
```js
let age = 18;

if (age >= 18) {
    console.log("You are an adult!");
} else {
    console.log("You are a minor.");
}
```

### **Switch Statement**
```js
let fruit = "Apple";

switch (fruit) {
    case "Apple":
        console.log("You chose an apple.");
        break;
    case "Banana":
        console.log("You chose a banana.");
        break;
    default:
        console.log("Unknown fruit.");
}
```

### **💡 Task:**  
1. Write a program that asks for a user’s age and prints if they are **a minor or an adult**.  

---

# **📖 Lesson 7: Loops**  

### **For Loop**  
```js
for (let i = 1; i <= 5; i++) {
    console.log("Number: " + i);
}
```

### **While Loop**
```js
let i = 1;
while (i <= 5) {
    console.log(i);
    i++;
}
```

### **💡 Task:**  
1. Write a loop that prints numbers from 1 to 10.  

---

# **📖 Lesson 8: Basic DOM Manipulation**  

### **What is the DOM?**  
The **Document Object Model (DOM)** allows JavaScript to interact with **HTML elements**.  

### **Selecting and Changing an Element**
```js
document.getElementById("title").innerText = "New Title!";
```

### **Handling Events**
```js
document.getElementById("btn").addEventListener("click", function() {
    alert("Button Clicked!");
});
```

---

# **📌 Mini Project: Interactive To-Do List**  

### **Project Goal**  
- Users can type a task and add it to a list.  
- Clicking a task **removes** it from the list.  

### **HTML (Create an `index.html` file)**
```html
<!DOCTYPE html>
<html>
<head><title>To-Do List</title></head>
<body>
    <input type="text" id="taskInput" placeholder="Enter task">
    <button id="addTask">Add Task</button>
    <ul id="taskList"></ul>

    <script src="script.js"></script>
</body>
</html>
```

### **JavaScript (Create a `script.js` file)**
```js
document.getElementById("addTask").addEventListener("click", function() {
    let task = document.getElementById("taskInput").value;
    if (task.trim() !== "") {
        let li = document.createElement("li");
        li.innerText = task;
        li.addEventListener("click", function() {
            this.remove();
        });
        document.getElementById("taskList").appendChild(li);
        document.getElementById("taskInput").value = "";
    }
});
```

### **💡 Challenge:**  
1. Modify the project to allow task completion by clicking instead of deleting immediately.  

---

# **🎯 Conclusion & Next Steps**  
🎉 Congrats on completing **Week 1**! Now, start **experimenting** and building simple projects.  

