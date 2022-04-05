import { useCallback, useReducer } from "react"

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
}

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null, extra: null, identifier: action.identifier }
        case 'RESPONSE':
            return { ...currentHttpState, loading: false, data: action.responseData, extra: action.reqExtra }
        case 'ERROR':
            return { loading: false, error: action.errData }
        case "CLOSE":
            return initialState
        default:
            throw new Error("Should not be reached")
    }
}

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, initialState)

    const close = useCallback(() => httpDispatch({ type: 'CLOSE' }), [])

    const sendRequest = useCallback((url, method, body, extra, reqIdentifier) => {
        httpDispatch({ type: "SEND", identifier: reqIdentifier })
        fetch(url,
            {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                httpDispatch({ type: 'RESPONSE', responseData: data, reqExtra: extra })
            })
            .catch(err => {
                httpDispatch({
                    type: "ERROR",
                    errData: "Something went wrong"
                })
            })
    }, [])
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        extra: httpState.extra,
        identifier: httpState.identifier,
        close: close
    }
};
export default useHttp;