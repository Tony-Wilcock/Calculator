import { useReducer } from 'react';
import DigitBtn from './DigitBtn';
import OperationsBtn from './OperationsBtn';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  CLEAR_ENTRY: 'clear-entry',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
};

const INTEGER_FORMATTER = new Intl.NumberFormat('en-uk', {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) {
    return (operand = '0');
  }
  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const evaluate = ({ currentOperand, prevOperand, operation }) => {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return '';

  let computation = '';

  switch (operation) {
    case '+':
      computation = prev + curr;
      break;
    case '-':
      computation = prev - curr;
      break;
    case 'x':
      computation = prev * curr;
      break;
    case '÷':
      computation = prev / curr;
      break;
  }

  return computation.toString();
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: null,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CLEAR_ENTRY:
      return {
        ...state,
        currentOperand: null,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.prevOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return { ...state };
  }
}

function App() {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className='App'>
      <input
        id='top-colour'
        className='colour-picker top-clr'
        type='color'
        defaultValue='#1e1e1e'
        onChange={(e) => {
          document.documentElement.style.setProperty(
            '--top-colour',
            e.target.value
          );
        }}
      ></input>
      <input
        id='bottom-colour'
        className='colour-picker b-clr'
        type='color'
        defaultValue='#00aacc'
        onChange={(e) => {
          document.documentElement.style.setProperty(
            '--bottom-colour',
            e.target.value
          );
        }}
      ></input>
      <div className='calc'>
        <div className='output'>
          <div className='prev-operand'>
            {formatOperand(prevOperand)} {operation}
          </div>
          <div className='cur-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button onClick={() => dispatch({ type: ACTIONS.CLEAR_ENTRY })}>
          CE
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>C</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          Del
        </button>
        <OperationsBtn operation='÷' dispatch={dispatch} />
        <DigitBtn digit='7' dispatch={dispatch} />
        <DigitBtn digit='8' dispatch={dispatch} />
        <DigitBtn digit='9' dispatch={dispatch} />
        <OperationsBtn operation='x' dispatch={dispatch} />
        <DigitBtn digit='4' dispatch={dispatch} />
        <DigitBtn digit='5' dispatch={dispatch} />
        <DigitBtn digit='6' dispatch={dispatch} />
        <OperationsBtn operation='+' dispatch={dispatch} />
        <DigitBtn digit='1' dispatch={dispatch} />
        <DigitBtn digit='2' dispatch={dispatch} />
        <DigitBtn digit='3' dispatch={dispatch} />
        <OperationsBtn operation='-' dispatch={dispatch} />
        <DigitBtn digit='.' dispatch={dispatch} />
        <DigitBtn digit='0' dispatch={dispatch} />
        <button
          className='span-2'
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
