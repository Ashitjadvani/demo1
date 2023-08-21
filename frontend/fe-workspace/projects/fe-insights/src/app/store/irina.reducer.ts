export interface IState {
  version: string;
}


export const initialState: IState = {
  version: '1.0.0'
};


export function irinaReducer(state: IState = initialState, action: any): IState {
  return state;
}

