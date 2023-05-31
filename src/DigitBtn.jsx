import { ACTIONS } from './App';
import { canAddDigit } from './App';

export default function DigitBtn({ dispatch, digit }) {
  return (
    <button
      className='digit-btn'
      onClick={(e) => {
        if (!canAddDigit) {
          e.preventDefault();
        } else {
          dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
        }
      }}
    >
      {digit}
    </button>
  );
}
