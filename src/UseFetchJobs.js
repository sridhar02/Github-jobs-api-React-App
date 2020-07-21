import { useReducer, useEffect } from "react";
import axios from "axios";

const BASE_URL =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

const ACTIONS = {
  MAKE_REGUEST: "make_request",
  GET_DATA: "get_data",
  ERROR: "error",
  UPDATE_HAS_NEXT_PAGE:"update_has_next_page"
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REGUEST:
      return { loading: true, Jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
        return {...state,hasNextPage:ACTIONS.payload.hasNextPage}  
    default:
      break;
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REGUEST });
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken1.token,
        params: {
          markdown: true,
          page: page,
          ...params,
        },
      })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

      const cancelToken2 = axios.CancelToken.source();
      axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: {
          markdown: true,
          page: page+1,
          ...params,
        },
      })
      .then((res) => {
        dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0  } });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });
    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
