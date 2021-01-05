import * as React from 'react'
import { FilterPanel, FormField, Label, Select, TitleBar, useMessageBus, useToast, WidgetWrapper } from 'uxp/components';
import OutPutListComponent from './OutPutListComponent';
import { IContextProvider } from '../uxp';

interface ITestOutPutWidgetProps {
    uxpContext: IContextProvider
}


const TestOutputWidget: React.FunctionComponent<ITestOutPutWidgetProps> = (props) => {

    let { uxpContext } = props

    let [equipments, setEquipments] = React.useState<any[]>([])
    let [testModels, setTestModels] = React.useState<any[]>([])
    let [filters, setFilters] = React.useState<any>({
        equipment: "",
        model: ""
    })
    let [args, setArgs] = React.useState({})
    let [count, setCount] = React.useState<number>(0)

    let Toast = useToast()

    useMessageBus(uxpContext, "c2o.TestOutput.NewEntry", (payload, channel) => {
        setCount(prev => (prev+=1))
        return "updated"
    })

    React.useEffect(() => {
        getEquipments()
    }, [])

    React.useEffect(() => {
        if (filters.equipment.trim().length > 0) {
            getEquipmentDetails(filters.equipment)

            setArgs(Object.assign({}, args, {EquipmentID: filters.equipment}))
        }

        if(filters.model.trim().length > 0) {
            setArgs(Object.assign({}, args, {TestID: filters.model}))
        } 
    }, [filters])


    const getEquipments = () => {
        uxpContext.executeAction("c2o.EquipRegister", "GetEquipment", {}, { json: true })
            .then((res: any) => {
                setEquipments(res.map((i: any) => ({ label: i.equipmentId, value: i.equipmentId })))
            })
            .catch((e: any) => {
            })
    }

    const getEquipmentDetails = (id: string) => {
        uxpContext.executeAction("c2o.EquipRegister", "GetEquipmentDetails", {
            EquipmentId: id
        }, { json: true })
            .then((res: any) => {
                console.log("response ", res)
                setTestModels(res.testModels.map((i: any) => ({ label: i.testID, value: i.testID })))
            })
            .catch((e: any) => {
                console.log("Exception : ", e)
            })
    }


    return (<WidgetWrapper className="equipment-test-output-widget">
        <TitleBar title="Test Model's Output">
            <FilterPanel
                onClear={() => { setFilters({ equipment: "", model: "" }); setArgs({}) }}
                enableClear={filters.equipment.trim().length > 0 || filters.model.trim().length > 0}
            >
                <FormField>
                    <Label>Equipment</Label>
                    <Select
                        options={equipments}
                        selected={filters.equipment}
                        onChange={(val) => { setFilters(Object.assign({}, filters, { equipment: val })) }}
                        placeholder="Select an Equipment"
                        showEndOfContent={false}
                    />
                </FormField>
                <FormField>
                    <Label>Test Models</Label>
                    <Select
                        options={testModels}
                        selected={filters.model}
                        onChange={(val) => { setFilters(Object.assign({}, filters, { model: val })) }}
                        placeholder="Select a model"
                        showEndOfContent={false}
                    />
                </FormField>
            </FilterPanel>
        </TitleBar>

        <OutPutListComponent uxpContext={uxpContext} args={args} renderCount={count} />

    </WidgetWrapper>)
}



export default TestOutputWidget