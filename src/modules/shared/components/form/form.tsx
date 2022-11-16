import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState, useEffect,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classes from './form.module.sass';
import Input from './input/input';
import Password from "./password/password";
import TextArea from "./textarea/textarea";
import SelectList from "./select/select";

function ItemBlock({ label, type, actions = [], hide = true,  ...props }) {
    const typeArr = {
        input: Input,
        // number: Number,
        password: Password,
        textarea: TextArea,
        // checkbox: Checkbox,
        // radio: Radio,
        select: SelectList,
        // datepicker: Datepicker,
        // daterangepicker: Daterangepicker,
        // customDateRangePicker: CustomDateRangePicker,
        // mask: MaskInput,
        // objectField: ControllerField,
        // hiddenField: HiddenField,
        // GoogleAutocomplete: GoogleAutocomplete,
        // currencyInput: CurrencyInput,
        // ipAddressInput: IpAddressInput,
        // percentageInput: PercentagInput,
        // switchInput:Switch,
    };

    const TypeComp = typeArr[type];

    const formElement = () => {
        return label ? (
            <div>
                <label htmlFor={`${props.name}`}>{label}</label>
                <TypeComp key={1} {...props} type={type} />
            </div>
        ) : (
            <div>
                <TypeComp key={1} {...props} type={type} />
            </div>
        );
    };

    return (
        <>
            {formElement()}
        </>
    )
}

function FormItems({ fields }) {
    const [hideSectionArr, setHideSectionArr] = useState([]);
    useEffect(() => {
        setHideSectionArr([]);
    }, []);

    return (
        <div className={classes.orgform}>
            {
                fields.map((itemArr) => {
                    return ( <ItemBlock
                        {...itemArr}
                    />)
                })
            }
            {/*{fields.map(*/}
            {/*    ({*/}
            {/*         key,*/}
            {/*         title,*/}
            {/*         subtitle = null,*/}
            {/*         items,*/}
            {/*     }) => (*/}
            {/*        <div className={`${classes.formbox} formbox `}>*/}
            {/*            {*/}
            {/*                (title ||  subtitle) ? (*/}
            {/*                    <div className={`${classes.formboxtitle} formboxtitle`}>*/}
            {/*                        <h3>{title}</h3>*/}

            {/*                        {subtitle !== null ? (<span className={classes.subtitle}>{subtitle}</span>) : (<></>)}*/}
            {/*                    </div>*/}
            {/*                ) : null*/}
            {/*            }*/}

            {/*            {hideSectionArr.indexOf(key) === -1 ? (*/}
            {/*                <div className={`${classes.formboxInner} formboxInner`}>*/}
            {/*                    {Array.isArray(items) &&*/}
            {/*                        items.map((itemArr,index) => (*/}
            {/*                            <div className={`${classes.ordformlist} ordformlist`}>*/}
            {/*                                <ItemBlock*/}
            {/*                                    key={`formelement_${itemArr[index].name}`}*/}
            {/*                                    blocktype="right"*/}
            {/*                                    {...itemArr[1]}*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                        ))}*/}
            {/*                </div>*/}
            {/*            ) : (<></>)}*/}
            {/*        </div>*/}
            {/*    ),*/}
            {/*)}*/}
        </div>
    );
}

function Form(props, ref) {
    const { formItems, defaultValues, validationSchema, onSubmit, children } = props;
    const submitRef = useRef(null);
    const formOptions = {
        defaultValues,
        resolver: yupResolver(validationSchema),
    };
    const methods = useForm({ ...formOptions, mode: 'all' });

    useImperativeHandle(ref, () => ({
        submit(invalidStatusCallback = null) {
            if (submitRef.current !== null) {
                submitRef.current.click();
            }
            if (invalidStatusCallback !== null) {
                setTimeout(() => {
                    invalidStatusCallback(methods.formState.isValid);
                }, 500);
            }
        },
        resetFieldWithError(field, defaultValue) {
            setTimeout(() => {
                methods.resetField(field, {
                    keepDirty: false,
                    keepTouched: false,
                    keepError: false,
                    defaultValue: defaultValue ?? '',
                });
            }, 100);
        },
        resetAll() {
            setTimeout(() => {
                methods.reset({}, {
                    keepErrors: true,
                    keepDirty: true,
                    keepIsSubmitted: false,
                    keepTouched: false,
                    keepIsValid: false,
                    keepSubmitCount: false,
                });
            }, 100);
        },
        resetField(field, value = '') {
            setTimeout(() => {
                methods.setValue(field, value, { shouldValidate: true });
            }, 100);
        },
        // isFormValid();
    }));

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <FormItems fields={formItems} />
                {children}
                <input type="submit" style={{ display: 'none' }} ref={submitRef} />
            </form>
        </FormProvider>
    );
}

export default forwardRef(Form);
