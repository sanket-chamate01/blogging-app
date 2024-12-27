import { SignUpInput } from "common-blogging-app"
import { ChangeEvent, useState } from "react"
import { Link } from "react-router-dom"

export const Auth = ({type}: {type: "signin" | "signup"}) => {

    const [postInputs, setPostInputs] = useState<SignUpInput>({
        name: "",
        email: "",
        password: ""
    })

    return (
        <div className="flex flex-col justify-center h-screen bg-yellow-100">
            <div className="flex justify-center">
                <div className="px-10">
                    <div className="text-4xl font-bold text-center">
                        Create an Account
                    </div>
                    <div className="text-slate-500 pt-3 text-center font-semibold mb-7">
                        Already have an Account? 
                        <Link className="underline ml-2 text-yellow-900" to={"/signin"}>Login</Link>
                    </div>
                    <LabelledInput inputType="text" label="Username" placeholder="Enter your username" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            name: e.target.value
                        }))
                    }}></LabelledInput>
                    <LabelledInput inputType="text" label="Email" placeholder="me@example.com" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            email: e.target.value
                        }))
                    }}></LabelledInput>
                    <LabelledInput inputType="password" label="Password" placeholder="" onChange={(e) => {
                        setPostInputs((c) => ({
                            ...c,
                            password: e.target.value
                        }))
                    }}></LabelledInput>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    inputType: string
}

function LabelledInput({label, placeholder, onChange, inputType}: LabelledInputType) {
    return(
        <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <input onChange={onChange} type={inputType} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    )
}