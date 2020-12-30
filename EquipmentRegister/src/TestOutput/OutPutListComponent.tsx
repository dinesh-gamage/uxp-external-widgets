import * as React from 'react'
import { DataList } from 'uxp/components'
import { IContextProvider } from '../uxp'

interface IOutPutListProps {
    uxpContext: IContextProvider
    args?: any,
    renderCount?: number // this will be used to re-render 
}

interface ILogItem {
    equipmentId: string,
    testId: string,
    message: string,
    timestamp: string,
}
const OutPutListComponent: React.FunctionComponent<IOutPutListProps> = (props) => {
    let { uxpContext, args } = props

    const getData = async (max: number, last: string, args: any): Promise<{ items: any[], pageToken: string }> => {
        if (!last) last = "0"
        return new Promise<{ items: any[], pageToken: string }>((resolve, reject) => {
            uxpContext.executeAction("c2o.TestOutput", "GetTestOutput", args, { json: true })
                .then((res: any) => {
                    console.log("res : ", res)
                    resolve({ items: res, pageToken: (parseInt(last) + res.length).toString() })
                })
                .catch((e: any) => {
                    console.log("Exception : ", e)
                    resolve({ items: [], pageToken: last })
                })
        })
    }
    return (<div className="tow-content">
        <DataList
            data={getData}
            pageSize={20}
            renderItem={(item: ILogItem, key: number) => {

                return (<div className="log-item">
                    <div className="e-id">{item.equipmentId}</div>
                    <div className="t-id">{item.testId}</div>
                    <div className="t-stamp">{item.timestamp}</div>
                    <div className="msg">{item.message}</div>
                </div>)
            }}
            showEndOfContent={false}
            showFooter={false}
            args={args}
        />
    </div>)
}

export default React.memo(OutPutListComponent)