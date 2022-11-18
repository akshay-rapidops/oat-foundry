import Form from "../shared/components/form/form";
import * as Yup from 'yup';
import {useEffect, useRef, useState} from "react";
import ModalWrapper from "../shared/components/modal/modal";
import ApiTable from "../shared/components/table/api-table";
import axios from "axios";
import {Flipboard} from "../shared/components/flipboard";

export default function DemoCompo() {
    const formRef = useRef(null);
    const [formDefaultValues, setFormDefaultValues] = useState(null);
    const modelRef =  useRef(null);
    const childRef =  useRef(null);
    const formState = [
        {
            name: 'uname',
            type: 'input',
            label: `Username`,
            placeholder: 'Username',
            maxlength: 50,
            maxCharacter: 50,

        },
        {
            name: 'password',
            type: 'password',
            maxlength: 6,
            label: 'password',
            minimumValue: 0,
            decimalScale: 0,
        },
        {
            name: 'notes',
            type: 'textarea',
            label: 'Notes',
            placeholder: 'Text Area',
            maxCharacter: 2000,
            maxlength: 2000,
            isDisplayCharCount: false
        },
        {
            name: 'select',
            type: 'select',
            label: 'Select',
            isMulti: true,
            options:[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' }
            ]

        }
    ]
    const onSubmit = async (data) => {
        console.log(data)
    }

    const getData = async () => {
        try {
            return  axios.get('https://jsonplaceholder.typicode.com/todos').then((d) => d.data);
        }catch (e) {

        }
    }
    useEffect(() => {
        (async () => {
           await getData()
        })()
    },[])
    return (
    <>
        <Form
            ref={formRef}
            formItems={formState}
            defaultValues={formDefaultValues}
            validationSchema={Yup.object().shape({
                 ['uname']: Yup.string().required('UserName is required.').nullable(),
            })}
            onSubmit={onSubmit}
        />
        <button onClick={() => {
            if(formRef.current){
                formRef.current.submit()
            }
        }}>Submit</button>





        <h2>Dialog</h2>
            <button onClick={() => {
                if(modelRef.current) {
                    modelRef.current.openModal()
                }
            }}>Open Model</button>
    <ModalWrapper ref={modelRef}>
        <h2>
            Hello This Test Model
        </h2>
        <button onClick={() => {
            if(modelRef.current) {
                modelRef.current.closeModal()
            }
        }}>Close</button>
    </ModalWrapper>
    <br/><br/><br/><br/><br/>
<Flipboard/>
        <ApiTable
            ref={childRef}
            gridDataService={getData}
            columns={[{
                field: 'id',
                title: 'Id',

            },{
                title:'title',
                field: 'title',
            }]}
            gridName={'test'}
            displayGridName={'test'}
            onViewRow={ () => {}}

        />
    </>

    )
}
