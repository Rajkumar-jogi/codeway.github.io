
class Calculator{
   constructor(){
    this.display = document.getElementById('display');
    this.buttonNumbers = document.querySelectorAll('.number');
    this.buttonOperators = document.querySelectorAll('.operator');
    this.clearButton = document.getElementById('clear');
    this.calculateButton = document.getElementById('calculate');
    this.clearLastItemButton = document.getElementById('clearLastItem')
    this.togglePlusMinusButton = document.getElementById('togglePlusMinus')
    this.attachEventListeners();
   }


    attachEventListeners() {
        // Add event listeners to number buttons
        this.buttonNumbers.forEach(number => {
            number.addEventListener('click', () => {
                this.appendToDisplay(number.textContent);
            });
        });
        
        // Add event listeners to operator buttons
        this.buttonOperators.forEach(operator => {
            operator.addEventListener('click', () => {
                this.appendToDisplay(operator.textContent);
            });
        });
        
        // Event listener for clear button
        this.clearButton.addEventListener('click', () => {
            this.clearDisplay();
        });
        
        // Event listener for clear last item in the expression
        this.clearLastItemButton.addEventListener('click', () => {
            this.clearLastItemInExpression();
        });
        
        // Event listener for calculate button
        this.calculateButton.addEventListener('click', () => {
            this.calculateResult();
        });
        
        // Event listenre for onTogglePlusMinusButton
        this.togglePlusMinusButton.addEventListener('click', () => {
            this.onTogglePlusMinus();
        });

         // Event listener for keyboard input
        document.addEventListener('keydown', (event) => {
            const keyValue = event.key;
            // console.log(keyValue)

            // Check if the key pressed is a valid number or operator
            if (!isNaN(Number(keyValue)) || ['+', '-', '*', '/'].includes(keyValue)) {
                this.appendToDisplay(keyValue);
            } else if (keyValue === 'Backspace') {
                // Handle Backspace key separately to allow deleting characters
                event.preventDefault(); // Prevent the default Backspace behavior (e.g., navigating back in browser)
                this.clearLastItemInExpression(); // Call the function to remove the last character from the display
            }else if(keyValue === 'Enter'){
                event.preventDefault()
                this.calculateResult()
            }
            // Prevent default behavior for all other keys
            event.preventDefault();
        });

    }
   
    appendToDisplay(currentValue) {
        let lastChar = display.value.slice(-1).trim(); // Trim any leading or trailing whitespace
        const operators = ['+', '-', '*', '/'];
    
        // Function to check if a character is an operator
        const isOperator = (char) => operators.includes(char);
    
        // Function to handle concatenating operators and numbers
        const handleConcatenation = () => {
            // If last character is an operator and current value is a number, concatenate them
            if (isOperator(lastChar) && !isNaN(currentValue)) {
                display.value += currentValue;
                console.log('Added number to last operator:', currentValue);
            } else if (!isNaN(lastChar) && isOperator(currentValue)) {
                // If last character is a number and current value is an operator, concatenate them
                display.value += currentValue;
                console.log(`Concatenated operator with last number:`, currentValue);
            } else if (isOperator(lastChar) && isOperator(currentValue)) {
                // If both last character and current value are operators, replace last operator with current value
                if (lastChar !== currentValue) {
                    display.value = display.value.slice(0, -1).trim() + currentValue;
                    console.log(`Replaced last operator with current value:`, currentValue);
                } else {
                    display.value = display.value.trim();
                    console.log(`Last operator and current value are the same:`, currentValue);
                }
            } else if(!isNaN(lastChar) && !isNaN(currentValue)) {
                // Trim any extra whitespace and append the current value as usual if both are values
                display.value += currentValue;
                console.log('Added number:', currentValue);
            }
        };
    
        // Call the handleConcatenation function
        handleConcatenation();
    }

    clearDisplay() {
        display.value = '';
    }

    clearLastItemInExpression() {
         // Get the current value of the display
        let currentValue = this.display.value.trim();
        
        // Check if the last character is not a space
        if (currentValue.length > 0) {
            // Remove the last character from the display value
            const updatedValue = currentValue.slice(0, -1);
            
            // Update the display with the updated value
            this.display.value = updatedValue;
        }
    }

    onTogglePlusMinus() {
        console.log('onTogglePlusMinus function is triggered');
        const currentValue = display.value.trim();

        if (currentValue[0] === '-') {
            // If the first character is a minus sign, remove it
            display.value = currentValue.slice(1);
        } else {
            // If the first character is not a minus sign, add it
            display.value = '-' + currentValue;
        }
    }

    removeStartingEndingOperators(expression) {
        
        // checking does expression starts with any operator          
        const isExpressionStartsWithOperator = expression.startsWith('/') || expression.startsWith('*')
        // checking does expression ends with any operator
        const isExpressionEndsWithOperator = expression.endsWith('/') || expression.endsWith('*') || expression.endsWith('+') || expression.endsWith('-')

        let filteredExpression = ''
        
        if(isExpressionStartsWithOperator && !isExpressionEndsWithOperator){
            filteredExpression = expression.slice(1, ) // which extract part of the expression excluding the starting operator
            return filteredExpression

        }else if(!isExpressionStartsWithOperator && isExpressionEndsWithOperator){
            filteredExpression = expression.slice(0, -1)  // which extract part of the expression excluding the ending operator
            return filteredExpression

        }else if(isExpressionStartsWithOperator && isExpressionEndsWithOperator){
            filteredExpression = expression.slice(1, -1) // which extract part of the expression excluding the ending operator and starting operator
            return filteredExpression
        }

        return expression // returns the expression if no operator in front or end of the expression
        
    }

    evaluate(expression) {
        const operators = ['+', '-', '*', '/'];
        const operandStack = [];
        const operatorStack = [];

        const resultedExpresstion = this.removeStartingEndingOperators(expression)
        
        for (let i = 0; i < resultedExpresstion.length; i++) {
            let char = resultedExpresstion[i];
            
            if (!isNaN(parseInt(char))) {
                // If the character is a digit, parse the number and push it onto the operand stack
                let num = parseInt(char);
                while (!isNaN(parseInt(resultedExpresstion[i + 1]))) {
                    num = num * 10 + parseInt(resultedExpresstion[++i]);
                }
                operandStack.push(num);
            } else if (operators.includes(char)) {
                // If the character is an operator, push it onto the operator stack
                operatorStack.push(char);
            }
        }
        // console.log(`operandStack: ${operandStack}`)
        // console.log(`operatorStack: ${operatorStack}`)
    
        // Evaluate the expression based on the operators and operands
        let result = operandStack[0];
        for (let i = 1; i < operandStack.length; i++) {
            let operator = operatorStack.shift();
            let operand = operandStack[i];
            switch (operator) {
                case '+': result += operand; break;
                case '-': result -= operand; break;
                case '*': result *= operand; break;
                case '/': result /= operand; break;
            }
        }
        
        return result;
    }

    calculateResult() {
        const expression = display.value.trim();
        const isEmpty = expression.length === 0
        if(!isEmpty){
            const result = this.evaluate(expression);
            display.value = result;
        }
        
    }


}

document.addEventListener('DOMContentLoaded', function () {
    const calculator = new Calculator();
});
