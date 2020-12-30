import * as React from "react";
import { IContextProvider, } from './uxp';
import { TitleBar, WidgetWrapper, DataList, Button, Modal, Checkbox, FormField, useToast, IconButton, Label, Select } from "uxp/components";
import EquipmentList from "./EquipmentList";

interface IEquipmentRegisterProps {
    uxpContext?: IContextProvider
}

interface ITestModel {
    equipmentId?: string
    testID: string,
    isEnabled: boolean
}

interface IEquipment {
    _id: string,
    equipmentId: string,
    equipmentModel: string,
    testModels: ITestModel[]
}

const EquipmentRegisterWidget: React.FunctionComponent<IEquipmentRegisterProps> = (props) => {

    // props 
    let { uxpContext } = props

    // states
    let [selected, setSelected] = React.useState<string>(null)
    let [testModels, setTestModels] = React.useState<ITestModel[]>([] as ITestModel[])

    let [add, setAdd] = React.useState<boolean>(false)
    let [equipments, setEquipments] = React.useState<any[]>([])
    let [models, setModels] = React.useState<any[]>([])
    let [newModel, setNewModel] = React.useState<ITestModel>({
        testID: "",
        equipmentId: "",
        isEnabled: false
    })

    // toast messages 
    let Toast = useToast();

    React.useEffect(() => {
        getEquipments()
        getModels()
    }, [])

    React.useEffect(() => {
        if (selected) {
            getEquipmentDetails(selected)
        }
    }, [selected])


    const getEquipments = () => {
        uxpContext.executeAction("c2o.EquipRegister", "GetEquipment", {}, { json: true })
            .then((res: any) => {
                setEquipments(res.map((i: IEquipment) => ({ label: i.equipmentId, value: i.equipmentId })))
            })
            .catch((e: any) => {
            })
    }

    const getModels = () => {
        uxpContext.executeAction("c2o.EquipRegister", "GetLibrary", {}, { json: true })
            .then((res: any) => {
                setModels(res.map((i: IEquipment) => ({ label: i, value: i })))
            })
            .catch((e: any) => {
            })
    }

    const toggleIsEnabled = (equipmentId: string, item: ITestModel, enabled: boolean) => {
        console.log("Toggling...")
        uxpContext.executeAction("c2o.EquipRegister", "EnableTest", {
            EquipmentID: equipmentId,
            TestID: item.testID,
            IsEnabled: enabled ? 1 : 0
        })
            .then((res: any) => {
                if (res) {
                    // get details 
                    getEquipmentDetails(equipmentId)
                    Toast.success(enabled ? "Enabled" : "Disabled")
                    return
                }
            })
            .catch((e: any) => {
                console.log("Exception : ", e)
                Toast.error("Something went wrong!")
            })
    }

    const getEquipmentDetails = (id: string) => {
        uxpContext.executeAction("c2o.EquipRegister", "GetEquipmentDetails", {
            EquipmentId: id
        }, { json: true })
            .then((res: any) => {
                console.log("selected : ", selected, " res : ", res)
                setTestModels(res.testModels)
            })
            .catch((e: any) => {
                console.log("Exception : ", e)
            })
    }

    const onDelete = (item: ITestModel) => {
        uxpContext.executeAction("c2o.EquipRegister", "RemoveTest", {
            EquipmentID: selected,
            TestID: item.testID,
        }, { json: true })
            .then((res: any) => {

                getEquipmentDetails(selected)
                Toast.success("Model deleted")
            })
            .catch((e: any) => {
                console.log("Exception : ", e)
                Toast.error("Something went wrong! Unable to delete model")
            })
    }

    const addModel = () => {
        uxpContext.executeAction("c2o.EquipRegister", "AddTest", {
            EquipmentID: newModel?.equipmentId,
            TestID: newModel.testID,
            IsEnabled: newModel.isEnabled ? 1 : 0
        }, { json: true })
            .then((res: any) => {

                getEquipmentDetails(selected)
                Toast.success("Model added")
                setAdd(false)
                resetNewModel()
            })
            .catch((e: any) => {
                console.log("Exception : ", e)
                Toast.error("Something went wrong! Unable to add model")
            })
    }

    const resetNewModel = () => {
        setNewModel({
            equipmentId: "",
            testID: "",
            isEnabled: false
        })
    }
    const onCloseModal = () => {
        setSelected(null)
        setAdd(false)
        resetNewModel()
    }

    let headerContent = <div className="header">
        <div className="title">Test Models </div>
        <Button title="Add" onClick={() => setAdd(true)} />
    </div>

    return (
        <WidgetWrapper>
            <TitleBar title='EquipmentRegister'></TitleBar>

            <EquipmentList uxpContext={uxpContext} onSelectEquipment={setSelected} />

            <Modal
                show={selected != null}
                onOpen={() => { }}
                onClose={onCloseModal}
                backgroundDismiss={false}
                className="test-modules-modal"
                title=""
                headerContent={headerContent}
            >
                {add ?
                    <div className="add-test-model">
                        <FormField>
                            <Label>Equipment</Label>
                            <Select
                                options={equipments}
                                selected={newModel.equipmentId}
                                onChange={(val) => setNewModel(prev => ({ ...prev, ...{ equipmentId: val } }))}
                                placeholder="Select an Equipment"
                            />
                        </FormField>
                        <FormField>
                            <Label>Model</Label>
                            <Select
                                options={models}
                                selected={newModel.testID}
                                onChange={(val) => setNewModel(prev => ({ ...prev, ...{ testID: val } }))}
                                placeholder="Select an Model"
                            />
                        </FormField>
                        <FormField>
                            <Checkbox
                                checked={newModel.isEnabled}
                                label="Is Enabled"
                                onChange={(checked) => setNewModel(prev => ({ ...prev, ...{ isEnabled: checked } }))}
                            />
                        </FormField>

                        <div className="row">
                            <Button title="Cancel" onClick={() => { setAdd(false); resetNewModel() }} />
                            <Button title="Save" onClick={() => addModel()} />
                        </div>
                    </div>
                    :
                    <DataList
                        data={testModels || []}
                        pageSize={10}
                        renderItem={(item: ITestModel, key: number) => {
                            return (<div className="test-model-item">
                                <div className="name">{item.testID}</div>
                                <div className="status">
                                    <Checkbox
                                        type="switch-line"
                                        checked={item.isEnabled}
                                        onChange={(checked) => toggleIsEnabled(selected, item, checked)}
                                    />
                                </div>
                                <div className="delete">
                                    <IconButton type="close" onClick={() => onDelete(item)} />
                                </div>
                            </div>)
                        }}
                        showFooter={false}
                        showEndOfContent={false}
                    />
                }

            </Modal>
        </WidgetWrapper>
    )
};

export default EquipmentRegisterWidget