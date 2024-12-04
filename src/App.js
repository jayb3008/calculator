import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Tabs } from 'antd';
import CustomDrawer from './components/CustomDrawer';
import {
  addToHistory,
  clearHistory,
  setMemory,
  addToMemoryList,
  clearMemory,
  removeMemoryItem,
} from './features/calculatorSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { history, memory, memoryList } = useSelector((state) => state.calculator);
  
  const [display, setDisplay] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [firstOperand, setFirstOperand] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  const clearAll = () => {
    setDisplay('0');
    setPendingOperator(null);
    setFirstOperand(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case 'x': return firstOperand * secondOperand;
      case '÷': return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };

  const performOperation = (operator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (pendingOperator) {
      const currentValue = firstOperand || 0;
      const newResult = calculate(currentValue, inputValue, pendingOperator);

      if (operator === '=') {
        const calculation = `${currentValue} ${pendingOperator} ${inputValue} = ${newResult}`;
        dispatch(addToHistory(calculation));
      }

      setFirstOperand(newResult);
      setDisplay(String(newResult));
    }

    setWaitingForOperand(true);
    setPendingOperator(operator);
  };

  const memoryAdd = () => {
    const currentValue = parseFloat(display);
    dispatch(setMemory(memory + currentValue));
  };

  const memorySubtract = () => {
    const currentValue = parseFloat(display);
    dispatch(setMemory(memory - currentValue));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryStore = () => {
    const currentValue = parseFloat(display);
    dispatch(addToMemoryList(currentValue));
  };

  const memoryClear = () => {
    dispatch(clearMemory());
  };

  const clearMemoryItem = (index) => {
    dispatch(removeMemoryItem(index));
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-main">
        <div className="menu-buttons">
          <button className="hamburger-menu" onClick={() => setShowPanel(!showPanel)}>☰</button>
        </div>
        <div className="calculator-screen">{display}</div>
        
        <CustomDrawer
          open={showPanel}
          onClose={() => setShowPanel(false)}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'history',
                label: 'History',
                children: (
                  <div className="drawer-content">
                    {history.length === 0 ? (
                      <div className="history-entry">No history available</div>
                    ) : (
                      <>
                        <div className="calculation-history">
                          {history.map((item, index) => (
                            <div key={index} className="history-entry">
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <button className="clear-history-button" onClick={handleClearHistory}>
                          <span>Clear History</span> 🗑️
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: 'memory',
                label: 'Memory',
                children: (
                  <div className="memory-section">
                    <div className="memory-display">Memory: {memory}</div>
                    {memoryList.length === 0 ? (
                      <div className="memory-entry">No stored values</div>
                    ) : (
                      <div className="memory-entries">
                        {memoryList.map((value, index) => (
                          <div key={index} className="memory-entry">
                            <span>{value}</span>
                            <button 
                              className="remove-memory" 
                              onClick={() => clearMemoryItem(index)}
                            >
                              <span>Delete</span> 🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </CustomDrawer>

        <div className="button-container">
          <div className="memory-button-row">
            <Button className="memory-button" onClick={memoryClear}>MC</Button>
            <Button className="memory-button" onClick={memoryRecall}>MR</Button>
            <Button className="memory-button" onClick={memoryAdd}>M+</Button>
            <Button className="memory-button" onClick={memorySubtract}>M-</Button>
            <Button className="memory-button" onClick={memoryStore}>MS</Button>
          </div>
          <div className="number-pad">
            <Button className="calculator-button" onClick={clearAll}>CE</Button>
            <Button className="calculator-button" onClick={clearAll}>C</Button>
            <Button className="calculator-button" onClick={() => setDisplay(String(-parseFloat(display)))}>⌫</Button>
            <Button className="calculator-button" onClick={() => performOperation('÷')}>÷</Button>

            <Button className="calculator-button" onClick={() => inputDigit(7)}>7</Button>
            <Button className="calculator-button" onClick={() => inputDigit(8)}>8</Button>
            <Button className="calculator-button" onClick={() => inputDigit(9)}>9</Button>
            <Button className="calculator-button" onClick={() => performOperation('x')}>x</Button>

            <Button className="calculator-button" onClick={() => inputDigit(4)}>4</Button>
            <Button className="calculator-button" onClick={() => inputDigit(5)}>5</Button>
            <Button className="calculator-button" onClick={() => inputDigit(6)}>6</Button>
            <Button className="calculator-button" onClick={() => performOperation('-')}>-</Button>

            <Button className="calculator-button" onClick={() => inputDigit(1)}>1</Button>
            <Button className="calculator-button" onClick={() => inputDigit(2)}>2</Button>
            <Button className="calculator-button" onClick={() => inputDigit(3)}>3</Button>
            <Button className="calculator-button" onClick={() => performOperation('+')}>+</Button>

            <Button className="calculator-button" onClick={() => inputDigit(0)}>0</Button>
            <Button className="calculator-button" onClick={() => inputDigit('.')}>.</Button>
            <Button className="calculator-button equals-button" onClick={() => performOperation('=')}>=</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
