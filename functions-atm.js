/*********************************************************
 * ATM SIMULATOR
 * Author: Miracle
 *********************************************************/


/*********************************************************
 * ACCOUNT DATA
 *********************************************************/

let account = {
    cardNumber: "123456789",
    pin: "1234",
    balance: 2000000,
    transactions: []
};

let currentWithdrawal = 0;
let pinAttempts = 0;
const MAX_PIN_ATTEMPTS = 3;


/*********************************************************
 * LOCAL STORAGE
 *********************************************************/

function saveAccount() {
    localStorage.setItem(
        "atmAccount",
        JSON.stringify(account)
    );
}

function loadAccount() {

    const storedAccount =
        localStorage.getItem("atmAccount");

    if (storedAccount) {
        account = JSON.parse(storedAccount);
    }
}

loadAccount();


/*********************************************************
 * SCREEN NAVIGATION
 *********************************************************/

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.style.display = "none";
    });

    const activeScreen =
        document.getElementById(screenId);

    if (activeScreen) {
        activeScreen.style.display = "block";
    }
}


/*********************************************************
 * CARD INSERTION
 *********************************************************/

function insertCard() {

    pinAttempts = 0;

    showScreen("pinScreen");
}


/*********************************************************
 * PIN VERIFICATION
 *********************************************************/

function verifyPin() {

    const enteredPin =
        document.getElementById("pinInput").value;

    if (enteredPin === account.pin) {

        pinAttempts = 0;

        updateBalanceDisplay();

        showScreen("dashboard");

        return true;
    }

    pinAttempts++;

    if (pinAttempts >= MAX_PIN_ATTEMPTS) {

        alert("Card blocked.");

        ejectCard();

        return false;
    }

    alert(
        `Incorrect PIN. ${
            MAX_PIN_ATTEMPTS - pinAttempts
        } attempt(s) remaining.`
    );

    return false;
}


/*********************************************************
 * LANGUAGE SELECTION
 *********************************************************/

function selectLanguage(language) {

    console.log(
        `Language selected: ${language}`
    );

    updateBalanceDisplay();

    showScreen("dashboard");
}


/*********************************************************
 * DASHBOARD
 *********************************************************/

function showDashboard() {

    updateBalanceDisplay();

    showScreen("dashboard");
}


/*********************************************************
 * BALANCE INQUIRY
 *********************************************************/

function getBalance() {

    return account.balance;
}

function updateBalanceDisplay() {

    const balanceElement =
        document.getElementById("balance");

    if (balanceElement) {

        balanceElement.textContent =
            getBalance().toLocaleString();
    }
}

function checkBalance() {

    alert(
        `Current Balance: ${account.balance.toLocaleString()}`
    );
}


/*********************************************************
 * WITHDRAWAL MENU
 *********************************************************/

function selectWithdrawal(amount) {

    currentWithdrawal = amount;

    showScreen("receiptChoice");
}


/*********************************************************
 * CUSTOM WITHDRAWAL
 *********************************************************/

function otherAmount() {

    const amount = Number(
        prompt("Enter amount:")
    );

    if (!amount || amount <= 0) {

        alert("Invalid amount.");

        return;
    }

    currentWithdrawal = amount;

    showScreen("receiptChoice");
}


/*********************************************************
 * WITHDRAWAL PROCESSING
 *********************************************************/

function withdraw(amount) {

    amount = Number(amount);

    if (amount <= 0) {

        alert("Invalid amount.");

        return false;
    }

    if (amount > account.balance) {

        alert("Insufficient funds.");

        return false;
    }

    account.balance -= amount;

    account.transactions.push({

        type: "Withdrawal",

        amount: amount,

        balanceAfter: account.balance,

        date: new Date().toLocaleString()
    });

    saveAccount();

    updateBalanceDisplay();

    return true;
}


/*********************************************************
 * RECEIPT DECISION
 *********************************************************/

function receiptChoice(printReceipt) {

    const success =
        withdraw(currentWithdrawal);

    if (!success) {
        return;
    }

    if (printReceipt) {
        generateReceipt();
    }

    dispenseCash();
}


/*********************************************************
 * CASH DISPENSING
 *********************************************************/

function dispenseCash() {

    showScreen("cashDispense");

    setTimeout(() => {

        showScreen(
            "anotherTransaction"
        );

    }, 3000);
}


/*********************************************************
 * ANOTHER TRANSACTION
 *********************************************************/

function anotherTransaction(choice) {

    if (choice) {

        updateBalanceDisplay();

        showScreen("dashboard");

    } else {

        ejectCard();
    }
}


/*********************************************************
 * TRANSACTION HISTORY
 *********************************************************/

function showMiniStatement() {

    if (
        account.transactions.length === 0
    ) {

        alert(
            "No transactions available."
        );

        return;
    }

    let statement = "";

    account.transactions.forEach(
        transaction => {

            statement +=
                `${transaction.type}\n` +
                `Amount: ${transaction.amount}\n` +
                `Balance: ${transaction.balanceAfter}\n` +
                `Date: ${transaction.date}\n\n`;
        }
    );

    alert(statement);
}


/*********************************************************
 * RECEIPT GENERATION
 *********************************************************/

function generateReceipt() {

    const transactionId =
        Math.floor(
            100000 + Math.random() * 900000
        );

    const receiptWindow =
        window.open(
            "",
            "_blank",
            "width=400,height=600"
        );

    receiptWindow.document.write(`
        <html>
        <head>
            <title>ATM Receipt</title>
        </head>
        <body>

            <h2>INFOSUPER BANK</h2>

            <hr>

            <p>
                Transaction ID:
                ${transactionId}
            </p>

            <p>
                Amount:
                ${currentWithdrawal}
            </p>

            <p>
                Remaining Balance:
                ${account.balance}
            </p>

            <p>
                Date:
                ${new Date().toLocaleString()}
            </p>

            <hr>

            <p>
                Thank you for using our ATM.
            </p>

        </body>
        </html>
    `);
}


/*********************************************************
 * DEPOSIT FUNCTION (OPTIONAL)
 *********************************************************/

function deposit(amount) {

    amount = Number(amount);

    if (amount <= 0) {

        alert("Invalid amount.");

        return;
    }

    account.balance += amount;

    account.transactions.push({

        type: "Deposit",

        amount: amount,

        balanceAfter: account.balance,

        date: new Date().toLocaleString()
    });

    saveAccount();

    updateBalanceDisplay();
}


/*********************************************************
 * SESSION RESET
 *********************************************************/

function ejectCard() {

    currentWithdrawal = 0;

    document
        .querySelectorAll("input")
        .forEach(input => {
            input.value = "";
        });

    showScreen("welcome");
}


/*********************************************************
 * ADMIN RESET (TESTING ONLY)
 *********************************************************/

function resetAccount() {

    account.balance = 2000000;

    account.transactions = [];

    saveAccount();

    updateBalanceDisplay();

    alert("Account reset.");
}