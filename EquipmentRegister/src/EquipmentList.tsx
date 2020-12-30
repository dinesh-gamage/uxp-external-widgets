import * as React from 'react';
import { Button, DataList } from 'uxp/components';
import { IContextProvider } from './uxp';


interface IEquipmentListProps {
    uxpContext?: IContextProvider,
    onSelectEquipment: (equipmentId: string) => void
}

interface ITestModel {
    testID: string,
    isEnabled: boolean
}

interface IEquipment {
    _id: string,
    equipmentId: string,
    equipmentModel: string,
    testModels: ITestModel[]
}

const EquipmentList: React.FunctionComponent<IEquipmentListProps> = (props) => {

    let { uxpContext, onSelectEquipment } = props

    // get equipments
    const getListOfEquipments = (max: number, last: string, args: any): Promise<{ items: any[], pageToken: string }> => {
        // these used to paginate
        if (!last) last = "0"

        // since there are no any pagination option setup yet we ill handle it here

        // get data from lucy model action 
        return new Promise<{ items: any[], pageToken: string }>((resolve, reject) => {
            uxpContext.executeAction("c2o.EquipRegister", "GetEquipment", {}, { json: true })
                .then((res: any) => {
                    console.log(res)
                    resolve({ items: res, pageToken: (parseInt(last) + res.length).toString() })
                })
                .catch((e: any) => {
                    resolve({ items: [], pageToken: last });
                })
        })
    }

    return (<div className="er-content">
        <DataList
            data={getListOfEquipments}
            pageSize={20}
            renderItem={(item: IEquipment, key: number) => {
                return (<div className="equipment-item">
                    <div className="id">{item.equipmentId}</div>
                    <div className="name">{item.equipmentModel}</div>
                    <div className="actions">
                        <Button
                            title="View Models"
                            onClick={() => onSelectEquipment(item.equipmentId)}
                        />
                    </div>
                </div>)
            }}
            showEndOfContent={false}
            showFooter={false}
        />
    </div>)
}

export default React.memo(EquipmentList)