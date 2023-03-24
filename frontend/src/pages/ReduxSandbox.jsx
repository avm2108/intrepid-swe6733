import React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import intrepidSlice from './slice'

const ReduxSandbox = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(intrepidSlice.actions.getUserDataFetch())
    }, [dispatch])

    /*-- pull data from current store state --*/
    const intrepidData = useSelector(state => state.intrepid)

    /*-- consume data from intrepid store --*/
    const {firstName, lastName, maidenName, age, gender, email, phone, username, password, birthDate} = intrepidData['userData']

    return(
        <>
            <h2>User Data Example from the Redux Store</h2>
            <p>Full Name: {`${firstName} ${lastName}`}</p>
            <p>Maiden Name: {maidenName}</p>
            <p>Age: {age}</p>
            <p>Gender: {gender}</p>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Username: {username}</p>
            <p>Password: {password}</p>
            <p>Birth Date: {birthDate}</p>
        </>
    )

}

export default ReduxSandbox

