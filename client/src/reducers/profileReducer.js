import types from '../actions/types';

const initialState = {
	profile: null,
	profiles: null,
	isLoading: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case types.PROFILE_LOADING:
			return { ...state, isLoading: true };
		case types.GET_PROFILE:
			return { ...state, isLoading: false, profile: action.payload };
		case types.CLEAR_PROFILE:
			return { ...state, isLoading: false, profile: null };
		case types.GET_PROFILES:
			return { ...state, isLoading: false, profiles: action.payload };
		default:
			return state;
	}
};
