import { data, Link, redirect, useFetcher } from "react-router";
import Button from "~/layouts/authentication/components/button";
import InputField from "~/layouts/authentication/components/input-field";
import type { Route } from "./+types/login";
import dbConnect from "~/utils/db.connect";
import User from "~/models/user.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";

import { toast } from 'react-toastify';
import { useEffect, useRef } from "react";
import { requireUser } from "~/utils/requireUser";

export async function loader({request}: Route.LoaderArgs) {
    const user = await requireUser(request)
    if(user) {
        return redirect('/')
    }
}

export async function action({ request }: Route.ActionArgs) {
    configDotenv()
    const formData = await request.formData()

    await dbConnect()

    const { email, password } = Object.fromEntries(formData)

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return data({ ok: false, message: 'Email or password is incorrect' }, { status: 401 })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return data({ ok: false, message: 'Email or password is incorrect' }, { status: 401 })
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
        return redirect("/", {
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Lax`,
            },
        });
    }
    catch (err) {
        console.log(err)
        return data({ ok: false, message: 'Internal server error' }, { status: 500 })
    }
}

export default function Login() {
    const fetcher = useFetcher()

    const busy = fetcher?.state !== 'idle'

    const formRef = useRef(null)

    useEffect(() => {
            if (!fetcher.data?.ok) {
                toast.error(fetcher.data?.message)
            }
        }, [fetcher.data])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Welcome Back!</p>
                <p className="text-xs text-onSurface dark:text-onSurface">
                    Don't have an account?&nbsp;
                    <span className="text-onSurfaceActive dark:text-onSurfaceActive">
                        <Link to="/signup" className="underline underline-offset-2">Create a new account now,</Link>
                    </span>&nbsp;
                    It's FREE! Takes less than a minute.
                </p>
            </div>

            <fetcher.Form ref={formRef} method="post" className="text-sm flex flex-col gap-4">
                <InputField required={true} type={'email'} name={'email'} placeholder={'Email'} />
                <InputField required={true} name={'password'} type={'password'} placeholder={'Password'} />

                <Button label={'Login now'} isPending={busy} type={'submit'} />
            </fetcher.Form>
        </div>
    )
}