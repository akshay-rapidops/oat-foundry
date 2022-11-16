import React, { useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';


export default function SelectList({
                                       name,
                                       options = [],
                                       isMulti = false,
                                       isCreatable = false,
                                       isSearchable = false,
                                       onSearch = null,
                                       creatableMessage = 'Create',
                                       placeholder = 'Select',
                                       multiSelectMessage = 'Selected',
                                       NoOptionsMessage = 'No Options',
                                       loadingMessage = '',
                                       loadData = null,
                                       loadingDependentQuery = '',
                                       selectMapObj = null,
                                       disabled = false,
                                       searchValues = true,
                                       isClearable = true,
                                       // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                       onSelectChange = (a: any, b: any) => null,
                                       // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                       onCreate = (a: any, b: any) => null,
                                       menuPlacement = 'auto',
                                       maxLength = 50,
                                       regexForCreatableValue = null,
                                       isMenuBodyTarget =  true,
                                       isCategorizeOptions = false,
                                       ...props
                                   }) {
    const {
        register,
        control,

        formState: { errors },
    } = useFormContext(); // retrieve all hook methods

    return (
        <Controller
            control={control}
            {...register(name)}
            {...props}
            render={({ field: { onChange, onBlur, value, name: fieldName } }) => (
                <>
                <Select options={options}
                        isMulti={isMulti}
                        onChange={(selectedOptions: any) => {
                            if(isMulti) {
                                onChange(selectedOptions?.map((options: any) => options.value));
                            } else {
                                onChange(selectedOptions?.value);
                            }

                }}
                />

                    {errors?.[name]?.message ? (
                        <span className="error-msg m-t-8">{errors?.[name]?.message}</span>
                    ) : null}
                </>

            )}
        />
    );
}
