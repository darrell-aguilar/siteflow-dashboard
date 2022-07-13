import React, {useState, useEffect} from 'react'

export default function PrinterTable({setMessages, tableHead, site}) {

    const [printers, setPrinters] = useState('')
    const [zplOnly, setZplOnly] = useState(false)
    const [activeOnly, setActiveOnly] = useState(false)
    const [search, setSearch] = useState('')
    const [printerTypes, setPrinterTypes] = useState([])
    const [printerTypeFilter, setPrinterTypeFilter] = useState('All')

    useEffect(() => {
        const fetchPrinters= async () => {
            const myPrinters = await fetch(`/api/printer?site=${site}`)
                                        .then(res => res.json())
                                            .catch(err => console.log(err))
            setPrinters(myPrinters.data)
        }
       fetchPrinters()
    }, [site])

    useEffect(() => {
        if(printers !== '') {
            var myPrinters = []
            for(var printer of printers) {
                if (!myPrinters.includes(printer.type)) {
                    myPrinters.push(printer.type)
                }
            }
            setPrinterTypes(myPrinters)
        }
    }, [printers])

    const sendPrint = async (printer) => {
        let payload = {
            action: {
                type: "print"
            },
            content: {
                mimeType: printer.zpl === true ? "application/zpl" : "application/pdf",
                url: printer.zpl === true ? "https://s3-eu-west-1.amazonaws.com/oneflow-public/device-test/label/zpl/label.zpl" : "https://s3-eu-west-1.amazonaws.com/oneflow-public/device-test/greensheet/greensheet.pdf"
            },
            device: {
                type: printer.ipAddress ? "tcp" : "printer",
                endpoint: printer.ipAddress ? `tcp://${printer.ipAddress}:${printer.port}` : printer.deviceName
            },
            source: {
                name: "connect",
                category: "printer",
                deviceId: printer._id,
                deviceName: printer.name
            }
        }

        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(payload)
        }
        const sendToPrinter = async () => {
            try {
                await fetch(`/api/print-job/device?site=${site}`, options)
                .then(res => {
                    if (res.status !== 200) {
                        setMessages(messages => [{
                            state: "error",
                            msg: "An error has occured",
                            id: messages.length
                        }, ...messages])
                    }
                    else {
                        setMessages(messages => [{
                            state: "success",
                            msg: "Job has been sent to the printer",
                            id: messages.length
                        }, ...messages])
                    }
                    
                })
                .catch(err => setMessages(messages => [{
                        state: "error",
                        msg: "An error has occured",
                        id: messages.length
                    }, ...messages]))
                
            }
            catch(e) {
                setMessages(messages => [{
                    state: "error",
                    msg: "An error has occured",
                    id: messages.length
                }, ...messages])
            }
        }
           
       sendToPrinter()
    }

    const toggleFilter = () => {
        document.querySelector('#filterToggle').classList.toggle('d-none')
    }

    return (
        <div className='container'>
            <input className='px-3 py-2 mb-3 w-75' onChange={(e) => setSearch(e.target.value.toLowerCase())} placeholder="Search to filter by name or IP"/>
            <br/>
            <button className='btn btn-secondary mb-3' onClick={() => toggleFilter()}>Show Filters</button>
                <div id="filterToggle" className='d-flex align-items-center justify-content-center d-none'>
                    <div className='form-check'>
                        <label className='m-2'>ZPL Only</label>
                        <input type="checkbox" onChange={() => setZplOnly(!zplOnly)}></input>
                    </div>
                    <div className='form-check'>
                        <label className='m-2'>Active Only</label>
                        <input type="checkbox" onChange={() => setActiveOnly(!activeOnly)}></input>
                    </div>
                    <div className='mx-3'>
                        <label className='m-2'>Filter by printer type</label>
                        <select defaultValue="All" className='py-1 px-1' onChange={(e) => setPrinterTypeFilter(e.target.value)}>
                            <option>All</option>
                            {(printerTypes.length !== 0) && printerTypes.map(type => 
                            <option key={type}>{type}</option>
                            )}
                        </select>
                    </div>
                </div>
            <div className='table-responsive'>
            <table className="table">
                <thead className='table-dark'> 
                    <tr>
                        {tableHead.map(header => 
                            <th key={header} scope="col">{header}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th><button className='btn btn-primary' onClick={() => sendPrint("ok")}>Send to press</button></th>
                    </tr>
                    {printers !=='' && 
                    printers.filter(printer => printer.name.toLowerCase().includes(search) || printer.ipAddress?.includes(search) || search === '')
                            .filter(printer => zplOnly === true ? printer.zpl.toString().includes('true') : true)
                            .filter(printer => activeOnly === true ? printer.active.toString().includes('true') : true)
                            .filter(printer => printerTypeFilter === 'All' ? true : printer.type.includes(printerTypeFilter))
                            .map((printer, index) => 
                        <tr key={index}>
                            <th>{printer.name}</th>
                            <th>{printer.deviceName}</th>
                            <th>{printer.ipAddress ? printer.ipAddress : "N/A"}</th>
                            <th>{printer.type}</th>
                            <th>{printer.orientation}</th>
                            <th>{printer.port}</th>
                            <th>{printer.zpl.toString()}</th>
                            <th>{printer.active.toString()}</th>
                            <th><button className='btn btn-primary' onClick={() => sendPrint(printer)}>Send to press</button></th>
                        </tr>
                        )}
                </tbody>
            </table>
            </div>
        </div>
    )
}