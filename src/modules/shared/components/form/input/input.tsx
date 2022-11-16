import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Input({ name, onChange, maxlength = 100, ...props }) {
    const {
        register,
        formState: { errors },
    } = useFormContext(); // retrieve all hook methods

    return (
        <>
            <input
                type="text"
                autoComplete={`${name}noinput`}
                maxLength={maxlength}
                {...register(name)}
                {...props}
                onChange={(event) => onChange ? onChange(event.target.value) : null}
                className={`form-control ${errors?.[name] ? 'is-invalid' : ''}`}
            />
            {errors?.[name]?.message ? <span className="error-msg m-t-8">{errors?.[name]?.message}</span> : null}
        </>
    );
}
