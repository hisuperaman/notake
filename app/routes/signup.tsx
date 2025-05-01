import { data, Form, Link, redirect, useFetcher } from "react-router";
import Button from "~/layouts/authentication/components/button";
import InputField from "~/layouts/authentication/components/input-field";
import type { Route } from "./+types/signup";
import bcrypt from 'bcrypt'
import dbConnect from "~/utils/db.connect";
import User from "~/models/user.model";
import { useEffect, useRef, useState } from "react";

import { toast } from 'react-toastify';
import Folder from "~/models/folder.model";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()

    await dbConnect()

    const { full_name, email, password } = Object.fromEntries(formData)

    if (!full_name) {
        return data({ ok: false, message: 'Full name is required' }, { status: 400 })
    }
    if (!email) {
        return data({ ok: false, message: 'Email is required' }, { status: 400 })
    }
    if (!password) {
        return data({ ok: false, message: 'Password is required' }, { status: 400 })
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            fullName: full_name,
            email: email,
            password: hashedPassword
        })
        await user.save()
        
        const folder = new Folder({
            userId: user._id,
            name: 'Personal'
        })
        await folder.save()

        return data({ ok: true, message: 'Success' }, { status: 200 })
    }
    catch (err) {
        console.log(err)
        return data({ ok: false, message: 'Internal server error' }, { status: 500 })
    }
}

export default function Signup() {
    const fetcher = useFetcher()

    const busy = fetcher.state !== 'idle'

    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)

    const formRef = useRef(null)


    function handlePasswordChange(e) {
        if (e.currentTarget.name === 'password') {
            passwordRef.current = e.currentTarget.value
        }
        else {
            confirmPasswordRef.current = e.currentTarget.value
        }

        if (passwordRef.current !== confirmPasswordRef.current) {
            setIsPasswordMatch(false)
        }
        else {
            setIsPasswordMatch(true)
        }

    }

    useEffect(() => {
        if (!fetcher.data?.ok) {
            toast.error(fetcher.data?.message)
        }
        else {
            formRef.current?.reset()
            toast.success('Sign up successful')
        }
    }, [fetcher.data])


    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Welcome!</p>
                <p className="text-xs text-onSurface dark:text-onSurface">
                    Already have an account?&nbsp;
                    <span className="text-onSurfaceActive dark:text-onSurfaceActive">
                        <Link to="/login" className="underline underline-offset-2">Login</Link>
                    </span>
                </p>
            </div>

            <fetcher.Form ref={formRef} method="post" className="text-sm flex flex-col gap-4">
                <InputField required={true} name={'full_name'} placeholder={'Full Name'} />
                <InputField required={true} type={'email'} name={'email'} placeholder={'Email'} />
                <InputField required={true} onChange={handlePasswordChange} name={'password'} type={'password'} placeholder={'Password'} />
                <div className="flex flex-col gap-1">
                    <InputField required={true} onChange={handlePasswordChange} type={'password'} placeholder={'Confirm Password'} />
                    {
                        !isPasswordMatch && (
                            <span className="text-danger">
                                Passwords do not match
                            </span>
                        )
                    }
                </div>

                <Button label={"Sign Up"} isPending={busy} disabled={!isPasswordMatch} type={'submit'} />

            </fetcher.Form >
        </div>
    )
}