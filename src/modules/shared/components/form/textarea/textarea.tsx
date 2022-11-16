import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import classes from './textarea.module.scss';

export function TextAreaBasic({ register = null, name, onChangeInput = null, rows, cols, maxCharacter, isDisplayCharCount = true, defaultValue = '', errors, ...props }) {
  const [value, setValue] = useState('');
  const [isRegister, setRegister] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
    if (textRef.current) {
      textRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  useEffect(()=>{
    if (register) {
      setRegister(true);
    }
  }, []);

  return (
    <div className="pos-rlt textareamain">
        {
            isRegister ?  (
                <>
                      <textarea
                          {...register(name)}
                          rows={rows}
                          name={name}
                          // @ts-ignore
                          className={`${classes.textarea} ${errors?.[name] ? 'is-invalid' : ''}`}
                          cols={cols}
                          onChange={(event) => {
                            let val = '';
                            if (event.target.value.length <= maxCharacter) {
                              val = event.target.value;
                            } else {
                              val = event.target.value.substring(0, maxCharacter);
                            }
                            if (setValue)
                              setValue(val);
                            if (onChangeInput)
                              onChangeInput(val);
                          }}
                          {...props}
                      />
                    {isDisplayCharCount && (<span className="maxcharactersection">{value ? value.length : 0}/{maxCharacter}</span>)}


                </>
            ) : (

                <>

                  <textarea
                      rows={rows}
                      name={name}
                      ref={textRef}
                      value={value}
                      // @ts-ignore
                      className={`${classes.textarea} ${errors?.[name] ? 'is-invalid' : ''}`}
                      cols={cols}
                      onChange={(event) => {
                        let val = '';
                        if (event.target.value.length <= maxCharacter) {
                          val = event.target.value;
                        } else {
                          val = event.target.value.substring(0, maxCharacter);
                        }
                        if (setValue)
                          setValue(val);
                        if (onChangeInput)
                          onChangeInput(val);
                      }}
                      {...props}
                  />
                    {isDisplayCharCount && (<span className="maxcharactersection">{value ? value.length : 0}/{maxCharacter}</span>)}


                </>
            )
        }

    </div>
  );
}

export default function TextArea({ name, onChange, rows, cols, isDisplayCharCount = true, maxCharacter = 180, ...props }) {
  const [defaultValue, setDefaultValue] = useState('');
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  useEffect(() => {
    const data = getValues();
    if (data[name] !== undefined) {
      setDefaultValue(data[name]);
    }
  }, []);

  return (
    <>
      <TextAreaBasic
        register={register}
        name={name}
        onChangeInput={onChange}
        rows={rows}
        cols={cols}
        isDisplayCharCount={isDisplayCharCount}
        maxCharacter={maxCharacter}
        defaultValue={defaultValue}
        errors={errors}
        {...props}
      />
      {errors?.[name]?.message ? <span className="error-msg m-t-8">{errors?.[name]?.message}</span> : null}
    </>
  );
}
