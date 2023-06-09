import { ACTIONS } from './App';

export default function OperationsBtn({ dispatch, operation }) {
  return (
    <button
      className='operations-btn'
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
